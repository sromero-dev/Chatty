import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowBigRightDash,
  CircleUserRound,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";

function Navbar() {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Cerrar menú móvil al presionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMobileMenuOpen]);

  // Memoizar handlers para performance
  const handleLogout = useCallback(() => {
    logout();
    setIsMobileMenuOpen(false);
  }, [logout]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Memoizar las rutas para evitar recálculos
  const navItems = useMemo(() => {
    if (authUser) {
      return [
        {
          to: "/profile",
          label: "Profile",
          icon: User,
          className: "btn-accent",
        },
        {
          to: "/settings",
          label: "Settings",
          icon: Settings,
          className: "btn-info bg-primary border-0",
        },
        {
          action: handleLogout,
          label: "Logout",
          icon: LogOut,
          className: "btn-error",
          isButton: true,
        },
      ];
    }
    return [
      {
        to: "/signup",
        label: "Sign Up",
        icon: ArrowBigRightDash,
        className: "btn-accent",
      },
      {
        to: "/login",
        label: "Log In",
        icon: CircleUserRound,
        className: "btn-accent",
      },
      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
        className: "btn-info bg-primary border-0",
      },
    ];
  }, [authUser, handleLogout]);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-base-100/95 backdrop-blur-xl shadow-lg border-b border-base-300/50"
            : "bg-base-100/80 backdrop-blur-lg border-b border-base-300"
        }`}
        role="banner"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group relative"
              aria-label="Chatty Home"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
                <MessageSquare
                  className="size-5 text-primary transition-transform group-hover:rotate-12"
                  aria-hidden="true"
                />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Chatty
                <span className="text-primary animate-pulse">!</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-2.5"
              aria-label="Desktop navigation"
            >
              {navItems.map((item, index) =>
                item.isButton ? (
                  <button
                    key={item.label}
                    className={`btn ${item.className} btn-sm gap-2 transition-all hover:scale-105 active:scale-95`}
                    onClick={item.action}
                    aria-label={item.label}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`btn ${item.className} btn-sm gap-2 transition-all hover:scale-105 active:scale-95`}
                    aria-label={item.label}
                    aria-current={
                      location.pathname === item.to ? "page" : undefined
                    }
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden btn btn-ghost btn-square"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`md:hidden fixed inset-x-0 top-16 bg-base-100/95 backdrop-blur-xl border-b border-base-300 shadow-2xl transition-all duration-300 ease-out ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-4 invisible"
          }`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-3">
              {navItems.map((item, index) => (
                <div
                  key={item.label}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.isButton ? (
                    <button
                      className={`btn ${item.className} btn-block justify-start gap-3 py-4 text-lg`}
                      onClick={item.action}
                      aria-label={item.label}
                    >
                      <item.icon className="size-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.to}
                      className={`btn ${
                        item.className
                      } btn-block justify-start gap-3 py-4 text-lg ${
                        location.pathname === item.to
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      }`}
                      aria-label={item.label}
                      aria-current={
                        location.pathname === item.to ? "page" : undefined
                      }
                    >
                      <item.icon className="size-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={toggleMobileMenu}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Espacio para el navbar fijo */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}

export default Navbar;
