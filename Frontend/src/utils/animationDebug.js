/**
 * Utilidade para debug de animações
 */
export function enableAnimationDebug() {
  if (typeof window !== 'undefined') {
    // Mostrar no console quantos elementos têm cada classe de animação
    const animClasses = [
      'animate-slide-up',
      'animate-slide-left',
      'animate-slide-right',
      'animate-scale',
      'animate-fade',
      'animate-float',
      'hover-lift',
      'hover-glow',
      'hover-scale'
    ];

    console.log('🎨 DEBUG: Elementos com animações:');
    animClasses.forEach(cls => {
      const elements = document.querySelectorAll(`.${cls}`);
      console.log(`  .${cls}: ${elements.length} elementos`);
    });

    // Adicionar estilo temporário para visualizar animações
    const style = document.createElement('style');
    style.textContent = `
      [class*="animate-"] {
        border: 1px solid rgba(99, 102, 241, 0.2);
      }
    `;
    // document.head.appendChild(style); // Descomente para debug visual
  }
}

// Chamar automaticamente em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', enableAnimationDebug);
  }
}
