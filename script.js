document.addEventListener('DOMContentLoaded', () => {
  // Precarga inmediata de fotos en la memoria del navegador
  const photoCache = ['fotos/foto 1.jpg', 'fotos/foto 2.jpg', 'fotos/foto 3.jpg', 'fotos/foto 4.jpg', 'fotos/foto 5.jpg', 'fotos/foto 6.jpg'].map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  // Contenedores y etapas
  const stage1 = document.getElementById('stage1');
  const stage2 = document.getElementById('stage2');
  const stage3 = document.getElementById('stage3');

  const envelopeWrapper1 = document.getElementById('envelopeWrapper1');
  const sealBtn1 = document.getElementById('sealBtn1');
  const btnGoToStage2 = document.getElementById('btnGoToStage2');

  const envelopeWrapper2 = document.getElementById('envelopeWrapper2');
  const sealBtn2 = document.getElementById('sealBtn2');
  const btnGoToStage3 = document.getElementById('btnGoToStage3');

  const topGarland = document.getElementById('topGarland');
  const vineLeft = document.getElementById('vineLeft');
  const vineRight = document.getElementById('vineRight');
  const gardenLeft = document.getElementById('gardenLeft');
  const gardenRight = document.getElementById('gardenRight');

  const particlesContainer = document.getElementById('particles-container');
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');

  let isEnvelope1Open = false;
  let isEnvelope2Open = false;
  let continuousParticles = null;

  // ========================================================
  // 1. GENERADORES DE GIRASOLES (SUNFLOWERS)
  // ========================================================

  // ========================================================
  // 1. GENERADORES DE GIRASOLES BOTÁNICOS PROFESIONALES
  // ========================================================

  const botanicalSvgDefs = `
    <defs>
      <!-- Gradiente pétalo capa trasera (ámbar profundo y dorado) -->
      <linearGradient id="sfPetalBack" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#92400e" />
        <stop offset="35%" stop-color="#b45309" />
        <stop offset="70%" stop-color="#d97706" />
        <stop offset="100%" stop-color="#f59e0b" />
      </linearGradient>

      <!-- Gradiente pétalo capa media (dorado miel vibrante) -->
      <linearGradient id="sfPetalMid" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#b45309" />
        <stop offset="25%" stop-color="#d97706" />
        <stop offset="65%" stop-color="#f59e0b" />
        <stop offset="90%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#fef08a" />
      </linearGradient>

      <!-- Gradiente pétalo capa frontal (luz solar radiante) -->
      <linearGradient id="sfPetalFront" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#d97706" />
        <stop offset="30%" stop-color="#f59e0b" />
        <stop offset="75%" stop-color="#fde047" />
        <stop offset="100%" stop-color="#fffbeb" />
      </linearGradient>

      <!-- Centro de semillas (disco aterciopelado con profundidad multicapa) -->
      <radialGradient id="sfCenterDisk" cx="42%" cy="40%" r="58%">
        <stop offset="0%" stop-color="#140702" />
        <stop offset="30%" stop-color="#2a1106" />
        <stop offset="55%" stop-color="#451c09" />
        <stop offset="78%" stop-color="#71320c" />
        <stop offset="90%" stop-color="#a1490d" />
        <stop offset="95%" stop-color="#d97706" />
        <stop offset="100%" stop-color="#1c0903" />
      </radialGradient>

      <!-- Follaje botánico sombreado -->
      <linearGradient id="sfLeafGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0f2619" />
        <stop offset="40%" stop-color="#1b4332" />
        <stop offset="85%" stop-color="#2d6a4f" />
        <stop offset="100%" stop-color="#40916c" />
      </linearGradient>

      <linearGradient id="sfLeafGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#143622" />
        <stop offset="50%" stop-color="#2d6a4f" />
        <stop offset="100%" stop-color="#52b788" />
      </linearGradient>

      <!-- Capullos dorados jóvenes -->
      <linearGradient id="sfBudGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#1b4332" />
        <stop offset="50%" stop-color="#ca8a04" />
        <stop offset="85%" stop-color="#facc15" />
        <stop offset="100%" stop-color="#fef08a" />
      </linearGradient>

      <!-- Sombra suave realista -->
      <filter id="sfSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="3" flood-color="#231006" flood-opacity="0.18" />
      </filter>
    </defs>
  `;

  // Constructor de Girasol Botánico Profesional
  function renderSunflower(cx, cy, scale = 1, rotate = 0, hasLeaves = true) {
    let petalsBack = '';
    let petalsMid = '';
    let petalsFront = '';
    let floretRing = '';

    // 14 pétalos traseros con curvas suaves
    for (let a = 0; a < 360; a += (360 / 14)) {
      petalsBack += `<path d="M0,-6 C-7,-16 -7.5,-33 0,-44 C7.5,-33 7,-16 0,-6 Z" fill="url(#sfPetalBack)" transform="rotate(${a.toFixed(1)})" />`;
    }

    // 14 pétalos medios entrelazados con arista de brillo
    for (let a = 12.8; a < 360; a += (360 / 14)) {
      petalsMid += `
        <g transform="rotate(${a.toFixed(1)})">
          <path d="M0,-5 C-6,-15 -6.5,-29 0,-39 C6.5,-29 6,-15 0,-5 Z" fill="url(#sfPetalMid)" />
          <path d="M0,-7 L0,-32" stroke="#fef08a" stroke-width="0.8" opacity="0.45" />
        </g>`;
    }

    // 12 pétalos frontales radiantes
    for (let a = 6; a < 360; a += (360 / 12)) {
      petalsFront += `<path d="M0,-4 C-4.8,-12 -5,-24 0,-34 C5,-24 4.8,-12 0,-4 Z" fill="url(#sfPetalFront)" transform="rotate(${a.toFixed(1)})" />`;
    }

    // Corona de pequeñas florecillas doradas alrededor del disco central
    for (let a = 0; a < 360; a += 15) {
      const rad = (a * Math.PI) / 180;
      const x = Math.cos(rad) * 14.5;
      const y = Math.sin(rad) * 14.5;
      floretRing += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.1" fill="#fde047" opacity="0.9" />`;
    }

    // Hojas botánicas elegantes con venas realistas
    const leaves = hasLeaves ? `
      <!-- Hoja izquierda -->
      <g transform="rotate(-38) translate(0, -6)">
        <path d="M0,0 C-22,-12 -38,-34 -24,-58 C-8,-44 4,-24 0,0 Z" fill="url(#sfLeafGrad1)" />
        <path d="M0,0 C-12,-20 -20,-38 -24,-58" stroke="#74c69d" stroke-width="1.2" fill="none" opacity="0.5" />
        <path d="M-8,-16 C-15,-18 -20,-24 -24,-24" stroke="#74c69d" stroke-width="0.8" fill="none" opacity="0.4" />
        <path d="M-14,-30 C-22,-32 -26,-38 -28,-40" stroke="#74c69d" stroke-width="0.8" fill="none" opacity="0.4" />
      </g>
      <!-- Hoja derecha -->
      <g transform="rotate(38) translate(0, -6)">
        <path d="M0,0 C22,-12 38,-34 24,-58 C8,-44 -4,-24 0,0 Z" fill="url(#sfLeafGrad2)" />
        <path d="M0,0 C12,-20 20,-38 24,-58" stroke="#52b788" stroke-width="1.2" fill="none" opacity="0.5" />
        <path d="M8,-16 C15,-18 20,-24 24,-24" stroke="#52b788" stroke-width="0.8" fill="none" opacity="0.4" />
        <path d="M14,-30 C22,-32 26,-38 28,-40" stroke="#52b788" stroke-width="0.8" fill="none" opacity="0.4" />
      </g>
    ` : '';

    return `
      <g transform="translate(${cx}, ${cy}) rotate(${rotate}) scale(${scale})" filter="url(#sfSoftShadow)">
        ${leaves}
        <!-- Capas de pétalos botánicos -->
        ${petalsBack}
        ${petalsMid}
        ${petalsFront}
        <!-- Centro aterciopelado del girasol -->
        <circle cx="0" cy="0" r="16" fill="url(#sfCenterDisk)" />
        <!-- Textura de semillas en anillos concéntricos -->
        <circle cx="0" cy="0" r="12" fill="none" stroke="#92400e" stroke-width="2" stroke-dasharray="2 3" opacity="0.75" />
        <circle cx="0" cy="0" r="8" fill="none" stroke="#b45309" stroke-width="1.5" stroke-dasharray="1.5 2.5" opacity="0.7" />
        <circle cx="0" cy="0" r="4.5" fill="#140702" />
        <!-- Corona perimetral de florecillas doradas -->
        ${floretRing}
      </g>
    `;
  }

  // Guirnalda superior de girasoles (armónica, elegante y no distorsionada)
  if (topGarland) {
    topGarland.innerHTML = `
      <svg viewBox="0 0 1000 85" width="100%" height="100%" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg">
        ${botanicalSvgDefs}
        <!-- Guirnalda de ramas arqueadas y hojas de eucalipto -->
        <path d="M0,15 Q250,42 500,20 Q750,42 1000,15" fill="none" stroke="#1b4332" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M50,18 Q300,50 500,22 Q700,50 950,18" fill="none" stroke="#40916c" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>

        <!-- Hojitas decorativas -->
        <ellipse cx="180" cy="30" rx="10" ry="5" fill="#52b788" transform="rotate(-15 180 30)" opacity="0.75" />
        <ellipse cx="370" cy="32" rx="12" ry="5" fill="#52b788" transform="rotate(18 370 32)" opacity="0.75" />
        <ellipse cx="630" cy="32" rx="12" ry="5" fill="#52b788" transform="rotate(-18 630 32)" opacity="0.75" />
        <ellipse cx="820" cy="30" rx="10" ry="5" fill="#52b788" transform="rotate(15 820 30)" opacity="0.75" />

        <!-- Pequeños capullos dorados -->
        <circle cx="160" cy="28" r="5" fill="url(#sfBudGrad)" />
        <circle cx="390" cy="33" r="6" fill="url(#sfBudGrad)" />
        <circle cx="610" cy="33" r="6" fill="url(#sfBudGrad)" />
        <circle cx="840" cy="28" r="5" fill="url(#sfBudGrad)" />

        <!-- Girasoles botánicos proporcionados -->
        ${renderSunflower(90, 26, 0.58, -12, true)}
        ${renderSunflower(270, 36, 0.72, 8, true)}
        ${renderSunflower(500, 26, 0.88, 0, true)}
        ${renderSunflower(730, 36, 0.72, -8, true)}
        ${renderSunflower(910, 26, 0.58, 12, true)}
      </svg>
    `;
  }

  // Enredaderas laterales delicadas y orgánicas (no deformadas)
  function createSunflowerVineSVG() {
    return `
      <svg viewBox="0 0 80 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        ${botanicalSvgDefs}
        <!-- Tallo trepador orgánico -->
        <path d="M22,0 Q50,200 25,400 Q48,600 22,800" fill="none" stroke="#1b4332" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M22,0 Q10,200 25,400 Q12,600 22,800" fill="none" stroke="#40916c" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>

        <!-- Zarcillos botánicos delicados -->
        <path d="M26,120 Q44,130 40,144 Q35,154 26,150" fill="none" stroke="#52b788" stroke-width="1.5" />
        <path d="M25,360 Q44,370 42,384 Q35,394 24,390" fill="none" stroke="#52b788" stroke-width="1.5" />
        <path d="M26,580 Q44,590 40,604 Q35,614 25,610" fill="none" stroke="#52b788" stroke-width="1.5" />

        <!-- Girasoles botánicos en puntos clave -->
        ${renderSunflower(42, 95, 0.65, 14, true)}
        <circle cx="28" cy="220" r="7" fill="url(#sfBudGrad)" />
        ${renderSunflower(45, 305, 0.74, -10, true)}
        <circle cx="26" cy="440" r="7" fill="url(#sfBudGrad)" />
        ${renderSunflower(40, 520, 0.68, 16, true)}
        ${renderSunflower(44, 715, 0.72, -8, true)}
      </svg>
    `;
  }

  if (vineLeft) vineLeft.innerHTML = createSunflowerVineSVG();
  if (vineRight) vineRight.innerHTML = createSunflowerVineSVG();

  // Jardín inferior de girasoles en esquinas (ramillete exuberante y romántico)
  function createSunflowerGardenSVG() {
    return `
      <svg viewBox="0 0 170 210" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        ${botanicalSvgDefs}
        <!-- Tallos principales que emergen de la esquina -->
        <path d="M15,210 Q45,140 75,85 Q88,50 82,15" fill="none" stroke="#1b4332" stroke-width="4.2" stroke-linecap="round" />
        <path d="M15,210 Q60,155 110,120 Q130,100 135,70" fill="none" stroke="#2d6a4f" stroke-width="3.6" stroke-linecap="round" />
        <path d="M10,210 Q28,165 35,135" fill="none" stroke="#40916c" stroke-width="3" stroke-linecap="round" />

        <!-- Capullo lateral con sépalos -->
        <g transform="translate(140, 60) rotate(-25)">
          <path d="M0,0 C-10,-12 -12,-26 0,-34 C12,-26 10,-12 0,0 Z" fill="url(#sfBudGrad)" />
          <path d="M-6,-2 C-14,-10 -10,-22 -4,-28" stroke="#1b4332" stroke-width="1.8" fill="none" />
          <path d="M6,-2 C14,-10 10,-22 4,-28" stroke="#1b4332" stroke-width="1.8" fill="none" />
        </g>

        <!-- Hojas de fondo frondosas -->
        <path d="M30,170 C0,135 15,95 45,115 C35,145 32,165 30,170 Z" fill="url(#sfLeafGrad1)" />
        <path d="M50,150 C85,120 115,135 105,160 C75,165 55,155 50,150 Z" fill="url(#sfLeafGrad2)" />

        <!-- Girasol Secundario Lateral -->
        ${renderSunflower(125, 95, 0.78, -22, true)}

        <!-- Girasol Pequeño Inferior -->
        ${renderSunflower(36, 125, 0.68, 22, true)}

        <!-- Gran Girasol Principal Radiante -->
        ${renderSunflower(82, 52, 0.98, 4, true)}
      </svg>
    `;
  }

  if (gardenLeft) gardenLeft.innerHTML = createSunflowerGardenSVG();
  if (gardenRight) gardenRight.innerHTML = createSunflowerGardenSVG();

  // Caída continua de pétalos dorados de girasol y destellos sutiles
  function createFallingPetal() {
    const petal = document.createElement('div');
    petal.className = 'falling-petal';

    const isSparkle = Math.random() < 0.28;
    if (isSparkle) {
      petal.innerHTML = `<span style="font-size: ${(Math.random() * 0.6 + 0.7).toFixed(2)}rem; filter: drop-shadow(0 0 5px rgba(245,158,11,0.8));">✨</span>`;
    } else {
      const petalW = Math.floor(Math.random() * 8 + 14); // 14px a 22px
      const petalH = Math.floor(petalW * 1.6);
      const rot = Math.floor(Math.random() * 360);
      petal.innerHTML = `
        <svg width="${petalW}" height="${petalH}" viewBox="0 0 18 30" style="transform: rotate(${rot}deg); filter: drop-shadow(0 2px 4px rgba(180,83,9,0.35));">
          <defs>
            <linearGradient id="pGrad_${Date.now()}_${Math.floor(Math.random()*1000)}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
          </defs>
          <path d="M9,0 C15,8 18,18 9,30 C0,18 3,8 9,0 Z" fill="url(#sfPetalMid)" />
          <path d="M9,4 L9,24" stroke="#fffbeb" stroke-width="0.75" opacity="0.55" />
        </svg>
      `;
    }

    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 3.5 + 5;

    petal.style.left = `${startX}px`;
    petal.style.top = `-35px`;
    petal.style.animationDuration = `${duration}s`;

    particlesContainer.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000);
  }

  setInterval(createFallingPetal, 700);

  // ========================================================
  // 2. SISTEMA DE PARTÍCULAS INTERACTIVAS (CON GIRASOLES)
  // ========================================================
  const particleTypes = ['🌻', '💖', '✨', '💛', '🌻', '💐', '🎂', '💌'];

  function createSingleParticle(customX = null, customY = null) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    
    const startX = customX !== null ? (customX + (Math.random() * 60 - 30)) : (Math.random() * window.innerWidth);
    const startY = customY !== null ? customY : (window.innerHeight + 20);
    const size = Math.random() * 1.3 + 1.1;
    const duration = Math.random() * 3 + 3.5;
    
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.fontSize = `${size}rem`;
    particle.style.animationDuration = `${duration}s`;
    
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
  }

  function burstParticles(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight * 0.65 + (Math.random() * 160 - 80);
        createSingleParticle(startX, startY);
      }, i * 50);
    }
  }

  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#musicBtn') || e.target.closest('button')) return;
    if (isEnvelope1Open || isEnvelope2Open) {
      for (let i = 0; i < 3; i++) {
        createSingleParticle(e.clientX, e.clientY);
      }
    }
  });

  // ========================================================
  // 3. ACTO 1: APERTURA Y CIERRE DEL PRIMER SOBRE
  // ========================================================
  function openEnvelope1() {
    if (isEnvelope1Open) return;
    isEnvelope1Open = true;

    envelopeWrapper1.classList.add('open');
    if (gardenLeft) gardenLeft.classList.add('bloomed');
    if (gardenRight) gardenRight.classList.add('bloomed');

    burstParticles(40);

    // Reproducir 'Caminar de tu mano' al abrir el sobre
    playSong();
  }

  sealBtn1.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope1();
  });

  envelopeWrapper1.addEventListener('click', (e) => {
    if (!isEnvelope1Open) openEnvelope1();
  });

  // Transición del Acto 1 al Acto 2 (Cierre del Sobre 1 y aparición del Sobre 2)
  btnGoToStage2.addEventListener('click', (e) => {
    e.stopPropagation();

    // 1. Cerrar sobre 1 con animación elegante
    envelopeWrapper1.classList.remove('open');
    envelopeWrapper1.classList.add('closing');

    // 2. Transición suave al Acto 2
    setTimeout(() => {
      stage1.classList.add('stage-fading-out');

      setTimeout(() => {
        stage1.classList.remove('stage-active', 'stage-fading-out');
        stage1.style.display = 'none';

        stage2.style.display = 'flex';
        setTimeout(() => {
          stage2.classList.add('stage-active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          burstParticles(35);
        }, 50);
      }, 600);
    }, 850);
  });

  // ========================================================
  // 4. ACTO 2: APERTURA Y CIERRE DEL SEGUNDO SOBRE
  // ========================================================
  function openEnvelope2() {
    if (isEnvelope2Open) return;
    isEnvelope2Open = true;

    envelopeWrapper2.classList.add('open');
    burstParticles(40);
  }

  sealBtn2.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope2();
  });

  envelopeWrapper2.addEventListener('click', () => {
    if (!isEnvelope2Open) openEnvelope2();
  });

  // Transición del Acto 2 al Acto 3 (Cierre del Sobre 2 y aparición del Pastel Final)
  btnGoToStage3.addEventListener('click', (e) => {
    e.stopPropagation();

    // 1. Cerrar sobre 2
    envelopeWrapper2.classList.remove('open');
    envelopeWrapper2.classList.add('closing');

    // 2. Transición al Acto 3 (El Pastel)
    setTimeout(() => {
      stage2.classList.add('stage-fading-out');

      setTimeout(() => {
        stage2.classList.remove('stage-active', 'stage-fading-out');
        stage2.style.display = 'none';

        stage3.style.display = 'flex';
        setTimeout(() => {
          stage3.classList.add('stage-active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          burstParticles(60);
        }, 50);
      }, 600);
    }, 850);
  });

  // ========================================================
  // 5. ACTO 3: EL PASTEL FINAL Y VELITAS
  // ========================================================
  const birthdayCake = document.getElementById('birthdayCake');
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const cakeCandles = document.getElementById('cakeCandles');
  const cakeHint = document.getElementById('cakeHint');
  let candlesBlown = false;

  function blowOutCandles(e) {
    if (e) e.stopPropagation();
    if (candlesBlown) return;
    candlesBlown = true;

    if (cakeCandles) cakeCandles.classList.add('blown');
    if (blowCandlesBtn) {
      blowCandlesBtn.classList.add('blown');
      blowCandlesBtn.innerHTML = '<span>✨ ¡Deseo pedido con amor! ❤️</span>';
    }

    // Ocultar llamas 100%
    document.querySelectorAll('.flame, .flame-halo').forEach(el => {
      el.style.display = 'none';
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
    });

    if (cakeHint) {
      cakeHint.innerHTML = '✨ ¡FELIZ CUMPLEAÑOS, MI REINA HERMOSA! ✨<br>¡Que todos tus anhelos se hagan realidad! 🎂🎉💖<br><span style="display:inline-block; margin-top:8px; font-family:var(--font-hand); font-size:1.35rem; color:#d6336c; font-weight:700;">Con amor, tu ingeniero ❤️</span>';
      cakeHint.style.color = '#c9184a';
      cakeHint.style.fontWeight = '700';
      cakeHint.style.fontSize = '1.05rem';
    }

    // Mega fiesta de fuegos artificiales, flores y confeti
    burstParticles(70);
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight * 0.65;
        createSingleParticle(startX, startY);
      }, i * 90);
    }
  }

  if (birthdayCake) {
    birthdayCake.addEventListener('click', blowOutCandles);
    birthdayCake.addEventListener('touchend', blowOutCandles);
  }

  if (blowCandlesBtn) {
    blowCandlesBtn.addEventListener('click', blowOutCandles);
    blowCandlesBtn.addEventListener('touchend', blowOutCandles);
  }

  // Botón para revivir toda la experiencia
  const btnReplay = document.getElementById('btnReplay');
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // ========================================================
  // 6. INTERACCIONES ADICIONALES (GIRAR POLAROIDS, PUERCOESPÍN, RAZONES)
  // ========================================================

  // Giro de fotos Polaroid 3D
  document.querySelectorAll('.polaroid-flip-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('flipped');
      const rect = card.getBoundingClientRect();
      createSingleParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  // Puercoespín
  const hedgehog = document.getElementById('hedgehog');
  if (hedgehog) {
    hedgehog.addEventListener('click', (e) => {
      e.stopPropagation();
      hedgehog.classList.add('bounce', 'show-bubble');
      const rect = hedgehog.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          createSingleParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }, i * 80);
      }
      setTimeout(() => hedgehog.classList.remove('bounce'), 600);
      setTimeout(() => hedgehog.classList.remove('show-bubble'), 2400);
    });
  }

  // ========================================================
  // 6. 10 RAZONES POR LAS QUE TE AMO
  // ========================================================
  const loveReasons = [
    "Por tu hermosa sonrisa que ilumina hasta el día más gris y llena mi corazón de una paz infinita.",
    "Por ser mi cómplice y compañera incondicional en cada sueño, meta y locura que emprendemos.",
    "Por la calidez de tus abrazos, el único lugar del mundo donde sé que pertenezco y encuentro mi verdadero hogar.",
    "Por tu sentido del humor y por hacerme reír y sonreír como nadie más en este planeta.",
    "Por tu enorme bondad, tu dulzura y esa luz tan pura con la que alegras la vida de todos a tu alrededor.",
    "Por ser la mujer más fuerte, inteligente, perseverante y admirable que tengo el honor de amar.",
    "Por creer siempre en mí, impulsarme a ser mejor cada día y celebrar cada uno de mis logros como propios.",
    "Por cada viaje, cada mirada cómplice y cada pequeño instante cotidiano que a tu lado se convierte en magia.",
    "Por elegirme todos los días como tu compañero de vida y amarme de una manera tan bonita y sincera.",
    "Por ser simplemente tú: el amor de mi vida, mi reina hermosa y la mayor bendición de mi existir."
  ];

  let currentReasonIndex = 0;
  const reasonDisplay = document.getElementById('reasonDisplay');
  const reasonBadge = document.getElementById('reasonBadge');
  const newReasonBtn = document.getElementById('newReasonBtn');
  const nextBtnText = document.getElementById('nextBtnText');
  const prevReasonBtn = document.getElementById('prevReasonBtn');
  const nextReasonBtn = document.getElementById('nextReasonBtn');
  const reasonsDots = document.getElementById('reasonsDots');
  const btnToggleAllReasons = document.getElementById('btnToggleAllReasons');
  const reasonsFullList = document.getElementById('reasonsFullList');

  // Inicializar puntos indicadores (10 dots)
  if (reasonsDots) {
    reasonsDots.innerHTML = '';
    loveReasons.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = `reason-dot ${idx === 0 ? 'active' : ''}`;
      dot.title = `Razón #${idx + 1}`;
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToReason(idx);
      });
      reasonsDots.appendChild(dot);
    });
  }

  // Llenar lista completa de las 10 razones
  if (reasonsFullList) {
    reasonsFullList.innerHTML = loveReasons
      .map((r, i) => `<li><strong>#${i + 1}:</strong> "${r}"</li>`)
      .join('');
  }

  function updateReasonUI() {
    if (!reasonDisplay) return;
    reasonDisplay.classList.add('fade');

    setTimeout(() => {
      reasonDisplay.textContent = `"${loveReasons[currentReasonIndex]}"`;
      reasonDisplay.classList.remove('fade');

      if (reasonBadge) {
        reasonBadge.textContent = `💖 Razón ${currentReasonIndex + 1} de ${loveReasons.length} 💖`;
      }

      if (nextBtnText) {
        if (currentReasonIndex < loveReasons.length - 1) {
          nextBtnText.textContent = `✨ Siguiente razón (${currentReasonIndex + 2} de 10) ✨`;
        } else {
          nextBtnText.textContent = `✨ Volver a leer desde la #1 ✨`;
        }
      }

      // Actualizar dots activos
      if (reasonsDots) {
        const dots = reasonsDots.querySelectorAll('.reason-dot');
        dots.forEach((d, idx) => {
          d.classList.toggle('active', idx === currentReasonIndex);
        });
      }
    }, 200);
  }

  function goToReason(index) {
    currentReasonIndex = (index + loveReasons.length) % loveReasons.length;
    updateReasonUI();
  }

  if (newReasonBtn) {
    newReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToReason(currentReasonIndex + 1);
      const rect = newReasonBtn.getBoundingClientRect();
      createSingleParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  if (nextReasonBtn) {
    nextReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToReason(currentReasonIndex + 1);
      const rect = nextReasonBtn.getBoundingClientRect();
      createSingleParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  if (prevReasonBtn) {
    prevReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToReason(currentReasonIndex - 1);
      const rect = prevReasonBtn.getBoundingClientRect();
      createSingleParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  if (btnToggleAllReasons && reasonsFullList) {
    btnToggleAllReasons.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = reasonsFullList.style.display === 'none';
      reasonsFullList.style.display = isHidden ? 'block' : 'none';
      const label = btnToggleAllReasons.querySelector('span');
      if (label) {
        label.textContent = isHidden
          ? '🙈 Ocultar lista de 10 razones'
          : '📜 Ver las 10 razones juntas';
      }
    });
  }

  // ========================================================
  // 7. REPRODUCTOR DE LA CANCIÓN "CAMINAR DE TU MANO"
  // ========================================================
  let isPlayingSong = false;
  let userExplicitlyPaused = false;

  if (bgMusic) {
    bgMusic.volume = 1.0;
    bgMusic.muted = false;

    bgMusic.addEventListener('play', () => {
      isPlayingSong = true;
      if (musicBtn) {
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '<span class="icon">🔊</span>';
      }
    });

    bgMusic.addEventListener('pause', () => {
      isPlayingSong = false;
      if (musicBtn) {
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<span class="icon">🔇</span>';
      }
    });

    bgMusic.addEventListener('ended', () => {
      bgMusic.currentTime = 0;
      bgMusic.play().catch(() => {});
    });
  }

  function playSong() {
    if (!bgMusic) return;
    userExplicitlyPaused = false;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlayingSong = true;
        if (musicBtn) {
          musicBtn.classList.add('playing');
          musicBtn.innerHTML = '<span class="icon">🔊</span>';
        }
      }).catch((err) => {
        console.warn('Reproducción en espera de interacción táctil:', err);
      });
    }
  }

  function pauseSong() {
    if (!bgMusic) return;
    userExplicitlyPaused = true;
    bgMusic.pause();
    isPlayingSong = false;
    if (musicBtn) {
      musicBtn.classList.remove('playing');
      musicBtn.innerHTML = '<span class="icon">🔇</span>';
    }
  }

  function toggleSong() {
    if (bgMusic) {
      if (bgMusic.paused) {
        playSong();
      } else {
        pauseSong();
      }
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSong();
    });
  }

  // Desbloqueo universal en el primer toque de la pantalla (iOS / Android / Desktop)
  const unlockAudioOnTouch = () => {
    if (bgMusic && bgMusic.paused && !userExplicitlyPaused && isEnvelope1Open) {
      playSong();
    }
  };
  window.addEventListener('pointerdown', unlockAudioOnTouch, { passive: true });
  window.addEventListener('touchstart', unlockAudioOnTouch, { passive: true });
});
