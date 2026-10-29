"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { SITE_CONFIG } from "@/config/site";

export const Navbar = () => {
    const pathname = usePathname();
    // The menu stays open only on the route where it was opened, so navigating closes it
    const [menuOpenedOn, setMenuOpenedOn] = useState<string | null>(null);
    const isMobileMenuOpen = menuOpenedOn === pathname;
    const setIsMobileMenuOpen = (open: boolean) => setMenuOpenedOn(open ? pathname : null);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/subjects/logic-building", label: "Logic Building" },
        { href: "/subjects/data-structures", label: "Data Structures" },
    ];

    const comingSoonLinks = [
        { label: "Algorithms" },
        { label: "Operating Systems" },
        { label: "DBMS" },
    ];

    return (
        <header
            className={`site-header ${isScrolled ? "scrolled" : ""} ${isMobileMenuOpen ? "mobile-open" : ""
                }`}
        >
            <nav className="site-nav container">
                {/* Logo Section */}
                <Link href="/" className="site-logo">
                    <Logo />
                    <div className="logo-text-container">
                        <span className="logo-subtitle">Vamsi Bhavani presents</span>
                        <span className="logo-title">
                            VB <span className="gradient-text">Visual</span>
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="nav-links desktop-only">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? "active" : ""}`}
                            prefetch={false}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {comingSoonLinks.map((link) => ( // Use index if labels are not unique, but they are here
                        <span key={link.label} className="nav-link disabled" title="Coming Soon">
                            {link.label}
                        </span>
                    ))}
                </div>

                <div className="nav-actions desktop-only">
                    <a href={SITE_CONFIG.repoUrl} className="nav-link" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}></span>
                </button>

                {/* Mobile Navigation Drawer */}
                <div className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
                    <div className="mobile-nav-content">
                        <div className="mobile-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`mobile-link ${pathname === link.href ? "active" : ""
                                        }`}
                                    prefetch={false}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a href={SITE_CONFIG.repoUrl} className="mobile-link" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </a>
                            <div className="divider"></div>
                            {comingSoonLinks.map((link) => (
                                <span key={link.label} className="mobile-link disabled">
                                    {link.label} <span className="badge-coming-soon-sm">Soon</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Backdrop for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-backdrop"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </header>
    );
};
