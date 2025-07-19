import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, UserPlus, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "./auth-modal";
import { logOut } from "@/lib/firebase";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, isAdmin } = useAuth();
  const [location, navigate] = useLocation();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const scrollToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) footer.scrollIntoView({ behavior: "smooth" });
  };

  const handleHomeClick = () => {
    if (location === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={handleHomeClick}>
              <h1 className="text-2xl font-bold text-travel-blue font-inter">Apni Holidays</h1>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <span onClick={handleHomeClick} className="cursor-pointer text-gray-900 hover:text-travel-blue px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </span>
                <Link href="/packages" className="text-gray-500 hover:text-travel-blue px-3 py-2 text-sm font-medium transition-colors">
                  Packages
                </Link>
                <span onClick={scrollToFooter} className="cursor-pointer text-gray-500 hover:text-travel-blue px-3 py-2 text-sm font-medium transition-colors">
                  About Us
                </span>
                <span onClick={scrollToFooter} className="cursor-pointer text-gray-500 hover:text-travel-blue px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/profile">
                    <Button variant="ghost" className="text-gray-700 hover:text-travel-blue">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="ghost" className="text-gray-700 hover:text-travel-blue">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleAuthClick('login')} className="travel-blue text-white">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                  <Button onClick={() => handleAuthClick('signup')} className="sunset-orange text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <span onClick={handleHomeClick} className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-travel-blue cursor-pointer">
                Home
              </span>
              <Link href="/packages" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-travel-blue">
                Packages
              </Link>
              <span onClick={scrollToFooter} className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-travel-blue cursor-pointer">
                About Us
              </span>
              <span onClick={scrollToFooter} className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-travel-blue cursor-pointer">
                Contact
              </span>
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-travel-blue">
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-travel-blue">
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-travel-blue">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleAuthClick('login')} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-travel-blue">
                    Login
                  </button>
                  <button onClick={() => handleAuthClick('signup')} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-travel-blue">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
