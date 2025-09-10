// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const RegisterPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const { register } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//     if (password.length < 6) {
//         setError('Password must be at least 6 characters long.');
//         return;
//     }
//     try {
//       const data = await register(name, email, password);
//       setMessage(data.message);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed. Please try again.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
//         <div>
//           <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
//             Create a new account
//           </h2>
//         </div>
//         {message ? (
//           <div className="p-4 text-center text-green-700 bg-green-100 rounded-md">
//             <p>{message}</p>
//             <p className='mt-2'>You can now close this tab.</p>
//           </div>
//         ) : (
//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             {error && <p className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-md">{error}</p>}
//             <div className="space-y-4 rounded-md shadow-sm">
//                 <div>
//                     <input name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Full name"/>
//                 </div>
//                 <div>
//                     <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address"/>
//                 </div>
//                 <div>
//                     <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password"/>
//                 </div>
//             </div>
//             <div>
//               <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                 Create Account
//               </button>
//             </div>
//           </form>
//         )}
//          <p className="mt-2 text-sm text-center text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 Sign in
//             </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

// client/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { register } = useAuth();
  
  // --- NEW: State to track the API call loading status ---
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // --- NEW: Set loading to true before starting the API call ---
    setIsLoading(true);

    try {
      const data = await register(name, email, password);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      // --- NEW: Set loading back to false after the API call finishes (whether it succeeds or fails) ---
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Create a new account
          </h2>
        </div>
        {message ? (
          <div className="p-4 text-center text-green-700 bg-green-100 rounded-md">
            <p>{message}</p>
            <p className='mt-2'>You can now close this tab.</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <p className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-md">{error}</p>}
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <input name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Full name"/>
              </div>
              <div>
                <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address"/>
              </div>
              <div>
                <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password"/>
              </div>
            </div>
            <div>
              {/* --- NEW: Button is now disabled and shows a spinner when isLoading is true --- */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        )}
        <p className="mt-2 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
