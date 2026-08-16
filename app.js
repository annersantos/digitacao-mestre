/* ==========================================================================
   Digitação Mestre - Motor de Lógica e Lições (JavaScript)
   ========================================================================== */

// 1. Definição das Lições em Português
const LESSONS = [
  // Lição 1: Posição Inicial (Home Row)
  "asdf jklç asdf jklç a s d f j k l ç asdf jklç f d s a ç l k j asdf jklç",
  // Lição 2: Linha Base Ampliada (adicionando E, I, G, H)
  "asdfg hjklç fgh gfd hjl lkç e i g h aeiou gha fgh jkl eigh dgi hçl eigi",
  // Lição 3: Sequência Linha Superior (QWERT / POIUY) - NOVA
  "qwert poiuy qwert poiuy qwer poiuy q w e r t p o i u y qwert poiuy",
  // Lição 4: Sequência Linha Inferior (\ZXCV / .,MNB) - NOVA
  "\\zxcv .,mnb \\zxcv .,mnb \\ z x c v . , m n b \\zxcv .,mnb",
  // Lição 5: Linha Superior (QWERTY / UIOP)
  "que ir por rei pio rio ouro pior quer pular topo pote rotulo requinte quieto",
  // Lição 6: Linha Inferior (ZXCV / BNM)
  "com ver bom voz novo clima beijo mais novo zero nexo cabo banana cinza",
  // Lição 7: Mescla de Letras e Palavras (Tudo misturado)
  "o rato roeu a roupa do rei de roma. o doce mais doce e de batata doce.",
  // Lição 8: Símbolos, Pontuação e Números
  "atenção! você prefere café ou chá? comprei 3 maçãs por R$ 5,00 e 2 bananas.",
  // Lição 9: Frases Curtas em Português
  "a digitação correta exige paciência e regularidade. mantenha as costas eretas e respire.",
  // Lição 10: Citações Famosas e Desafios
  "no meio do caminho tinha uma pedra. tinha uma pedra no meio do caminho. nunca me esquecerei."
];

// Instruções amigáveis para cada lição
const LESSON_INSTRUCTIONS = [
  "Posicione seus dedos indicadores nas teclas F (mão esquerda) e J (mão direita). As teclas têm relevos para te guiar.",
  "Agora vamos praticar esticar os dedos indicadores para G e H, e usar os dedos médios para alcançar as vogais E e I na linha superior.",
  "Pratique a sequência de dedos correta da linha superior: mova os dedos esquerdos em ordem (Q-W-E-R-T) e depois os direitos (P-O-I-U-Y).",
  "Pratique a sequência de dedos correta da linha inferior: mova os dedos esquerdos (\\-Z-X-C-V) e depois os direitos (.,-M-N-B).",
  "Explore a linha superior (QWER e UIOP). Use os mesmos dedos que usa na linha base, movendo-os ligeiramente para cima.",
  "Mova seus dedos para a linha inferior (ZXCV e BNM). Tente não olhar para as mãos físicas, confie no teclado virtual.",
  "Misturando tudo! Mantenha a postura e lembre-se de respirar. Cada caractere correto acende em verde.",
  "Hora de usar os números e símbolos básicos. O uso da tecla SHIFT com a mão oposta à tecla principal é altamente recomendado.",
  "Foque na precisão antes de buscar velocidade. A velocidade virá naturalmente com a memória muscular.",
  "Parabéns por chegar até aqui! Este é o desafio final com citações famosas. Digite com calma e ritmo."
];

// 2. Estado Global do Aplicativo
let state = {
  activeLessonIndex: 0,
  targetText: "",
  currentIndex: 0,
  errors: 0,
  correctKeystrokes: 0,
  startTime: null,
  isTyping: false,
  timerInterval: null,
  soundEnabled: true,
  theme: "dark",
  history: {
    bestPPM: 0,
    avgAccuracy: 0,
    attemptsCount: 0,
    totalAccuracySum: 0,
    completedLessons: [],
    lessonStats: {},
    certStudentName: ""
  }
};

// 3. Seleção de Elementos do DOM
const DOM = {
  lessonSelect: document.getElementById("lesson-select"),
  restartLessonBtn: document.getElementById("restart-lesson"),
  nextLessonBtn: document.getElementById("next-lesson"),
  toggleSoundBtn: document.getElementById("toggle-sound"),
  toggleThemeBtn: document.getElementById("toggle-theme"),
  textDisplay: document.getElementById("text-display"),
  keyboardGate: document.getElementById("keyboard-gate"),
  instructions: document.getElementById("instructions"),
  statPpm: document.getElementById("stat-ppm").querySelector(".stat-value"),
  statAccuracy: document.getElementById("stat-accuracy").querySelector(".stat-value"),
  statErrors: document.getElementById("stat-errors").querySelector(".stat-value"),
  statTime: document.getElementById("stat-time").querySelector(".stat-value"),
  bestPpm: document.getElementById("best-ppm"),
  avgAccuracy: document.getElementById("avg-accuracy"),
  completedCount: document.getElementById("completed-count"),
  clearHistoryBtn: document.getElementById("clear-history"),
  viewCertificateBtn: document.getElementById("view-certificate-btn"),
  virtualKeyboard: document.getElementById("virtual-keyboard"),
  typingPrompt: document.querySelector(".typing-prompt"),
  textDisplayCard: document.querySelector(".text-display-card")
};

// 4. Mapeamento de Teclas Físicas para Dedos e Elementos
// Mapeia caracteres ou nomes de teclas para o dedo e a tecla correspondente no teclado virtual
function getFingerAndKey(char) {
  const normChar = char.toLowerCase();
  
  // Tabela de mapeamento de dedos
  const fingerMap = {
    // Mão Esquerda (Mínimo)
    "q": "pinky-l", "a": "pinky-l", "z": "pinky-l", "1": "pinky-l", "'": "pinky-l", "`": "pinky-l", "tab": "pinky-l", "caps": "pinky-l", "shift": "pinky-l", "ctrl": "pinky-l",
    // Mão Esquerda (Anelar)
    "w": "ring-l", "s": "ring-l", "x": "ring-l", "2": "ring-l",
    // Mão Esquerda (Médio)
    "e": "middle-l", "d": "middle-l", "c": "middle-l", "3": "middle-l",
    // Mão Esquerda (Indicador)
    "r": "index-l", "f": "index-l", "v": "index-l", "4": "index-l", "t": "index-l", "g": "index-l", "b": "index-l", "5": "index-l",
    // Polegares
    " ": "thumb-l",
    // Mão Direita (Indicador)
    "y": "index-r", "h": "index-r", "n": "index-r", "6": "index-r", "u": "index-r", "j": "index-r", "m": "index-r", "7": "index-r",
    // Mão Direita (Médio)
    "i": "middle-r", "k": "middle-r", ",": "middle-r", "8": "middle-r",
    // Mão Direita (Anelar)
    "o": "ring-r", "l": "ring-r", ".": "ring-r", "9": "ring-r",
    // Mão Direita (Mínimo)
    "p": "pinky-r", "ç": "pinky-r", ";": "pinky-r", "0": "pinky-r", "-": "pinky-r", "=": "pinky-r", "[": "pinky-r", "]": "pinky-r", "\\": "pinky-r", "/": "pinky-r", "enter": "pinky-r", "backspace": "pinky-r"
  };

  // Determina se o caractere necessita de SHIFT (ex: maiúsculas ou caracteres especiais)
  let requiresShift = false;
  if (char !== normChar && char.match(/[A-Z]/)) {
    requiresShift = true;
  } else if ("\"!@#$%&*()_+{}?:>|<".includes(char)) {
    requiresShift = true;
  }

  // Chaves de tradução para ID de teclas virtuais
  let virtualKey = normChar;
  if (char === " ") virtualKey = " ";
  
  // Trata acentuações simples normalizando para destacar a tecla base correspondente
  const accentsMap = {
    "á": "a", "à": "a", "â": "a", "ã": "a",
    "é": "e", "ê": "e",
    "í": "i",
    "ó": "o", "ô": "o", "õ": "o",
    "ú": "u",
    "ç": "ç"
  };
  
  if (accentsMap[normChar]) {
    virtualKey = accentsMap[normChar];
  }

  return {
    finger: fingerMap[virtualKey] || null,
    key: virtualKey,
    requiresShift: requiresShift
  };
}

// 5. Sintetizador de Áudio (Web Audio API)
const SoundSynth = {
  ctx: null,
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  
  playClick() {
    if (!state.soundEnabled) return;
    this.init();
    
    // Pequeno clique mecânico (transiente rápido de frequência alta)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  },
  
  playError() {
    if (!state.soundEnabled) return;
    this.init();
    
    // Som de erro grave (buzzer leve)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc2.type = "square";
    osc2.frequency.setValueAtTime(112, this.ctx.currentTime); // Ligeiramente desafinado
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.16);
    osc2.stop(this.ctx.currentTime + 0.16);
  }
};

// 6. Lógica de Inicialização e Carregamento de Lições
function loadLesson(index) {
  state.activeLessonIndex = index;
  state.targetText = LESSONS[index];
  state.currentIndex = 0;
  state.errors = 0;
  state.correctKeystrokes = 0;
  state.isTyping = false;
  
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  
  // Atualiza Instruções
  DOM.instructions.innerHTML = LESSON_INSTRUCTIONS[index];
  
  // Renderiza Texto na Área de Exibição
  renderTextDisplay();
  
  // Reseta estatísticas mostradas na tela
  updateStatsUI(0, 100, 0, 0);
  
  // Atualiza destaques de recomendação no teclado virtual
  highlightNextKey();
  
  DOM.typingPrompt.innerText = "Clique no texto acima ou comece a digitar para iniciar.";
  DOM.keyboardGate.value = "";
  DOM.nextLessonBtn.style.display = "none";
}

function renderTextDisplay() {
  DOM.textDisplay.innerHTML = "";
  for (let i = 0; i < state.targetText.length; i++) {
    const span = document.createElement("span");
    span.classList.add("char");
    if (i === 0) span.classList.add("current");
    
    // Tratamento visual de espaços
    if (state.targetText[i] === " ") {
      span.innerHTML = "&nbsp;";
      span.classList.add("space-char");
    } else {
      span.innerText = state.targetText[i];
    }
    
    DOM.textDisplay.appendChild(span);
  }
}

// 7. Destaque Visual no Teclado e Mãos
function highlightNextKey() {
  // Remove recomendações antigas de teclas e mãos
  document.querySelectorAll(".key.next-recommend").forEach(k => k.classList.remove("next-recommend"));
  document.querySelectorAll(".hand-finger.active-finger").forEach(f => f.classList.remove("active-finger"));
  
  if (state.currentIndex >= state.targetText.length) return;
  
  const char = state.targetText[state.currentIndex];
  const { finger, key, requiresShift } = getFingerAndKey(char);
  
  // Destaque da tecla principal
  const keyElements = document.querySelectorAll(`.key[data-key="${key}"]`);
  keyElements.forEach(el => el.classList.add("next-recommend"));
  
  // Se requerer shift, destaca o Shift oposto
  if (requiresShift) {
    const shiftKeyToHighlight = (finger && finger.endsWith("-l")) ? "Shift" : "Shift"; 
    // Para simplificar, destacamos o Shift oposto se soubermos a mão do dedo principal
    const isLeftHand = finger && finger.endsWith("-l");
    const shiftSelector = isLeftHand ? ".key-shift-right" : ".key-shift-left";
    const shiftEl = document.querySelector(shiftSelector);
    if (shiftEl) shiftEl.classList.add("next-recommend");
    
    // E aciona o dedo mínimo correspondente ao shift oposto
    const shiftFingerClass = isLeftHand ? "finger-pinky-r" : "finger-pinky-l";
    const shiftFingerEl = document.querySelector(`.${shiftFingerClass}`);
    if (shiftFingerEl) shiftFingerEl.classList.add("active-finger");
  }
  
  // Destaque do dedo no SVG das mãos
  if (finger) {
    const fingerClass = `finger-${finger}`;
    const fingerEl = document.querySelector(`.${fingerClass}`);
    if (fingerEl) fingerEl.classList.add("active-finger");
  }
}

// 8. Motor de Processamento de Digitação (Keydown / Input)
function handleKeyPress(charTyped) {
  if (state.currentIndex >= state.targetText.length) return;
  
  // Inicia timer no primeiro caractere digitado
  if (!state.isTyping) {
    state.isTyping = true;
    state.startTime = Date.now();
    DOM.typingPrompt.innerText = "Praticando... Continue digitando!";
    
    state.timerInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
      calculateAndShowStats(elapsedSeconds);
    }, 1000);
  }
  
  const expectedChar = state.targetText[state.currentIndex];
  const charElements = DOM.textDisplay.querySelectorAll(".char");
  const currentCharEl = charElements[state.currentIndex];
  
  // Validação do caractere digitado
  // Nota: Acentuações e cedilha são validadas de forma flexível ou estrita
  if (charTyped === expectedChar) {
    // Acerto!
    SoundSynth.playClick();
    currentCharEl.classList.remove("current", "incorrect");
    currentCharEl.classList.add("correct");
    state.correctKeystrokes++;
    state.currentIndex++;
    
    if (state.currentIndex < state.targetText.length) {
      charElements[state.currentIndex].classList.add("current");
    } else {
      // Lição Concluída!
      finishLesson();
    }
  } else {
    // Erro!
    SoundSynth.playError();
    currentCharEl.classList.add("incorrect");
    state.errors++;
    
    // Efeito vibrar (shake) na caixa de texto
    DOM.textDisplayCard.classList.remove("shake");
    void DOM.textDisplayCard.offsetWidth; // Força reflow
    DOM.textDisplayCard.classList.add("shake");
  }
  
  // Atualiza as estatísticas instantaneamente
  const elapsedSeconds = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));
  calculateAndShowStats(elapsedSeconds);
  
  // Atualiza destaques do teclado
  highlightNextKey();
}

function calculateAndShowStats(elapsedSeconds) {
  // PPM: (Caracteres corretos / 5) / (Tempo em Minutos)
  const minutes = elapsedSeconds / 60;
  const ppm = minutes > 0 ? Math.round((state.correctKeystrokes / 5) / minutes) : 0;
  
  // Precisão: (Corretos / (Corretos + Erros)) * 100
  const totalAttempts = state.correctKeystrokes + state.errors;
  const accuracy = totalAttempts > 0 ? Math.round((state.correctKeystrokes / totalAttempts) * 100) : 100;
  
  updateStatsUI(ppm, accuracy, state.errors, elapsedSeconds);
}

function updateStatsUI(ppm, accuracy, errors, seconds) {
  DOM.statPpm.innerText = ppm;
  DOM.statAccuracy.innerText = `${accuracy}%`;
  DOM.statErrors.innerText = errors;
  DOM.statTime.innerText = `${seconds}s`;
}

function finishLesson() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  
  const elapsedSeconds = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));
  const minutes = elapsedSeconds / 60;
  const finalPPM = Math.round((state.correctKeystrokes / 5) / minutes);
  const finalAccuracy = Math.round((state.correctKeystrokes / (state.correctKeystrokes + state.errors)) * 100);
  
  // Salva estatísticas no histórico
  saveAttemptToHistory(finalPPM, finalAccuracy);
  
  DOM.typingPrompt.innerHTML = `<span class="gradient-text font-bold" style="font-size: 1.2rem; font-family: var(--font-display);">Lição Concluída com Sucesso! 🎉</span><br>Parabéns! Clique no botão <strong>Próxima Fase</strong> no topo para continuar ou repita a lição.`;
  
  // Exibe o botão de Próxima Fase
  DOM.nextLessonBtn.style.display = "flex";
  
  // Animação de comemoração nos cards de estatísticas
  document.querySelectorAll(".stat-card").forEach(card => {
    card.style.transform = "scale(1.08)";
    setTimeout(() => card.style.transform = "scale(1)", 300);
  });
}

// 9. Histórico e LocalStorage
function saveAttemptToHistory(ppm, accuracy) {
  state.history.attemptsCount++;
  state.history.totalAccuracySum += accuracy;
  
  if (ppm > state.history.bestPPM) {
    state.history.bestPPM = ppm;
  }
  
  if (!state.history.completedLessons.includes(state.activeLessonIndex)) {
    state.history.completedLessons.push(state.activeLessonIndex);
  }
  
  state.history.avgAccuracy = Math.round(state.history.totalAccuracySum / state.history.attemptsCount);
  
  // Guardar as estatísticas por lição para fins de certificado
  if (!state.history.lessonStats) {
    state.history.lessonStats = {};
  }
  
  const currentBest = state.history.lessonStats[state.activeLessonIndex];
  if (!currentBest || accuracy > currentBest.accuracy || (accuracy === currentBest.accuracy && state.errors < currentBest.errors)) {
    state.history.lessonStats[state.activeLessonIndex] = {
      accuracy: accuracy,
      errors: state.errors,
      ppm: ppm
    };
  }
  
  localStorage.setItem("typing_master_history", JSON.stringify(state.history));
  updateHistoryUI();
  checkCertificateUnlock();
}

function loadHistory() {
  const saved = localStorage.getItem("typing_master_history");
  if (saved) {
    try {
      state.history = JSON.parse(saved);
    } catch (e) {
      console.error("Falha ao ler o histórico local:", e);
    }
  }
  updateHistoryUI();
  checkCertificateUnlock();
}

function updateHistoryUI() {
  DOM.bestPpm.innerText = state.history.bestPPM;
  DOM.avgAccuracy.innerText = `${state.history.avgAccuracy}%`;
  DOM.completedCount.innerText = `${state.history.completedLessons.length}/${LESSONS.length}`;
  
  // Exibir/ocultar botão de certificado no painel
  if (hasEarnedCertificate()) {
    DOM.viewCertificateBtn.style.display = "inline-flex";
  } else {
    DOM.viewCertificateBtn.style.display = "none";
  }
}

function clearHistory() {
  if (confirm("Tem certeza que deseja zerar seu histórico de evolução?")) {
    state.history = {
      bestPPM: 0,
      avgAccuracy: 0,
      attemptsCount: 0,
      totalAccuracySum: 0,
      completedLessons: [],
      lessonStats: {},
      certStudentName: ""
    };
    localStorage.removeItem("typing_master_history");
    updateHistoryUI();
  }
}

// Funções de validação e exibição do Certificado
function hasEarnedCertificate() {
  if (!state.history.completedLessons || state.history.completedLessons.length < LESSONS.length) return false;
  if (!state.history.lessonStats) return false;
  
  let totalAccuracy = 0;
  let totalErrors = 0;
  let count = 0;
  
  for (let i = 0; i < LESSONS.length; i++) {
    const stats = state.history.lessonStats[i];
    if (stats) {
      totalAccuracy += stats.accuracy;
      totalErrors += stats.errors;
      count++;
    }
  }
  
  if (count < LESSONS.length) return false;
  
  const avgAcc = totalAccuracy / LESSONS.length;
  const avgErr = totalErrors / LESSONS.length;
  
  return avgAcc >= 85 && avgErr < 15;
}

function checkCertificateUnlock() {
  if (hasEarnedCertificate()) {
    DOM.viewCertificateBtn.style.display = "inline-flex";
    
    // Se o usuário ainda não inseriu o nome dele, abrimos o formulário para preencher e gerar
    if (!state.history.certStudentName) {
      let totalAccuracy = 0;
      let totalErrors = 0;
      for (let i = 0; i < LESSONS.length; i++) {
        totalAccuracy += state.history.lessonStats[i].accuracy;
        totalErrors += state.history.lessonStats[i].errors;
      }
      const avgAcc = totalAccuracy / LESSONS.length;
      const avgErr = totalErrors / LESSONS.length;
      openCertificateModal(avgAcc, avgErr);
    }
  } else {
    DOM.viewCertificateBtn.style.display = "none";
  }
}

function openCertificateModal(avgAcc, avgErr) {
  const maxPpm = state.history.bestPPM;
  
  // Guardar temporariamente as métricas para usar ao exibir o certificado
  state.tempCertStats = {
    accuracy: avgAcc ? Math.round(avgAcc) : state.history.avgAccuracy,
    errors: avgErr !== undefined ? Math.round(avgErr) : 0,
    ppm: maxPpm
  };
  
  const modal = document.getElementById("certificate-modal");
  const formStep = document.getElementById("cert-form-step");
  const displayStep = document.getElementById("cert-display-step");
  const nameInput = document.getElementById("cert-name-input");
  
  if (state.history.certStudentName) {
    formStep.style.display = "none";
    displayStep.style.display = "block";
    renderCertificate(state.history.certStudentName);
  } else {
    formStep.style.display = "block";
    displayStep.style.display = "none";
    nameInput.value = "";
  }
  
  modal.style.display = "flex";
}

function renderCertificate(studentName) {
  const stats = state.tempCertStats || {
    accuracy: state.history.avgAccuracy,
    errors: 0,
    ppm: state.history.bestPPM
  };
  
  if (state.history.lessonStats) {
    let totalAccuracy = 0;
    let totalErrors = 0;
    let count = 0;
    for (let key in state.history.lessonStats) {
      totalAccuracy += state.history.lessonStats[key].accuracy;
      totalErrors += state.history.lessonStats[key].errors;
      count++;
    }
    if (count > 0) {
      stats.accuracy = Math.round(totalAccuracy / count);
      stats.errors = Math.round(totalErrors / count);
    }
  }

  document.getElementById("cert-display-name").innerText = studentName;
  document.getElementById("cert-display-accuracy").innerText = `${stats.accuracy}%`;
  document.getElementById("cert-display-errors").innerText = stats.errors;
  document.getElementById("cert-display-ppm").innerText = `${stats.ppm} PPM`;
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const todayStr = new Date().toLocaleDateString('pt-BR', options);
  document.getElementById("cert-display-date").innerText = todayStr;
}

// 10. Listeners e Integração de Eventos
function setupEventListeners() {
  // Alteração de lição
  DOM.lessonSelect.addEventListener("change", (e) => {
    loadLesson(parseInt(e.target.value));
    DOM.keyboardGate.focus();
  });
  
  // Refazer lição
  DOM.restartLessonBtn.addEventListener("click", () => {
    loadLesson(state.activeLessonIndex);
    DOM.keyboardGate.focus();
  });
  
  // Avançar para a próxima fase
  DOM.nextLessonBtn.addEventListener("click", () => {
    if (state.activeLessonIndex < LESSONS.length - 1) {
      const nextIndex = state.activeLessonIndex + 1;
      DOM.lessonSelect.value = nextIndex;
      loadLesson(nextIndex);
    } else {
      alert("Você já completou a última fase! Parabéns!");
    }
    DOM.keyboardGate.focus();
  });
  
  // Controle de som
  DOM.toggleSoundBtn.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    DOM.toggleSoundBtn.querySelector(".icon").innerText = state.soundEnabled ? "🔊" : "🔇";
    DOM.toggleSoundBtn.classList.toggle("btn-active", !state.soundEnabled);
    DOM.keyboardGate.focus();
  });
  
  // Controle de tema (Dark/Light)
  DOM.toggleThemeBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.body.classList.toggle("light-theme", state.theme === "light");
    DOM.toggleThemeBtn.querySelector(".icon").innerText = state.theme === "dark" ? "🌙" : "☀️";
    DOM.keyboardGate.focus();
  });
  
  // Limpar histórico
  DOM.clearHistoryBtn.addEventListener("click", clearHistory);
  
  // Clicar na área de texto foca no input oculto para digitação
  DOM.textDisplayCard.addEventListener("click", () => {
    DOM.keyboardGate.focus();
    DOM.textDisplayCard.classList.add("focused");
  });
  
  DOM.keyboardGate.addEventListener("blur", () => {
    DOM.textDisplayCard.classList.remove("focused");
  });
  
  // Captura de digitação através do input oculto
  DOM.keyboardGate.addEventListener("input", (e) => {
    const val = e.target.value;
    if (val.length > 0) {
      const char = val[val.length - 1];
      handleKeyPress(char);
      e.target.value = ""; // Limpa para a próxima entrada
    }
  });

  // Captura especial de teclas físicas para animação do teclado virtual
  window.addEventListener("keydown", (e) => {
    // Se o usuário estiver digitando no campo do nome do certificado, não interceptar
    if (document.activeElement && document.activeElement.id === "cert-name-input") {
      return;
    }
    
    let keyName = e.key;
    
    // Tratamento de teclas especiais para mapeamento do teclado virtual
    if (keyName === " ") {
      keyName = " ";
    } else if (keyName === "Control") {
      keyName = "Control";
    } else if (keyName === "AltGraph") {
      keyName = "AltGraph";
    }
    
    // Se o usuário apertar Backspace no input
    if (keyName === "Backspace") {
      e.preventDefault(); // Impede voltar a página
      SoundSynth.playError();
      return;
    }
    
    // Ativa animação visual no teclado virtual
    let virtualKeyName = keyName.toLowerCase();
    
    // Mapeamentos para fazer a tecla correta piscar fisicamente
    const virtualKeyEl = document.querySelector(`.key[data-key="${virtualKeyName}"]`);
    if (virtualKeyEl) {
      virtualKeyEl.classList.add("active");
    }
    
    // Também ativa o Shift correspondente se apertado fisicamente
    if (e.shiftKey) {
      const shiftLeftEl = document.querySelector(".key-shift-left");
      const shiftRightEl = document.querySelector(".key-shift-right");
      // Ilumina ambos para simplificar a indicação física do pressionamento
      if (shiftLeftEl && e.code === "ShiftLeft") shiftLeftEl.classList.add("active");
      if (shiftRightEl && e.code === "ShiftRight") shiftRightEl.classList.add("active");
    }
  });
  window.addEventListener("keyup", (e) => {
    // Se o usuário estiver digitando no campo do nome do certificado, não interceptar
    if (document.activeElement && document.activeElement.id === "cert-name-input") {
      return;
    }
    
    let keyName = e.key.toLowerCase();
    
    // Desativa animação no teclado virtual
    const activeKeys = document.querySelectorAll(`.key.active`);
    activeKeys.forEach(k => {
      // Se for shift físico solto
      if (e.key === "Shift" && (k.classList.contains("key-shift-left") || k.classList.contains("key-shift-right"))) {
        k.classList.remove("active");
      } else if (k.getAttribute("data-key") === keyName) {
        k.classList.remove("active");
      }
    });
  });

  // Eventos do Certificado
  document.getElementById("generate-cert-btn").addEventListener("click", () => {
    const nameInput = document.getElementById("cert-name-input");
    const name = nameInput.value.trim();
    if (name.length < 3) {
      alert("Por favor, digite seu nome completo (mínimo de 3 caracteres).");
      return;
    }
    
    state.history.certStudentName = name;
    localStorage.setItem("typing_master_history", JSON.stringify(state.history));
    
    document.getElementById("cert-form-step").style.display = "none";
    document.getElementById("cert-display-step").style.display = "block";
    renderCertificate(name);
  });
  
  document.getElementById("print-cert-btn").addEventListener("click", () => {
    window.print();
  });
  
  const closeModal = () => {
    document.getElementById("certificate-modal").style.display = "none";
  };
  
  document.getElementById("close-modal-btn").addEventListener("click", closeModal);
  document.getElementById("close-cert-btn").addEventListener("click", closeModal);
  
  DOM.viewCertificateBtn.addEventListener("click", () => {
    openCertificateModal();
  });
}

// 11. Inicialização Principal do Sistema
window.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadHistory();
  loadLesson(0);
  
  // Foco inicial automático
  setTimeout(() => {
    DOM.keyboardGate.focus();
    DOM.textDisplayCard.classList.add("focused");
  }, 500);
});
