
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './App2';
import Login from './components/Login/Login'
import AdminMap from './components/AdminMap';
import Register from './components/Login/Register'
import UserMap from './components/UserMap'
import UserBookings from './components/Bookings';
import DeleteStation from './components/DeleteStation/DeleteStation';
import MyProfile from './components/MyProfile/MyProfile';
import Help from './components/Help/Help';

console.log()
const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/adminlogin" element={<Home />} /> 
          <Route exact path="/adminmarking" element={<AdminMap />} /> 
          <Route exact path="/usermap" element={<UserMap />} /> 
          <Route exact path="/mybookings" element={<UserBookings />} /> 
          <Route exact path="/delete-station" element={<DeleteStation />} />
          <Route exact path="/myprofile" element={<MyProfile />} />
          <Route exact path="/help" element={<Help />} />

        </Routes>
      </Router>
    </div>
  );
};

export default App;
