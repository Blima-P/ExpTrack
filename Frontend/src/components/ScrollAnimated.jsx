import { useRef, useEffect } from 'react';

/**
 * Componente que anima automaticamente quando entra na viewport
 */
export default function ScrollAnimated({ children, animation = 'slide-up', delay = 0, className = '' }) {
  const ref = useRef(null);
  
  const animationClasses = {
    'slide-up': 'animate-slide-up',
    'slide-left': 'animate-slide-left',
    'slide-right': 'animate-slide-right',
    'scale': 'animate-scale',
    'fade': 'animate-fade',
    'float': 'animate-float',
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add('is-visible');
          // Opcional: parar de observar após animar
          // observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${animationClasses[animation] || animationClasses['slide-up']} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
