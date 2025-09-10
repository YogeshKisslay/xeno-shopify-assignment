// client/src/pages/ProfilePage.jsx

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
    <div className="min-h-screen bg-gray-50">
      <main className="container px-4 py-12 mx-auto max-w-4xl">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="mt-1 text-lg text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
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
                <dd className="mt-1 text-sm text-green-600 font-semibold">Active</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;