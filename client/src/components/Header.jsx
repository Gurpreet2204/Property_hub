import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" className="text-blue-800 font-extrabold text-lg sm:text-2xl flex items-center w-full sm:w-auto">
          <span>Property</span>
          <span className="text-red-600">Hub</span>
        </Link>
        <form onSubmit={handleSubmit} className="bg-gray-100 p-2 rounded-lg flex items-center w-full mt-4 sm:mt-0 sm:w-auto">
          <input
            type="search"
            placeholder="Search..."
            className="bg-transparent text-gray-800 focus:outline-none w-full px-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="text-blue-800 px-2">
            <Search size={20} />
          </button>
        </form>
        <nav className="mt-4 sm:mt-0">
          <ul className="flex flex-wrap gap-4 text-white justify-center sm:justify-end w-full sm:w-auto">
            <li className="hover:text-blue-800 transition duration-300">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-blue-800 transition duration-300">
              <Link to="/contact">contact us</Link>
            </li>
            
            <li className="hover:text-blue-800 transition duration-300">
              <Link to="/about">About</Link>
            </li>
            <li className="hover:text-blue-800 transition duration-300">
              <Link to="/profile">
                {currentUser ? (
                  <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />
                ) : (
                  'Sign in'
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}