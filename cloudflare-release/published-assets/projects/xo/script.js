(() => {
  const cells = Array.from(document.querySelectorAll(".cell"));
  const boardShell = document.getElementById("board-shell");
  const fxLayer = document.getElementById("fx-layer");
  const splash = document.getElementById("splash");
  const gameOver = document.getElementById("game-over");
  const celebration = document.getElementById("celebration");
  const gameOverMsg = document.getElementById("game-over-msg");
  const modeSelect = document.getElementById("mode-select");
  const difficultySelect = document.getElementById("difficulty");
  const statusText = document.getElementById("status-text");
  const badgeX = document.getElementById("badge-x");
  const badgeO = document.getElementById("badge-o");

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const strings = {
    ar: {
      htmlDir: "rtl",
      langButton: "AR",
      themeDark: "☾",
      themeLight: "☀",
      splashKicker: "تحدي سريع",
      splashTitle: "لعبة XO 3D",
      splashSub: "لوحة ثلاثية الأبعاد، حركات قوية، وخصم ذكي جاهز للتحدي.",
      start: "ابدأ اللعب",
      login: "الدخول",
      profile: "الملف",
      modeLabel: "الوضع",
      difficultyLabel: "الصعوبة",
      pve: "ضد الذكاء",
      pvp: "لاعبان",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      restart: "إعادة",
      title: "لعبة XO 3D",
      panelKicker: "XO Arena",
      playerX: "اللاعب X",
      playerO: "اللاعب O",
      ties: "تعادل",
      turn: "دور اللاعب {player}",
      aiThinking: "الذكاء يفكر...",
      xWins: "X فاز بالجولة",
      oWins: "O فاز بالجولة",
      tie: "تعادل قوي",
      newRound: "جولة جديدة",
      guest: "ضيف",
      signIn: "دخول",
      cellEmpty: "الخانة {n}",
      cellMarked: "الخانة {n}: {player}"
    },
    en: {
      htmlDir: "ltr",
      langButton: "EN",
      themeDark: "☾",
      themeLight: "☀",
      splashKicker: "Fast Duel",
      splashTitle: "XO 3D Arena",
      splashSub: "A 3D board, sharp motion, and a smart opponent ready to play.",
      start: "Start",
      login: "Sign in",
      profile: "Profile",
      modeLabel: "Mode",
      difficultyLabel: "Difficulty",
      pve: "vs AI",
      pvp: "Two players",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      restart: "Restart",
      title: "XO 3D Arena",
      panelKicker: "XO Arena",
      playerX: "Player X",
      playerO: "Player O",
      ties: "Tie",
      turn: "Player {player}'s turn",
      aiThinking: "AI is thinking...",
      xWins: "X wins the round",
      oWins: "O wins the round",
      tie: "Strong tie",
      newRound: "New round",
      guest: "Guest",
      signIn: "Sign in",
      cellEmpty: "Cell {n}",
      cellMarked: "Cell {n}: {player}"
    }
  };

  let lang = loadPreference("ttt_lang", "ar");
  let theme = loadPreference("ttt_theme", "dark");
  let current = "X";
  let mode = "pve";
  let aiLevel = "medium";
  let locked = false;
  let scores = loadScores();
  let aiTimer = null;
  let resultTimer = null;
  const app = document.querySelector('.app-shell');
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loadScores() {
    try {
      const saved = JSON.parse(localStorage.getItem('xo_arena_scores') || '{}');
      return Object.fromEntries(['X','O','ties'].map(key => [key, Number.isSafeInteger(saved[key]) && saved[key]>=0 ? saved[key] : 0]));
    } catch { return {X:0, O:0, ties:0}; }
  }
  function cancelPending() {
    window.clearTimeout(aiTimer);
    window.clearTimeout(resultTimer);
    aiTimer = resultTimer = null;
  }

  function hideDialog(dialog) {
    if (!dialog) return;
    dialog.classList.remove("show");
    dialog.setAttribute("aria-hidden", "true");
    dialog.style.display = "none";
    if (app) app.inert = !!document.querySelector('.splash.show, .overlay.show');
  }

  function showDialog(dialog) {
    if (!dialog) return;
    dialog.style.display = "grid";
    dialog.removeAttribute("aria-hidden");
    dialog.classList.add('show');
    if (app) app.inert = true;
    dialog.querySelector('button')?.focus();
  }

  function loadPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      // Storage can be unavailable in strict browser settings.
    }
  }

  function t(key, vars = {}) {
    let value = strings[lang][key] || strings.ar[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => {
      value = value.replace(`{${name}}`, replacement);
    });
    return value;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function applyLanguage(nextLang) {
    lang = nextLang;
    const html = document.documentElement;
    html.lang = lang;
    html.dir = t("htmlDir");
    document.body.dir = t("htmlDir");

    setText("lang-toggle", t("langButton"));
    setText("splash-kicker", t("splashKicker"));
    setText("splash-title", t("splashTitle"));
    setText("splash-sub", t("splashSub"));
    setText("splash-start", t("start"));
    setText("splash-login", t("login"));
    setText("mode-label", t("modeLabel"));
    setText("difficulty-label", t("difficultyLabel"));
    setText("restart", t("restart"));
    setText("game-title", t("title"));
    setText("panel-kicker", t("panelKicker"));
    setText("label-x", t("playerX"));
    setText("label-o", t("playerO"));
    setText("label-tie", t("ties"));
    setText("overlay-restart", t("newRound"));

    updateOptionText(modeSelect, { pve: t("pve"), pvp: t("pvp") });
    updateOptionText(difficultySelect, { easy: t("easy"), medium: t("medium"), hard: t("hard") });
    updateStatus();
    renderLocalInfo();
    refreshCellLabels();
    savePreference("ttt_lang", lang);
    setText('back-home', lang==='ar'?'العودة للموقع':'Back to portfolio');
    setText('reset-scores', lang==='ar'?'تصفير النتائج':'Clear scores');
    setText('local-note', lang==='ar'?'النتائج محفوظة على هذا المتصفح.':'Scores are saved in this browser.');
    modeSelect.setAttribute('aria-label', t('modeLabel'));
    difficultySelect.setAttribute('aria-label', t('difficultyLabel'));
    document.title=t('title')+' | Huzaifa Alahmad';
  }

  function updateOptionText(select, labels) {
    if (!select) return;
    Array.from(select.options).forEach(option => {
      option.textContent = labels[option.value] || option.textContent;
    });
  }

  function applyTheme(nextTheme) {
    theme = nextTheme;
    document.body.classList.toggle("light", theme === "light");
    setText("theme-toggle", theme === "dark" ? t("themeDark") : t("themeLight"));
    savePreference("ttt_theme", theme);
  }

  function boardState() {
    return cells.map(cell => cell.dataset.marked || null);
  }

  function updateStatus(message) {
    if (message) {
      statusText.textContent = message;
    } else {
      statusText.textContent = locked && mode === "pve" && current === "O"
        ? t("aiThinking")
        : t("turn", { player: current });
    }

    badgeX.classList.toggle("active", current === "X");
    badgeO.classList.toggle("active", current === "O");
  }

  function refreshCellLabels() {
    cells.forEach((cell, index) => {
      const mark = cell.dataset.marked;
      cell.setAttribute("aria-label", mark
        ? t("cellMarked", { n: index + 1, player: mark })
        : t("cellEmpty", { n: index + 1 }));
    });
  }

  function updateScoreDisplay(changedKey) {
    savePreference('xo_arena_scores', JSON.stringify(scores));
    setText("score-x", scores.X);
    setText("score-o", scores.O);
    setText("score-tie", scores.ties);

    if (!changedKey) return;
    const id = changedKey === "ties" ? "score-tie" : `score-${changedKey.toLowerCase()}`;
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("score-pop");
      void el.offsetWidth;
      el.classList.add("score-pop");
    }
  }

  function checkGame(state = boardState()) {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (state[a] && state[a] === state[b] && state[a] === state[c]) {
        return { winner: state[a], combo };
      }
    }
    if (state.every(Boolean)) return { winner: "tie", combo: [] };
    return null;
  }

  function placeMark(index, player) {
    const cell = cells[index];
    if (!cell || cell.dataset.marked) return false;

    cell.dataset.marked = player;
    cell.disabled = true;

    const layer = cell.querySelector(".mark-layer");
    layer.innerHTML = "";
    const mark = document.createElement("span");
    mark.className = `mark mark-${player.toLowerCase()}`;
    mark.textContent = player;
    layer.appendChild(mark);

    sparkAtCell(cell, player === "X" ? "var(--x)" : "var(--o)");
    refreshCellLabels();
    return true;
  }

  function handleCellClick(event) {
    const cell = event.currentTarget;
    if (locked || cell.dataset.marked) return;
    const index = Number(cell.dataset.index);
    if (!placeMark(index, current)) return;
    finishTurn();
  }

  function finishTurn() {
    const result = checkGame();
    if (result) {
      endGame(result);
      return;
    }

    current = current === "X" ? "O" : "X";
    updateStatus();

    if (mode === "pve" && current === "O") {
      locked = true;
      cells.forEach(cell => cell.classList.add("blocked"));
      updateStatus(t("aiThinking"));
      aiTimer = window.setTimeout(() => {
        aiTimer = null;
        if (!locked || mode !== 'pve' || current !== 'O' || checkGame()) return;
        const move = chooseAiMove();
        if (move !== null) placeMark(move, "O");
        cells.forEach(cell => cell.classList.remove("blocked"));
        locked = false;
        finishTurn();
      }, 520);
    }
  }

  function endGame(result) {
    locked = true;
    cells.forEach(cell => {
      cell.disabled = true;
      cell.classList.remove("blocked");
    });

    if (result.winner === "tie") {
      scores.ties += 1;
      updateScoreDisplay("ties");
      showResult("tie", t("tie"));
      burstConfetti(["var(--amber)", "var(--blue)", "var(--o)"], 44);
      updateStatus(t("tie"));
      return;
    }

    scores[result.winner] += 1;
    updateScoreDisplay(result.winner);
    result.combo.forEach(index => cells[index].classList.add("winning"));

    const message = result.winner === "X" ? t("xWins") : t("oWins");
    showResult(result.winner, message);
    burstConfetti(result.winner === "X" ? ["var(--x)", "var(--amber)", "var(--blue)"] : ["var(--o)", "var(--amber)", "var(--blue)"], 64);
    updateStatus(message);
  }

  function showResult(kind, message) {
    celebration.innerHTML = "";
    const mark = document.createElement("div");
    mark.className = `big-mark ${kind === "tie" ? "tie" : `win-${kind.toLowerCase()}`}`;
    mark.textContent = kind === "tie" ? "=" : kind;
    celebration.appendChild(mark);
    celebration.setAttribute("aria-hidden", "false");
    gameOverMsg.textContent = message;
    resultTimer = window.setTimeout(() => { resultTimer=null; showDialog(gameOver); }, reducedMotion()?0:300);
  }

  function resetBoard() {
    cancelPending();
    hideDialog(gameOver);
    celebration.innerHTML = "";
    celebration.setAttribute("aria-hidden", "true");
    locked = false;
    current = "X";
    cells.forEach(cell => {
      cell.disabled = false;
      delete cell.dataset.marked;
      cell.classList.remove("winning", "blocked");
      const layer = cell.querySelector(".mark-layer");
      if (layer) layer.innerHTML = "";
    });
    refreshCellLabels();
    updateStatus();
  }

  function chooseAiMove() {
    if (aiLevel === "easy") return randomMove();
    if (aiLevel === "medium") return mediumMove();
    return hardMove();
  }

  function randomMove() {
    const available = availableMoves(boardState());
    return available.length ? available[Math.floor(Math.random() * available.length)] : null;
  }

  function mediumMove() {
    const state = boardState();
    return findWinningMove(state, "O")
      ?? findWinningMove(state, "X")
      ?? (state[4] ? null : 4)
      ?? randomCorner(state)
      ?? randomMove();
  }

  function hardMove() {
    const state = boardState();
    return minimax(state, "O").move;
  }

  function availableMoves(state) {
    return state.map((mark, index) => mark ? null : index).filter(index => index !== null);
  }

  function findWinningMove(state, player) {
    for (const combo of winningCombos) {
      const marks = combo.map(index => state[index]);
      const count = marks.filter(mark => mark === player).length;
      const emptyIndex = marks.findIndex(mark => !mark);
      if (count === 2 && emptyIndex !== -1) return combo[emptyIndex];
    }
    return null;
  }

  function randomCorner(state) {
    const corners = [0, 2, 6, 8].filter(index => !state[index]);
    return corners.length ? corners[Math.floor(Math.random() * corners.length)] : null;
  }

  function minimax(state, player) {
    const result = checkGame(state);
    if (result) {
      if (result.winner === "O") return { score: 10, move: null };
      if (result.winner === "X") return { score: -10, move: null };
      return { score: 0, move: null };
    }

    const moves = availableMoves(state);
    let bestMove = null;
    let bestScore = player === "O" ? -Infinity : Infinity;

    for (const move of moves) {
      state[move] = player;
      const next = minimax(state, player === "O" ? "X" : "O").score;
      state[move] = null;

      if (player === "O" && next > bestScore) {
        bestScore = next;
        bestMove = move;
      }

      if (player === "X" && next < bestScore) {
        bestScore = next;
        bestMove = move;
      }
    }

    return { score: bestScore, move: bestMove };
  }

  function sparkAtCell(cell, color) {
    if (reducedMotion()) return;
    const rect = cell.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    for (let i = 0; i < 12; i += 1) {
      const spark = document.createElement("span");
      spark.className = "spark";
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 34 + Math.random() * 30;
      spark.style.setProperty("--xpos", `${x}px`);
      spark.style.setProperty("--ypos", `${y}px`);
      spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      spark.style.setProperty("--color", color);
      fxLayer.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove(), { once: true });
    }
  }

  function burstConfetti(colors, amount) {
    if (reducedMotion()) return;
    amount = Math.min(amount, 24);
    const width = window.innerWidth;
    for (let i = 0; i < amount; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.setProperty("--xpos", `${Math.random() * width}px`);
      piece.style.setProperty("--ypos", `${-20 - Math.random() * 80}px`);
      piece.style.setProperty("--dx", `${-180 + Math.random() * 360}px`);
      piece.style.setProperty("--dy", `${window.innerHeight + 120 + Math.random() * 180}px`);
      piece.style.setProperty("--rot", `${Math.random() * 360}deg`);
      piece.style.setProperty("--dur", `${900 + Math.random() * 900}ms`);
      piece.style.setProperty("--color", colors[i % colors.length]);
      fxLayer.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove(), { once: true });
    }
  }

  function renderLocalInfo() {
    setText('user-info',lang==='ar'?'لعب محلي':'Local play');
  }

  function bindBoardTilt() {
    if (!boardShell) return;
    const stage = document.querySelector(".stage");
    if (!stage) return;

    stage.addEventListener("pointermove", event => {
      if (reducedMotion() || window.matchMedia("(max-width: 720px)").matches) return;
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      boardShell.style.setProperty("--tilt-x", `${32 - y * 8}deg`);
      boardShell.style.setProperty("--tilt-y", `${x * 7}deg`);
    });

    stage.addEventListener("pointerleave", () => {
      boardShell.style.setProperty("--tilt-x", "32deg");
      boardShell.style.setProperty("--tilt-y", "0deg");
    });
  }

  cells.forEach(cell => cell.addEventListener("click", handleCellClick));

  document.getElementById("splash-start").addEventListener("click", () => {
    hideDialog(splash);
    resetBoard();
    cells[0].focus();
  });

  document.getElementById("restart").addEventListener("click", resetBoard);
  document.getElementById("overlay-restart").addEventListener("click", () => {resetBoard(); cells[0].focus();});

  document.getElementById("lang-toggle").addEventListener("click", () => {
    applyLanguage(lang === "ar" ? "en" : "ar");
  });

  document.getElementById("theme-toggle").addEventListener("click", () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  });

  modeSelect.addEventListener("change", event => {
    mode = event.target.value;
    difficultySelect.disabled = mode !== "pve";
    resetBoard();
  });

  difficultySelect.addEventListener("change", event => {
    aiLevel = event.target.value;
    resetBoard();
  });

  applyTheme(theme === "light" ? "light" : "dark");
  applyLanguage(lang === "en" ? "en" : "ar");
  modeSelect.value = mode;
  difficultySelect.value = aiLevel;
  difficultySelect.disabled = mode !== "pve";
  updateScoreDisplay();
  refreshCellLabels();
  updateStatus();
  renderLocalInfo();
  bindBoardTilt();
  hideDialog(gameOver);
  showDialog(splash);
  document.getElementById('reset-scores').addEventListener('click',()=> {
    scores={X:0,O:0,ties:0}; updateScoreDisplay(); resetBoard();
  });
  document.addEventListener('keydown',event=> {
    const active = document.querySelector('.splash.show, .overlay.show');
    if (!active || event.key!=='Tab') return;
    const focusable=[...active.querySelectorAll('button,a[href]')];
    if (!focusable.length) return;
    const first=focusable[0], last=focusable[focusable.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  });
})();
