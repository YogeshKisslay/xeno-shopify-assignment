// client/src/pages/LandingPage.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const LandingPage = () => {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-slate-50">
//       {/* Animated background shapes for a creative feel */}
//       <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//       <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//       <div className="absolute bottom-0 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

//       <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
//         <motion.div
//           className="max-w-3xl p-8 text-center"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h1 className="text-5xl font-extrabold text-gray-900 md:text-6xl lg:text-7xl">
//             Unlock Insights from Your Shopify Data
//           </h1>
//           <p className="mt-6 text-lg text-gray-600 md:text-xl">
//             Connect your store in minutes and transform raw data into actionable insights. Understand your customers, track performance, and drive growth with a beautiful, real-time dashboard.
//           </p>
//           <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
//             <Link
//               to="/register"
//               className="w-full px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-lg sm:w-auto hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Get Started for Free
//             </Link>
//             <Link
//               to="/login"
//               className="w-full px-8 py-3 text-lg font-semibold text-indigo-600 bg-white rounded-lg shadow-lg sm:w-auto hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Sign In
//             </Link>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;


// client/src/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const LandingPage = () => {
  // --- THE FIX IS HERE: We get the user from our global AuthContext ---
  const { user } = useAuth();

  // This is the view for logged-in users
  const AuthenticatedView = () => (
    <motion.div
      className="max-w-3xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-5xl font-extrabold text-gray-900 md:text-6xl lg:text-7xl">
        Welcome back, {user?.name || 'User'}!
      </h1>
      <p className="mt-6 text-lg text-gray-600 md:text-xl">
        You are already signed in. You can head straight to your dashboard to see your latest insights.
      </p>
      <div className="mt-10">
        <Link
          to="/dashboard"
          className="px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Dashboard
        </Link>
      </div>
    </motion.div>
  );

  // This is the view for new visitors (our original landing page)
  const UnauthenticatedView = () => (
    <motion.div
      className="max-w-3xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-5xl font-extrabold text-gray-900 md:text-6xl lg:text-7xl">
        Unlock Insights from Your Shopify Data
      </h1>
      <p className="mt-6 text-lg text-gray-600 md:text-xl">
        Connect your store in minutes and transform raw data into actionable insights. Understand your customers, track performance, and drive growth with a beautiful, real-time dashboard.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
        <Link
          to="/register"
          className="w-full px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-lg sm:w-auto hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Get Started for Free
        </Link>
        <Link
          to="/login"
          className="w-full px-8 py-3 text-lg font-semibold text-indigo-600 bg-white rounded-lg shadow-lg sm:w-auto hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign In
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Animated background shapes */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        {/* --- THE FIX IS HERE: Conditionally render the correct view --- */}
        {user ? <AuthenticatedView /> : <UnauthenticatedView />}
      </div>
    </div>
  );
};

export default LandingPage;