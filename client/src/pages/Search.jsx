import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
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
      e.target.id === 'sale' ||
      e.target.id === 'keywords' ||
      e.target.id === 'bungalow' ||
      e.target.id === 'townhouse' ||
      e.target.id === 'apartment' ||
      e.target.id === 'condominium' ||
      e.target.id === 'duplex' ||
      e.target.id === 'triplex' ||
      e.target.id === 'other' ||
      e.target.id === 'offer'
    ) {
      setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
    } else if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'villa' ||
      e.target.id === 'keywords' ||
      e.target.id === 'bungalow' ||
      e.target.id === 'townhouse' ||
      e.target.id === 'apartment' ||
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('keywords', sidebarData.keywords);
    urlParams.set('villa', sidebarData.villa);
    urlParams.set('bungalow', sidebarData.bungalow);
    urlParams.set('apartment', sidebarData.apartment);
    urlParams.set('townhouse', sidebarData.townhouse);
    urlParams.set('condominium', sidebarData.condominium);
    urlParams.set('duplex', sidebarData.duplex);
    urlParams.set('triplex', sidebarData.triplex);
    urlParams.set('other', sidebarData.other);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
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

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="radio"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === 'all'}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === 'sale'}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Property Types:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="villa"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.villa}
              />
              <span>Villa</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="bungalow"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.bungalow}
              />
              <span>Bungalow</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="apartment"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.apartment}
              />
              <span>Apartment</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="townhouse"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.townhouse}
              />
              <span>Townhouse</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="condominium"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.condominium}
              />
              <span>Condominium</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="duplex"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.duplex}
              />
              <span>Duplex</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="triplex"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.triplex}
              />
              <span>Triplex</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="other"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.other}
              />
              <span>Other</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1 bg-white">
        <h1 className="text-3xl font-extrabold text-gray-500">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}