import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag, FileText, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

type PublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Articles", href: "/articles" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span
                  className={cn(
                    "text-2xl font-bold transition-colors",
                    scrolled ? "text-gray-900" : "text-white"
                  )}
                >
                  CopyStation
                </span>
              </Link>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-8">
              <nav className="flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      location.pathname === item.href
                        ? "text-primary"
                        : scrolled
                        ? "text-gray-900"
                        : "text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex md:hidden">
              <button
                type="button"
                className={cn(
                  "p-2 rounded-md focus:outline-none",
                  scrolled ? "text-gray-900" : "text-white"
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl flex flex-col h-full animate-slide-in">
              <div className="p-6 flex items-center justify-between">
                <span className="text-2xl font-semibold text-primary">
                  CopyStation
                </span>
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
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
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t">
                <Button
                  asChild
                  className="w-full flex items-center justify-center"
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex-grow">{children}</div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CopyStation</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop shop for all office supplies and photocopy needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/products?category=Paper"
                    className="hover:text-primary transition-colors"
                  >
                    Paper
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=Stationery"
                    className="hover:text-primary transition-colors"
                  >
                    Stationery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=Office Supplies"
                    className="hover:text-primary transition-colors"
                  >
                    Office Supplies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=Printing Services"
                    className="hover:text-primary transition-colors"
                  >
                    Printing Services
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="text-sm text-gray-400 not-italic">
                <p>123 Office Street</p>
                <p>Business District, City</p>
                <p className="mt-2">Email: info@copystation.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
              <div className="mt-4 flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} CopyStation. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
