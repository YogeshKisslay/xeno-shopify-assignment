
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
      <div className="p-8 mt-8 bg-white/50 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex-shrink-0 w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-900 sm:text-left">{user.name}</h1>
            <p className="mt-1 text-lg text-center text-gray-600 sm:text-left">{user.email}</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200/80 pt-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Account Details
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="mt-1 text-sm font-semibold text-green-600">Active & Verified</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;