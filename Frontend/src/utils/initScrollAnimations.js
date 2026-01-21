/**
 * Initialize scroll-driven animations using Intersection Observer API
 * This approach automatically animates elements as they enter the viewport
 */

export function initScrollAnimations() {
  // Configuration for Intersection Observer
  const observerConfig = {
    threshold: 0.2, // Trigger when 20% of element is visible (mais tarde)
    rootMargin: '0px 0px -20px 0px', // Menor antecipação para não disparar tão cedo
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, observerConfig);

  // Helper to observe all current elements
  const observeAll = () => {
    const animatedElements = document.querySelectorAll('[data-scroll-animation]');
    animatedElements.forEach((el) => observer.observe(el));
    console.log(`🎬 Initialized scroll animations for ${animatedElements.length} elements`);
  };

  // Observe existing elements
  observeAll();

  // MutationObserver to catch new elements added after initial load (e.g., lists)
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return; // element nodes only

        // If the added node itself has the data attribute
        if (node.hasAttribute && node.hasAttribute('data-scroll-animation')) {
          observer.observe(node);
        }

        // Also scan its children
        if (node.querySelectorAll) {
          node.querySelectorAll('[data-scroll-animation]').forEach((child) => {
            observer.observe(child);
          });
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}

/**
 * Add scroll animation to an element programmatically
 * @param {HTMLElement} element - The element to animate
 * @param {string} type - Animation type: 'default', 'slide-left', 'slide-right', 'scale', 'fade'
 * @param {number} delay - Delay in milliseconds (optional)
 */
export function addScrollAnimation(element, type = 'default', delay = 0) {
  if (!element) return;

  element.setAttribute('data-scroll-animation', type);
  
  if (delay > 0) {
    element.setAttribute('data-delay', Math.ceil(delay / 100)); // Convert to delay unit (100ms increments)
  }

  // Ensure element is observed
  if (window.scrollAnimationObserver) {
    window.scrollAnimationObserver.observe(element);
  }
}

/**
 * Clear scroll animations from an element
 * @param {HTMLElement} element - The element to clear
 */
export function clearScrollAnimation(element) {
  if (!element) return;

  element.removeAttribute('data-scroll-animation');
  element.removeAttribute('data-delay');
  element.classList.remove('in-view');

  if (window.scrollAnimationObserver) {
    window.scrollAnimationObserver.unobserve(element);
  }
}
