import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  direction = 'up',
  distance = '30px',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, [threshold]);

  const initialStyle: React.CSSProperties = {
    opacity: 0,
    transform:
      direction === 'up' ? `translateY(${distance})` :
      direction === 'down' ? `translateY(-${distance})` :
      direction === 'left' ? `translateX(${distance})` :
      direction === 'right' ? `translateX(-${distance})` :
      'none',
    transition: `opacity ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1), transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform',
  };

  const finalStyle: React.CSSProperties = {
    opacity: 1,
    transform: 'translate(0, 0)',
    transition: `opacity ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1), transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? finalStyle : initialStyle}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;