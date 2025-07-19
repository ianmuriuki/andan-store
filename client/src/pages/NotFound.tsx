import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary-500 mb-4 animate-bounce-gentle">
            404
          </div>
          <h1 className="text-heading text-4xl font-bold text-neutral-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-body text-xl text-neutral-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Link to="/" className="btn-primary w-full">
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <Link to="/products" className="btn-secondary w-full">
            <Search className="w-5 h-5 mr-2" />
            Browse Products
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn-ghost w-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="text-sm text-neutral-500">
          Need help? <Link to="/contact" className="text-primary-500 hover:text-primary-600">Contact us</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;