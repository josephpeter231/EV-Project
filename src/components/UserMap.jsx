import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar/Navbar';
import axios from 'axios';
import Swal from 'sweetalert2'

const vehicleTypes = ["Car", "Auto", "Bike"];
const chargeTypes = [
  "AC Type 1",
  "AC Type 2",
  "Tesla Charger",
  "GB/T"
];

const MapIntegration = () => {
  const [chargingStations, setChargingStations] = useState([]);
  const [myLocation, setMyLocation] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedChargeType, setSelectedChargeType] = useState('');
  const [nearestStation, setNearestStation] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingTime, setBookingTime] = useState(null);
  const [carNumber, setCarNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
    if (carNumber && !regex.test(carNumber)) {
      setErrorMessage('Invalid vehicle number format. Example: KA02WE2234');
    } else {
      setErrorMessage('');
    }
  }, [carNumber]);

  // Auto-cancellation of slots
  const cancelSlot = () => {
    // eslint-disable-next-line no-undef
    axios.delete(`https://ev-project-backend.onrender.com/api/bookings/${bookingId}`)
      .then(response => {
        console.log("Slot cancelled successfully:", response.data);
      })
      .catch(error => {
        console.error('Error cancelling slot:', error.message);
      });
  };

  // Check for non-arrival and generate notification
  useEffect(() => {
    if (nearestStation && bookingTime) {
      const timer = setTimeout(() => {
        const currentTime = new Date();
        const timeDifference = (currentTime - new Date(bookingTime)) / 60000; // Convert milliseconds to minutes
        if (timeDifference >= 30) {
          // Cancel the slot after 30 minutes if the user hasn't reached the station
          cancelSlot();
          alert("Your booking has been automatically cancelled due to non-arrival.", { autoClose: 5000 });
        }
      }, 1000 * 60 * 5); // Check every 5 minutes
      return () => clearTimeout(timer);
    }
  }, [nearestStation, bookingTime]);

  // Generate pop-up notification for idle location
  useEffect(() => {
    if (bookingTime) {
      const idleTimer = setTimeout(() => {
        // Check if the user's location is idle for more than 10 minutes
        const currentTime = new Date();
        const timeDifference = (currentTime - new Date(bookingTime)) / 60000;
        if (timeDifference >= 10 && !nearestStation) {
          // Generate pop-up notification for changing time slot or cancelling
          alert("Your location seems to be idle. Would you like to change the time slot?", { autoClose: false });
        }
      }, 1000 * 60 * 10); // Check every 10 minutes
      return () => clearTimeout(idleTimer);
    }
  }, [nearestStation, bookingTime]);

  useEffect(() => {
    axios.get('https://ev-project-backend.onrender.com/api/chargingstations')
      .then(response => {
        const stations = response.data;
        setChargingStations(stations);
        console.log(stations)
      })
      .catch(error => {
        console.error('Error fetching charging stations:', error.message);
      });
  }, []);

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

    addMarkersForChargingStations();

    const onLocationSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setMyLocation({ latitude, longitude });

      const myIcon = L.icon({
        iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROGRvCr4nBwXxZAyYEmdfCevT5jxB4GhEfrw&s',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      L.marker([latitude, longitude], { icon: myIcon }).addTo(map)
        .bindPopup('Your Location', { offset: L.point(0, -myIcon.options.iconSize[1]) })
        .openPopup();
      map.setView([latitude, longitude], 13);

      const nearest = findNearestChargingStation({ latitude, longitude });
      if (nearest) {
        setNearestStation(nearest);
      }
    };

    const onLocationError = (error) => {
      console.error('Error getting location:', error.message);
    };

    navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);

    return () => {
      map.remove();
    };
  }, [chargingStations]);

  const findNearestChargingStation = (userLocation) => {
    let nearestStation = null;
    let shortestDistance = Infinity;
    let filteredStations = chargingStations;
    if (selectedChargeType) {
      filteredStations = chargingStations.filter(station => station.chargerType === selectedChargeType);
    }
    filteredStations.forEach(station => {
      const { latitude, longitude } = station;
      const distance = calculateDistance(userLocation.latitude, userLocation.longitude, latitude, longitude);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestStation = station;
      }
    });
    return nearestStation;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;//radius of the earth is 6371kms
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleFindAndBookStation = () => {
    const nearest = findNearestChargingStation(myLocation);
    if (nearest) {
      // Check if the selected time slot is available at the nearest station
      axios.get(`https://ev-project-backend.onrender.com/allbookings?stationName=${nearest.stationName}&chargingSlot=${selectedTimeSlot}`)
        .then(response => {
          console.log(response.data.message)
          // If there are no existing bookings for the selected time slot, allow booking
          if (response.data.message === 'Slot already booked') {
            alert("This time slot is already booked. Please select a different time slot.");
          } else {
            setNearestStation(nearest);
            setBookingStatus(true);
          }
        })
        .catch(error => {
          console.error('Error fetching existing bookings:', error.message);
        });
    } else {
      setNearestStation(null);
    }
  };

  const handleBookSlot = () => {
    const id = localStorage.getItem('userid');
    setBookingTime(new Date());
    console.log("Booking Time:", new Date().toLocaleString());
    console.log("Nearest Charging Station:", nearestStation ? nearestStation : "Not Found");
    console.log("Vehicle Type:", selectedVehicleType);
    console.log("Charge Type:", selectedChargeType);
    console.log("Vehicle Number:", carNumber);
  
    // Validate the vehicle number format
    const regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
    if (!regex.test(carNumber)) {
      // If the vehicle number format is incorrect, display an error message
      setErrorMessage('Invalid vehicle number format. Example: KA02WE2234');
      return; // Exit the function without proceeding with booking
    }
  
    // Send booking data to the backend
    const bookingData = {
      user: id,
      location: {
        type: "Point",
        coordinates: [myLocation.latitude, myLocation.longitude]
      },
      nearestLocation: {
        type: "Point",
        coordinates: [nearestStation.latitude, nearestStation.longitude]
      },
      stationName: nearestStation.stationName,
      carType: selectedVehicleType,
      carNumber: carNumber,
      chargingSlot: selectedTimeSlot,
    };
    console.log(bookingData);
  
    // Send booking data to the backend endpoint
    axios.post('https://ev-project-backend.onrender.com/api/bookings', bookingData)
      .then(response => {
        Swal.fire({
          title: "Make payment to Confirm Booking",
          text: "Redirecting",
          icon: "for payment"
        }).then(() => {
          window.location.href = "https://rzp.io/l/kiEV7p2b"; 
        });
        window.location.href = "https://rzp.io/l/kiEV7p2b"
        console.log("Booking successful:", response.data);
      })
      .catch(error => {
        console.error('Error booking slot:', error.message);
      });
  };
  

// Function to generate time slots
const generateTimeSlots = () => {
  const timeSlots = [];
  const startTime = new Date();
  startTime.setHours(7, 0, 0); // Start from 7:00 AM

  const endTime = new Date();
  endTime.setHours(24, 0, 0); // End at 10:00 PM

  // Adjust start time to the nearest 30-minute interval after the current time
  const currentTime = new Date();
  const currentMinutes = currentTime.getMinutes();
  const next30MinuteSlot = Math.ceil(currentMinutes / 30) * 30;
  if (next30MinuteSlot === 60) {
    currentTime.setHours(currentTime.getHours() + 1);
    currentTime.setMinutes(0);
  } else {
    currentTime.setMinutes(next30MinuteSlot);
  }
  startTime.setHours(currentTime.getHours(), currentTime.getMinutes());

  while (startTime < endTime) {
    const timeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeSlots.push(timeString);
    startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 30 minutes
  }
  return timeSlots;
};

// State to hold the generated time slots
const [timeSlots, setTimeSlots] = useState(generateTimeSlots());


return (
  <div>
    <Navbar />
    <div id="map" className="h-96 w-full"></div>
    <div className="flex items-center justify-center mt-4">
      <div className="mr-4">
        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Select Vehicle Type:</label>
        <select id="vehicleType" value={selectedVehicleType} onChange={(e) => setSelectedVehicleType(e.target.value)} className="mt-1 block w-40 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Select</option>
          {vehicleTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="chargeType" className="block text-sm font-medium text-gray-700">Select Charge Type:</label>
        <select id="chargeType" value={selectedChargeType} onChange={(e) => setSelectedChargeType(e.target.value)} className="mt-1 block w-40 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Select</option>
          {chargeTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div style={{marginLeft:"15px"}}>
        <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Select Time Slot:</label>
        <select id="timeSlot" value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} className="mt-1 block w-40 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Select</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>{slot}</option>
          ))}
        </select>
      </div>
      <button className="ml-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded" style={{marginTop:"22px"}} onClick={handleFindAndBookStation}>Find and Book Station</button>
    </div>
    {nearestStation && bookingStatus && (
      <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded">
        <p className="font-bold">Nearest Charging Station:</p>
        <p>Station Name: {nearestStation.stationName}</p>
        <p>Charger Type: {nearestStation.chargerType}</p>
        <p>Latitude: {nearestStation.latitude}</p>
        <p>Longitude: {nearestStation.longitude}</p>
        <div>
          <label htmlFor="carNumber" className="block text-sm font-medium text-gray-700">Vehicle Number:</label>
          <input
            type="text"
            id="carNumber"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleBookSlot}>Book Slot</button>
      </div>
    )}
    {!nearestStation && (
      <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded">
        <p className="font-bold">Station Not Found</p>
      </div>
    )}
  </div>
);
};

export default MapIntegration;