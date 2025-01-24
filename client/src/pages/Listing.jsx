/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Contact from "../components/Contact";
import AppointmentForm from "./AppointmentForm";
import { AlertCircle, Bath, Bed, Car, Loader2, MapPin, Share2, Sofa,HousePlus,HomeIcon,Building2,Building,Hotel } from "lucide-react";

SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

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

  return (
    <main className="bg-gray-50 min-h-screen">
      {loading && (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-96 text-red-500 gap-2">
          <AlertCircle className="w-6 h-6" />
          <p className="text-xl">Something went wrong!</p>
        </div>
      )}

      {listing && !loading && !error && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="relative">
            <Swiper 
              navigation 
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className='h-[600px] w-full rounded-2xl'
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            
            {copied && (
              <div className="absolute top-20 right-4 z-10 py-2 px-4 bg-black text-white rounded-md text-sm animate-fade-in">
                Link copied!
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900">
                  {listing.name}
                </h1>
                
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <p className="text-gray-600">{listing.address}</p>
                </div>

                <div className="flex gap-4 mt-6">
                  <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                    ₹{listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && '/month'}
                  </div>
                  {listing.offer && (
                    <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium">
                      ₹{listing.regularPrice - +listing.discountPrice} OFF
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Appointment Fee</h2>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{listing.appointmentFees}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Property Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Bed className="w-5 h-5 text-green-600" />
                    <span>{listing.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Bath className="w-5 h-5 text-green-600" />
                    <span>{listing.bathrooms} Baths</span>
                  </div>
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${listing.parking ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <Car className="w-5 h-5" />
                    <span>{listing.parking ? 'Parking' : 'No Parking'}</span>
                  </div>
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${listing.furnished ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <Sofa className="w-5 h-5" />
                     
                    <span>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Property Type</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: 'villa', icon: HomeIcon },
                    { type: 'bunglow', icon: Building2 },
                    { type: 'townhouse', icon: Building },
                    { type: 'appartment', icon: HousePlus  },
                    { type: 'condominum', icon: Hotel },
                  ].map(({ type, icon: Icon }) => (
                    listing[type] && (
                      <div key={type} className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                        <Icon className="w-5 h-5" />
                        <span className="capitalize">{type}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {currentUser && listing.userRef !== currentUser._id && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <AppointmentForm />
                  </div>
                )}
                
                {contact && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <Contact listing={listing} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
