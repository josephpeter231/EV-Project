import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import voltspotImage from '../../assets/voltspot.png';

const MyProfile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false); // State to track if editing mode is active
    const userId = localStorage.getItem('userid');

    useEffect(() => {
      fetchUserDetails();
    }, []);

    const fetchUserDetails = () => {
      axios.get(`https://ev-project-backend.onrender.com/api/users/${userId}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    };

    const handleEdit = () => {
      setEditing(true); // Activate editing mode
    };

    const handleSave = async (updatedUser) => {
      try {
        const response = await axios.put(`https://ev-project-backend.onrender.com/api/users/${userId}`, updatedUser);
        setUser(response.data.user);
        setEditing(false); // Deactivate editing mode
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    };

    return (
      <>
        <Navbar />
        <section style={{ fontFamily: 'Montserrat' }} className="bg-[#AED2FF] flex items-center justify-center h-screen">
            <section className="w-64 mx-auto bg-[#20354b] rounded-2xl px-8 py-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm" style={{fontSize:20, color:"#FFB07F"}}>My Profile</span>
                    {!editing ? ( // Show edit button only if not in editing mode
                      <button onClick={handleEdit} className="text-emerald-400">
                          Edit
                      </button>
                    ) : (
                      <button onClick={() => setEditing(false)} className="text-red-500">
                          Cancel
                      </button>
                    )}
                </div>
                <div className="mt-6 w-fit mx-auto">
                    <img src={voltspotImage} className="rounded-full w-28 " alt="profile picture" style={{borderRadius:"190px"}} />
                </div>

                <div className="mt-8 ">
                    {editing ? (
                      <EditProfileForm user={user} onSave={handleSave} />
                    ) : (
                      user ? (
                        <div style={{lineHeight:"40px", fontFamily:"sans-serif",width:"15rem"}}>
                          <p className="text-white font-semibold"><strong>First Name :</strong> {user.firstName}</p>
                          <p className="text-white font-semibold"><strong>Last Name :</strong> {user.lastName}</p>
                          <p className="text-white font-semibold"><strong>Email :</strong> {user.email}</p>
                          <p className="text-white font-semibold"><strong>Mob Number :</strong> {user.contactNumber}</p>
                        </div>
                      ) : (
                        <p>Loading...</p>
                      )
                    )}
                </div>
            </section>
        </section>
      </>
    );
};

const EditProfileForm = ({ user, onSave }) => {
  // Component for editing user details, you can implement your form here
  // This is a simplified example
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="firstName" value={editedUser.firstName} onChange={handleChange} />
      <input type="text" name="lastName" value={editedUser.lastName} onChange={handleChange} />
      <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
      <input type="tel" name="contactNumber" value={editedUser.contactNumber} onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  );
};

export default MyProfile;
