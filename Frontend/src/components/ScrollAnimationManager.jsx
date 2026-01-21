import { useEffect } from 'react';

/**
 * Componente para gerenciar animações ao fazer scroll
 * Deve ser colocado em um componente pai (ex: App.jsx)
 */
export default function ScrollAnimationManager() {
  useEffect(() => {
    // Selecionar todos os elementos com classes de animação
    const animatedElements = document.querySelectorAll(
      '.animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-fade, .animate-float'
    );

    // Criar observer para animar quando entram na viewport
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Elemento entrou na viewport - já tem a animação aplicada
          entry.target.style.animation = entry.target.className.match(/animate-\w+/)?.[0];
        }
      });
    }, observerOptions);

    animatedElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      animatedElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return null;
}
