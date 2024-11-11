/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, X } from 'lucide-react';

const AppointmentForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('')
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [listing, setListing] = useState(" ");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const params = useParams();
  const navigate = useNavigate()

  const checkAvailability = async () => {
    try {
      const response = await fetch('/api/checkAvailability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          selectedDate,
          duration: 60,
          appointmentFees:amount
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        alert(data || 'Error checking availability. Please try again.');
        return false;
      }

      const data = await response.json();
      return data || false;
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking availability. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAvailable = await checkAvailability();
    if (!isAvailable) return;

    setAppointments([...appointments, { date: new Date(selectedDate), duration: 60 }]);
    setSubmitted(true);
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleOpenRazorpay = (data) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: Number(data.amount) * 100,
      currency: data.currency,
      order_id: data.id,
      handler: async function (response) {
        try {
          const res = await fetch("/api/verify", { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ response }),
          });
          
          if (res.ok) {
            setPaymentSuccess(true);
            setShowSuccess(true);
            // Reset form after successful payment
            setName('');
            setEmail('');
            setPhone('');
            setSelectedDate(null);
            setSubmitted(false);
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              setShowSuccess(false);
              setShowForm(false);
            }, 5000);
          }
        } catch (err) {
          console.log("Error:", err);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async () => {
    const appointmentFees = 100; // Set this to the desired appointment fee
    const orderId = `receipt#${Math.floor(Math.random() * 1000)}`; // Generate a random receipt ID
    const status = "Pending"; // Set a default status if needed
    const createdAt = new Date().toISOString(); // Current timestamp

    try {
        const response = await fetch('/api/orders/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentFees, // Send appointmentFees
                status,          // Send status
                orderId,        // Send orderId
                createdAt,      // Send createdAt
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'An error occurred'}`);
            return;
        }

        const orderData = await response.json();
        console.log('Order created successfully:', orderData);
        // Handle further logic after order creation (like redirecting to payment)
        handleOpenRazorpay(orderData)
        
    } catch (error) {
        console.error('Error during payment:', error);
        alert('An unexpected error occurred. Please try again.');
    }
};

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto relative">
        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 bg-green-100 border-l-4 border-green-500 rounded-lg shadow-lg p-4 mb-4 animate-slide-in-top">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="text-green-800 font-medium">Payment Successful!</h3>
                <p className="text-green-600 text-sm">Your appointment has been booked.</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full p-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
            showForm 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" />
              Close Form
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              Book Your Appointment
            </>
          )}
        </button>

        {showForm && (
          <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
            <div className="p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Book Your Appointment</h2>
              <p className="text-gray-500 mb-8">Fill in your details to schedule an appointment</p>

              {paymentSuccess ? (
                <div className="text-center py-8 animate-fade-in">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thank You!</h3>
                  <p className="text-gray-600 mb-6">Your appointment has been successfully booked and confirmed.</p>
                  <Link 
                    to="/profile"
                    className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    View My Appointments
                  </Link>
                </div>
              ) : submitted ? (
                <div className="text-center py-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Complete Your Booking</h3>
                  <p className="text-gray-600 mb-6">Please proceed with the payment to confirm your appointment.</p>
                  <button 
                    onClick={() => handlePayment(listing.appointmentFees)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Pay ₹{listing.appointmentFees}
                    
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        <span>Name</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-gray-700 mb-2">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-gray-700 mb-2">
                        <Phone className="w-4 h-4" />
                        <span>Phone</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Preferred Date and Time</span>
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                          required
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Submit Appointment Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-top {
          0% {
            transform: translateY(-1rem);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in-top {
          animation: slide-in-top 0.5s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AppointmentForm;