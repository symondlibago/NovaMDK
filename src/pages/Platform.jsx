import React from 'react';
import Home from '../components/Home';
import { Toaster } from '../components/ui/toaster';

const Platform = () => {
  return (
    <div className="min-h-screen bg-white">
      <Home />
      <Toaster />
    </div>
  );
};

export default Platform;