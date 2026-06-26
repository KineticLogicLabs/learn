import { Mail } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-bone-warm/85 border-t border-accent-blue/15 relative z-10 w-full" id="global-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          
          {/* Column 1: Brand Info & Contacts */}
          <div className="md:col-span-5 space-y-5">
            {/* Logo and Brand Text */}
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => handleNav('home')}>
              <svg 
                id="Logo" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="120 120 760 760"
                className="w-8 h-8 text-accent-blue"
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
              <div className="flex flex-col select-none leading-none">
                <span className="font-mono text-[12px] font-extrabold tracking-widest text-charcoal">KINETIC</span>
                <span className="font-mono text-[12px] font-extrabold tracking-widest text-charcoal">LOGIC LABS</span>
              </div>
            </div>

            {/* Description matching image exactly */}
            <p className="font-mono text-[13px] leading-relaxed text-charcoal-light max-w-sm">
              Kinetic Logic Labs is a engineering and design firm focused on technical, design, and engineering development.
            </p>

            {/* Contacts list matching image exactly */}
            <div className="space-y-3 pt-2 text-xs font-mono text-charcoal-light">
              <a 
                href="mailto:kineticlogiclabs@gmail.com" 
                className="flex items-center gap-2.5 hover:text-accent-blue transition-colors group"
              >
                <Mail className="w-4 h-4 text-accent-blue/75 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-accent-blue/20 underline-offset-2">kineticlogiclabs@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Explore Navigation */}
          <div className="md:col-span-4 space-y-4">
            <div className="space-y-1">
              <h5 className="font-mono text-[11px] font-bold tracking-widest text-charcoal uppercase">EXPLORE</h5>
              <div className="h-[1px] w-full bg-accent-blue/15" />
            </div>
            <ul className="space-y-2.5 text-xs font-mono text-charcoal-light">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-accent-blue transition-colors text-left">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-accent-blue transition-colors text-left">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('projects')} className="hover:text-accent-blue transition-colors text-left">
                  Projects
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('team')} className="hover:text-accent-blue transition-colors text-left">
                  Our Team
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-accent-blue transition-colors text-left">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Divider & Credits exactly matching image */}
          <div className="hidden md:flex md:col-span-1 justify-center py-2">
            <div className="w-[1.5px] h-32 bg-accent-blue/15" />
          </div>

          {/* Column 5: Right Aligned Rights Block */}
          <div className="md:col-span-2 flex flex-col justify-between items-start md:items-end h-auto md:h-36 pt-2 md:pt-0 text-left md:text-right font-mono">
            <div className="space-y-1">
              <div className="text-[11px] font-extrabold tracking-wider text-charcoal">
                © 2026 KINETIC LOGIC LABS
              </div>
              <div className="text-[9px] tracking-widest text-charcoal-muted uppercase">
                ALL RIGHTS RESERVED
              </div>
            </div>
            <div className="pt-6 md:pt-0">
              <span className="text-[10px] tracking-widest text-charcoal-light font-extrabold block uppercase">
                WEBSITE DESIGN BY ZIYAO XU
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
