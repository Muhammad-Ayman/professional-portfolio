import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Linkedin } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="container flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-display font-bold text-gradient hover:opacity-80 transition-opacity">
          Mohamed Salah Merza
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get in Touch
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="container py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium hover:text-primary transition-colors block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <h3 className="text-2xl font-display font-bold text-gradient mb-4">
                Mohamed Salah Merza
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
              Proposals Leader | Bid Management Expert | Growth Advisor
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4">
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="md:col-span-4">
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://www.linkedin.com/in/mohamedsalahmerza/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Mohamed Salah Merza. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

