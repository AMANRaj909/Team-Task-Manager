import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  ChevronRight,
  Bell,
  Box
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Session closed');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white/50 backdrop-blur-2xl border-r border-rose/10 relative z-20">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-rose/20"
            >
              <Box className="text-white" size={20} strokeWidth={3} />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-foreground">TaskMgr</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-4 mb-4 opacity-50">Management</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-rose text-white shadow-md shadow-rose/10'
                    : 'text-muted hover:text-rose hover:bg-rose/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={18} className={isActive ? 'text-white' : 'group-hover:text-rose transition-colors'} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-pill" className="w-1 h-4 bg-white/50 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-rose/5 rounded-3xl p-5 border border-rose/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose shadow-sm">
                <UserIcon size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-foreground truncate">{user?.name}</p>
                <p className="text-[9px] text-muted font-black uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-[10px] font-black text-rose hover:bg-rose hover:text-white rounded-xl transition-all duration-300 border border-rose/20 uppercase tracking-widest"
            >
              <LogOut size={12} strokeWidth={3} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white/30 backdrop-blur-md border-b border-rose/5">
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-rose">
              <Menu size={24} />
            </button>
          </div>

          <div className="hidden md:flex items-center bg-white/50 border border-rose/10 px-4 py-2 rounded-2xl w-80 focus-within:border-rose/30 transition-all">
            <input 
              type="text" 
              placeholder="Search data..." 
              className="bg-transparent border-none text-xs text-foreground placeholder:text-muted focus:outline-none w-full font-medium"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2.5 bg-white/50 text-muted hover:text-rose rounded-xl border border-rose/5 relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose rounded-full" />
            </button>
            <div className="h-10 w-10 bg-rose rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-rose/20">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-rose/20 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-72 bg-cornsilk z-[110] md:hidden p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rose rounded-xl flex items-center justify-center shadow-lg">
                    <Box className="text-white" size={20} strokeWidth={3} />
                  </div>
                  <span className="text-2xl font-black text-foreground tracking-tighter">TaskMgr</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-2xl ${
                      location.pathname === item.path
                        ? 'bg-rose text-white shadow-lg'
                        : 'text-muted hover:bg-rose/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon size={20} />
                      <span className="font-bold">{item.name}</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-auto flex items-center justify-center space-x-3 p-4 bg-rose/10 text-rose rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
