import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';
import { Home as HomeIcon, Search, ArrowRight, Building2, Map, Tag } from 'lucide-react';
import ListingItem from '../components/ListingItem';

SwiperCore.use([Navigation, Autoplay, EffectFade]);

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllListings = async () => {
      setLoading(true);
      try {
        const fetchOffers = fetch('/api/listing/get?offer=true&limit=4');
        const fetchRent = fetch('/api/listing/get?type=rent&limit=4');
        const fetchSale = fetch('/api/listing/get?type=sale&limit=4');

        const [offersRes, rentRes, saleRes] = await Promise.all([
          fetchOffers,
          fetchRent,
          fetchSale
        ]);

        const [offersData, rentData, saleData] = await Promise.all([
          offersRes.json(),
          rentRes.json(),
          saleRes.json()
        ]);

        setOfferListings(offersData);
        setRentListings(rentData);
        setSaleListings(saleData);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, []);

  // eslint-disable-next-line react/prop-types
  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm text-gray-600">{title}</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh]">
        <Swiper
          navigation
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-full w-full"
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${listing.imageUrls[0]}) center/cover no-repeat`,
                }}
                className="h-full w-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white space-y-4 sm:space-y-6 px-4 max-w-4xl mx-auto">
            <HomeIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 animate-bounce" />
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight">
              Discover Your Perfect Home
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl opacity-90 px-4">
              Your journey to the perfect property begins here
            </p>
            <div className="relative z-20">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer text-sm sm:text-base"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                Start Exploring
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 sm:-mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <StatCard icon={Building2} title="Properties Listed" value="1,000+" />
          <StatCard icon={Map} title="Cities Covered" value="50+" />
          <StatCard icon={Tag} title="Special Offers" value="100+" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        {offerListings.length > 0 && (
          <section className="mb-8 sm:mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Featured <span className="text-blue-600">Offers</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Exclusive deals you won&apos;t want to miss</p>
              </div>
              <Link
                to="/search?offer=true"
                className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
              >
                View All
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {rentListings.length > 0 && (
          <section className="mb-8 sm:mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Properties for <span className="text-blue-400">Rent</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Find your perfect rental home</p>
              </div>
              <Link
                to="/search?type=rent"
                className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
              >
                View All
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {saleListings.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Properties for <span className="text-red-600">Sale</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Your dream home awaits</p>
              </div>
              <Link
                to="/search?type=sale"
                className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
              >
                View All
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[200px] sm:min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default Home;