import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LogOut, Menu, X, SwordIcon, Library } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated: checkAuth, logout } = useAuthStore();
  const isAuthenticated = checkAuth();
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else if (window.location.pathname === "/search") {
      navigate("/search"); // Clear search results if on search page
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-card)]/90 backdrop-blur-md border-b border-[var(--color-border)]/40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-2xl text-[var(--color-primary)]"> <SwordIcon /> </span>
          <span className="font-display text-xl font-bold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors hidden sm:block">
            Sword of Coming
          </span>
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-md mx-4"
        >
          <div className="relative w-full group">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search donghua..."
              className="w-full px-4 py-2 pl-10 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-lg 
                         text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]
                         focus:shadow-[0_0_15px_rgba(196,30,58,0.2)]
                         transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] group-focus-within:text-[var(--color-primary)] transition-colors" />
          </div>
        </form>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* My Library Link */}
              <Link
                to="/library"
                className="flex items-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Library className="w-4 h-4" />
                My Library
              </Link>

              <span className="text-sm text-[var(--color-muted-foreground)] border-l border-[var(--color-border)] pl-4">
                Welcome,{" "}
                <span className="text-[var(--color-foreground)] font-medium">
                  {user.username}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-muted-foreground)] 
                           hover:text-[var(--color-primary)] transition-colors cursor-pointer"
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
          
          <ThemeToggle />
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-[var(--color-foreground)] hover:text-[var(--color-primary)] cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-card)] border-t border-[var(--color-border)]/40 px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="flex-1 px-4 py-2 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-lg 
                         text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </form>

          {isAuthenticated && user ? (
            <div className="space-y-4">
              <Link
                to="/library"
                className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Library className="w-4 h-4 text-[var(--color-primary)]" />
                My Library
              </Link>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
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
      )}
    </nav>
  );
}
