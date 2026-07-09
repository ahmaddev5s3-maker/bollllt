import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Pill, Phone, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function Navbar({ cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const navLinks = [
    { label: "الرئيسية", path: "/" },
    { label: "الأدوية", path: "#catalog" },
    { label: "عن الصيدلية", path: "#about" },
    { label: "اتصل بنا", path: "#contact" },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">صيدليتي</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Contact Info - Desktop */}
            <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground mr-4">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>050-1234567</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>info@pharmacy.com</span>
              </div>
            </div>

            {/* Cart Button */}
            {isHomePage && (
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Login Button */}
            <Link to="/login">
              <Button size="sm" className="rounded-lg">
                <User className="w-4 h-4 ml-2" />
                دخول
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>050-1234567</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span>info@pharmacy.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
