// // client/src/pages/VerifyEmailPage.jsx

// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import api from '../api/axios'; // <-- CHANGE THIS LINE

// const VerifyEmailPage = () => {
//     const { token } = useParams();
//     const [status, setStatus] = useState('verifying');
//     const [message, setMessage] = useState('Verifying your email...');

//     useEffect(() => {
//         const verify = async () => {
//             try {
//                 const response = await api.get(`/api/auth/verify-email/${token}`); // Use our instance
//                 setStatus('success');
//                 setMessage(response.data.message);
//             } catch (error) {
//                 setStatus('error');
//                 setMessage(error.response?.data?.message || 'Verification failed.');
//             }
//         };
//         verify();
//     }, [token]);

//     // ... rest of the component is the same
//     const statusStyles = {
//         verifying: 'text-gray-700 bg-gray-100',
//         success: 'text-green-700 bg-green-100',
//         error: 'text-red-700 bg-red-100',
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50">
//             <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
//                 <h2 className="text-2xl font-bold">Email Verification</h2>
//                 <div className={`p-4 mt-6 rounded-md ${statusStyles[status]}`}>
//                     <p>{message}</p>
//                 </div>
//                 {status === 'success' && (
//                     <Link to="/login" className="inline-block w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
//                         Proceed to Login
//                     </Link>
//                 )}
//             </div>
//         </div>
//     );
// };


// export default VerifyEmailPage;

// client/src/pages/VerifyEmailPage.jsx

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