
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Users,
  ShoppingBag,
  FileText,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
    { name: 'Visit Site', href: '/', icon: Home }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 w-full flex items-center justify-between p-4 bg-white shadow-sm">
        <button
          type="button"
          className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <div className="w-8" />
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col h-full animate-slide-in">
            <div className="p-6 flex items-center justify-between">
              <span className="text-2xl font-semibold text-primary">CopyStation</span>
              <button
                type="button"
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="px-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-gray-500 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img 
                    src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff'} 
                    alt={user?.name || 'User'} 
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <span className="text-2xl font-semibold text-primary">CopyStation</span>
            <button
              type="button"
              className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-gray-500 mr-3" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <img 
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff'} 
                  alt={user?.name || 'User'} 
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <div className="min-h-screen pt-16 lg:pt-0">
          <header className="bg-white shadow-sm hidden lg:block">
            <div className="py-6 px-8">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
          </header>
          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
