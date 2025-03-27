import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MapComponent = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const matara = [5.9485, 80.5353]; // Coordinates for Matara

  useEffect(() => {
    if (selectedLocation) {
      fetchRoute();
      onLocationSelect(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchRoute = async () => {
    try {
      const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${matara[1]},${matara[0]};${selectedLocation[1]},${selectedLocation[0]}?overview=full&geometries=geojson`);
      const routeCoordinates = response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setRoute(routeCoordinates);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const locations = [
    { name: 'Colombo', coords: [6.9271, 79.8612] },
    { name: 'Kandy', coords: [7.2906, 80.6337] },
    { name: 'Galle', coords: [6.0535, 80.2210] },
    // Add more locations as needed
  ];

  return (
    <MapContainer center={matara} zoom={8} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={matara}>
        <Popup>Matara</Popup>
      </Marker>
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={location.coords}
          eventHandlers={{
            click: () => {
              setSelectedLocation(location.coords);
              onLocationSelect(location.name);
            },
          }}
        >
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default MapComponent;