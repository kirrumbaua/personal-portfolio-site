import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { ExperienceCard } from './components/ExperienceCard';
import { ProjectCard } from './components/ProjectCard';
import { SkillBadge } from './components/SkillBadge';
import { BlurReveal } from './components/BlurReveal';
import { Chatbot } from './components/Chatbot';

function App() {
  const [isDark, setIsDark] = useState(false); // Default to Light Mode

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = (e) => {
    const nextDark = !isDark;

    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsDark(nextDark);
      return;
    }

    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? 0;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setIsDark(nextDark);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 540,
          easing: 'cubic-bezier(0.32, 0.08, 0.24, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0c0c0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 overflow-hidden">
      
      {/* Decorative Halftone Textures */}
      <div className="halftone halftone-wide mask-tr absolute right-0 top-0 h-[70vh] w-[65vw] opacity-[0.16] pointer-events-none -z-10" />
      <div className="halftone mask-bl absolute bottom-0 left-0 h-[60vh] w-[55vw] opacity-[0.13] pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-6 pb-20 relative z-10">
        
        {/* Scroll-Reactive Navbar */}
        <Navbar isDark={isDark} toggleDark={toggleDark} />

        {/* Hero Header */}
        <Header />

        <main className="mt-2 flex flex-col gap-2">
          
          {/* Current Focus & Work Experience */}
          <BlurReveal>
            <Section id="experience" title="experience & status" index="01">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                <ExperienceCard 
                  role="Thesis & Active Upskilling Phase"
                  company="Mapúa University / Self-Directed"
                  type="Current"
                  date="2024 – Present"
                  points={[
                    "Currently completing BS Computer Science thesis requirements at Mapúa University.",
                    "Actively upskilling in Data Analytics, Data Engineering, and modern Fullstack Web Development.",
                    "Open and looking forward to internship and entry-level positions in software engineering, data analytics, and data engineering."
                  ]}
                />
                <ExperienceCard 
                  role="Support Engineer Intern"
                  company="Dashlabs.ai"
                  type="Remote"
                  date="2024"
                  points={[
                    "Assisted our company's clients with their technical issues, ensuring the system was implemented smoothly.",
                    "Learned to create medical document templates using Nunjucks, leveraging my front-end skills in HTML, CSS, and JavaScript.",
                    "Developed a ticket creation automation script using Google Apps Script to streamline issue reporting and resolution for clients and client success employees."
                  ]}
                />
              </div>
            </Section>
          </BlurReveal>

          {/* University Projects */}
          <BlurReveal>
            <Section id="projects" title="projects" index="02">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                <ProjectCard 
                  title="IT Ticketing System"
                  date="2024"
                  tech={["Angular", "Bootstrap", "Java Spring Boot", "MySQL"]}
                  contributions="Implemented MVC architecture by connecting Angular frontend to Spring Boot backend through models and services to handle API data."
                />
                <ProjectCard 
                  title="School Records Management System"
                  date="2024"
                  tech={["MongoDB", "Express", "React", "Node.js", "Figma"]}
                  contributions="Designed the front-end UI in Figma and coded it in React for a responsive school records system."
                />
                <ProjectCard 
                  title="Do La Lash - Client Business Website"
                  date="2023"
                  tech={["TeleportHQ", "Django"]}
                  contributions="Built the front end with TeleportHQ, a low-code platform, for rapid development of a responsive client website."
                />
              </div>
            </Section>
          </BlurReveal>

          {/* Education & Activities */}
          <BlurReveal>
            <Section id="education" title="education & activities" index="03">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                <ExperienceCard 
                  role="BS in Computer Science (App Dev)"
                  company="Mapúa University"
                  type="Makati"
                  date="2021 – 2025"
                  points={[
                    "Cumulative GPA: 2.05",
                    "Relevant Coursework: Software Engineering, Application Development, Web Systems & Tech, Data Structures & Algorithms, Object-Oriented Programming"
                  ]}
                />
                <ExperienceCard 
                  role="TVL-ICT Track (Honors)"
                  company="San Lorenzo Ruiz Senior High School"
                  type="Pasig"
                  date="2021"
                />
                <ExperienceCard 
                  role="Public Relations Committee"
                  company="Information Systems Nextgen Organization"
                  type="Mapúa University"
                  date="2022 – 2023"
                  points={[
                    "Managed social media accounts to post updates and engage with followers, while assisting with event coordination."
                  ]}
                />
              </div>
            </Section>
          </BlurReveal>

          {/* Skills & Certifications */}
          <BlurReveal>
            <Section id="skills" title="stack & certifications" index="04">
              <div className="flex flex-col gap-6 pt-1">
                <div>
                  <h3 className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mb-3 uppercase tracking-wider">Technical Skills & Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Java", "HTML", "CSS", "Javascript", "Angular", "React", "Spring Boot", "MySQL", "Data Analytics", "Data Engineering"].map(skill => (
                      <SkillBadge key={skill}>{skill}</SkillBadge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mb-3 uppercase tracking-wider">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    <SkillBadge>Fluent Tagalog</SkillBadge>
                    <SkillBadge>Conversational English</SkillBadge>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mb-3 uppercase tracking-wider">Certifications</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Software Development Processes and Methodologies", issuer: "Coursera" },
                      { name: "Engineering Practices for Building Quality Software", issuer: "Coursera" },
                      { name: "Data Structures", issuer: "Coursera" }
                    ].map((cert, i) => (
                      <div key={i} className="flex items-baseline justify-between text-[13px] border-b border-dashed border-zinc-200 dark:border-zinc-800/80 pb-2">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{cert.name}</span>
                        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">{cert.issuer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </BlurReveal>

        </main>
      </div>

      {/* Floating Groq-Powered AI Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
