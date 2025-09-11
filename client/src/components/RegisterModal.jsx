// client/src/components/RegisterModal.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const RegisterModal = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }
        setIsLoading(true);
        try {
          const data = await register(name, email, password);
          setMessage(data.message);
        } catch (err) {
          setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleEsc = (event) => { if (event.keyCode === 27) navigate('/'); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [navigate]);

    return (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => navigate('/')}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-xl"
          >
            <button onClick={() => navigate('/')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Create a new account</h2>
            </div>
            {message ? (
              <div className="p-4 mt-8 text-center text-green-700 bg-green-100 rounded-md">
                <p>{message}</p>
                <p className='mt-2'>You can now close this window and check your email.</p>
              </div>
            ) : (
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-md">{error}</p>}
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div><input name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full name"/></div>
                        <div><input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address"/></div>
                        <div><input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password"/></div>
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            {isLoading ? (<><svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>) : ('Create Account')}
                        </button>
                    </div>
                </form>
            )}
            <p className="mt-2 text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
            </p>
          </motion.div>
        </motion.div>
    );
};

export default RegisterModal;