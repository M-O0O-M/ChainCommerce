// Mouse Effects and Animations

// Custom Cursor
export const initCustomCursor = () => {
  const cursor = document.createElement('div');
  const cursorDot = document.createElement('div');
  
  cursor.className = 'custom-cursor';
  cursorDot.className = 'custom-cursor-dot';
  
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  const animateCursor = () => {
    // Smooth follow effect
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    
    requestAnimationFrame(animateCursor);
  };
  
  animateCursor();
  
  // Add hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .product-card, .category-btn');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
};

// Mouse Trail Effect
export const initMouseTrail = () => {
  let lastTime = 0;
  const throttleDelay = 30; // milliseconds
  
  document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    
    if (currentTime - lastTime < throttleDelay) {
      return;
    }
    
    lastTime = currentTime;
    
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
      trail.remove();
    }, 800);
  });
};

// Floating Particles
export const initParticles = () => {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 20 + 's';
    
    // Random animation duration
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    // Random size
    const size = 2 + Math.random() * 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random color variation
    const colors = [
      'rgba(102, 126, 234, 0.6)',
      'rgba(139, 92, 246, 0.6)',
      'rgba(99, 102, 241, 0.6)',
      'rgba(252, 70, 107, 0.6)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
  }
};

// Parallax Effect on Mouse Move
export const initParallax = () => {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.product-card, .glass-card');
    
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      if (card.matches(':hover')) {
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-15px)
          scale(1.03)
        `;
      }
    });
  });
  
  document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('.product-card, .glass-card');
    cards.forEach(card => {
      card.style.transform = '';
    });
  });
};

// Initialize all effects
export const initAllEffects = () => {
  // Check if not mobile
  if (window.innerWidth > 768) {
    initCustomCursor();
    initMouseTrail();
    initParallax();
  }
  
  initParticles();
};

// Cleanup function
export const cleanupEffects = () => {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const particles = document.querySelector('.particles');
  const trails = document.querySelectorAll('.mouse-trail');
  
  if (cursor) cursor.remove();
  if (cursorDot) cursorDot.remove();
  if (particles) particles.remove();
  trails.forEach(trail => trail.remove());
};
