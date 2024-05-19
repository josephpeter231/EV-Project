import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Swal from 'sweetalert2'

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://ev-project-backend.onrender.com/register', { firstName, lastName, email, password, contactNumber });
            localStorage.setItem('token', response.data.token);
            Swal.fire({
                title: "Registration Success!",
                text: "Now Login to continue",
                icon: "success"
            });
            navigate('/login');
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
            console.error('Error:', error.response.data.message);
        }
    };

    const Loginhere = () => {
        navigate('/login');
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <>
            <Navbar />
            <div className={`flex min-h-full flex-1 flex-col justify-center px-6 py-[88px] lg:px-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`} style={{ backgroundColor: "#AED2FF" }}>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
                        Register an account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {/* First Name field */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium leading-6">
                                First Name
                            </label>
                            <div className="mt-2">
                                <input
                                    style={{ paddingLeft: '10px' }}
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Last Name field */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium leading-6">
                                Last Name
                            </label>
                            <div className="mt-2">
                                <input
                                    style={{ paddingLeft: '10px' }}
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    style={{ paddingLeft: '10px' }}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    style={{ paddingLeft: '10px' }}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Contact Number field */}
                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium leading-6">
                                Contact Number
                            </label>
                            <div className="mt-2">
                                <input
                                    style={{ paddingLeft: '10px' }}
                                    id="contactNumber"
                                    name="contactNumber"
                                    type="tel"
                                    autoComplete="tel"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Register button */}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
                <p className="mt-10 text-center text-sm">
                    Already have an account?{' '}
                    <button onClick={Loginhere} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Login here
                    </button>
                </p>
                {/* Theme toggle button */}
                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="flex items-center justify-center fixed bottom-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                >
                    {theme === "light" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a7 7 0 00-7 7c0 3.86 3.14 7 7 7s7-3.14 7-7a7 7 0 00-7-7zm0 12.2a5.2 5.2 0 100-10.4 5.2 5.2 0 000 10.4zM10 1a9 9 0 100 18 9 9 0 000-18z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 00-6 6c0 2.625 1.75 5 4 5 2.25 0 4-2.375 4-5a6 6 0 00-6-6zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
        </>
    );
};

export default Register;
