import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PredictiveTimeline } from '../components/analytics/PredictiveTimeline';
import { RiskHeatmap } from '../components/analytics/RiskHeatmap';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

// Hybrid map style configuration
const hybridMapStyle = {
  "version": 8,
  "name": "qgis2web export",
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
  const [selectedLocation, setSelectedLocation] = useState<ShipmentLocation | null>(null);
  const [activeTab, setActiveTab] = useState('tracking');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  // Sample shipment locations based on the data
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

  // Fetch weather data for a location
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

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: hybridMapStyle as any,
      center: [30, 0],
      zoom: 3,
      pitch: 30,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Add markers and routes when map loads
    map.current.on('load', () => {
      // Add markers for each location
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

        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-deepcal-purple">${location.name}</h3>
              <p class="text-sm">${location.shipmentCount} shipments</p>
              <p class="text-xs text-gray-600">Status: ${location.status}</p>
            </div>
          `);

        marker.setPopup(popup);

        // Add click handler
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

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [viewMode]);

  // Load weather data for all locations
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
              {/*<Interactive3DGlobe />*/}
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
                  {viewMode === '2d' ? 'Global Shipment Tracking' : 'Quantum Shipment Consciousness Field'}
                </CardTitle>
                <p className="text-slate-300 text-sm mt-1">
                  {viewMode === '2d' 
                    ? 'Real-time visualization of emergency logistics operations'
                    : '3D visualization of quantum supply chain consciousness'
                  }
                </p>
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
                  <i className="fas fa-map mr-2"></i>
                  2D Map
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
                      className="bg-deepcal-purple/20 border-deepcal-purple/50 text-deepcal-light hover:bg-deepcal-purple/30"
                      onClick={() => map.current?.flyTo({ center: [36.990054, 1.2404475], zoom: 6 })}
                    >
                      <i className="fas fa-home mr-2"></i>
                      Nairobi Hub
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-deepcal-purple/20 border-deepcal-purple/50 text-deepcal-light hover:bg-deepcal-purple/30"
                      onClick={() => map.current?.flyTo({ center: [30, 0], zoom: 3 })}
                    >
                      <i className="fas fa-globe mr-2"></i>
                      Global View
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

      {/* Floating Sidebar */}
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

      {/* Selected Location Details - Floating */}
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

      {/* Legend for 3D mode */}
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Map;
