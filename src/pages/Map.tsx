import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Interactive3DGlobe } from '../components/Interactive3DGlobe';
import { PredictiveTimeline } from '../components/analytics/PredictiveTimeline';
import { RiskHeatmap } from '../components/analytics/RiskHeatmap';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

// Custom hybrid style configuration
const hybridStyleConfig = {
  "version": 8,
  "name": "Hybrid Satellite Style",
  "pitch": 0,
  "light": {
    "intensity": 0.2
  },
  "sources": {
    "GoogleSatellite_0": {
      "type": "raster",
      "tiles": ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
      "tileSize": 256
    },
    "GoogleHybrid_1": {
      "type": "raster",
      "tiles": ["https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"],
      "tileSize": 256
    }
  },
  "sprite": "",
  "glyphs": "https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "layout": {},
      "paint": {
        "background-color": "#ffffff"
      }
    },
    {
      "id": "lyr_GoogleSatellite_0_0",
      "type": "raster",
      "source": "GoogleSatellite_0"
    },
    {
      "id": "lyr_GoogleHybrid_1_1",
      "type": "raster",
      "source": "GoogleHybrid_1"
    }
  ]
};

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
}

interface ShipmentLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  status: 'origin' | 'destination' | 'waypoint';
  shipmentCount: number;
  weather?: WeatherData;
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ShipmentLocation | null>(null);
  const [activeTab, setActiveTab] = useState('tracking');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const shipmentLocations: ShipmentLocation[] = [
    { id: 'nairobi', name: 'Nairobi Hub', coordinates: [36.990054, 1.2404475], status: 'origin', shipmentCount: 87 },
    { id: 'zimbabwe', name: 'Zimbabwe', coordinates: [31.08848075, -17.80269125], status: 'destination', shipmentCount: 12 },
    { id: 'zambia', name: 'Zambia', coordinates: [28.3174378, 15.4136414], status: 'destination', shipmentCount: 8 },
    { id: 'madagascar', name: 'Madagascar', coordinates: [47.50866443, -14.71204234], status: 'destination', shipmentCount: 5 },
    { id: 'comoros', name: 'Comoros', coordinates: [43.2413774, 11.7209701], status: 'destination', shipmentCount: 4 },
    { id: 'south_sudan', name: 'South Sudan', coordinates: [29.69490516, 7.86237248], status: 'destination', shipmentCount: 3 },
    { id: 'ethiopia', name: 'Ethiopia', coordinates: [38.7675998, 9.0146129], status: 'destination', shipmentCount: 6 },
    { id: 'burundi', name: 'Burundi', coordinates: [29.3731839, -3.3806734], status: 'destination', shipmentCount: 7 },
  ];

  // Get user's live location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        setUserLocation(coords);
        setLocationError(null);
        
        // Add user location marker to map
        if (map.current) {
          if (userLocationMarker.current) {
            userLocationMarker.current.remove();
          }
          
          const el = document.createElement('div');
          el.className = 'user-location-marker';
          el.style.cssText = `
            width: 20px;
            height: 20px;
            background: #10b981;
            border: 3px solid white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.7);
            animation: pulse 2s infinite;
          `;

          userLocationMarker.current = new mapboxgl.Marker(el)
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold text-green-600">Your Location</h3>
                  <p class="text-sm">Live GPS Position</p>
                  <p class="text-xs text-gray-600">${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}</p>
                </div>
              `))
            .addTo(map.current);

          // Center map on user location
          map.current.flyTo({
            center: coords,
            zoom: 10
          });
        }
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            break;
          default:
            setLocationError('An unknown error occurred');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '32b25b6e6eb45b6df18d92b934c332a7';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!mapContainer.current || viewMode !== '2d') return;

    // Initialize map with custom hybrid style
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: hybridStyleConfig,
      center: [30, 0],
      zoom: 3,
      pitch: 30,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.current.addControl(geolocateControl, 'top-right');

    // Add markers and routes when map loads
    map.current.on('load', () => {
      shipmentLocations.forEach((location) => {
        const el = document.createElement('div');
        el.className = 'shipment-marker';
        el.style.cssText = `
          width: ${location.status === 'origin' ? '24px' : '16px'};
          height: ${location.status === 'origin' ? '24px' : '16px'};
          background: ${location.status === 'origin' ? '#7e22ce' : '#a855f7'};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
          animation: pulse 2s infinite;
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat(location.coordinates)
          .addTo(map.current!);

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-deepcal-purple">${location.name}</h3>
              <p class="text-sm">${location.shipmentCount} shipments</p>
              <p class="text-xs text-gray-600">Status: ${location.status}</p>
            </div>
          `);

        marker.setPopup(popup);

        el.addEventListener('click', async () => {
          const weather = await fetchWeatherData(location.coordinates[1], location.coordinates[0]);
          setSelectedLocation({ ...location, weather: weather || undefined });
          setShowSidebar(true);
        });
      });

      // Add routes from Nairobi to destinations
      const nairobi = shipmentLocations.find(loc => loc.id === 'nairobi');
      if (nairobi) {
        shipmentLocations
          .filter(loc => loc.status === 'destination')
          .forEach((destination, index) => {
            const routeId = `route-${index}`;
            
            map.current!.addSource(routeId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [nairobi.coordinates, destination.coordinates]
                }
              }
            });

            map.current!.addLayer({
              id: routeId,
              type: 'line',
              source: routeId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#a855f7',
                'line-width': 2,
                'line-opacity': 0.7,
                'line-dasharray': [2, 2]
              }
            });
          });
      }
    });

    // Get user location on map load
    getUserLocation();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [viewMode]);

  useEffect(() => {
    const loadWeatherData = async () => {
      const weatherPromises = shipmentLocations.map(location => 
        fetchWeatherData(location.coordinates[1], location.coordinates[0])
      );
      const results = await Promise.all(weatherPromises);
      setWeatherData(results.filter(Boolean) as WeatherData[]);
    };

    loadWeatherData();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map or Globe View */}
      {viewMode === '2d' ? (
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full max-w-6xl h-96">
              <Interactive3DGlobe />
            </div>
          </div>
        </div>
      )}

      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <Card className="oracle-card backdrop-blur-sm bg-black/40 border-deepcal-purple/30">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-deepcal-light text-xl">
                  {viewMode === '2d' ? 'Hybrid Satellite Tracking' : 'Quantum Shipment Consciousness Field'}
                </CardTitle>
                <p className="text-slate-300 text-sm mt-1">
                  {viewMode === '2d' 
                    ? 'High-resolution satellite imagery with live GPS tracking'
                    : '3D visualization of quantum supply chain consciousness'
                  }
                </p>
                {userLocation && (
                  <p className="text-green-400 text-xs mt-1">
                    📍 Live location: {userLocation[1].toFixed(4)}, {userLocation[0].toFixed(4)}
                  </p>
                )}
                {locationError && (
                  <p className="text-red-400 text-xs mt-1">
                    ⚠️ {locationError}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={viewMode === '2d' ? 'default' : 'outline'}
                  size="sm"
                  className={viewMode === '2d' 
                    ? "bg-deepcal-purple text-white" 
                    : "bg-deepcal-purple/20 border-deepcal-purple/50 text-deepcal-light hover:bg-deepcal-purple/30"
                  }
                  onClick={() => setViewMode('2d')}
                >
                  <i className="fas fa-satellite mr-2"></i>
                  Satellite
                </Button>
                <Button 
                  variant={viewMode === '3d' ? 'default' : 'outline'}
                  size="sm"
                  className={viewMode === '3d' 
                    ? "bg-deepcal-purple text-white" 
                    : "bg-deepcal-purple/20 border-deepcal-purple/50 text-deepcal-light hover:bg-deepcal-purple/30"
                  }
                  onClick={() => setViewMode('3d')}
                >
                  <i className="fas fa-globe mr-2"></i>
                  3D Globe
                </Button>
                {viewMode === '2d' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-green-600/20 border-green-500/50 text-green-100 hover:bg-green-600/30"
                      onClick={getUserLocation}
                    >
                      <i className="fas fa-crosshairs mr-2"></i>
                      My Location
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-deepcal-purple/20 border-deepcal-purple/50 text-deepcal-light hover:bg-deepcal-purple/30"
                      onClick={() => map.current?.flyTo({ center: [36.990054, 1.2404475], zoom: 6 })}
                    >
                      <i className="fas fa-home mr-2"></i>
                      Nairobi Hub
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-deepcal-purple/20 border-deepcal-purple/50 text-deepcal-light hover:bg-deepcal-purple/30"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <i className="fas fa-bars mr-2"></i>
                  Panel
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {showSidebar && (
        <div className="absolute top-24 right-4 w-80 max-h-[calc(100vh-120px)] overflow-y-auto z-10">
          <Card className="oracle-card backdrop-blur-sm bg-black/60 border-deepcal-purple/30">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-deepcal-light">Control Panel</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setShowSidebar(false)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-deepcal-purple/20">
                  <TabsTrigger value="tracking" className="text-slate-300 data-[state=active]:bg-deepcal-purple data-[state=active]:text-white text-xs">Track</TabsTrigger>
                  <TabsTrigger value="weather" className="text-slate-300 data-[state=active]:bg-deepcal-purple data-[state=active]:text-white text-xs">Weather</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-slate-300 data-[state=active]:bg-deepcal-purple data-[state=active]:text-white text-xs">Timeline</TabsTrigger>
                  <TabsTrigger value="risk" className="text-slate-300 data-[state=active]:bg-deepcal-purple data-[state=active]:text-white text-xs">Risk</TabsTrigger>
                </TabsList>

                <TabsContent value="tracking" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    {userLocation && (
                      <div className="p-3 rounded-lg border border-green-500 bg-green-900/20 glowing-border">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-green-100">Your Location</h3>
                            <p className="text-sm text-green-300">
                              Live GPS Position
                            </p>
                          </div>
                          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                        </div>
                      </div>
                    )}
                    {shipmentLocations.map((location) => (
                      <div 
                        key={location.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all backdrop-blur-sm ${
                          selectedLocation?.id === location.id 
                            ? 'border-deepcal-purple bg-deepcal-purple/20 glowing-border' 
                            : 'border-slate-600 bg-black/20 hover:border-deepcal-purple/50'
                        }`}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-slate-200">{location.name}</h3>
                            <p className="text-sm text-slate-400">
                              {location.shipmentCount} shipments
                            </p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            location.status === 'origin' ? 'bg-deepcal-purple' : 'bg-deepcal-light'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="weather" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    {weatherData.map((weather, index) => (
                      <div key={index} className="p-3 rounded-lg border border-slate-600 bg-black/20 backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-slate-200">{weather.name}</h3>
                            <p className="text-sm text-slate-400 capitalize">
                              {weather.weather[0].description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-deepcal-light">
                              {Math.round(weather.main.temp)}°C
                            </p>
                            <p className="text-xs text-slate-400">
                              {weather.main.humidity}% humidity
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="mt-4">
                  <div className="scale-90 origin-top">
                    <PredictiveTimeline />
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="mt-4">
                  <div className="scale-90 origin-top">
                    <RiskHeatmap />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedLocation && (
        <div className="absolute bottom-4 left-4 w-80 z-10">
          <Card className="oracle-card backdrop-blur-sm bg-black/60 border-deepcal-purple/30">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-deepcal-light text-lg">Location Details</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setSelectedLocation(null)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-200">{selectedLocation.name}</h3>
                <p className="text-sm text-slate-400">
                  {selectedLocation.coordinates[1].toFixed(4)}, {selectedLocation.coordinates[0].toFixed(4)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-slate-400">Shipments</p>
                <p className="text-2xl font-bold text-deepcal-light">
                  {selectedLocation.shipmentCount}
                </p>
              </div>

              {selectedLocation.weather && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Current Weather</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-200">
                          {Math.round(selectedLocation.weather.main.temp)}°C
                        </p>
                        <p className="text-sm text-slate-400 capitalize">
                          {selectedLocation.weather.weather[0].description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">
                          Wind: {selectedLocation.weather.wind.speed} m/s
                        </p>
                        <p className="text-sm text-slate-400">
                          Humidity: {selectedLocation.weather.main.humidity}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewMode === '2d' && (
                <Button 
                  className="w-full bg-deepcal-purple hover:bg-deepcal-dark text-white"
                  onClick={() => {
                    map.current?.flyTo({
                      center: selectedLocation.coordinates,
                      zoom: 8
                    });
                  }}
                >
                  <i className="fas fa-crosshairs mr-2"></i>
                  Center on Location
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === '3d' && (
        <div className="absolute bottom-4 right-4 w-80 z-10">
          <Card className="oracle-card backdrop-blur-sm bg-black/60 border-deepcal-purple/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-deepcal-light text-lg">Quantum Field Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-deepcal-light mr-2"></div>
                  <span>Origin Points</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-deepcal-purple mr-2"></div>
                  <span>Destination Points</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-1 bg-deepcal-purple mr-2"></div>
                  <span>Active Routes</span>
                </div>
                {userLocation && (
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                    <span>Your Live Location</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Map;
