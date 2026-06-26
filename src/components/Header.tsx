import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onInquireClick: () => void;
}

export default function Header({ activeTab, setActiveTab, onInquireClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'team', label: 'OUR TEAM' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    if (query.includes('3d') || query.includes('sandbox') || query.includes('model') || query.includes('project')) {
      setActiveTab('projects');
    } else if (query.includes('team') || query.includes('member') || query.includes('ziyao') || query.includes('people') || query.includes('staff')) {
      setActiveTab('team');
    } else if (query.includes('curriculum') || query.includes('syllabus') || query.includes('about') || query.includes('notebook') || query.includes('research')) {
      setActiveTab('about');
    } else if (query.includes('inquiry') || query.includes('admissions') || query.includes('contact') || query.includes('form')) {
      setActiveTab('contact');
    } else {
      setActiveTab('home');
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-50 w-full navbar-frosted py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300" id="global-header">
      {/* Brand Logo & Text Layout - Exactly like the image */}
      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('home')}>
        {/* Pointy-topped Hexagon Gear SVG Logo - Exact user-supplied SVG */}
        <div className="relative w-9 h-9 flex items-center justify-center">
          <svg 
            id="Logo" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="120 120 760 760"
            className="w-9 h-9 text-accent-blue"
          >
            <polygon 
              className="fill-none stroke-current"
              strokeWidth="29" 
              strokeLinecap="round"
              strokeLinejoin="round"
              points="500 123.78 174.18 311.89 174.18 688.11 500 876.22 825.82 688.11 825.82 311.89 500 123.78"
            />
            <circle 
              className="fill-none stroke-current"
              strokeWidth="29" 
              cx="500" 
              cy="500" 
              r="162.65"
            />
            <path 
              className="fill-current stroke-none"
              d="M753.03,448.91l-36.04-7.29c-3.87-.78-6.99-3.62-8.17-7.39-3.87-12.28-8.8-24.1-14.67-35.34-1.83-3.51-1.64-7.72.55-11.02l20.35-30.66c4.43-6.68,4.05-14.91-.92-19.88l-51.46-51.46c-4.97-4.97-13.2-5.35-19.88-.92l-30.66,20.35c-3.3,2.19-7.51,2.38-11.02.55-10.95-5.72-22.44-10.54-34.38-14.35-3.74-1.2-6.56-4.31-7.34-8.16l-8.3-41.03c-1.59-7.85-7.68-13.4-14.7-13.4h-72.78c-7.02,0-13.11,5.55-14.7,13.4l-8.3,41.03c-.78,3.85-3.6,6.96-7.34,8.16-11.94,3.81-23.43,8.63-34.38,14.35-3.51,1.83-7.72,1.64-11.02-.55l-30.66-20.35c-6.68-4.43-14.91-4.05-19.88.92l-51.46,51.46c-4.97,4.97-5.35,13.2-.92,19.88l20.35,30.66c2.19,3.3,2.38,7.51.55,11.02-5.87,11.24-10.8,23.06-14.67,35.34-1.18,3.77-4.3,6.61-8.17,7.39l-36.04,7.29c-7.85,1.59-13.41,7.68-13.41,14.7v72.78c0,7.02,5.56,13.11,13.41,14.7l36.04,7.29c3.87.78,6.99,3.62,8.17,7.39,3.87,12.28,8.8,24.1,14.67,35.34,1.83,3.51,1.64,7.72-.55,11.02l-20.35,30.66c-4.43,6.68-4.05,14.91.92,19.88l51.46,51.46c4.97,4.97,13.2,5.35,19.88.92l30.66-20.35c3.3-2.19,7.51-2.38,11.02-.55,11.24,5.87,23.06,10.8,35.34,14.67,3.77,1.18,6.61,4.3,7.39,8.17l7.29,36.04c1.59,7.85,7.68,13.41,14.7,13.41h72.78c7.02,0,13.11-5.56,14.7-13.41l7.29-36.04c.78-3.87,3.62-6.99,7.39-8.17,12.28-3.87,24.1-8.8,35.34-14.67,3.51-1.83,7.72-1.64,11.02.55l30.66,20.35c6.68,4.43,14.91,4.05,19.88-.92l51.46-51.46c4.97-4.97,5.35-13.2.92-19.88l-20.35-30.66c-2.19-3.3-2.38-7.51-.55-11.02,5.87-11.24,10.8-23.06,14.67-35.34,1.18-3.77,4.3-6.61,8.17-7.39l36.04-7.29c7.85-1.59,13.41-7.68,13.41-14.7v-72.78c0-7.02-5.56-13.11-13.41-14.7ZM500,662.65c-89.83,0-162.65-72.82-162.65-162.65s72.82-162.65,162.65-162.65,162.65,72.82,162.65,162.65-72.82,162.65-162.65,162.65Z"
            />
          </svg>
        </div>
        <div className="flex flex-col select-none leading-none">
          <span className="font-mono text-[13px] font-extrabold tracking-widest text-charcoal">KINETIC</span>
          <span className="font-mono text-[13px] font-extrabold tracking-widest text-charcoal">LOGIC LABS</span>
        </div>
      </div>

      {/* Navigation menu - exact uppercase with line indicator underneath, search and vertical line */}
      <div className="flex items-center gap-2">
        <nav className="hidden md:flex items-center gap-7 lg:gap-10 mr-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative py-2 text-[11px] font-mono font-extrabold tracking-widest transition-all duration-300 ${
                  isActive ? 'text-accent-blue' : 'text-charcoal-light hover:text-accent-blue'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2.5px] bg-accent-blue rounded-full transition-all duration-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Vertical divider */}
        <div className="h-5 w-[1px] bg-accent-blue/25 mx-2 hidden md:block" />

        {/* Search button toggler */}
        <div className="relative flex items-center">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-charcoal-light hover:text-accent-blue transition-colors p-2 rounded-lg hover:bg-bone-warm/50" 
            aria-label="Search site"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* Elegant slide-out search form */}
          {isSearchOpen && (
            <form 
              onSubmit={handleSearchSubmit}
              className="absolute right-0 top-12 bg-bone-light/90 backdrop-blur border border-accent-blue/20 rounded-xl p-2 shadow-lg flex items-center gap-2 w-64 md:w-80 animate-[slideDown_0.2s_ease-out] z-50"
            >
              <input 
                type="text" 
                placeholder="Search tabs (e.g. 3D, Curriculum)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bone-warm/30 rounded px-3 py-1.5 text-xs font-mono border-none focus:outline-none focus:ring-1 focus:ring-accent-blue text-charcoal"
                autoFocus
              />
              <button 
                type="submit"
                className="bg-accent-blue text-bone-light p-1.5 rounded hover:bg-opacity-90 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-charcoal-light hover:text-accent-blue p-2 rounded-lg hover:bg-bone-warm/50 focus:outline-none flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
          aria-label="Toggle navigation menu"
        >
          <span className={`w-5 h-0.5 bg-current transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
          <span className={`w-5 h-0.5 bg-current transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile responsive navigation panel */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-bone-light/95 backdrop-blur border-b border-accent-blue/20 p-6 flex flex-col gap-4 animate-[slideDown_0.2s_ease-out] md:hidden z-40 shadow-md">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`py-2 text-xs font-mono font-extrabold tracking-widest text-left transition-colors ${
                  isActive ? 'text-accent-blue border-l-2 border-accent-blue pl-2' : 'text-charcoal-light pl-2'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
