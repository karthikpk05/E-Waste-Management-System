import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect, disabled }) => {
  useMapEvents({
    click: async (e) => {
      if (disabled) return;
      
      const { lat, lng } = e.latlng;
      
      try {
        // Reverse geocoding using Nominatim (free OSM service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        const formattedAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          formattedAddress: formattedAddress,
          addressComponents: {
            house_number: data.address?.house_number || '',
            road: data.address?.road || '',
            neighbourhood: data.address?.neighbourhood || '',
            suburb: data.address?.suburb || '',
            city: data.address?.city || data.address?.town || data.address?.village || '',
            state: data.address?.state || '',
            postcode: data.address?.postcode || '',
            country: data.address?.country || ''
          }
        });
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          addressComponents: {}
        });
      }
    },
  });
  return null;
};

const LocationMapSelector = ({ 
  selectedLocation, 
  onLocationSelect, 
  height = '400px',
  // center = [11.0168, 76.9558], // Default to Tiruppur, Tamil Nadu
  center = [13.0827, 80.2707],
  zoom = 13,
  showSearch = true,
  disabled = false,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const mapRef = useRef(null);

  // Search for locations using Nominatim
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=IN&addressdetails=1`
      );
      const data = await response.json();
      
      setSearchResults(data.map(item => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        display_name: item.display_name,
        address: item.address
      })));
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSearchResultSelect = (result) => {
    onLocationSelect({
      latitude: result.lat,
      longitude: result.lng,
      formattedAddress: result.display_name,
      addressComponents: {
        house_number: result.address?.house_number || '',
        road: result.address?.road || '',
        neighbourhood: result.address?.neighbourhood || '',
        suburb: result.address?.suburb || '',
        city: result.address?.city || result.address?.town || result.address?.village || '',
        state: result.address?.state || '',
        postcode: result.address?.postcode || '',
        country: result.address?.country || ''
      }
    });
    
    // Pan map to selected location
    if (mapRef.current) {
      mapRef.current.setView([result.lat, result.lng], 16);
    }
    
    setShowResults(false);
    setSearchQuery('');
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 2) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Update map view and select location
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 16);
          }
          
          // Reverse geocode current location
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
              onLocationSelect({
                latitude: lat,
                longitude: lng,
                formattedAddress: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                addressComponents: {
                  house_number: data.address?.house_number || '',
                  road: data.address?.road || '',
                  neighbourhood: data.address?.neighbourhood || '',
                  suburb: data.address?.suburb || '',
                  city: data.address?.city || data.address?.town || data.address?.village || '',
                  state: data.address?.state || '',
                  postcode: data.address?.postcode || '',
                  country: data.address?.country || ''
                }
              });
            })
            .catch(error => {
              console.error('Reverse geocoding failed:', error);
              onLocationSelect({
                latitude: lat,
                longitude: lng,
                formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                addressComponents: {}
              });
            });
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please select a location on the map or search for an address.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const mapCenter = selectedLocation 
    ? [selectedLocation.latitude, selectedLocation.longitude] 
    : center;

  return (
    <div className={`location-map-selector ${className}`}>
      {/* Search Bar */}
      {showSearch && !disabled && (
        <div className="map-search-container" style={{ marginBottom: '10px', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for an address or place..."
                className="form-input"
                style={{ paddingRight: '40px' }}
              />
              {isSearching && (
                <div style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  fontSize: '14px',
                  color: '#6c757d'
                }}>
                  Searching...
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="btn btn-secondary"
              title="Use current location"
              style={{ minWidth: '120px' }}
            >
              Current Location
            </button>
          </div>
          
          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="search-results" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleSearchResultSelect(result)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: index < searchResults.length - 1 ? '1px solid #eee' : 'none',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {result.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!disabled && (
        <div style={{ 
          marginBottom: '8px', 
          fontSize: '14px', 
          color: '#6c757d',
          fontStyle: 'italic'
        }}>
          Click on the map to select pickup location
        </div>
      )}

      {/* Map Container */}
      <div style={{ height, border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Map click handler */}
          <MapClickHandler onLocationSelect={onLocationSelect} disabled={disabled} />
          
          {/* Marker for selected location */}
          {selectedLocation && (
            <Marker 
              position={[selectedLocation.latitude, selectedLocation.longitude]}
            />
          )}
        </MapContainer>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Selected Location:</strong><br />
          {selectedLocation.formattedAddress}
          <br />
          <small style={{ color: '#6c757d' }}>
            Lat: {selectedLocation.latitude.toFixed(6)}, Lng: {selectedLocation.longitude.toFixed(6)}
          </small>
        </div>
      )}
    </div>
  );
};

export default LocationMapSelector;