/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  X,
  Lock,
} from "lucide-react";
import { useSelector } from "react-redux";

const AppointmentForm = () => {
 const { currentUser } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [propertyId, setPropertyId] = useState("");
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
  const navigate = useNavigate();

  const checkAvailability = async () => {
    try {
      const response = await fetch("https://property-hub-backend.onrender.com/api/checkAvailability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          selectedDate,
          duration: 60,
          propertyId: listing._id,
          
        }),
      });
      

      if (!response.ok) {
        const data = await response.text();
        alert(data || "Error checking availability. Please try again.");
        return false;
      }

      const data = await response.json();
      console.log('data----->', data);
      return data || false;
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Error checking availability. Please try again.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAvailable = await checkAvailability();
    if (!isAvailable) return;

    setAppointments([
      ...appointments,
      { date: new Date(selectedDate), duration: 60 },
    ]);
    setSubmitted(true);
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://property-hub-backend.onrender.com/api/listing/get/${params.listingId}`);
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

  const handlePayment = async () => {
    try {
      const amountInPaise = listing.appointmentFees;

      const response = await fetch("https://property-hub-backend.onrender.com/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentFees: amountInPaise,
          status: "created",
          currency: "INR",
          Userid:currentUser._id,
          propertyId:listing._id
          
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          handleOpenRazorpay(data.data, propertyId);
        } else {
          console.error("Invalid response format:", data);
        }
      } else {
        const error = await response.json();
        console.error("Failed to create order:", error);
      }
    } catch (error) {
      console.error("Error in handlePayment:", error);
    }
  };

  const handleOpenRazorpay = (orderData, propertyId ) => {
    console.log("Order data received:", orderData);
  
    const options = {
      key: "rzp_test_0o4NhN2bWbS3HN",
      amount: orderData.amount,
      currency: orderData.currency,
      name: listing.name || "Appointment Booking",
      description: "Appointment Booking Payment",
      order_id: orderData.id,
      handler: async function (response) {
        try {
          const verifyResponse = await fetch("https://property-hub-backend.onrender.com/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              response: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              propertyId:listing._id,
            }),
          });
  
          const verifyData = await verifyResponse.json();
          console.log('verify data------>', verifyData);
          if (verifyResponse.ok && verifyData.code === 200) {
            setPaymentSuccess(true);
            setShowSuccess(true);
            console.log('navigate de andr console');
            navigate("/");
          } else {
            console.error("Payment verification failed:", verifyData.message);
          }
        } catch (err) {
          console.error("Error during payment verification:", err);
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  console.log('currentUser----------->', currentUser._id);
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto relative">
        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 bg-green-100 border-l-4 border-green-500 rounded-lg shadow-lg p-4 mb-4 animate-slide-in-top">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="text-green-800 font-medium">
                  Payment Successful!
                </h3>
                <p className="text-green-600 text-sm">
                  Your appointment has been booked.
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentSuccess ? (
          <div className="text-center py-8 animate-fade-in">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked and confirmed.
            </p>
            <Link
              to="/profile"
              className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              View My Appointments
            </Link>
          </div>
        ) : submitted ? (
          <div className="text-center py-12 px-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-8 animate-bounce">
              <Calendar className="w-16 h-16 text-green-500 mx-auto" />
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Complete Your Booking
            </h3>

            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                Please proceed with the payment to confirm your appointment
              </p>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Appointment Duration: 60 minutes</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handlePayment()}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      Pay ₹{listing.appointmentFees}
                    </span>
                    <CheckCircle className="w-5 h-5 animate-pulse" />
                  </span>
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                <Lock className="w-4 h-4 inline mr-1 text-gray-400" />
                Secure payment powered by Razorpay
              </p>
            </div>
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
  );
};

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
      `}</style>;

export default AppointmentForm;
