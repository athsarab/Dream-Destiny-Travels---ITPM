import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { Box, Typography, Card, CardContent, Chip, CircularProgress, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

// Import Leaflet marker icons directly
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom control component for zoom buttons
const ZoomControl = () => {
  const map = useMap();
  
  return (
    <Box
      sx={{
        position: 'absolute',
        right: '10px',
        bottom: '30px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
        padding: '4px',
      }}
    >
      <IconButton onClick={() => map.zoomIn()} size="small">
        <ZoomInIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={() => map.zoomOut()} size="small">
        <ZoomOutIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const LocationMarker = ({ position, name, onClick, isSelected }) => {
  return (
    <Marker
      position={position}
      eventHandlers={{ click: onClick }}
      icon={L.icon({
        iconUrl: isSelected 
          ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
          : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })}
    >
      <Popup>
        <Typography variant="subtitle2">{name}</Typography>
      </Popup>
    </Marker>
  );
};

const MapComponent = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const matara = [5.9485, 80.5353]; // Coordinates for Matara

  useEffect(() => {
    if (selectedLocation) {
      fetchRoute();
      onLocationSelect(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchRoute = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${matara[1]},${matara[0]};${selectedLocation[1]},${selectedLocation[0]}?overview=full&geometries=geojson`
      );
      const routeData = response.data.routes[0];
      const routeCoordinates = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setRoute(routeCoordinates);
      setDistance((routeData.distance / 1000).toFixed(1)); // Convert to km
      setDuration((routeData.duration / 60).toFixed(0)); // Convert to minutes
    } catch (error) {
      console.error('Error fetching route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const locations = [
    { name: 'Colombo', coords: [6.9271, 79.8612], description: 'Commercial capital of Sri Lanka' },
    { name: 'Kandy', coords: [7.2906, 80.6337], description: 'Cultural capital with the Temple of the Tooth' },
    { name: 'Galle', coords: [6.0535, 80.2210], description: 'Historic fortified city with Dutch colonial architecture' },
    { name: 'Nuwara Eliya', coords: [6.9497, 80.7891], description: 'Hill country with tea plantations' },
    { name: 'Anuradhapura', coords: [8.3114, 80.4037], description: 'Ancient capital with sacred Buddhist sites' },
  ];

  const handleLocationClick = (location) => {
    setSelectedLocation(location.coords);
    onLocationSelect(location.name);
  };

  return (
    <Box sx={{ position: 'relative', height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={matara} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <LocationMarker 
          position={matara} 
          name="Matara" 
          onClick={() => setSelectedLocation(null)}
          isSelected={false}
        />
        
        {locations.map((location, index) => (
          <LocationMarker
            key={index}
            position={location.coords}
            name={location.name}
            onClick={() => handleLocationClick(location)}
            isSelected={selectedLocation && location.coords[0] === selectedLocation[0] && location.coords[1] === selectedLocation[1]}
          />
        ))}
        
        {route.length > 0 && (
          <Polyline 
            positions={route} 
            color="#3f51b5" 
            weight={4}
            dashArray="5, 5"
          />
        )}
        
        <ZoomControl />
      </MapContainer>

      {/* Route Information Card */}
      {selectedLocation && (
        <Card sx={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          minWidth: '250px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: '12px',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {locations.find(loc => 
                  loc.coords[0] === selectedLocation[0] && 
                  loc.coords[1] === selectedLocation[1]
                )?.name}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {locations.find(loc => 
                loc.coords[0] === selectedLocation[0] && 
                loc.coords[1] === selectedLocation[1]
              )?.description}
            </Typography>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                {distance && duration && (
                  <>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        label={`${distance} km`} 
                        color="primary" 
                        variant="outlined"
                        icon={<MyLocationIcon fontSize="small" />}
                      />
                      <Chip 
                        label={`${duration} min`} 
                        color="secondary" 
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Route from Matara
                    </Typography>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Box sx={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            backgroundColor: 'red',
            borderRadius: '50%',
            marginRight: '6px'
          }} />
          Other locations
        </Typography>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            backgroundColor: 'green',
            borderRadius: '50%',
            marginRight: '6px'
          }} />
          Selected location
        </Typography>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            backgroundColor: '#3f51b5',
            marginRight: '6px'
          }} />
          Route path
        </Typography>
      </Box>
    </Box>
  );
};

export default MapComponent;