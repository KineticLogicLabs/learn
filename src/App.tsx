import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  Mail
} from 'lucide-react';

import BackgroundGrid from './components/BackgroundGrid';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgramCard from './components/ProgramCard';
import ThreeDModelingSandbox from './components/ThreeDModelingSandbox';
import SyllabusTimeline from './components/SyllabusTimeline';
import InquiryForm from './components/InquiryForm';
import OurTeam from './components/OurTeam';
import LabNotebook from './components/LabNotebook';
import ScrollVideoScrubber from './components/ScrollVideoScrubber';

import { programs } from './data';

const pencilCaseVideo = new URL('./pencil_case_video.mp4', import.meta.url).href;

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('kll-101');

  const handleInquireClick = () => {
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProgramSelect = (id: string) => {
    setSelectedProgramId(id);
    setActiveTab('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-charcoal flex flex-col font-serif antialiased bg-bone-light" id="app-root-container">
      {/* 1. Animated background grid lines & coordinates indicator */}
      <BackgroundGrid />

      {/* 2. Glassmorphic main navigation header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onInquireClick={handleInquireClick} 
      />

      {/* 3. Main layout stage */}
      <main className="flex-1 relative z-10">
        
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {/* FULL-WIDTH IMMERSIVE VIDEO HERO & SCRUBBER */}
              <ScrollVideoScrubber 
                videoUrl={pencilCaseVideo} 
                onLaunchSandbox={() => {
                  setActiveTab('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewInquiry={handleInquireClick}
              />

              {/* REST OF HOME PAGE CONTENT */}
              <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-20">
                {/* PROGRAMS SECTION */}
                <section className="space-y-10 pt-4">
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-4xl md:text-5xl font-serif font-light text-charcoal tracking-tight">
                      Educational Programs
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto" id="programs-grid-panel">
                    {programs.map((prog) => (
                      <ProgramCard 
                        key={prog.id} 
                        program={prog} 
                        onSelect={handleProgramSelect} 
                      />
                    ))}
                  </div>
                </section>

                {/* Spotlight Team Block */}
                <section className="pt-8 border-t border-accent-blue/15">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-bone-warm/35 p-8 rounded-2xl border border-accent-blue/10">
                    <div className="space-y-1 max-w-2xl text-left">
                      <h4 className="text-3xl md:text-4xl font-serif font-light text-charcoal">Meet the Core Research Faculty</h4>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('team');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="whitespace-nowrap px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-bone-light bg-accent-blue hover:bg-opacity-95 transition-all duration-300 flex items-center gap-2"
                    >
                      <span>Meet the Team</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8"
            >
              {/* Projects Subheader */}
              <div className="space-y-1 pb-4 border-b border-accent-blue/10">
                <h2 className="text-4xl md:text-5xl font-serif font-light text-charcoal tracking-tight">
                  Parametric Mesh Modeler
                </h2>
              </div>

              <ThreeDModelingSandbox />
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8"
            >
              <OurTeam />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-16"
            >
              {/* About Subheader */}
              <div className="space-y-1 pb-4 border-b border-accent-blue/10">
                <h2 className="text-4xl md:text-5xl font-serif font-light text-charcoal tracking-tight">
                  Laboratory Syllabus & Logs
                </h2>
              </div>

              {/* Grid of Syllabus Timeline and Lab Notebook */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-widest font-extrabold uppercase mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>CURRICULUM SYLLABUS TIMELINE</span>
                  </div>
                  <SyllabusTimeline />
                </div>
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-widest font-extrabold uppercase mb-2">
                    <Award className="w-4 h-4" />
                    <span>LABORATORY RESEARCH NOTEBOOK</span>
                  </div>
                  <LabNotebook />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-10"
            >
              {/* Short Header & Explanatory Message */}
              <div className="space-y-1 pb-6 border-b border-accent-blue/10">
                <h2 className="text-5xl md:text-6xl font-serif font-light text-charcoal tracking-tight leading-tight">
                  Contact
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Inquiry Form Card */}
                <div className="lg:col-span-7">
                  <InquiryForm />
                </div>

                {/* Right Column: Contact Information Section */}
                <div className="lg:col-span-5 pt-4 lg:pt-0 space-y-6">
                  <div>
                    <h3 className="font-mono text-lg font-bold tracking-wider text-charcoal uppercase">
                      CONTACT INFORMATION
                    </h3>
                    <div className="h-[1px] w-full bg-accent-blue/15 mt-3" />
                  </div>

                  <div className="flex items-center gap-5">
                    {/* Icon Card Box */}
                    <div className="h-14 w-14 glass-sheet rounded-lg flex items-center justify-center shadow-sm">
                      <Mail className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-charcoal-muted tracking-widest uppercase block mb-1 font-semibold">
                        EMAIL ADDRESS
                      </span>
                      <a 
                        href="mailto:kineticlogiclabs@gmail.com" 
                        className="font-mono text-sm md:text-base font-bold text-charcoal hover:text-accent-blue transition-colors"
                      >
                        kineticlogiclabs@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 4. Modular Curated Academic Footer matching image precisely in light theme */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
