/**
 * Animações e Transições
 * Design: Minimalismo Corporativo Moderno
 * 
 * Definições de animações reutilizáveis para manter consistência
 * em todo o projeto
 */

export const animations = {
  // Fade-in suave
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },

  // Scale com fade
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },

  // Slide da direita
  slideInRight: {
    initial: { x: 384, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },

  // Slide para a direita
  slideOutRight: {
    initial: { x: 0, opacity: 1 },
    animate: { x: 384, opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },

  // Hover elevation
  hoverElevation: {
    whileHover: { y: -2 },
    transition: { duration: 0.2 },
  },

  // Clique feedback
  tapFeedback: {
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1 },
  },
};

export const transitionClasses = {
  // Transições suaves para propriedades comuns
  smooth: 'transition-all duration-200 ease-in-out',
  smoothFast: 'transition-all duration-150 ease-in-out',
  smoothSlow: 'transition-all duration-300 ease-in-out',

  // Transições específicas
  colorTransition: 'transition-colors duration-200',
  shadowTransition: 'transition-shadow duration-200',
  transformTransition: 'transition-transform duration-200',
};

export const easing = {
  // Easing functions para animações
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
  easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
};
