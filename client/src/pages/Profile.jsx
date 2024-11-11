/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  UserCircle,
  Upload,
  Mail,
  Lock,
  LogOut,
  Trash2,
  Plus,
  Settings,
  Camera,
  Building,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const [activeSection, setActiveSection] = useState("profile");
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [ShowListingsError, setShowListingsError] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  useEffect(() => {
    const handleShowListings = async () => {
      try {
        setLoading(true);
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }, // Replace with your actual token
        });
        const data = await res.json();

        if (data.success === false) {
          setShowListingsError(true);
          return;
        }

        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      } finally {
        setLoading(false);
      }
    };
    handleShowListings();
  }, []);


//   useEffect(() => {
//     const fetchUserAppointments = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/appointments/my-appointments', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           },
//           credentials: 'include'
//         });
        
//         const data = await response.json();
//         console.log('Appointments data:', data); // Debug log
        
//         if (!response.ok) {
//           throw new Error(data.message || 'Failed to fetch appointments');
//         }
        
//         setUserAppointments(data.appointments || []);
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserAppointments();
//   }, []);
useEffect(()=>{
    const createTestAppointment = async () => {
        try {
            const response = await fetch('/api/appointments/my-appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    userId: '67299e5f14e030cab0b3e5b1' // Get this from your current user object
                })
            });
            const data = await response.json();
            console.log('Test appointment created:', data);
        } catch (error) {
            console.error('Error creating test appointment:', error);
        }
    };
    createTestAppointment()
},[])


  //   const handleListingDelete = async (listingId) => {
  //     try {
  //       const res = await fetch(`/api/listing/delete/${listingId}`, {
  //         method: "DELETE",
  //       });
  //       const data = await res.json();
  //       if (data.success === false) {
  //         console.log(data.message);
  //         return;
  //       }

  //       setUserListings((prev) =>
  //         prev.filter((listing) => listing._id !== listingId)
  //       );
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };

  const NavigationCard = ({
    icon: Icon,
    title,
    description,
    active,
    onClick,
  }) => (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border transition-all ${
        active
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center">
        <Icon
          className={`w-6 h-6 ${active ? "text-blue-500" : "text-gray-500"}`}
        />
        <div className="ml-3 text-left">
          <h3
            className={`font-medium ${
              active ? "text-blue-700" : "text-gray-700"
            }`}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ChevronRight
          className={`ml-auto w-5 h-5 ${
            active ? "text-blue-500" : "text-gray-400"
          }`}
        />
      </div>
    </button>
  );
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your profile and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <NavigationCard
              icon={UserCircle}
              title="Profile Settings"
              description="Update your personal information"
              active={activeSection === "profile"}
              onClick={() => setActiveSection("profile")}
            />
            <NavigationCard
              icon={Building}
              title="My Properties"
              description="Manage your listings"
              active={activeSection === "properties"}
              onClick={() => setActiveSection("properties")}
            />
            <NavigationCard
              icon={CalendarCheck}
              title="Appointments"
              description="View your schedule"
              active={activeSection === "appointments"}
              onClick={() => setActiveSection("appointments")}
            />
            <NavigationCard
              icon={Settings}
              title="Account Settings"
              description="Security and preferences"
              active={activeSection === "settings"}
              onClick={() => setActiveSection("settings")}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeSection === "profile" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    <div className="relative">
                      <img
                        onClick={() => fileRef.current.click()}
                        src={formData.avatar || currentUser.avatar}
                        alt="profile"
                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <input
                      onChange={(e) => setFile(e.target.files[0])}
                      type="file"
                      ref={fileRef}
                      hidden
                      accept="image/*"
                    />
                  </div>

                  {fileUploadError && (
                    <div className="flex items-center text-red-600 mt-2">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Error uploading image (max 2MB)
                      </span>
                    </div>
                  )}

                  {filePerc > 0 && filePerc < 100 && (
                    <div className="w-full max-w-xs mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            Uploading... {filePerc}%
                          </span>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                          <div
                            style={{ width: `${filePerc}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 max-w-lg mx-auto"
                >
                  <div className="space-y-4">
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Username"
                        defaultValue={currentUser.username}
                        id="username"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        defaultValue={currentUser.email}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="New Password"
                        onChange={handleChange}
                        id="password"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <button
                      type="button"
                      onClick={handleDeleteUser}
                      className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Account
                    </button>
                    <button
                      disabled={loading}
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 flex items-center justify-center text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                  </div>
                )}

                {updateSuccess && (
                  <div className="mt-4 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span>Profile updated successfully!</span>
                  </div>
                )}
              </div>
            )}

            {activeSection === "properties" && (
              <Dashboard
                activeTab="listings"
                userListings={userListings} // Pass your listings data here
                // userAppointments={userAppointments}
                // propertyAppointments={propertyAppointments}
              />
            )}

            {/* {activeSection === 'appointments' && (
                        <Dashboard 
                            activeTab="appointments"
                            userListings={userListings}
                            userAppointments={userAppointments} // Pass your appointments data here
                            propertyAppointments={propertyAppointments}
                        />
                    )} */}

            {activeSection === "settings" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
const Dashboard = ({
  activeTab,
  userListings,
  userAppointments,
  handleListingDelete,
  Loading,
  error
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {activeTab === "listings" ? "My Listings" : "My Appointments"}
      </h2>

      {activeTab === "listings" && userListings.length === 0 && (
        <p>No listings found. Start adding some!</p>
      )}
      {activeTab === "listings" && userListings.length > 0 && (
        <ul className="space-y-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]} // Ensure this is the correct URL
                    alt="listing cover"
                    className="h-16 w-16 object-cover rounded-md" // Adjusted for styling
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <p className="text-gray-800 font-bold">
                    Appointment Fee: ${listing.appointmentFees}
                  </p>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ul>
      )}

  {activeTab === 'appointments' && (
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              My Appointments
            </h2>
            
            {Loading && (
              <div className="text-center py-4">
                <p>Loading appointments...</p>
              </div>
            )}
            
            {error && (
              <div className="text-red-500 text-center py-4">
                <p>Error: {error}</p>
              </div>
            )}
            
            {!Loading && !error && (!userAppointments || userAppointments.length === 0) && (
              <div className="text-center py-4">
                <p>No appointments found.</p>
              </div>
            )}
            
            {!Loading && !error && userAppointments && userAppointments.length > 0 && (
              <div className="space-y-4">
                {userAppointments.map((appointment) => (
                  <div 
                    key={appointment._id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Order #{appointment.orderId}
                        </h3>
                        <div className="mt-2 space-y-2">
                          <p className="text-sm text-gray-600">
                            Amount: {appointment.amount} {appointment.currency}
                          </p>
                          {appointment.propertyId && (
                            <>
                              <p className="text-sm text-gray-600">
                                Property: {appointment.propertyId.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Location: {appointment.propertyId.location}
                              </p>
                            </>
                          )}
                          <p className="text-sm text-gray-600">
                            Date: {new Date(appointment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span 
                        className={`px-3 py-1 rounded-full text-sm font-medium
                          ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}