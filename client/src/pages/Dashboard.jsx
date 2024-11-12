/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { 
  Calendar, 
  Home, 
  Clock, 
  User,
  Phone,
  Calendar as CalendarIcon,
  ChevronRight,
  MapPin,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react';

const Dashboard = ({ userListings, userAppointments, propertyAppointments }) => {
  const [activeTab, setActiveTab] = useState('listings');
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const ListingCard = ({ listing }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img 
          src={listing.imageUrls[0]} 
          alt={listing.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md">
          <span className="text-sm font-medium text-gray-800">
            <DollarSign className="w-4 h-4 inline-block mr-1" />
            {listing.price}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{listing.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{listing.address}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            Listed on {new Date(listing.createdAt).toLocaleDateString()}
          </span>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({ appointment, isOwner }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <span className="font-medium text-gray-800">{appointment.name}</span>
          </div>
          <div className="flex items-center mb-2 text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{appointment.phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          {isOwner && appointment.propertyName && (
            <div className="flex items-center mt-2 text-gray-600">
              <Building2 className="w-4 h-4 mr-2" />
              <span className="text-sm">{appointment.propertyName}</span>
            </div>
          )}
        </div>
        <div className={`flex items-center ${getStatusColor(appointment.status)}`}>
          {appointment.status === 'confirmed' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : appointment.status === 'pending' ? (
            <Clock className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your listings and appointments</p>
        </div>

        <div className="flex space-x-4 mb-6">
          <TabButton 
            icon={Home}
            label="My Listings"
            isActive={activeTab === 'listings'}
            onClick={() => setActiveTab('listings')}
          />
          <TabButton 
            icon={Calendar}
            label="My Appointments"
            isActive={activeTab === 'appointments'}
            onClick={() => setActiveTab('appointments')}
          />
          <TabButton 
            icon={Clock}
            label="Property Bookings"
            isActive={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'listings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Listings</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Appointments</h2>
              </div>
              <div className="space-y-4">
                {userAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment._id.$oid} 
                    appointment={appointment}
                    isOwner={false}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Property Bookings</h2>
              </div>
              <div className="space-y-4">
                {propertyAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment._id.$oid} 
                    appointment={appointment}
                    isOwner={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;