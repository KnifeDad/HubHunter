import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-lg border-b border-cyan-500/20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-4xl font-black mb-6 md:mb-0 font-tech">
          <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-300">
            HUB<span className="text-cyan-400">HUNTER</span>
          </Link>
        </h1>
        <div className="flex gap-12">
          <Link 
            to="/" 
            className={`nav-button ${location.pathname === '/' ? 'nav-button-active' : ''}`}
          >
            Search Candidates
          </Link>
          <Link 
            to="/saved" 
            className={`nav-button ${location.pathname === '/saved' ? 'nav-button-active' : ''}`}
          >
            Potential Candidates
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
