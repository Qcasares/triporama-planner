import { useEffect, useRef, useCallback } from 'react';
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
  }

  public initialize(initialCenter: [number, number]) {
    if (!this.container || this.mapInstance) return;

    try {
      this.mapInstance = L.map(this.container, {
        center: initialCenter as L.LatLngExpression,
        zoom: 13,
      });

      L.tileLayer(this.tileLayerConfig.url, {
        attribution: this.tileLayerConfig.attribution,
      }).addTo(this.mapInstance);
    } catch (error) {
      console.error('Error initializing map:', error);
      this.toast.toast({
        title: 'Error',
        description: 'Failed to initialize map.',
        variant: 'destructive',
      });
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
      this.mapInstance.remove();
      this.mapInstance = null;
    }
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
      const result = await this.mapsService.getDirections(
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng }
      );
      return result.routes[0];
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

    const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
    });

    // Remove existing layers
    this.mapInstance.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        this.mapInstance?.removeLayer(layer);
      }
    });

    // Add new layer based on theme
    if (theme === 'dark') {
      darkTiles.addTo(this.mapInstance);
    } else {
      lightTiles.addTo(this.mapInstance);
    }
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

  useEffect(() => {
    if (!mapRef.current) return;

    // Calculate initial center
    const defaultCenter: [number, number] = [51.505, -0.09];
    const initialCenter: [number, number] = initialLocations.length > 0 
      ? [initialLocations[0].lat, initialLocations[0].lng] as [number, number]
      : defaultCenter;

    // Initialize map manager if it doesn't exist
    if (!mapManager.current) {
      mapManager.current = new MapManager(
        mapRef.current,
        tileLayerConfig,
        toast
      );
      mapManager.current.initialize(initialCenter);
    }

    // Fit to bounds if locations exist
    if (initialLocations.length > 0) {
      mapManager.current.fitToBounds(initialLocations);
    }

    // Cleanup function
    return () => {
      if (mapManager.current) {
        mapManager.current.cleanup();
        mapManager.current = null;
      }
    };
  }, [initialLocations, tileLayerConfig, toast]);

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
    getDistanceMatrix,
    getDirections,
    centerMap,
    setMapTheme,
    getUserLocation
  };
};
