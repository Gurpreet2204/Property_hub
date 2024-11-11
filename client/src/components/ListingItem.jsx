/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { MapPin, BedDouble, Bath, Tag } from 'lucide-react';

SwiperCore.use([Navigation]);

const ListingItem = ({ listing }) => {
  return (
    <div className='group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={listing.imageUrls[0] || 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg'}
            alt='listing cover'
            className='h-[320px] sm:h-[220px] w-full object-cover transform group-hover:scale-110 transition-transform duration-500'
          />
          {listing.offer && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Tag size={14} />
              Special Offer
            </div>
          )}
        </div>
        <div className='p-5 flex flex-col gap-3'>
          <h3 className='font-semibold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>
            {listing.name}
          </h3>
          <div className='flex items-center gap-2 text-gray-600'>
            <MapPin size={18} className="text-blue-500" />
            <p className='text-sm truncate'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>
          <div className="flex justify-between items-center mt-2">
            <p className='text-2xl font-bold text-blue-600'>
              ₹{listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && <span className="text-sm text-gray-500"> /month</span>}
            </p>
            <p className="text-sm text-gray-500">
              Fee: ₹{listing.appointmentFees}
            </p>
          </div>
          <div className='flex items-center gap-4 text-gray-600 mt-2 pt-4 border-t'>
            <div className='flex items-center gap-1'>
              <BedDouble size={18} />
              <span className='text-sm'>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Bath size={18} />
              <span className='text-sm'>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem