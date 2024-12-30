import { useEffect, useRef } from 'react';
import { Location } from '../types/location';
import { DistanceMatrixResponse } from '../types/maps';
import { MapsService } from '../services/maps';
import { useToast } from './use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet.markercluster';

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
}

class MapManager {
  private mapInstance: L.Map | null;
  private markerCluster: L.MarkerClusterGroup;
  private markers: L.Marker[];
  private mapsService: MapsService;
  private container: HTMLDivElement;
  private tileLayerConfig: TileLayerConfig;
  private locations: Location[];
  private toast: ReturnType<typeof useToast>;

  constructor(
    container: HTMLDivElement,
    tileLayerConfig: TileLayerConfig,
    locations: Location[],
    toast: ReturnType<typeof useToast>
  ) {
    this.mapInstance = null;
    this.markerCluster = L.markerClusterGroup();
    this.markers = [];
    this.mapsService = new MapsService();
    this.container = container;
    this.tileLayerConfig = tileLayerConfig;
    this.locations = locations;
    this.toast = toast;
    this.initializeMap();
  }

  private initializeMap() {
    try {
      if (!this.container) return;

      this.mapInstance = L.map(this.container, {
        center: [51.505, -0.09],
        zoom: 13,
      });

      L.tileLayer(this.tileLayerConfig.url, {
        attribution: this.tileLayerConfig.attribution,
      }).addTo(this.mapInstance);

      this.addMarkers();
      this.fitToMarkers();
    } catch (error) {
      console.error('Error initializing map:', error);
      this.toast.toast({
        title: 'Error',
        description: 'Failed to initialize map.',
        variant: 'destructive',
      });
    }
  }

  private addMarkers() {
    if (!this.locations.length) return;

    const defaultIcon = L.icon({
      iconUrl: '/placeholder.svg',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    this.markers = this.locations.map(location => {
      const marker = L.marker([location.lat, location.lng], {
        icon: defaultIcon,
        title: location.name
      });

      marker.bindPopup(`
        <div class="marker-popup">
          <h3>${location.name}</h3>
          <p>Lat: ${location.lat.toFixed(4)}</p>
          <p>Lng: ${location.lng.toFixed(4)}</p>
        </div>
      `);

      marker.on('click', () => {
        this.mapInstance?.setView([location.lat, location.lng], 13);
      });

      return marker;
    });

    this.markerCluster.addLayers(this.markers);
    this.mapInstance?.addLayer(this.markerCluster);
  }

  private fitToMarkers() {
    if (this.locations.length > 0 && this.mapInstance) {
      const bounds = L.latLngBounds(
        this.locations.map(loc => [loc.lat, loc.lng])
      );
      this.mapInstance.fitBounds(bounds);
    }
  }

  public cleanup() {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
      this.markerCluster.clearLayers();
      this.markers = [];
    }
  }

  public async getDistanceMatrix(
    origins: Location[],
    destinations: Location[]
  ) {
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
}

export const useMap = (
  locations: Location[],
  tileLayerConfig: TileLayerConfig
): UseMapReturn => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapManager = useRef<MapManager | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (mapRef.current) {
      mapManager.current = new MapManager(
        mapRef.current,
        tileLayerConfig,
        locations,
        toast
      );

      return () => {
        mapManager.current?.cleanup();
        mapManager.current = null;
      };
    }
  }, [locations, tileLayerConfig, toast]);

  const getDistanceMatrix = async (
    origins: Location[],
    destinations: Location[]
  ) => {
    if (!mapManager.current) {
      throw new Error('Map manager not initialized');
    }
    return mapManager.current.getDistanceMatrix(origins, destinations);
  };

  return {
    mapRef,
    getDistanceMatrix,
  };
};