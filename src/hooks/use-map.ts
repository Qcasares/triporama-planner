import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Location, LocationType } from '../types/location';
import { DistanceMatrixResponse, OSRMRoute } from '../types/maps';
import { MapsService } from '../services/maps';
import { useToast } from './use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface TileLayerConfig {
  url: string;
  attribution: string;
}

interface UseMapReturn {
  mapRef: React.RefObject<HTMLDivElement>;
  mapInstance: L.Map | null;
  getDistanceMatrix: (
    origins: Location[],
    destinations: Location[]
  ) => Promise<DistanceMatrixResponse>;
  getDirections: (
    origin: Location,
    destination: Location
  ) => Promise<OSRMRoute>;
  centerMap: (location: Location) => void;
  setMapTheme: (theme: 'light' | 'dark') => void;
  getUserLocation: () => Promise<Location | null>;
}

class MapManager {
  private mapInstance: L.Map | null = null;
  private mapsService: MapsService;
  private container: HTMLDivElement;
  private tileLayerConfig: TileLayerConfig;
  private toast: ReturnType<typeof useToast>;
  private markerClusterGroup: L.MarkerClusterGroup | null = null;

  constructor(
    container: HTMLDivElement,
    tileLayerConfig: TileLayerConfig,
    toast: ReturnType<typeof useToast>
  ) {
    this.mapInstance = null;
    this.mapsService = new MapsService();
    this.container = container;
    this.tileLayerConfig = tileLayerConfig;
    this.toast = toast;
    this.markerClusterGroup = null;
  }

  public initialize(initialCenter: [number, number]) {
    if (!this.container || this.mapInstance) return;

    try {
      this.mapInstance = L.map(this.container, {
        center: initialCenter as L.LatLngExpression,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Add tile layer
      L.tileLayer(this.tileLayerConfig.url, {
        attribution: this.tileLayerConfig.attribution,
        maxZoom: 19,
        detectRetina: true
      }).addTo(this.mapInstance);

      // Add zoom control
      L.control.zoom({
        position: 'topright'
      }).addTo(this.mapInstance);

      // Add attribution control
      L.control.attribution({
        position: 'bottomright'
      }).addTo(this.mapInstance);

      // Initialize marker cluster group
      this.markerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 80
      });

      this.markerClusterGroup.addTo(this.mapInstance);

    } catch (error) {
      console.error('Error initializing map:', error);
      this.toast.toast({
        title: 'Error',
        description: 'Failed to initialize map.',
        variant: 'destructive',
      });
      throw error;
    }
  }

  public fitToBounds(locations: Location[]) {
    if (!locations?.length || !this.mapInstance) return;

    try {
      const validLocations = locations.filter(
        loc => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number'
      );

      if (validLocations.length > 0) {
        const bounds = L.latLngBounds(
          validLocations.map(loc => [loc.lat, loc.lng])
        );
        this.mapInstance.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error fitting to bounds:', error);
    }
  }

  public cleanup() {
    if (this.mapInstance) {
      // Remove all layers
      this.mapInstance.eachLayer(layer => {
        this.mapInstance?.removeLayer(layer);
      });

      // Remove map instance
      this.mapInstance.remove();
      this.mapInstance = null;
    }

    if (this.markerClusterGroup) {
      this.markerClusterGroup.clearLayers();
      this.markerClusterGroup = null;
    }
  }

  public getMapInstance(): L.Map | null {
    return this.mapInstance;
  }

  public async getDistanceMatrix(
    origins: Location[],
    destinations: Location[]
  ): Promise<DistanceMatrixResponse> {
    try {
      return await this.mapsService.getDistance(
        origins.map(origin => ({ lat: origin.lat, lng: origin.lng })),
        destinations.map(dest => ({ lat: dest.lat, lng: dest.lng }))
      );
    } catch (error) {
      console.error('Error calculating distances:', error);
      this.toast.toast({
        title: 'Error',
        description: 'Failed to calculate distances between locations.',
        variant: 'destructive',
      });
      throw error;
    }
  }

  public async getDirections(
    origin: Location,
    destination: Location
  ): Promise<OSRMRoute> {
    try {
      return await this.mapsService.getDirections(
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng }
      );
    } catch (error) {
      console.error('Error getting directions:', error);
      this.toast.toast({
        title: 'Error',
        description: 'Failed to get directions.',
        variant: 'destructive',
      });
      throw error;
    }
  }

  public centerMap(location: Location) {
    if (this.mapInstance) {
      this.mapInstance.setView([location.lat, location.lng], 13);
    }
  }

  public setMapTheme(theme: 'light' | 'dark') {
    if (!this.mapInstance) return;

    const tileLayers = {
      light: [
        {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors'
        },
        {
          url: 'https://{tileserver}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors, HOT'
        }
      ],
      dark: [
        {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
        },
        {
          url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
          attribution: '&copy; OpenStreetMap contributors, &copy; Stadia Maps'
        }
      ]
    };

    // Remove existing tile layers
    this.mapInstance.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        this.mapInstance?.removeLayer(layer);
      }
    });

    // Add new layers based on theme
    const layers = theme === 'dark' ? tileLayers.dark : tileLayers.light;
    layers.forEach(layerConfig => {
      L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
        maxZoom: 19,
        detectRetina: true
      }).addTo(this.mapInstance);
    });

    // Add layer control
    const baseLayers = {
      'Default': L.tileLayer(layers[0].url, {
        attribution: layers[0].attribution
      }),
      'Alternative': L.tileLayer(layers[1].url, {
        attribution: layers[1].attribution
      })
    };

    L.control.layers(baseLayers, null, {
      position: 'topright'
    }).addTo(this.mapInstance);
  }

  public async getUserLocation(): Promise<Location | null> {
    try {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationDetails = await this.mapsService.getLocationDetails(latitude, longitude);
            resolve({
              id: 'current-location',
              name: locationDetails.formatted_address,
              lat: latitude,
              lng: longitude,
              type: 'other' as LocationType
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Error getting user location:', error);
      this.toast.toast({
        title: 'Error',
        description: 'Failed to get user location.',
        variant: 'destructive',
      });
      return null;
    }
  }
}

export const useMap = (
  initialLocations: Location[],
  tileLayerConfig: TileLayerConfig
): UseMapReturn => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapManager = useRef<MapManager | null>(null);
  const toast = useToast();

  // Memoize initial center calculation
  const initialCenter = useMemo(() => {
    const defaultCenter: [number, number] = [51.505, -0.09];
    return initialLocations.length > 0 
      ? [initialLocations[0].lat, initialLocations[0].lng] as [number, number]
      : defaultCenter;
  }, [initialLocations]);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        // Initialize map manager if it doesn't exist
        if (!mapManager.current) {
          mapManager.current = new MapManager(
            mapRef.current!,
            tileLayerConfig,
            toast
          );
          await mapManager.current.initialize(initialCenter);
        }

        // Fit to bounds if locations exist
        if (initialLocations.length > 0) {
          mapManager.current.fitToBounds(initialLocations);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.toast({
          title: 'Error',
          description: 'Failed to initialize map.',
          variant: 'destructive',
        });
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapManager.current) {
        mapManager.current.cleanup();
        mapManager.current = null;
      }
    };
  }, [initialCenter, initialLocations, tileLayerConfig, toast]);

  const getDistanceMatrix = async (
    origins: Location[],
    destinations: Location[]
  ): Promise<DistanceMatrixResponse> => {
    if (!mapManager.current) {
      throw new Error('Map manager not initialized');
    }
    return mapManager.current.getDistanceMatrix(origins, destinations);
  };

  const getDirections = async (
    origin: Location,
    destination: Location
  ): Promise<OSRMRoute> => {
    if (!mapManager.current) {
      throw new Error('Map manager not initialized');
    }
    return mapManager.current.getDirections(origin, destination);
  };

  const centerMap = (location: Location) => {
    if (mapManager.current) {
      mapManager.current.centerMap(location);
    }
  };

  const setMapTheme = (theme: 'light' | 'dark') => {
    if (mapManager.current) {
      mapManager.current.setMapTheme(theme);
    }
  };

  const getUserLocation = useCallback(async (): Promise<Location | null> => {
    if (!mapManager.current) {
      throw new Error('Map manager not initialized');
    }
    return mapManager.current.getUserLocation();
  }, []);

  return {
    mapRef,
    mapInstance: mapManager.current?.getMapInstance() || null,
    getDistanceMatrix,
    getDirections,
    centerMap,
    setMapTheme,
    getUserLocation
  };
};
