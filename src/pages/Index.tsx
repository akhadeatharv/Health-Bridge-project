
import React from 'react';
import LocationMap from '../components/LocationMap';

const Index = () => {
  const handleLocationSelect = (hospitals: any[]) => {
    console.log('Selected hospitals:', hospitals);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hospital Finder</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-600 mb-4">Click on the map to find nearby hospitals</p>
        <LocationMap onLocationSelect={handleLocationSelect} />
      </div>
    </div>
  );
};

export default Index;
