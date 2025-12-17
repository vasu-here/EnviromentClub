'use client';

import { useState, useRef, useCallback, ReactNode, FC, useEffect } from 'react';
import { Mail, Phone, Calendar, Zap, Users, Leaf, Eye, ArrowRight, Rss, Globe, LucideIcon,X, Menu } from 'lucide-react';
import Image from 'next/image';

// --- Configuration ---
const CLUB_NAME = "Environment Club NIT Patna";
const NITP_BLUE = 'rgb(29, 78, 216)';
const GREEN_ACCENT = 'rgb(34, 197, 94)';
const BG_DARK = '#0a0a0a';
const CARD_BG = '#1f2937';

// --- Type Definitions ---

// Props for the Button component
interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

// Props for the SectionTitle component
interface SectionTitleProps {
  icon: LucideIcon; // LucideIcon is the type for components imported from lucide-react
  title: string;
  description: string;
  id: string;
}

// Props for the MagneticText component
interface MagneticTextProps {
  children: ReactNode;
  className?: string;
}

// Data structure for gallery items
interface GalleryItem {
  id: number;
  imgPath: string;
  title: string;
  description: string;
  size: 'sm' | 'md' | 'lg';
}

// Props for the TiltableGridItem component
interface TiltableGridItemProps extends Omit<GalleryItem, 'id'> { }


// --- Utility Components ---

// Explicitly typed utility function
const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Typed Functional Component (FC)
const Button: FC<ButtonProps> = ({ children, className = '', onClick }) => (
  <button onClick={onClick} className={`px-8 py-3 font-semibold text-sm rounded-full transition duration-300 ease-in-out transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-opacity-50 ${className}`}>
    {children}
  </button>
);

// Typed Functional Component (FC)
const SectionTitle: FC<SectionTitleProps> = ({ icon: Icon, title, description, id }) => (
  <div id={id} className="text-center mb-16 pt-20 -mt-20">
    <Icon className="w-10 h-10 mx-auto" style={{ color: GREEN_ACCENT }} />
    <h2 className="text-5xl font-extrabold mt-3 text-white tracking-tight">{title}</h2>
    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-3">{description}</p>
  </div>
);

// --- 1. Magnetic Text Component ---
const MagneticText: FC<MagneticTextProps> = ({ children, className = '' }) => {
  // useRef is explicitly typed to reference an HTMLDivElement
  const ref = useRef<HTMLDivElement>(null);
  // useState type inferred or explicitly defined
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // useCallback is used and event is typed to MouseEvent
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { current } = ref;
    if (current) {
      const { clientX, clientY } = e;
      const { width, height, left, top } = current.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.1;
      const y = (clientY - (top + height / 2)) * 0.1;
      setPosition({ x, y });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-100 ease-out will-change-transform ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
};

// --- Navbar Component ---
const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navItems = ['Home', 'Vision', 'Members', 'Events', 'Gallery', 'News'];

  const handleNavClick = (section: string) => {
    setIsOpen(false);
    // Timeout allows the menu to start closing before the scroll jump happens
    setTimeout(() => {
      scrollToSection(section.toLowerCase());
    }, 300);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-black/90 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
        
        {/* Logo - Scaled for Mobile */}
        <div 
          className="flex items-center gap-2 cursor-pointer z-[110]" 
          onClick={() => handleNavClick('home')}
        >
          <div className="p-1.5 h-10 w-10 relative rounded-full bg-green-500/10 border border-green-500/20">
            {/* <Leaf className="w-5 h-5 md:w-6 md:h-6 text-green-500" /> */}
            <Image src={'/club.png'} fill className='object-cover' alt='logo'/>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm md:text-xl font-black text-white leading-none tracking-tight">
              ENVIRONMENT CLUB
            </span>
            <span className="text-[10px] md:text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">
              NIT Patna
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="text-sm font-semibold text-gray-400 hover:text-green-500 transition-colors uppercase tracking-widest"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors z-[110]"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - Slide Down Transition */}
      <div 
        className={`
          absolute top-full left-0 w-full bg-black border-b border-gray-800 transition-all duration-300 ease-in-out overflow-hidden md:hidden
          ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <nav className="flex flex-col p-6 space-y-6">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className={`
                text-2xl font-bold text-left transition-all duration-500 transform
                ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
              `}
              style={{ 
                transitionDelay: `${index * 50}ms`,
                color: item === 'Home' ? GREEN_ACCENT : 'white' 
              }}
            >
              {item}
            </button>
          ))}
          
          <div className="pt-10 border-t border-gray-900">
            <p className="text-gray-500 text-sm italic">Join the movement for a greener NITP.</p>
          </div>
        </nav>
      </div>
    </header>
  );
};

// --- Hero & About Section ---
const HeroSection: FC = () => (
  <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: BG_DARK }}>
    {/* Dynamic Background Elements */}
    <div className="absolute inset-0 z-0">
      {/* Organic glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-800 opacity-20 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] opacity-10 blur-[120px] rounded-full" style={{ backgroundColor: NITP_BLUE }}></div>
      
      {/* Subtle Grid Pattern for Technical Feel */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
    </div>

    <div className="z-10 text-center p-6 max-w-7xl mx-auto">
      {/* Subtle Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/5 mb-8 animate-fade-in">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-bold tracking-widest text-green-400 uppercase">Protect. Restore. Innovate.</span>
      </div>

      <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-8">
        <MagneticText className="block">
          NURTURING <span style={{ color: GREEN_ACCENT }}>NATURE</span>
        </MagneticText>
        <MagneticText className="block text-gray-300">
          THROUGH <span className="italic">ACTION.</span>
        </MagneticText>
      </h1>

      <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto mt-6 font-medium">
        Empowering the <span className="text-white">NIT Patna</span> community to lead the global shift towards sustainability through science, advocacy, and collective effort.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
        <MagneticText>
          <Button
            onClick={() => scrollToSection('members')}
            className="bg-green-600 text-white hover:bg-green-700 px-8 py-6 text-xl shadow-2xl shadow-green-500/20 flex items-center transition-all duration-300 hover:translate-y-[-2px]"
          >
            Join the Movement <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </MagneticText>
        
        <button 
          onClick={() => scrollToSection('events')}
          className="text-gray-300 hover:text-white font-bold tracking-wide flex items-center transition-colors group"
        >
          View Calendar <div className="ml-2 w-8 h-[1px] bg-gray-600 group-hover:w-12 group-hover:bg-green-500 transition-all"></div>
        </button>
      </div>

      {/* Hero Stats / Social Proof Bar */}
      {/* <div className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-white/5 pt-12 max-w-4xl mx-auto">
        <div>
          <h4 className="text-white text-3xl font-black">1st Dec</h4>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Established</p>
        </div>
        <div>
          <h4 className="text-white text-3xl font-black">40+</h4>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Planned Events</p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-white text-3xl font-black">NITP</h4>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Core Presence</p>
        </div>
      </div> */}
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 animate-bounce">
      <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
        <div className="w-1 h-2 bg-white rounded-full"></div>
      </div>
    </div>
  </section>
);

// --- 2. Tiltable Grid Item (SMOOTHER INTERACTIVITY REVISION) ---
const TiltableGridItem: FC<TiltableGridItemProps> = ({ imgPath, title, description, size = 'md' }) => {
  // Ref typed to HTMLDivElement
  const ref = useRef<HTMLDivElement>(null);

  // Event typed to React.MouseEvent
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    // Use requestAnimationFrame for optimized styling updates
    requestAnimationFrame(() => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = el.getBoundingClientRect();

      const x = (clientX - (left + width / 2)) / width;
      const y = (clientY - (top + height / 2)) / height;

      const tiltX = -y * 8;
      const tiltY = x * 8;

      // Set CSS custom properties (safe for TypeScript)
      el.style.setProperty('--tiltX', `${tiltX}deg`);
      el.style.setProperty('--tiltY', `${tiltY}deg`);
      el.style.setProperty('--scaleFactor', '1.05');
      el.style.setProperty('--shadowOpacity', '0.5');
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (el) {
      // Reset CSS custom properties
      el.style.setProperty('--tiltX', '0deg');
      el.style.setProperty('--tiltY', '0deg');
      el.style.setProperty('--scaleFactor', '1');
      el.style.setProperty('--shadowOpacity', '0.3');
    }
  }, []);

  const sizeClasses = {
    sm: 'col-span-1 h-64',
    md: 'col-span-1 h-96',
    lg: 'col-span-2 h-[400px]',
  };

  // The 'style' object now includes CSS variables, which TypeScript accepts
  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
                relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ease-out 
                hover:z-20 cursor-pointer group bg-gray-900 perspective-1000
                ${sizeClasses[size]}
            `}
      style={{
        '--tiltX': '0deg',
        '--tiltY': '0deg',
        '--scaleFactor': '1',
        '--shadowOpacity': '0.3',
        transform: 'perspective(1000px) rotateX(var(--tiltX)) rotateY(var(--tiltY)) scale(var(--scaleFactor))',
        boxShadow: '0 10px 30px rgba(0, 0, 0, var(--shadowOpacity))',
        transitionProperty: 'transform, box-shadow, var(--tiltX), var(--tiltY)',
        transformStyle: 'preserve-3d',
      } as React.CSSProperties}
    >
      {/* Image Placeholder with subtle movement */}
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{
        backgroundImage: `url('${imgPath}')`,
        backgroundColor: '#333',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transformStyle: 'preserve-3d',
      }}>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-z-20">
        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{title}</h3>
        <p className="text-gray-200 text-sm opacity-80 group-hover:opacity-100 transition duration-300">{description}</p>
      </div>
    </div>
  );
};

// --- Slideshow/Gallery Section ---
const GallerySection: FC = () => {
  // The galleryItems array is now implicitly typed as GalleryItem[]
  const galleryItems: GalleryItem[] = [
    { id: 1, imgPath: '/placeholder-g1.jpg', title: 'Campus Clean-up Drive', description: 'Volunteers collecting waste near the Ganga Ghat.', size: 'md' },
    { id: 2, imgPath: '/placeholder-g2.jpg', title: 'Annual Plantation', description: 'Planting saplings to increase campus green cover.', size: 'sm' },
    { id: 3, imgPath: '/placeholder-g3.jpg', title: 'Solar Panel Installation', description: 'Promoting renewable energy on hostel rooftops.', size: 'lg' },
    { id: 4, imgPath: '/placeholder-g4.jpg', title: 'Eco-Workshop', description: 'Seminar on sustainable living practices.', size: 'sm' },
    { id: 5, imgPath: '/placeholder-g5.jpg', title: 'Biodiversity Walk', description: 'Documenting local flora and fauna on campus.', size: 'md' },
    { id: 6, imgPath: '/placeholder-g6.jpg', title: 'Recycling Project', description: 'Launch of the new multi-bin recycling system.', size: 'md' },
    { id: 7, imgPath: '/placeholder-g7.jpg', title: 'Water Conservation Check', description: 'Auditing campus water usage and infrastructure.', size: 'sm' },
    { id: 8, imgPath: '/placeholder-g8.jpg', title: 'Guest Lecture Series', description: 'Talk on environmental policy by an industry expert.', size: 'md' },
    { id: 9, imgPath: '/placeholder-g9.jpg', title: 'E-Waste Collection', description: 'Organized drive for safe disposal of electronic waste.', size: 'sm' },
    { id: 10, imgPath: '/placeholder-g10.jpg', title: 'River Bank Restoration', description: 'Local community effort near the campus.', size: 'lg' },
  ];

  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: BG_DARK }}>
      <SectionTitle
        icon={Eye}
        title="Club in Action"
        description="Explore our high-impact projects and the beautiful, sustainable landscape of NIT Patna."
        id="gallery"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <TiltableGridItem
              key={item.id}
              imgPath={item.imgPath}
              title={item.title}
              description={item.description}
              size={item.size}
            />
          ))}
        </div>
      </div>
    </section>
  );
};


// --- Vision Section ---
const VisionSection: FC = () => (
  <section className="py-24" style={{ backgroundColor: CARD_BG }}>
    <SectionTitle
      id="vision"
      icon={Globe}
      title="Our Vision & Mission"
      description="Driving sustainable change and innovation for a resilient future."
    />
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="p-8 bg-gray-900 rounded-xl shadow-2xl transition duration-300 hover:bg-gray-800 border-l-4" style={{ borderColor: GREEN_ACCENT }}>
          <h3 className="text-2xl font-bold mb-3 text-white">The Vision</h3>
          <p className="text-gray-400">
            To establish NIT Patna as a beacon of sustainability in technical education, fostering an eco-conscious community that leads through innovation and ethical environmental practices.
          </p>
        </div>

        <div className="p-8 bg-gray-900 rounded-xl shadow-2xl transition duration-300 hover:bg-gray-800">
          <h3 className="text-2xl font-bold mb-3 text-white">Awareness</h3>
          <p className="text-gray-400">
            Organize workshops and campaigns to raise awareness about critical environmental issues like climate change, waste management, and resource efficiency.
          </p>
        </div>

        <div className="p-8 bg-gray-900 rounded-xl shadow-2xl transition duration-300 hover:bg-gray-800">
          <h3 className="text-2xl font-bold mb-3 text-white">Action</h3>
          <p className="text-gray-400">
            Implement on-campus green initiatives, including tree planting drives, campus clean-ups, and advocacy for sustainable campus infrastructure projects.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// --- Members Section ---
// Type for a Member object
interface Member {
  name: string;
  position: string;
  contact: string;
  img: string;
}

const MembersSection: FC = () => {
  // Faculty PI - separated for unique positioning
  const facultyPI = { 
    name: 'Dr. Vineet Singh', 
    position: 'PI (Professor InCharge)', 
    contact: 'vineet.ec@nitp.ac.in', 
    img: '/vineet.jpg' 
  };

  const seniorMembers: Member[] = [
    { name: 'Ratnesh Anand', position: 'President', contact: 'ratnesha.ug23.cs@nitp.ac.in', img: '/ratnesh.jpeg' },
    { name: 'Arth Kumar', position: 'Vice President', contact: 'arthk.ug23.cs@nitp.ac.in', img: '/arth.jpeg' },
    { name: 'Vasu Choudhari', position: 'Secretary', contact: 'vasuc.ug23.cs@nitp.ac.in', img: '/vasu.jpeg' },
    { name: 'Ayush Kumar', position: 'Coordinator', contact: 'ayush@nitp.ac.in', img: '/ayush.jpeg' },
  ];

  const juniorMembers = [
    { name: 'Vaibhav Vishal', position: 'Joint Secretary', contact: 'vaibhavv.ug24.ec@nitp.ac.in' },
    { name: 'Bikas Kumar Rajak', position: 'Joint Secretary', contact: 'bikashr.ug24.ec@nitp.ac.in' },
    { name: 'Abhishek Kumar', position: 'Jr. Coordinator', contact: 'abhishekk.ug24.ec@nitp.ac.in' },
    { name: 'Sudhansu Mishra', position: 'Jr. Coordinator', contact: 'sudhanshum.ug24.ec@nitp.ac.in' },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: BG_DARK }}>
      <SectionTitle
        id="members"
        icon={Users}
        title="Our Dedicated Team"
        description="The core members driving the environmental movement at NIT Patna."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: Faculty PI (Centered Solo) */}
        <div className="flex justify-center mb-16">
          <div className="p-6 rounded-2xl text-center shadow-2xl transition-all duration-300 border border-green-500/20 hover:border-green-500/50 group w-full max-w-sm" style={{ backgroundColor: CARD_BG }}>
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-700 border-4 border-green-600 group-hover:border-green-400 transition-all duration-300">
              <Image src={facultyPI.img} fill className='object-cover' alt={facultyPI.name} />
            </div>
            <h4 className="text-xl font-bold text-white">{facultyPI.name}</h4>
            <p className="text-md font-bold mb-3 uppercase tracking-wider" style={{ color: GREEN_ACCENT }}>{facultyPI.position}</p>
            <div className="flex items-center justify-center text-sm text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              <a href={`mailto:${facultyPI.contact}`} className="hover:text-white transition underline underline-offset-4 decoration-green-900">{facultyPI.contact}</a>
            </div>
          </div>
        </div>

        {/* Row 2: Senior Leadership Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {seniorMembers.map((member, index) => (
            <div key={index} className="p-4 rounded-xl text-center shadow-lg transition-transform duration-300 hover:scale-[1.05] hover:shadow-2xl group" style={{ backgroundColor: CARD_BG }}>
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600 group-hover:border-green-500 transition-all duration-300">
                <Image src={member.img} fill className='object-cover' alt={member.name} />
              </div>
              <h4 className="text-lg font-bold text-white whitespace-nowrap">{member.name}</h4>
              <p className="text-sm font-semibold mb-2" style={{ color: GREEN_ACCENT }}>{member.position}</p>
              <div className="mt-3 text-xs space-y-1">
                <p className="flex items-center justify-center text-gray-400">
                  <Mail className="w-3 h-3 mr-1" />
                  <a href={`mailto:${member.contact}`} className="hover:text-white transition">{member.contact.split('@')[0]}...</a>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 3: Junior Members Section */}
        <div className="pt-12 border-t border-gray-800">
          <h3 className="text-center text-gray-400 uppercase tracking-widest text-sm font-semibold mb-10">Executive Committee</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {juniorMembers.map((junior, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-800 flex flex-col items-center hover:border-gray-600 transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <h5 className="text-white font-medium">{junior.name}</h5>
                <span className="text-xs mb-2" style={{ color: GREEN_ACCENT }}>{junior.position}</span>
                <a href={`mailto:${junior.contact}`} className="text-[10px] text-gray-500 flex items-center hover:text-white transition">
                  <Mail className="w-3 h-3 mr-1" />
                  {junior.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Events & News/Notice Section ---
const EventsNewsSection: FC = () => {
  const notices = [
    {
      date: '1st Dec 2024',
      title: 'Environment Club Established',
      description: 'Official formation of the NIT Patna Environment Club! Join us in our journey toward a sustainable and greener campus.',
      borderColor: NITP_BLUE, // You can also use GREEN_ACCENT here to make it stand out
    },
  ];
  // Full Academic Calendar Data
  const upcomingEvents = [
    { date: 'Jan 26', title: 'Republic Day', description: 'Green India pledges and environmental awareness.' },
    { date: 'Feb 2', title: 'World Wetlands Day', description: 'Focus on wetland restoration and biodiversity.' },
    { date: 'Feb 28', title: 'National Science Day', description: 'Science for Sustainability showcase.' },
    { date: 'Mar 3', title: 'World Wildlife Day', description: 'Protecting endangered local flora and fauna.' },
    { date: 'Mar 20', title: 'World Sparrow Day', description: 'International Day of Happiness celebration.' },
    { date: 'Mar 21', title: 'International Day of Forests', description: 'Tree identification and conservation talk.' },
    { date: 'Mar 22', title: 'World Water Day', description: 'Workshop on efficient water management.' },
    { date: 'Mar 23', title: 'World Meteorological Day', description: 'Understanding climate patterns.' },
    { date: 'Mar 26', title: 'Chipko Movement Anniversary', description: 'Commemorating the history of forest protection.' },
    { date: 'Apr 7', title: 'World Health Day', description: 'Environmental health and its impact on well-being.' },
    { date: 'Apr 22', title: 'Earth Day', description: 'Major campus-wide cleanup and awareness drive.' },
    { date: 'May 3', title: 'International Sun Day', description: 'Promoting solar energy adoption.' },
    { date: 'May 5', title: 'World Laughter Day', description: 'Stress relief and mental wellness session.' },
    { date: 'May 22', title: 'International Biodiversity Day', description: 'Exploring local ecosystem variety.' },
    { date: 'May 31', title: 'World No-Tobacco Day', description: 'Campaign against cigarette-butt litter.' },
    { date: 'Jun 5', title: 'World Environment Day', description: 'Flagship event for global restoration.' },
    { date: 'Jun 8', title: 'World Oceans Day', description: 'Awareness on marine life and plastic pollution.' },
    { date: 'Jun 17', title: 'Desertification Day', description: 'Focus on soil health and land degradation.' },
    { date: 'Jul 1-7', title: 'Van Mahotsav', description: 'Annual tree-planting week at NIT Patna.' },
    { date: 'Jul 11', title: 'World Population Day', description: 'Resource management and sustainability.' },
    { date: 'Jul 28', title: 'Nature Conservation Day', description: 'Practicing sustainable living habits.' },
    { date: 'Jul 29', title: 'International Tiger Day', description: 'Conservation status of Indias apex predators.' },
    { date: 'Aug 20', title: 'Akshay Urja Diwas', description: 'Renewable Energy Day awareness.' },
    { date: 'Sep 7', title: 'Clean Air Day', description: 'Initiatives for reducing campus emissions.' },
    { date: 'Sep 16', title: 'World Ozone Day', description: 'Protecting the ozone layer seminar.' },
    { date: 'Sep 28', title: 'Green Consumer Day', description: 'Promoting sustainable buying choices.' },
    { date: 'Oct 2-8', title: 'Wildlife Week', description: 'Series of events dedicated to local wildlife.' },
    { date: 'Oct 4', title: 'World Animal Day', description: 'Compassion for all living beings.' },
    { date: 'Oct 10', title: 'World Mental Health Day', description: 'Mental well-being for students.' },
    { date: 'Oct 13', title: 'Disaster Reduction Day', description: 'Preparedness and environmental safety.' },
    { date: 'Oct 16', title: 'World Food Day', description: 'Zero hunger and sustainable food systems.' },
    { date: 'Nov 6', title: 'Environmental Exploitation Day', description: 'Preventing exploitation in war and conflict.' },
    { date: 'Nov 13', title: 'World Kindness Day', description: 'Fostering community and mental well-being.' },
    { date: 'Nov 21', title: 'World Fisheries Day', description: 'Focus on aquatic life sustainability.' },
    { date: 'Dec 2', title: 'Pollution Control Day', description: 'National National Pollution Control awareness.' },
    { date: 'Dec 5', title: 'World Soil Day', description: 'The foundation of life: Soil health.' },
    { date: 'Dec 11', title: 'International Mountain Day', description: 'Mountain ecosystems and protection.' },
    { date: 'Dec 14', title: 'Energy Conservation Day', description: 'Campus-wide power saving initiative.' },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: CARD_BG }}>
      <SectionTitle
        id="events"
        icon={Rss}
        title="Updates & Engagement"
        description="Stay informed about our upcoming activities and the latest club announcements."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 mt-12">

          {/* News Section (Notices stay here) */}
          <div id="news" className="p-8 rounded-xl shadow-2xl" style={{ backgroundColor: BG_DARK }}>
            <h3 className="text-3xl font-bold text-white mb-6 border-b pb-3 border-gray-800">News / Notice Board</h3>
            <div className="space-y-6">
              {notices.map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition border-l-4" style={{ borderColor: item.borderColor }}>
                  <p className="text-sm font-semibold text-gray-400 mb-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> {item.date}
                  </p>
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Section with Aesthetic Scroll & Fade */}
          <div className="p-8 rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: BG_DARK }}>
            <h3 className="text-3xl font-bold text-white mb-6 border-b pb-3 border-gray-800">Upcoming Events</h3>

            <div className="relative">
              {/* Scrollable Container */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar mask-fade">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-start p-4 rounded-lg bg-gray-900/40 border border-gray-800/50 group hover:border-green-500/50 transition-all duration-300">
                    <div className="bg-green-900/20 text-green-400 px-2 py-2 rounded-lg text-center min-w-[85px] border border-green-900/30">
                      <span className="block text-[10px] font-bold uppercase tracking-tighter opacity-70">
                        {event.date.includes('-') ? 'WEEK' : event.date.split(' ')[0]}
                      </span>
                      <span className="block text-lg font-black leading-none py-1">
                        {event.date.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white font-bold group-hover:text-green-400 transition-colors leading-tight">{event.title}</h4>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- Footer Component ---
const Footer: FC = () => (
  <footer className="border-t border-gray-900" style={{ backgroundColor: BG_DARK }}>
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Grid: Centered on mobile (text-center), left-aligned on desktop (md:text-left) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <Leaf className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">{CLUB_NAME}</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto md:mx-0">
            Driving the sustainable revolution at NIT Patna since December 2024. Protecting our planet, one campus initiative at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-sm font-black uppercase tracking-[0.2em] text-gray-300 mb-6">Navigation</h5>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            {['Home', 'Vision', 'Members', 'Events', 'Gallery', 'News'].map((link) => (
              <li key={link}>
                <a 
                  onClick={() => scrollToSection(link.toLowerCase())} 
                  className="hover:text-green-500 transition cursor-pointer"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h5 className="text-sm font-black uppercase tracking-[0.2em] text-gray-300 mb-6">Resources</h5>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li>
              <a href="https://www.nitp.ac.in" target="_blank" rel="noreferrer" className="hover:text-green-500 transition">
                NIT Patna Official Site
              </a>
            </li>
            <li>
              <a href="http://intranet.nit.ac.in" className="hover:text-green-500 transition">Student Portal</a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500 transition">Sitemap</a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h5 className="text-sm font-black uppercase tracking-[0.2em] text-gray-300 mb-6">Contact Us</h5>
          <div className="space-y-4">
            <a 
              href="mailto:environmentclub@nitp.ac.in" 
              className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-green-500 transition"
            >
              <Mail className="w-4 h-4" />
              <span>env.club@nitp.ac.in</span>
            </a>
            <div className="text-sm text-gray-500 leading-relaxed mt-4 space-y-2">
              <p className="font-bold text-gray-400 text-xs uppercase tracking-wider">Main Campus</p>
              <p>Ashok Rajpath, Patna - 800005</p>
              <p className="font-bold text-gray-400 text-xs uppercase tracking-wider pt-2">Satellite Campus</p>
              <p>Bihta, Patna - 801103</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-16 pt-8 border-t border-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-600 font-medium">
          &copy; {new Date().getFullYear()} {CLUB_NAME}. All rights reserved.
        </p>
        <p className="text-xs text-gray-600 flex items-center">
          Crafted for <span className="text-white mx-1 font-bold">NIT Patna</span> with 
          <span className="text-red-600 mx-1">❤</span>
        </p>
      </div>
    </div>
  </footer>
);

// --- Main Page Component ---
const EnvironmentalClubWebsite: FC = () => {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: BG_DARK }}>
      {/* Added a custom style block to handle CSS needed for the interactive effects */}
      <style jsx global>{`
                .animate-pulse-slow {
                    animation: pulse-slow 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.35; }
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .translate-z-20 {
                    transform: translateZ(20px);
                }
            `}</style>

      <Navbar />

      <main>
        <HeroSection />
        <GallerySection />
        <VisionSection />
        <MembersSection />
        <EventsNewsSection />

      </main>

      <Footer />
    </div>
  );
}

export default EnvironmentalClubWebsite;