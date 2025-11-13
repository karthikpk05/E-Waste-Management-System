import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -12.5]
  });
};

const pickupIcon = createCustomIcon('#007bff'); // Blue for pickup locations
const currentLocationIcon = createCustomIcon('#28a745'); // Green for current location

// Component to fit map bounds to show all markers
const FitBounds = ({ locations }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [locations, map]);
  
  return null;
};

// Component to show route on map
const RouteComponent = ({ start, end, routeCoordinates }) => {
  const map = useMap();
  const routeRef = useRef(null);

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      // Remove existing route
      if (routeRef.current) {
        map.removeLayer(routeRef.current);
      }

      // Add new route
      routeRef.current = L.polyline(routeCoordinates, {
        color: '#007bff',
        weight: 4,
        opacity: 0.7
      }).addTo(map);
    }

    return () => {
      if (routeRef.current) {
        map.removeLayer(routeRef.current);
      }
    };
  }, [routeCoordinates, map]);

  return null;
};

const PickupMapView = ({ 
  pickups = [], 
  height = '500px',
  showRoutes = false,
  currentLocation = null,
  onGetDirections = null,
  className = ''
}) => {
  const [routeData, setRouteData] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const mapRef = useRef(null);

  // Calculate route using OpenRouteService
  const calculateRoute = async (start, end) => {
    setLoadingRoute(true);
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248d6b4bcc6b6654c7b8b8b8b8b8&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}&format=geojson`
      );
      
      if (!response.ok) {
        throw new Error('Route calculation failed');
      }
      
      const data = await response.json();
      const coordinates = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      const distance = (data.features[0].properties.segments[0].distance / 1000).toFixed(1); // km
      const duration = Math.round(data.features[0].properties.segments[0].duration / 60); // minutes
      
      setRouteData({
        coordinates,
        distance,
        duration
      });
    } catch (error) {
      console.error('Route calculation error:', error);
      // Fallback: show straight line
      setRouteData({
        coordinates: [[start.lat, start.lng], [end.lat, end.lng]],
        distance: 'Unknown',
        duration: 'Unknown'
      });
    } finally {
      setLoadingRoute(false);
    }
  };

  // Handle directions button click
  const handleGetDirections = (pickup) => {
    if (onGetDirections) {
      onGetDirections(pickup);
    } else {
      // Default behavior: open Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${pickup.latitude},${pickup.longitude}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  // Handle route calculation
  const handleShowRoute = (pickup) => {
    if (currentLocation) {
      setSelectedPickup(pickup);
      calculateRoute(
        { lat: currentLocation.latitude, lng: currentLocation.longitude },
        { lat: pickup.latitude, lng: pickup.longitude }
      );
    } else {
      // Get current location first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentPos = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setSelectedPickup(pickup);
            calculateRoute(
              { lat: currentPos.latitude, lng: currentPos.longitude },
              { lat: pickup.latitude, lng: pickup.longitude }
            );
          },
          (error) => {
            console.error('Error getting current location:', error);
            alert('Unable to get current location for route calculation');
          }
        );
      } else {
        alert('Geolocation is not supported by this browser');
      }
    }
  };

  // Prepare locations for map bounds
  const allLocations = [
    ...pickups.map(p => ({ lat: p.latitude, lng: p.longitude })),
    ...(currentLocation ? [{ lat: currentLocation.latitude, lng: currentLocation.longitude }] : [])
  ];

  // Default center (Tiruppur, Tamil Nadu)
  const defaultCenter = [11.0168, 76.9558];
  const mapCenter = allLocations.length > 0 
    ? [allLocations[0].lat, allLocations[0].lng] 
    : defaultCenter;

  return (
    <div className={`pickup-map-view ${className}`}>
      {/* Route Information */}
      {routeData && selectedPickup && (
        <div style={{
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Route to {selectedPickup.deviceType} pickup:</strong><br />
              Distance: {routeData.distance} km | ETA: {routeData.duration} minutes
            </div>
            <button 
              onClick={() => {
                setRouteData(null);
                setSelectedPickup(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={{ height, border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Fit bounds to show all locations */}
          {allLocations.length > 0 && <FitBounds locations={allLocations} />}
          
          {/* Current location marker */}
          {currentLocation && (
            <Marker 
              position={[currentLocation.latitude, currentLocation.longitude]}
              icon={currentLocationIcon}
            >
              <Popup>
                <div>
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Pickup location markers */}
          {pickups.map((pickup, index) => (
            <Marker 
              key={pickup.requestId || pickup.id || index}
              position={[pickup.latitude, pickup.longitude]}
              icon={pickupIcon}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>{pickup.deviceType} - {pickup.brand} {pickup.model}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>
                    User: {pickup.userName || pickup.user?.name || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                    {pickup.pickupAddress}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleGetDirections(pickup)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Get Directions
                    </button>
                    {showRoutes && (
                      <button
                        onClick={() => handleShowRoute(pickup)}
                        disabled={loadingRoute}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        {loadingRoute ? 'Loading...' : 'Show Route'}
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Route display */}
          {routeData && selectedPickup && currentLocation && (
            <RouteComponent
              start={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
              end={{ lat: selectedPickup.latitude, lng: selectedPickup.longitude }}
              routeCoordinates={routeData.coordinates}
            />
          )}
        </MapContainer>
      </div>

      {/* Pickup List */}
      {pickups.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>Pickup Locations ({pickups.length})</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {pickups.map((pickup, index) => (
              <div 
                key={pickup.requestId || pickup.id || index}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  marginBottom: '4px',
                  backgroundColor: selectedPickup?.requestId === pickup.requestId ? '#e3f2fd' : '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {pickup.deviceType} - {pickup.brand} {pickup.model}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      {pickup.userName || pickup.user?.name || 'Unknown'} • {pickup.pickupAddress?.substring(0, 50)}...
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleGetDirections(pickup)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Navigate
                    </button>
                    {showRoutes && (
                      <button
                        onClick={() => handleShowRoute(pickup)}
                        disabled={loadingRoute && selectedPickup?.requestId === pickup.requestId}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        {loadingRoute && selectedPickup?.requestId === pickup.requestId ? 'Loading...' : 'Route'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupMapView;