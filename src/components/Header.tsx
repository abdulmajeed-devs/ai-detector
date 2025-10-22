import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <Sparkles className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">AI Content Detector</h1>
                    </Link>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link href="/" className="font-medium hover:underline transition-all">
                                    Detector
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="font-medium hover:underline transition-all">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="font-medium hover:underline transition-all">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;