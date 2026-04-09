// src/components/layout/Navbar.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogOut, Menu, X, Sword, SwordIcon } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated: checkAuth, logout } = useAuthStore();
  const isAuthenticated = checkAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search navigation
      console.log("Searching:", searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-dark-card)]/90 backdrop-blur-md border-b border-[var(--color-dark-border)]/40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl text-red-500"> < SwordIcon /> </span>
          <span className="font-display text-xl font-bold text-[var(--color-dark-primary)] group-hover:text-[var(--color-dark-accent)] transition-colors">
            Sword of Coming
          </span>
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-md mx-8"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search donghua..."
              className="w-full px-4 py-2 pl-10 bg-[var(--color-dark-secondary)] border border-[var(--color-dark-border)] rounded-lg 
                         text-[var(--color-dark-foreground)] placeholder-[var(--color-dark-muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent
                         transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-dark-muted-foreground)]" />
          </div>
        </form>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-[var(--color-dark-muted-foreground)]">
                Welcome,{" "}
                <span className="text-[var(--color-dark-foreground)] font-medium">
                  {user.username}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-dark-muted-foreground)] 
                           hover:text-[var(--color-dark-primary)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-crimson text-sm px-4 py-2">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[var(--color-dark-foreground)] hover:text-[var(--color-dark-primary)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {
        mobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-dark-card)] border-t border-[var(--color-dark-border)]/40 px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-4 py-2 bg-[var(--color-dark-secondary)] border border-[var(--color-dark-border)] rounded-lg 
                         text-[var(--color-dark-foreground)] placeholder-[var(--color-dark-muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)]"
              />
            </form>

            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-dark-muted-foreground)]">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[var(--color-dark-primary)] hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center btn-crimson"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )
      }
    </nav >
  );
}
