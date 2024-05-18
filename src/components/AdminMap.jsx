import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar/AdminNavbar';
import axios from 'axios';

const chargerTypes = [
  "AC Type 1",
  "AC Type 2",
  "Tesla Charger",
  "GB/T"
];

const MapIntegration = () => {
  const [selectedChargerType, setSelectedChargerType] = useState('');
  const [chargingStations, setChargingStations] = useState([]);

  useEffect(() => {
    const map = L.map('map').setView([13.0827, 80.2707], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const addMarkersForChargingStations = () => {
      chargingStations.forEach(station => {
        const { latitude, longitude, chargerType, stationName } = station;
        L.marker([latitude, longitude]).addTo(map)
          .bindPopup(`Station Name: ${stationName}<br>Charger Type: ${chargerType}`)
          .openPopup();
      });
    };

    axios.get('http://localhost:3000/api/chargingstations')
      .then(response => {
        const stations = response.data;
        setChargingStations(stations);
        addMarkersForChargingStations();
      })
      .catch(error => {
        console.error('Error fetching charging stations:', error.message);
      });

    const onMapClick = (e) => {
      if (selectedChargerType) {
        const stationName = prompt("Enter station name:");
        if (stationName) {
          L.marker(e.latlng).addTo(map)
            .bindPopup(`Station Name: ${stationName}<br>Charger Type: ${selectedChargerType}`)
            .openPopup();

          axios.post('http://localhost:3000/api/chargingstations', {
            chargerType: selectedChargerType,
            stationName: stationName,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          })
          .then(response => {
            setChargingStations([...chargingStations, response.data]);
          })
          .catch(error => {
            console.error('Error adding charging station:', error.message);
          });
        } else {
          alert("Station name cannot be empty.");
        }
      } else {
        alert("Please select a charger type.");
      }
    };

    map.on('click', onMapClick);

    return () => {
      map.off('click', onMapClick);
      map.remove();
    };
  }, [selectedChargerType]);

  return (
    <div>
      <Navbar />
      <div id="map" className="h-96 w-full"></div>
      <div className="mt-4 mx-auto max-w-md">
        <label htmlFor="chargerType" className="block text-sm font-medium text-gray-700">Select Charger Type:</label>
        <select id="chargerType" value={selectedChargerType} onChange={(e) => setSelectedChargerType(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Select</option>
          {chargerTypes.map((chargerType, index) => (
            <option key={index} value={chargerType}>{chargerType}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default MapIntegration;
