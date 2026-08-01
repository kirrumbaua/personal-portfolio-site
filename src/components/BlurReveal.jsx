import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

export function BlurReveal({ children, className, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Fire ONCE only for performance and readability
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)",
        isVisible
          ? "opacity-100 filter blur-0 translate-y-0"
          : "opacity-0 filter blur-md translate-y-6",
        className
      )}
    >
      {children}
    </div>
  );
}
