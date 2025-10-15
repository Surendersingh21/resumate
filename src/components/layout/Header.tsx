import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border/30 gradient-card backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 animate-slide-in-right shadow-glow">
      <div className="container mx-auto fib-p-4 sm:fib-p-5 lg:fib-p-6">
        <div className="flex header-height items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center fib-gap-4 group hover:scale-105 transition-transform duration-300 ml-4 sm:ml-6 lg:ml-8">
            <div className="fib-p-4 rounded-lg gradient-primary shadow-glow group-hover:shadow-lg transition-all duration-300">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient">Resumate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center fib-gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-gradient hover:scale-110 relative fib-p-3 py-1 rounded-lg hover:bg-muted/50 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:gradient-primary after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
            <Link
              to="/templates"
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-gradient hover:scale-110 relative fib-p-3 py-1 rounded-lg hover:bg-muted/50 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:gradient-primary after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              Templates
            </Link>
            <Link
              to="/builder"
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-gradient hover:scale-110 relative fib-p-3 py-1 rounded-lg hover:bg-muted/50 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:gradient-primary after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              CV Builder
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-gradient hover:scale-110 relative fib-p-3 py-1 rounded-lg hover:bg-muted/50 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:gradient-primary after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              About Us
            </Link>
            <Link
              to="/privacy"
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-gradient hover:scale-110 relative fib-p-3 py-1 rounded-lg hover:bg-muted/50 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:gradient-primary after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              Privacy Policy
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center fib-gap-5 mr-4 sm:mr-6 lg:mr-8">
            {user ? (
              // Authenticated user actions
              <>
                <div className="flex items-center fib-gap-3">
                  <div className="flex items-center fib-gap-2 text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.displayName || user.email}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="h-8 fib-p-4 text-xs font-medium text-muted-foreground hover:text-gradient hover:bg-muted/50 transition-all duration-300"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign Out
                  </Button>
                </div>
                <Link to="/builder">
                  <Button className="h-8 fib-p-6 text-xs font-medium gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 group">
                    Create CV
                  </Button>
                </Link>
              </>
            ) : (
              // Guest user actions
              <>
                <Link to="/login">
                  <Button variant="ghost" className="h-8 fib-p-6 text-xs font-medium text-muted-foreground hover:text-gradient hover:bg-muted/50 transition-all duration-300">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="h-8 fib-p-6 text-xs font-medium gradient-card hover:gradient-primary hover:text-white border-purple-200 hover:border-transparent transition-all duration-300">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/builder">
                  <Button className="h-8 fib-p-6 text-xs font-medium gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 group">
                    Create CV
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center fib-gap-3 mr-4 sm:mr-6">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-lg gradient-card hover:gradient-primary hover:text-white transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-purple-200/30 gradient-card backdrop-blur-xl">
            <nav className="fib-p-5 space-y-1">
              <Link
                to="/"
                className="block fib-p-5 py-3 text-sm font-medium text-muted-foreground hover:text-gradient hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-lg fib-m-3 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/templates"
                className="block fib-p-5 py-3 text-sm font-medium text-muted-foreground hover:text-gradient hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-lg fib-m-3 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                to="/builder"
                className="block fib-p-5 py-3 text-sm font-medium text-muted-foreground hover:text-gradient hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-lg fib-m-3 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CV Builder
              </Link>
              
              <div className="fib-p-5 pt-4 border-t border-purple-200/30 space-y-3 mt-3">
                {user ? (
                  // Authenticated user mobile actions
                  <>
                    <div className="flex items-center fib-gap-2 fib-p-3 bg-muted/30 rounded-lg">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{user.displayName || user.email}</span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-9 text-sm font-medium text-muted-foreground hover:text-gradient hover:bg-muted/50 transition-all duration-300"
                    >
                      <LogOut className="h-3 w-3 mr-2" />
                      Sign Out
                    </Button>
                    
                    <Link to="/builder" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-9 text-sm font-medium gradient-primary hover:shadow-glow transition-all duration-300">
                        Create CV
                      </Button>
                    </Link>
                  </>
                ) : (
                  // Guest user mobile actions
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full h-9 text-sm font-medium text-muted-foreground hover:text-gradient hover:bg-muted/50 transition-all duration-300">
                        Login
                      </Button>
                    </Link>
                    
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-9 text-sm font-medium gradient-card hover:gradient-primary hover:text-white border-purple-200 hover:border-transparent transition-all duration-300">
                        Sign Up
                      </Button>
                    </Link>
                    
                    <Link to="/builder" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-9 text-sm font-medium gradient-primary hover:shadow-glow transition-all duration-300">
                        Create CV
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
