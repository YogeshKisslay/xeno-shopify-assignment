
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'error'
  const [message, setMessage] = useState('Verifying your email, please wait...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found.');
        return;
      }
      try {
        await api.get(`/api/auth/verify-email/${token}`);
        // On success, navigate to the login page with a success message in the state
        navigate('/login', {
          state: { message: 'Email verified successfully! You can now log in.' },
        });
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };
    verify();
  }, [token, navigate]);

  // This UI will only be shown briefly during verification or if there's an error.
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Email Verification</h2>
        <div className={`p-4 mt-6 rounded-md ${status === 'error' ? 'text-red-700 bg-red-100' : 'text-gray-700 bg-gray-100'}`}>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;