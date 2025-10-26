'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, Home, Info, Mail, Shield, FileText } from 'lucide-react';

const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Calculate scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const trackLength = documentHeight - windowHeight;
            const progress = (scrollTop / trackLength) * 100;
            
            setScrollProgress(Math.min(progress, 100));
            setIsScrolled(scrollTop > 20);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/about', label: 'About', icon: Info },
        { href: '/contact', label: 'Contact', icon: Mail },
        { href: '/privacy', label: 'Privacy', icon: Shield },
        { href: '/terms', label: 'Terms', icon: FileText },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <header 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link 
                            href="/" 
                            className={`flex items-center gap-3 hover:opacity-90 transition-all duration-300 group ${
                                isScrolled ? 'text-gray-900' : 'text-white'
                            }`}
                        >
                            <div className="relative">
                                <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                    AI Content Detector
                                </h1>
                                <p className={`text-xs hidden sm:block ${
                                    isScrolled ? 'text-gray-600' : 'text-white/80'
                                }`}>
                                    Detect AI-Generated Content Instantly
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`
                                            relative px-4 py-2 rounded-lg font-medium text-sm
                                            transition-all duration-300 flex items-center gap-2
                                            ${isScrolled 
                                                ? active
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                : active
                                                    ? 'bg-white/20 text-white backdrop-blur-sm'
                                                    : 'text-white/90 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {link.label}
                                        {active && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"></span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`
                                md:hidden p-2.5 rounded-lg transition-all duration-300
                                ${isScrolled 
                                    ? 'text-gray-700 hover:bg-gray-100' 
                                    : 'text-white hover:bg-white/10'
                                }
                            `}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <div 
                        className={`
                            md:hidden overflow-hidden transition-all duration-300 ease-in-out
                            ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                        `}
                    >
                        <nav className="py-4 border-t border-white/20">
                            <div className="flex flex-col space-y-1">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.href);
                                    
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                                                transition-all duration-300
                                                ${isScrolled
                                                    ? active
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                    : active
                                                        ? 'bg-white/20 text-white backdrop-blur-sm'
                                                        : 'text-white/90 hover:bg-white/10'
                                                }
                                            `}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{link.label}</span>
                                            {active && (
                                                <span className="ml-auto">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Reading Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/20">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out relative"
                        style={{ width: `${scrollProgress}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-lg animate-pulse"></div>
                    </div>
                </div>
            </header>

            {/* Spacer to prevent content from hiding under fixed header */}
            <div className="h-20"></div>
        </>
    );
};

export default Header;