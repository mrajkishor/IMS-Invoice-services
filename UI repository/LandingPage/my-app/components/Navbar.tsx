"use client";

import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
    const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav style={{ padding: '10px 20px', borderBottom: '1px solid #ddd', background: 'white' }}>
            <ul style={{ display: 'flex', listStyleType: 'none', margin: 0, padding: 0 }}>
                <li style={{ marginRight: '20px' }}>
                    <Link href="/privacypolicy" style={{ textDecoration: 'none', color: 'black' }}>
                        Privacy Policy
                    </Link>
                </li>
                <li style={{ marginRight: '20px' }}>
                    <Link href="/feedback" style={{ textDecoration: 'none', color: 'black' }}>
                        Feedback
                    </Link>
                </li>
                <li>
                    <a href="#contact" onClick={scrollToContact} style={{ textDecoration: 'none', color: 'black' }}>
                        Contact
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
