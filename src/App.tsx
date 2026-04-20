import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Calendar, Users, Info, Settings, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { cn } from './lib/utils';
import Logo from './components/Logo';

// Pages
import Home from './pages/Home';
import Standings from './pages/Standings';
import Schedule from './pages/Schedule';
import Results from './pages/Results';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Sponsors from './pages/Sponsors';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ScoreEntry from './pages/Admin/ScoreEntry';
import PlayerAdmin from './pages/Admin/Players';
import ScheduleAdmin from './pages/Admin/Schedule';
import AdminAnnouncements from './pages/Admin/Announcements';
import AnnouncementBanner from './components/AnnouncementBanner';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Trophy },
    { name: 'Standings', path: '/standings', icon: LayoutDashboard },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Results', path: '/results', icon: Trophy },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Sponsors', path: '/sponsors', icon: Info },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-ktpba-black text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo size={42} className="group-hover:scale-110 transition-transform duration-500" />
              <div>
                <span className="font-display text-2xl font-bold tracking-tighter block leading-none">KTPBA</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-ktpba-red font-bold">Teams Marathon 2026</span>
              </div>
            </Link>
          </div>


          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "px-4 py-3 rounded-sm text-sm font-bold transition-all flex items-center gap-2 uppercase tracking-widest font-display min-h-[44px]",
                      isActive 
                        ? "bg-ktpba-red text-white" 
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/admin/login"
                className={cn(
                  "ml-4 px-4 py-3 rounded-sm text-sm font-bold transition-all flex items-center gap-2 uppercase tracking-widest font-display border border-gray-700 hover:border-ktpba-red min-h-[44px]",
                  isAdmin ? "bg-ktpba-red border-ktpba-red text-white" : "text-gray-400"
                )}
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>

            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="kenyan-stripe" />

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ktpba-black border-t border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-4 rounded-md text-base font-display uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="text-ktpba-red hover:bg-gray-700 block px-3 py-4 rounded-md text-base font-display uppercase tracking-widest border-t border-gray-800"
              >
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-ktpba-black text-white py-16 mt-20 border-t-8 border-ktpba-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Logo size={36} />
              <span className="font-display text-2xl font-bold tracking-tighter">KTPBA 2026</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The premier Kenyan Ten Pin Bowling Association Teams Marathon. 
              20 teams, 13 weeks of intense competition at Village Bowl.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold mb-6 uppercase tracking-wider text-ktpba-red">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/standings" className="hover:text-white transition-colors">Standings</Link></li>
              <li><Link to="/schedule" className="hover:text-white transition-colors">Schedule</Link></li>
              <li><Link to="/results" className="hover:text-white transition-colors">Results</Link></li>
              <li><Link to="/teams" className="hover:text-white transition-colors">Teams</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold mb-6 uppercase tracking-wider text-ktpba-red">Venue</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Village Bowl<br />
              Village Market, Nairobi<br />
              Every Monday & Tuesday<br />
              From 6:45 PM
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            © 2026 KTPBA Teams Marathon. All Rights Reserved.
          </p>
          <div className="flex gap-6">
             <div className="kenyan-stripe w-32 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/results" element={<Results />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:slug" element={<TeamDetail />} />
            <Route path="/sponsors" element={<Sponsors />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/score-entry" element={<ScoreEntry />} />
            <Route path="/admin/players" element={<PlayerAdmin />} />
            <Route path="/admin/schedule" element={<ScheduleAdmin />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          </Routes>
        </main>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}
