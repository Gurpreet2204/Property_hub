import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import ListingItem from '../components/ListingItem';


export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showFilters, setShowFilters] = useState(false);
    const [sidebarData, setSidebarData] = useState({
      searchTerm: '',
      type: 'all',
      parking: false,
      furnished: false,
      keywords: '',
      offer: false,
      villa: false,
      bungalow: false,
      apartment: false,
      townhouse: false,
      condominium: false,
      duplex: false,
      triplex: false,
      other: false,
      sort: 'created_at',
      order: 'desc',
    });
  
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      const typeFromUrl = urlParams.get('type');
      const parkingFromUrl = urlParams.get('parking');
      const furnishedFromUrl = urlParams.get('furnished');
      const keywordsFromUrl = urlParams.get('keywords');
      const villaFromUrl = urlParams.get('villa');
      const bungalowFromUrl = urlParams.get('bungalow');
      const apartmentFromUrl = urlParams.get('apartment');
      const townhouseFromUrl = urlParams.get('townhouse');
      const condominiumFromUrl = urlParams.get('condominium');
      const duplexFromUrl = urlParams.get('duplex');
      const triplexFromUrl = urlParams.get('triplex');
      const otherFromUrl = urlParams.get('other');
      const offerFromUrl = urlParams.get('offer');
      const sortFromUrl = urlParams.get('sort');
      const orderFromUrl = urlParams.get('order');
  
      if (
        searchTermFromUrl ||
        typeFromUrl ||
        parkingFromUrl ||
        furnishedFromUrl ||
        keywordsFromUrl ||
        villaFromUrl ||
        bungalowFromUrl ||
        apartmentFromUrl ||
        townhouseFromUrl ||
        condominiumFromUrl ||
        duplexFromUrl ||
        triplexFromUrl ||
        otherFromUrl ||
        offerFromUrl ||
        sortFromUrl ||
        orderFromUrl
      ) {
        setSidebarData({
          searchTerm: searchTermFromUrl || '',
          type: typeFromUrl || 'all',
          parking: parkingFromUrl === 'true',
          furnished: furnishedFromUrl === 'true',
          keywords: keywordsFromUrl || '',
          villa: villaFromUrl === 'true',
          bungalow: bungalowFromUrl === 'true',
          apartment: apartmentFromUrl === 'true',
          townhouse: townhouseFromUrl === 'true',
          condominium: condominiumFromUrl === 'true',
          duplex: duplexFromUrl === 'true',
          triplex: triplexFromUrl === 'true',
          other: otherFromUrl === 'true',
          offer: offerFromUrl === 'true',
          sort: sortFromUrl || 'created_at',
          order: orderFromUrl || 'desc',
        });
      }
  
      const fetchListings = async () => {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setLoading(false);
      };
  
      fetchListings();
    }, [location.search]);
  
    const handleChange = (e) => {
      if (
        e.target.id === 'all' ||
        e.target.id === 'rent' ||
        e.target.id === 'sale'
      ) {
        setSidebarData({ ...sidebarData, type: e.target.id });
      } else if (
        e.target.id === 'parking' ||
        e.target.id === 'furnished' ||
        e.target.id === 'villa' ||
        e.target.id === 'bungalow' ||
        e.target.id === 'apartment' ||
        e.target.id === 'townhouse' ||
        e.target.id === 'condominium' ||
        e.target.id === 'duplex' ||
        e.target.id === 'triplex' ||
        e.target.id === 'other' ||
        e.target.id === 'offer'
      ) {
        setSidebarData({
          ...sidebarData,
          [e.target.id]: e.target.checked,
        });
      } else if (e.target.id === 'sort_order') {
        const [sort, order] = e.target.value.split('_');
        setSidebarData({ ...sidebarData, sort, order });
      } else {
        setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams();
      Object.keys(sidebarData).forEach(key => {
        urlParams.set(key, sidebarData[key]);
      });
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
      setShowFilters(false);
    };
  
    const onShowMoreClick = async () => {
      const numberOfListings = listings.length;
      const startIndex = numberOfListings;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', startIndex);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length < 9) {
        setShowMore(false);
      }
      setListings([...listings, ...data]);
    };
  
    // eslint-disable-next-line react/prop-types
    const FilterCheckbox = ({ id, label }) => (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={id}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          onChange={handleChange}
          checked={sidebarData[id]}
        />
        <label htmlFor={id} className="text-sm text-gray-600">{label}</label>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Search Header */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Find Your Perfect Property
            </h1>
            <div className="flex items-center gap-4">
              <select
                onChange={handleChange}
                value={`${sidebarData.sort}_${sidebarData.order}`}
                id="sort_order"
                className="border rounded-lg px-4 py-2 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="regularPrice_desc">Price: High to Low</option>
                <option value="regularPrice_asc">Price: Low to High</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all text-gray-700"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Search properties..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                  />
                  <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">Property Type</label>
                  <div className="flex gap-4">
                    {['all', 'rent', 'sale'].map(type => (
                      <div key={type} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={type}
                          name="type"
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          onChange={handleChange}
                          checked={sidebarData.type === type}
                        />
                        <label htmlFor={type} className="text-sm text-gray-600 capitalize">
                          {type === 'all' ? 'All Types' : type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    <FilterCheckbox id="parking" label="Parking" />
                    <FilterCheckbox id="furnished" label="Furnished" />
                    <FilterCheckbox id="offer" label="Special Offer" />
                  </div>
                </div>
              </div>

              {/* Property Types Grid */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700">Property Categories</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <FilterCheckbox id="villa" label="Villa" />
                  <FilterCheckbox id="bungalow" label="Bungalow" />
                  <FilterCheckbox id="apartment" label="Apartment" />
                  <FilterCheckbox id="townhouse" label="Townhouse" />
                  <FilterCheckbox id="condominium" label="Condominium" />
                  <FilterCheckbox id="duplex" label="Duplex" />
                  <FilterCheckbox id="triplex" label="Triplex" />
                  <FilterCheckbox id="other" label="Other" />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-600">No listings found</p>
              </div>
            ) : (
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))
            )}
          </div>

          {showMore && (
            <div className="text-center mt-8">
              <button
                onClick={onShowMoreClick}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}