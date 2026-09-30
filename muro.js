/**
 * MURO DE MENSAJES Y DESEOS DE CUMPLEAÑOS
 * Tablero de corcho colaborativo con sincronización en Google Sheets
 */

// ========================================================
// 1. CONFIGURACIÓN DE GOOGLE SHEETS
// ========================================================
// Pega aquí la URL de tu Web App de Google Apps Script cuando la crees:
// Ejemplo: 'https://script.google.com/macros/s/AKfycb.../exec'
let GOOGLE_SCRIPT_URL = localStorage.getItem('google_script_muro_url') || '';

// Paletas de colores y fuentes disponibles
const COLORS = ['yellow', 'pink', 'green', 'blue', 'purple', 'peach', 'lilac', 'lemon'];
const PINS = ['pin-red', 'pin-blue', 'pin-yellow', 'pin-green', 'pin-purple', 'pin-orange', 'pin-gold'];
const FONTS = [
  'caveat', 'dancing', 'patrick', 'kalam', 'indie', 
  'shadows', 'gochi', 'pacifico', 'marck', 'sacramento'
];

// Mensajes de bienvenida y de amor predeterminados (para que el muro siempre tenga vida)
const DEFAULT_SAMPLE_NOTES = [
  {
    id: 'sample_1',
    author: 'Yonathan (Tu esposo que te adora) ❤️',
    message: '¡Feliz cumpleaños, amor de mi vida! Gracias por llenar cada uno de mis días de felicidad, complicidad y amor verdadero. Eres mi reina hermosa, hoy y por siempre.',
    color: 'pink',
    font: 'dancing',
    pin: 'pin-red',
    sticker: '👑',
    rotation: -1.8,
    date: 'Hoy',
    likes: 12
  },
  {
    id: 'sample_2',
    author: 'Mamá & Papá 💐',
    message: 'Hija de nuestro corazón, verte crecer y convertirte en la mujer tan maravillosa que eres es nuestro mayor orgullo. ¡Que Dios te bendiga siempre! Te amamos.',
    color: 'yellow',
    font: 'caveat',
    pin: 'pin-yellow',
    sticker: '🌻',
    rotation: 2.2,
    date: 'Hoy',
    likes: 8
  },
  {
    id: 'sample_3',
    author: 'Tus Amigos de Siempre 🎉',
    message: '¡A celebrar la vida de la más alegre del grupo! Que vengan muchísimos años más llenos de risas, viajes y momentos inolvidables. ¡Feliz cumple!',
    color: 'green',
    font: 'gochi',
    pin: 'pin-green',
    sticker: '🥂',
    rotation: -2.5,
    date: 'Hoy',
    likes: 6
  },
  {
    id: 'sample_4',
    author: 'Tu Puercoespín Tierno 🦔',
    message: '¡Piqui piqui de abrazos para la cumpleañera más linda del mundo! No pincho hoy, solo doy besitos de amor 💖',
    color: 'peach',
    font: 'patrick',
    pin: 'pin-orange',
    sticker: '🦔',
    rotation: 1.5,
    date: 'Hoy',
    likes: 15
  },
  {
    id: 'sample_5',
    author: 'Familia Baquero ✨',
    message: '¡Feliz cumpleaños querida! Que este nuevo año de vida venga cargado de salud, éxitos, paz y bendiciones infinitas en tu hogar.',
    color: 'blue',
    font: 'kalam',
    pin: 'pin-blue',
    sticker: '⭐',
    rotation: -1.2,
    date: 'Hoy',
    likes: 5
  },
  {
    id: 'sample_6',
    author: 'Tu Cómpice Favorita 🌸',
    message: '¡Feliz vuelta al sol reina hermosa! Que nunca se apague esa luz tan bonita y contagiosa que tienes. ¡A brindar y gozar tu día!',
    color: 'purple',
    font: 'indie',
    pin: 'pin-purple',
    sticker: '🎂',
    rotation: 2.8,
    date: 'Hoy',
    likes: 9
  }
];

// Estado local de notas
let notes = [];
let userLikedNotes = new Set(JSON.parse(localStorage.getItem('user_liked_notes') || '[]'));

// ========================================================
// 2. INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  initMusicPlayer();
  initFormInteractivity();
  initConfigModal();
  initSearch();
  loadNotes();
});

// ========================================================
// 3. CARGA Y SINCRONIZACIÓN DE NOTAS
// ========================================================
function loadNotes() {
  const localNotesJson = localStorage.getItem('muro_cumpleanos_notes');
  let localNotes = [];

  if (localNotesJson) {
    try {
      localNotes = JSON.parse(localNotesJson);
    } catch (e) {
      console.error('Error parseando notas locales:', e);
    }
  }

  // Si no hay notas guardadas, cargar las notas de ejemplo
  if (!localNotes || localNotes.length === 0) {
    notes = [...DEFAULT_SAMPLE_NOTES];
    saveNotesToLocalStorage();
  } else {
    notes = localNotes;
  }

  renderNotes();

  // Si hay URL de Google Sheets, sincronizar en segundo plano
  if (GOOGLE_SCRIPT_URL) {
    fetchNotesFromGoogleSheets();
  }
}

function saveNotesToLocalStorage() {
  localStorage.setItem('muro_cumpleanos_notes', JSON.stringify(notes));
}

// Obtener notas desde Google Sheets
async function fetchNotesFromGoogleSheets() {
  const syncInd = document.getElementById('syncIndicator');
  if (syncInd) syncInd.style.display = 'block';

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'GET',
      mode: 'cors'
    });

    if (response.ok) {
      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data)) {
        // Mapear filas de Google Sheets a notas
        const remoteNotes = result.data.map((row, index) => {
          return {
            id: row.id || `remote_${index}`,
            author: row.name || 'Amigo/a',
            message: row.message || '',
            color: row.color || getRandomItem(COLORS),
            font: row.font || getRandomItem(FONTS),
            pin: getRandomItem(PINS),
            sticker: row.sticker || '💖',
            rotation: getRandomRotation(),
            date: row.timestamp ? formatDate(row.timestamp) : 'Reciente',
            likes: Number(row.likes) || 0
          };
        });

        if (remoteNotes.length > 0) {
          // Fusionar notas remotas evitando duplicados
          const existingIds = new Set(remoteNotes.map(n => n.id));
          const keepLocal = notes.filter(n => !existingIds.has(n.id) && n.id.startsWith('sample_'));
          notes = [...keepLocal, ...remoteNotes];
          saveNotesToLocalStorage();
          renderNotes();
        }
      }
    }
  } catch (error) {
    console.warn('Nota: No se pudo conectar a Google Sheets en este momento (trabajando con notas locales):', error);
  } finally {
    if (syncInd) syncInd.style.display = 'none';
  }
}

// Enviar nueva nota a Google Sheets
async function sendNoteToGoogleSheets(noteData) {
  if (!GOOGLE_SCRIPT_URL) return;

  try {
    // Usar text/plain para evitar pre-flight CORS en Google Apps Script
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        id: noteData.id,
        name: noteData.author,
        message: noteData.message,
        color: noteData.color,
        font: noteData.font,
        sticker: noteData.sticker,
        likes: noteData.likes
      })
    });
  } catch (err) {
    console.warn('Error enviando a Google Sheets:', err);
  }
}

// ========================================================
// 4. RENDERIZADO DE LAS NOTAS EN EL TABLERO
// ========================================================
function renderNotes(filterQuery = '') {
  const surface = document.getElementById('corkboardSurface');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('notesCount');

  if (!surface) return;

  const filtered = notes.filter(note => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return note.author.toLowerCase().includes(q) || note.message.toLowerCase().includes(q);
  });

  if (countEl) countEl.textContent = notes.length;

  if (filtered.length === 0) {
    surface.innerHTML = '';
    if (emptyState) {
      emptyState.style.display = 'block';
      surface.appendChild(emptyState);
    }
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  surface.innerHTML = '';

  filtered.forEach(note => {
    const card = document.createElement('article');
    const colorClass = `note-${note.color || 'yellow'}`;
    const fontClass = `font-${note.font || 'caveat'}`;
    const pinClass = note.pin || getRandomItem(PINS);
    const rotation = note.rotation !== undefined ? note.rotation : getRandomRotation();
    const isLiked = userLikedNotes.has(note.id);

    card.className = `postit-note ${colorClass} ${fontClass}`;
    card.style.setProperty('--rot', `${rotation}deg`);
    card.setAttribute('data-id', note.id);

    card.innerHTML = `
      <div class="pushpin ${pinClass}"></div>
      <div class="note-sticker">${escapeHtml(note.sticker || '💖')}</div>
      <div class="note-body">"${escapeHtml(note.message)}"</div>
      <div class="note-footer">
        <span class="note-author">— ${escapeHtml(note.author)}</span>
        <div class="note-actions">
          <button type="button" class="btn-like ${isLiked ? 'liked' : ''}" data-id="${note.id}" aria-label="Me gusta">
            <span>${isLiked ? '❤️' : '🤍'}</span>
            <span class="like-count">${note.likes || 0}</span>
          </button>
        </div>
      </div>
    `;

    // Event listener para dar like
    const likeBtn = card.querySelector('.btn-like');
    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(note.id);
      });
    }

    surface.appendChild(card);
  });
}

// Dar / Quitar Like
function toggleLike(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  if (userLikedNotes.has(noteId)) {
    userLikedNotes.delete(noteId);
    note.likes = Math.max(0, (note.likes || 1) - 1);
  } else {
    userLikedNotes.add(noteId);
    note.likes = (note.likes || 0) + 1;
    triggerMiniHeartConfetti();
  }

  localStorage.setItem('user_liked_notes', JSON.stringify([...userLikedNotes]));
  saveNotesToLocalStorage();
  renderNotes(document.getElementById('searchInput')?.value || '');
}

// ========================================================
// 5. FORMULARIO INTERACTIVO Y VISTA PREVIA EN VIVO
// ========================================================
function initFormInteractivity() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const btnOpenModal = document.getElementById('btnOpenModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelNote = document.getElementById('btnCancelNote');
  const noteForm = document.getElementById('noteForm');

  const authorInput = document.getElementById('authorName');
  const messageInput = document.getElementById('messageText');
  const charCount = document.getElementById('charCount');
  const fontSelect = document.getElementById('fontSelect');
  const colorPalette = document.getElementById('colorPalette');
  const stickerSelector = document.getElementById('stickerSelector');

  // Elementos de la vista previa
  const previewNote = document.getElementById('previewNote');
  const previewBody = document.getElementById('previewBody');
  const previewAuthor = document.getElementById('previewAuthor');
  const previewSticker = document.getElementById('previewSticker');
  const previewPin = document.getElementById('previewPin');

  let selectedColor = 'yellow';
  let selectedFont = 'caveat';
  let selectedSticker = '💖';

  // Abrir / Cerrar Modal
  const openModal = () => {
    // Al abrir el modal, pre-asignar un color y fuente aleatorios para variedad natural
    selectedColor = getRandomItem(COLORS);
    selectedFont = getRandomItem(FONTS);
    selectedSticker = getRandomItem(['💖', '🎂', '🌻', '🎉', '🥂', '⭐', '💌', '👑']);

    updatePaletteActive(selectedColor);
    updateStickerActive(selectedSticker);
    if (fontSelect) fontSelect.value = selectedFont;

    updatePreview();
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    setTimeout(() => authorInput?.focus(), 250);
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  };

  if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelNote) btnCancelNote.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Actualizar vista previa
  function updatePreview() {
    if (!previewNote) return;

    // Actualizar clases de color
    COLORS.forEach(c => previewNote.classList.remove(`note-${c}`));
    previewNote.classList.add(`note-${selectedColor}`);

    // Actualizar clases de fuente
    FONTS.forEach(f => previewNote.classList.remove(`font-${f}`));
    previewNote.classList.add(`font-${selectedFont}`);

    // Actualizar textos
    const text = messageInput.value.trim();
    previewBody.textContent = text ? `"${text}"` : '"¡Feliz cumpleaños mi reina! Que todos tus sueños se hagan realidad hoy y siempre..."';

    const author = authorInput.value.trim();
    previewAuthor.textContent = author ? `— ${author}` : '— Tu nombre';

    if (previewSticker) previewSticker.textContent = selectedSticker;
    if (charCount) charCount.textContent = messageInput.value.length;
  }

  // Listeners de inputs para vista previa en vivo
  authorInput.addEventListener('input', updatePreview);
  messageInput.addEventListener('input', updatePreview);

  fontSelect.addEventListener('change', () => {
    selectedFont = fontSelect.value;
    updatePreview();
  });

  // Selector de Color
  if (colorPalette) {
    colorPalette.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;
      selectedColor = swatch.dataset.color;
      updatePaletteActive(selectedColor);
      updatePreview();
    });
  }

  function updatePaletteActive(color) {
    colorPalette.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === color);
    });
  }

  // Selector de Sticker
  if (stickerSelector) {
    stickerSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-sticker');
      if (!btn) return;
      selectedSticker = btn.dataset.sticker;
      updateStickerActive(selectedSticker);
      updatePreview();
    });
  }

  function updateStickerActive(sticker) {
    stickerSelector.querySelectorAll('.btn-sticker').forEach(b => {
      b.classList.toggle('active', b.dataset.sticker === sticker);
    });
  }

  // Enviar el formulario
  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const author = authorInput.value.trim();
    const message = messageInput.value.trim();

    if (!author) {
      alert('Por favor escribe tu nombre o apodo para que la cumpleañera sepa quién le escribe.');
      authorInput.focus();
      return;
    }

    if (!message) {
      alert('Por favor escribe un mensaje o felicitación.');
      messageInput.focus();
      return;
    }

    const newNote = {
      id: 'note_' + Date.now(),
      author: author,
      message: message,
      color: selectedColor,
      font: selectedFont,
      pin: getRandomItem(PINS),
      sticker: selectedSticker,
      rotation: getRandomRotation(),
      date: 'Reciente',
      likes: 0
    };

    // Agregar al inicio del tablero
    notes.unshift(newNote);
    saveNotesToLocalStorage();
    renderNotes();

    // Enviar en background a Google Sheets
    sendNoteToGoogleSheets(newNote);

    // Cerrar modal y limpiar
    closeModal();
    noteForm.reset();

    // Celebración visual con confeti y toast
    triggerCelebrationConfetti();
    showToast(`¡Hermoso mensaje, ${author}! Ya quedó pegado en el corcho 📌✨`);

    // Hacer scroll suave hacia la nueva nota
    const firstNote = document.querySelector('.corkboard-surface .postit-note');
    if (firstNote) {
      firstNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ========================================================
// 6. BÚSQUEDA Y FILTRADO
// ========================================================
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderNotes(e.target.value);
    });
  }
}

// ========================================================
// 7. MODAL DE CONFIGURACIÓN DE GOOGLE SHEETS
// ========================================================
function initConfigModal() {
  const configBackdrop = document.getElementById('configBackdrop');
  const btnOpenConfig = document.getElementById('btnOpenConfig');
  const btnCloseConfig = document.getElementById('btnCloseConfig');
  const btnCancelConfig = document.getElementById('btnCancelConfig');
  const btnSaveConfig = document.getElementById('btnSaveConfig');
  const scriptUrlInput = document.getElementById('scriptUrlInput');

  if (!configBackdrop) return;

  const openConfig = () => {
    if (scriptUrlInput) scriptUrlInput.value = GOOGLE_SCRIPT_URL;
    configBackdrop.classList.add('open');
    configBackdrop.setAttribute('aria-hidden', 'false');
  };

  const closeConfig = () => {
    configBackdrop.classList.remove('open');
    configBackdrop.setAttribute('aria-hidden', 'true');
  };

  if (btnOpenConfig) btnOpenConfig.addEventListener('click', openConfig);
  if (btnCloseConfig) btnCloseConfig.addEventListener('click', closeConfig);
  if (btnCancelConfig) btnCancelConfig.addEventListener('click', closeConfig);

  configBackdrop.addEventListener('click', (e) => {
    if (e.target === configBackdrop) closeConfig();
  });

  if (btnSaveConfig) {
    btnSaveConfig.addEventListener('click', () => {
      const url = scriptUrlInput.value.trim();
      GOOGLE_SCRIPT_URL = url;
      localStorage.setItem('google_script_muro_url', url);
      closeConfig();

      if (url) {
        showToast('¡Conectado con Google Sheets! Sincronizando notas...');
        fetchNotesFromGoogleSheets();
      } else {
        showToast('Modo sin conexión a Sheets activado (guardando notas localmente).');
      }
    });
  }
}

// ========================================================
// 8. REPRODUCTOR DE MÚSICA
// ========================================================
function initMusicPlayer() {
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const bgMusic = document.getElementById('bgMusic');

  if (!musicToggleBtn || !bgMusic) return;

  musicToggleBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.querySelector('.icon').textContent = '🔊';
      }).catch(err => {
        console.warn('Reproducción de audio bloqueada:', err);
      });
    } else {
      bgMusic.pause();
      musicToggleBtn.classList.remove('playing');
      musicToggleBtn.querySelector('.icon').textContent = '🎵';
    }
  });
}

// ========================================================
// 9. ANIMACIONES Y CONFETI
// ========================================================
function triggerCelebrationConfetti() {
  if (typeof confetti !== 'function') return;

  // Lluvia de confeti festivo
  confetti({
    particleCount: 75,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff4d6d', '#ffd166', '#06d6a0', '#118ab2', '#ff85a1', '#e040fb']
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff4d6d', '#ffd166', '#ffb3c6']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff4d6d', '#ffd166', '#ffb3c6']
    });
  }, 250);
}

function triggerMiniHeartConfetti() {
  if (typeof confetti !== 'function') return;
  confetti({
    particleCount: 15,
    spread: 40,
    scalar: 1.2,
    shapes: ['circle'],
    colors: ['#ff4d6d', '#ff758f', '#c9184a']
  });
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}

// ========================================================
// 10. UTILIDADES Y HELPERS
// ========================================================
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomRotation() {
  // Rotación aleatoria sutil entre -3.5° y +3.5°
  return parseFloat(((Math.random() * 7) - 3.5).toFixed(1));
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Hoy';
  return dateStr;
}
