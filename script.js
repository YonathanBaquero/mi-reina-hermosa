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

  // Función constructora de Girasoles SVG ultra detallados y radiantes
  function renderSunflower(cx, cy, scale = 1, rotate = 0) {
    let petalsBack = '';
    let petalsFront = '';
    
    // 12 pétalos traseros en dorado intenso
    for (let a = 0; a < 360; a += 30) {
      petalsBack += `<path d="M0,-8 C-6,-18 -5,-32 0,-40 C5,-32 6,-18 0,-8 Z" fill="#e08700" transform="rotate(${a})" />`;
    }
    // 12 pétalos frontales en amarillo brillante radiante
    for (let a = 15; a < 360; a += 30) {
      petalsFront += `<path d="M0,-8 C-5,-17 -4,-30 0,-37 C4,-30 5,-17 0,-8 Z" fill="#ffd000" transform="rotate(${a})" />`;
    }

    return `
      <g transform="translate(${cx}, ${cy}) rotate(${rotate}) scale(${scale})">
        <!-- Hojas de girasol verdes -->
        <path d="M0,0 Q-30,-20 -20,-48 Q8,-30 0,0 Z" fill="#2d6a4f" />
        <path d="M0,0 Q30,-20 20,-48 Q-8,-30 0,0 Z" fill="#40916c" />
        <!-- Pétalos en 2 capas -->
        ${petalsBack}
        ${petalsFront}
        <!-- Centro oscuro de semillas de girasol -->
        <circle cx="0" cy="0" r="16" fill="#3a1d0f" />
        <circle cx="0" cy="0" r="13" fill="#4e2712" />
        <circle cx="0" cy="0" r="9" fill="none" stroke="#75421c" stroke-width="2.5" stroke-dasharray="2 3" />
        <circle cx="0" cy="0" r="4.5" fill="#241107" />
      </g>
    `;
  }

  // Guirnalda superior de girasoles colgantes
  if (topGarland) {
    topGarland.innerHTML = `
      <svg viewBox="0 0 1000 70" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,15 Q250,45 500,18 Q750,45 1000,15" fill="none" stroke="#2d6a4f" stroke-width="3.5"/>
        <!-- Girasoles a lo largo de la guirnalda -->
        ${renderSunflower(80, 26, 0.65, -15)}
        ${renderSunflower(260, 36, 0.72, 10)}
        ${renderSunflower(500, 24, 0.85, 0)}
        ${renderSunflower(740, 36, 0.72, -10)}
        ${renderSunflower(920, 26, 0.65, 15)}
      </svg>
    `;
  }

  // Enredaderas laterales de girasoles trepadores
  function createSunflowerVineSVG() {
    return `
      <svg viewBox="0 0 90 850" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,0 Q50,220 25,430 Q55,640 20,850" fill="none" stroke="#2d6a4f" stroke-width="4" stroke-linecap="round"/>
        <!-- Girasoles radiantes a lo largo del tallo -->
        ${renderSunflower(42, 110, 0.7, 15)}
        ${renderSunflower(45, 320, 0.78, -12)}
        ${renderSunflower(42, 540, 0.72, 20)}
        ${renderSunflower(46, 740, 0.78, -8)}
      </svg>
    `;
  }

  if (vineLeft) vineLeft.innerHTML = createSunflowerVineSVG();
  if (vineRight) vineRight.innerHTML = createSunflowerVineSVG();

  // Jardín inferior de girasoles en esquinas
  function createSunflowerGardenSVG() {
    return `
      <svg viewBox="0 0 160 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <!-- Tallos principales -->
        <path d="M15,220 Q40,140 70,85 Q85,45 80,10" fill="none" stroke="#2d6a4f" stroke-width="4.5" stroke-linecap="round" />
        <path d="M15,220 Q55,160 105,120 Q125,100 130,70" fill="none" stroke="#40916c" stroke-width="4" stroke-linecap="round" />
        <path d="M10,220 Q25,170 30,135" fill="none" stroke="#2d6a4f" stroke-width="3.5" stroke-linecap="round" />

        <!-- Gran Girasol Principal -->
        ${renderSunflower(80, 50, 1.05, 5)}
        
        <!-- Girasol Secundario Lateral -->
        ${renderSunflower(125, 95, 0.85, -20)}
        
        <!-- Girasol Pequeño Inferior -->
        ${renderSunflower(35, 125, 0.72, 25)}
      </svg>
    `;
  }

  if (gardenLeft) gardenLeft.innerHTML = createSunflowerGardenSVG();
  if (gardenRight) gardenRight.innerHTML = createSunflowerGardenSVG();

  // Caída continua de pétalos dorados de girasol
  function createFallingPetal() {
    const petal = document.createElement('div');
    petal.className = 'falling-petal';
    
    const sunflowerIcons = ['🌻', '💛', '🌻', '✨', '🌼', '🐝', '💖'];
    petal.textContent = sunflowerIcons[Math.floor(Math.random() * sunflowerIcons.length)];
    
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 4 + 4.5;
    const size = Math.random() * 0.95 + 0.85;
    
    petal.style.left = `${startX}px`;
    petal.style.top = `-30px`;
    petal.style.fontSize = `${size}rem`;
    petal.style.animationDuration = `${duration}s`;
    
    particlesContainer.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000);
  }

  setInterval(createFallingPetal, 650);

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
