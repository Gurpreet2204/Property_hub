import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { MapPin, BedDouble, Bath, Tag } from "lucide-react";
import PropTypes from "prop-types";

SwiperCore.use([Navigation]);

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <Link to={`/listing/${listing._id}`} className="flex flex-col h-full">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={
              listing.imageUrls[0] ||
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          />
          {listing.offer && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Tag size={14} />
              Special Offer
            </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-col gap-3 flex-grow">
            <h3 className="font-semibold text-xl text-gray-800 hover:text-blue-600 transition-colors duration-300 line-clamp-1">
              {listing.name}
            </h3>
            
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} className="text-blue-500 flex-shrink-0" />
              <p className="text-sm truncate">{listing.address}</p>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
              {listing.description}
            </p>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-blue-600">
                ₹
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
                {listing.type === "rent" && (
                  <span className="text-sm text-gray-500"> /month</span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                Fee: ₹{listing.appointmentFees}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-gray-600 pt-4 border-t">
              <div className="flex items-center gap-1">
                <BedDouble size={18} className="flex-shrink-0" />
                <span className="text-sm">
                  {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Bath size={18} className="flex-shrink-0" />
                <span className="text-sm">
                  {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    offer: PropTypes.bool,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    discountPrice: PropTypes.number,
    regularPrice: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    appointmentFees: PropTypes.number.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
  }).isRequired,
};

export default ListingItem;
