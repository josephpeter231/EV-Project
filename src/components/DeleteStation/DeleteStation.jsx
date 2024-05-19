import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DeleteStation = () => {
  const [selectedStation, setSelectedStation] = useState('');
  const [stationNames, setStationNames] = useState([]);

  useEffect(() => {
    // Fetch station names from backend when component mounts
    axios.get('https://ev-project-backend.onrender.com/api/chargingstations')
      .then(response => {
        const stations = response.data;
        setStationNames(stations.map(station => station.stationName));
      })
      .catch(error => {
        console.error('Error fetching station names:', error);
      });
  }, []);

  const fetchStationNames = () => {
    axios.get('https://ev-project-backend.onrender.com/api/chargingstations')
      .then(response => {
        const stations = response.data;
        setStationNames(stations.map(station => station.stationName));
      })
      .catch(error => {
        console.error('Error fetching station names:', error);
      });
  };

  const handleDelete = () => {
    Swal.fire({
      title: `Are you sure you want to delete station "${selectedStation}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E72929',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement deletion logic here
        axios.delete(`https://ev-project-backend.onrender.com/api/chargingstations/${selectedStation}`)
          .then(response => {
            console.log('Station deleted successfully:', response.data);
            // Update the list of station names after deletion
            fetchStationNames();
            // Handle success, e.g., show a success message
          })
          .catch(error => {
            console.error('Error deleting station:', error);
            // Handle error, e.g., show an error message
          });
      }
    });
  };

  return (
    <div className="delete-station-container" style={{ backgroundColor: '#CDFADB', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '20px' }}>
      <h1 style={{
        fontWeight: 900,
        fontSize: '3em',
        padding: '40px',
        color: '#B784B7',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>Delete Station</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <select style={{
          padding: '10px',
          fontSize: '1.2em',
          borderRadius: '8px',
          border: '2px solid #B784B7',
          margin: '20px 0',
          width: '300px',
          marginBottom:'450px',
          fontFamily: 'Arial, sans-serif'
        }} value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)}>
          <option value="">Select Station</option>
          {stationNames.map(stationName => (
            <option key={stationName} value={stationName}>{stationName}</option>
          ))}
        </select>
        <button style={{
          padding: '15px 30px',
          fontSize: '1.2em',
          borderRadius: '10px',
          background:"#E72929",
          color: '#ffffff',
          border: 'none',
          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          marginLeft: '10px',
          marginBottom:'430px',
          fontFamily: 'Arial, sans-serif'
        }} onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default DeleteStation;
