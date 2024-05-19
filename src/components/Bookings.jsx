import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Swal from 'sweetalert2';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem('userid');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [attempts, setAttempts] = useState({});

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // Update the current location when the position changes
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []); // Run effect only once on component mount

  useEffect(() => {
    let timeoutIds = {};

    const checkLocation = (booking) => {
      timeoutIds[booking._id] = setTimeout(() => {
        const attemptCount = attempts[booking._id] || 0;
        if (attemptCount < 2) {
          const currentTime = new Date();
          const bookingTime = new Date(booking.bookingDateTime);
          const timeDifference = (bookingTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60); // Difference in hours
          if (timeDifference <= 1) {
            Swal.fire({
              title: "Idle Location",
              text: "You are in an idle location. Do you want to continue your journey?",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "Cancel",
              icon: "warning",
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            }).then((result) => {
              if (result.isConfirmed) {
                // Increment attempt count
                setAttempts(prevAttempts => ({
                  ...prevAttempts,
                  [booking._id]: (prevAttempts[booking._id] || 0) + 1
                }));
                // Check location again
                checkLocation(booking);
              } else {
                // User wants to cancel booking
                cancelBooking(booking._id);
              }
            });
          } else {
            // Exceeded time limit, cancel booking
            cancelBooking(booking._id);
          }
        } else {
          // Exceeded attempt limit, cancel booking
          cancelBooking(booking._id);
        }
      }, 5000);
    };

    const clearCheckLocationTimeout = (bookingId) => {
      if (timeoutIds[bookingId]) {
        clearTimeout(timeoutIds[bookingId]);
        delete timeoutIds[bookingId];
      }
    };

    bookings.forEach(booking => {
      checkLocation(booking);
    });

    return () => {
      Object.values(timeoutIds).forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [bookings, attempts]); // Re-run effect when bookings or attempts change

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    axios.get(`https://ev-project-backend.onrender.com/api/bookings/${userId}`)
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  };

  const handleDeleteBooking = (bookingId) => {
    Swal.fire({
      title: "Are you sure you want to cancel this booking?",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      icon: "warning",
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed cancellation
        cancelBooking(bookingId);
      }
    });
  };

  const cancelBooking = (bookingId) => {
    axios.delete(`https://ev-project-backend.onrender.com/api/bookings/${bookingId}`)
      .then(response => {
        console.log("Booking canceled successfully");
        fetchBookings(); // Fetch updated list of bookings after cancellation
        Swal.fire({
          title: "Success",
          html: "Booking canceled successfully<br/>Your amount would be refunded within 7 Working Days",
          icon: "success"
        });
      })
      .catch(error => {
        console.error('Error canceling booking:', error);
        Swal.fire("Error", "Failed to cancel booking", "error");
      });
  };

  const redirectToGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-4">User Bookings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking, index) => (
            <div key={index} className="bg-white rounded shadow p-4">
              <p className="text-lg font-semibold mb-2">Station Name: {booking.stationName}</p>
              <p className="text-sm text-gray-600 mb-2">Nearest Location: {booking.nearestLocation.coordinates[0]}, {booking.nearestLocation.coordinates[1]}</p>
              <p className="text-sm text-gray-600 mb-2">Location: {booking.location.coordinates[0]}, {booking.location.coordinates[1]}</p>
              <p className="text-sm text-gray-600 mb-2">Vehicle Type: {booking.carType}</p>
              <p className="text-sm text-gray-600 mb-2">Vehicle Number: {booking.carNumber}</p>
              <p className="text-sm text-gray-600 mb-2">Charging Slot: {booking.chargingSlot}</p>
              <p className="text-sm text-gray-600 mb-2">Booking Date: {new Date(booking.bookingDateTime).toLocaleDateString()}, Booking Time: {new Date(booking.bookingDateTime).toLocaleTimeString()}</p>
              <button className="bg-red-500 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => handleDeleteBooking(booking._id)}>Cancel</button>
              <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 ml-2" onClick={() => redirectToGoogleMaps(booking.nearestLocation.coordinates[0], booking.nearestLocation.coordinates[1])}>View on Google Maps</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserBookings;
