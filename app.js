(() => {
  "use strict";
  const PUZZLES = (window.COSMIC_WORDS && window.COSMIC_WORDS.puzzles) || [];
  const WORDS = (window.COSMIC_WORDS && window.COSMIC_WORDS.allowed) || [];
  if (!PUZZLES.length) return;

  const $ = id => document.getElementById(id);
  const ROWS = 6;
  const DAY_MS = 86400000;
  // Puzzle 1 begins on 26 Oct 2026 at 00:00 UTC. All players share the same daily puzzle.
  const PUZZLE_EPOCH = Date.UTC(2026, 9, 26);
  const utcDayIndex = () => Math.max(0, Math.floor((Date.now() - PUZZLE_EPOCH) / DAY_MS));
  const puzzleFor = day => PUZZLES[((day % PUZZLES.length) + PUZZLES.length) % PUZZLES.length];
  const stateKey = day => `cosmic-word-state-v2-${day}`;
  const rank = { absent: 1, present: 2, correct: 3 };
  const answerSet = new Set(PUZZLES.map(p => p.answer.toUpperCase()));
  const allowedSet = new Set([...WORDS, ...answerSet].map(w => String(w).toUpperCase()).filter(w => /^[A-Z]{3,10}$/.test(w)));

  let day = utcDayIndex();
  let puzzle = puzzleFor(day);
  let answer = puzzle.answer.toUpperCase();
  let state = loadState();
  let toastTimer;

  function blankState() {
    return { guesses: [], statuses: [], current: "", over: false, won: false };
  }
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(stateKey(day)) || "null");
      if (saved && Array.isArray(saved.guesses) &&
          saved.guesses.every(w => typeof w === "string" && w.length === puzzle.answer.length) &&
          Array.isArray(saved.statuses)) {
        return { ...blankState(), ...saved };
      }
    } catch {}
    return blankState();
  }
  function saveState() {
    try { localStorage.setItem(stateKey(day), JSON.stringify(state)); } catch {}
  }

  function updateHeader() {
    const date = new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
    }).format(new Date()).toUpperCase();
    $("todayDate").textContent = `DAILY PUZZLE · ${date} UTC`;
    $("missionNumber").textContent = `PUZZLE ${String(day + 1).padStart(3, "0")}`;
    $("puzzleTopic").textContent = puzzle.topic;
    $("puzzleQuestion").textContent = puzzle.question;
    $("puzzleLength").textContent = `${answer.length} LETTER${answer.length === 1 ? "" : "S"}`;
    $("board").setAttribute("aria-label", `${ROWS} guesses, ${answer.length} letters each`);
    $("wordCount").textContent = String(PUZZLES.length);
  }

  function updateBoardDimensions() {
    const viewport = window.innerWidth || 360;
    const gap = viewport <= 450 ? 4 : 6;
    const available = Math.max(220, Math.min(620, viewport - 36));
    const tileSize = Math.max(20, Math.floor((available - (answer.length - 1) * gap) / answer.length));
    const width = tileSize * answer.length + (answer.length - 1) * gap;
    const board = $("board");
    board.style.width = `${width}px`;
    board.style.gridTemplateColumns = `repeat(${answer.length}, ${tileSize}px)`;
    board.style.gap = `${gap}px`;
    board.style.setProperty("--tile-font", `${Math.max(11, Math.min(26, Math.floor(tileSize * 0.48)))}px`);
  }

  function buildBoard() {
    const board = $("board");
    board.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < answer.length; c++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.setAttribute("role", "gridcell");
        tile.setAttribute("aria-label", `Row ${r + 1}, letter ${c + 1}`);
        tile.id = `tile-${r}-${c}`;
        board.appendChild(tile);
      }
    }
    updateBoardDimensions();
  }

  const keyRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  function makeKey(label, key, wide = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key" + (wide ? " wide" : "");
    button.textContent = label;
    button.dataset.key = key;
    button.setAttribute("aria-label", key === "BACK" ? "Delete letter" : key === "ENTER" ? "Submit guess" : key);
    button.addEventListener("click", () => handleKey(key));
    return button;
  }
  function buildKeyboard() {
    const keyboard = $("keyboard");
    keyboard.innerHTML = "";
    [keyRows[0], keyRows[1], keyRows[2]].forEach((letters, index) => {
      const row = document.createElement("div");
      row.className = "key-row";
      if (index === 2) row.appendChild(makeKey("ENTER", "ENTER", true));
      [...letters].forEach(letter => row.appendChild(makeKey(letter, letter)));
      if (index === 2) row.appendChild(makeKey("⌫", "BACK", true));
      keyboard.appendChild(row);
    });
  }

  function evaluate(guess) {
    const result = Array(answer.length).fill("absent");
    const remaining = answer.split("");
    for (let i = 0; i < answer.length; i++) {
      if (guess[i] === answer[i]) {
        result[i] = "correct";
        remaining[i] = null;
      }
    }
    for (let i = 0; i < answer.length; i++) {
      if (result[i] === "correct") continue;
      const found = remaining.indexOf(guess[i]);
      if (found !== -1) {
        result[i] = "present";
        remaining[found] = null;
      }
    }
    return result;
  }

  function applyKeyboardStatuses() {
    const statusesByLetter = {};
    state.guesses.forEach((word, rowIndex) => {
      const statuses = state.statuses[rowIndex] || [];
      [...word].forEach((letter, columnIndex) => {
        const status = statuses[columnIndex];
        if (status && (!statusesByLetter[letter] || rank[status] > rank[statusesByLetter[letter]])) {
          statusesByLetter[letter] = status;
        }
      });
    });
    $("keyboard").querySelectorAll(".key").forEach(key => {
      key.classList.remove("correct", "present", "absent");
      const status = statusesByLetter[key.dataset.key];
      if (status) key.classList.add(status);
    });
  }

  function render() {
    buildBoard();
    buildKeyboard();
    state.guesses.forEach((word, rowIndex) => {
      const statuses = state.statuses[rowIndex] || evaluate(word);
      [...word].forEach((letter, columnIndex) => {
        const tile = $(`tile-${rowIndex}-${columnIndex}`);
        tile.textContent = letter;
        tile.classList.add(statuses[columnIndex] || "absent", "reveal");
      });
    });
    if (!state.over && state.guesses.length < ROWS) {
      [...state.current].forEach((letter, columnIndex) => {
        const tile = $(`tile-${state.guesses.length}-${columnIndex}`);
        if (tile) {
          tile.textContent = letter;
          tile.classList.add("filled");
        }
      });
    }
    applyKeyboardStatuses();
    if (state.over) {
      $("gameHint").textContent = state.won
        ? `SOLVED IN ${state.guesses.length} ${state.guesses.length === 1 ? "GUESS" : "GUESSES"}.`
        : `NO GUESSES LEFT · ANSWER: ${answer}`;
    } else {
      $("gameHint").textContent = "TYPE A GUESS · PRESS ENTER TO SUBMIT";
    }
  }

  function showToast(message) {
    $("gameHint").textContent = message;
    $("toast").textContent = message;
    $("toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 1700);
  }

  function handleKey(key) {
    checkRollover();
    if (state.over) { showToast("TODAY'S PUZZLE IS COMPLETE."); return; }
    if (key === "BACK") {
      state.current = state.current.slice(0, -1);
      saveState();
      render();
      return;
    }
    if (key === "ENTER") { submitGuess(); return; }
    if (/^[A-Z]$/.test(key) && state.current.length < answer.length) {
      state.current += key;
      saveState();
      render();
    }
  }

  function submitGuess() {
    if (state.current.length !== answer.length) {
      showToast(`ENTER ${answer.length} LETTERS.`);
      return;
    }
    const guess = state.current;
    if (!allowedSet.has(guess)) {
      showToast("THAT WORD ISN'T IN THE GUESS LIST.");
      return;
    }
    const statuses = evaluate(guess);
    state.guesses.push(guess);
    state.statuses.push(statuses);
    state.current = "";
    if (guess === answer) {
      state.over = true;
      state.won = true;
      recordResult(true, state.guesses.length);
      showToast("CORRECT. WELL OBSERVED.");
    } else if (state.guesses.length === ROWS) {
      state.over = true;
      state.won = false;
      recordResult(false, state.guesses.length);
    }
    saveState();
    render();
    updateStats();
  }

  const emptyStats = () => ({ played: 0, wins: 0, streak: 0, bestStreak: 0, lastDay: null, distribution: Array(ROWS).fill(0) });
  function readStats() {
    try { return { ...emptyStats(), ...(JSON.parse(localStorage.getItem("cosmic-word-stats-v2") || "null") || {}) }; }
    catch { return emptyStats(); }
  }
  function recordResult(won, tries) {
    const stats = readStats();
    if (stats.lastDay === day) return;
    stats.played++;
    if (won) {
      stats.wins++;
      stats.streak = stats.lastDay === day - 1 ? stats.streak + 1 : 1;
      stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
      stats.distribution[tries - 1] = (stats.distribution[tries - 1] || 0) + 1;
    } else {
      stats.streak = 0;
    }
    stats.lastDay = day;
    try { localStorage.setItem("cosmic-word-stats-v2", JSON.stringify(stats)); } catch {}
  }
  function updateStats() {
    const stats = readStats();
    $("played").textContent = stats.played || 0;
    $("winRate").textContent = stats.played ? Math.round((stats.wins / stats.played) * 100) + "%" : "0%";
    $("streak").textContent = stats.streak || 0;
    $("bestStreak").textContent = stats.bestStreak || 0;
    const distribution = $("distribution");
    distribution.innerHTML = "";
    const max = Math.max(1, ...(stats.distribution || []));
    (stats.distribution || Array(ROWS).fill(0)).forEach((count, index) => {
      const row = document.createElement("div");
      row.className = "dist-row";
      const label = document.createElement("span");
      label.textContent = String(index + 1);
      const bar = document.createElement("div");
      bar.className = "dist-bar" + (state.won && state.guesses.length === index + 1 ? " best" : "");
      bar.style.width = Math.max(24, (count / max) * 220) + "px";
      bar.textContent = String(count);
      row.append(label, bar);
      distribution.appendChild(row);
    });
  }

  function checkRollover() {
    const nextDay = utcDayIndex();
    if (nextDay === day) return;
    day = nextDay;
    puzzle = puzzleFor(day);
    answer = puzzle.answer.toUpperCase();
    state = loadState();
    updateHeader();
    render();
    updateStats();
  }

  function updateCountdown() {
    checkRollover();
    const now = Date.now();
    const nextMidnight = Math.floor(now / DAY_MS) * DAY_MS + DAY_MS;
    let seconds = Math.max(0, Math.floor((nextMidnight - now) / 1000));
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    seconds %= 3600;
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainder = String(seconds % 60).padStart(2, "0");
    $("countdown").textContent = `${hours}:${minutes}:${remainder}`;
  }

  function openDialog(id) {
    const dialog = $(id);
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
  }
  $("helpButton").addEventListener("click", () => openDialog("helpDialog"));
  $("statsButton").addEventListener("click", () => { updateStats(); openDialog("statsDialog"); });
  $("settingsButton").addEventListener("click", () => openDialog("settingsDialog"));
  $("launchButton").addEventListener("click", () => {
    $("game").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const firstKey = $("keyboard").querySelector(".key");
      if (firstKey) firstKey.focus({ preventScroll: true });
    }, 250);
  });

  function loadSettings() {
    let settings = {};
    try { settings = JSON.parse(localStorage.getItem("cosmic-word-settings") || "{}"); } catch {}
    $("darkToggle").checked = Boolean(settings.dark);
    $("contrastToggle").checked = Boolean(settings.contrast);
    document.body.classList.toggle("dark", Boolean(settings.dark));
    document.body.classList.toggle("high-contrast", Boolean(settings.contrast));
    document.documentElement.style.colorScheme = settings.dark ? "dark" : "light";
  }
  $("saveSettings").addEventListener("click", () => {
    const settings = { dark: $("darkToggle").checked, contrast: $("contrastToggle").checked };
    document.body.classList.toggle("dark", settings.dark);
    document.body.classList.toggle("high-contrast", settings.contrast);
    document.documentElement.style.colorScheme = settings.dark ? "dark" : "light";
    try { localStorage.setItem("cosmic-word-settings", JSON.stringify(settings)); } catch {}
    $("settingsDialog").close();
  });

  document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.metaKey || event.altKey || document.querySelector("dialog[open]")) return;
    if (/^[a-zA-Z]$/.test(event.key)) handleKey(event.key.toUpperCase());
    else if (event.key === "Enter") handleKey("ENTER");
    else if (event.key === "Backspace") handleKey("BACK");
  });

  $("shareButton").addEventListener("click", async () => {
    const emoji = { correct: "🟩", present: "🟨", absent: "⬛" };
    const rows = state.guesses.map((word, i) => [...word].map((_, j) => emoji[(state.statuses[i] || [])[j]] || "⬜").join(""));
    const message = `Cosmic Word · Puzzle ${day + 1}\n${state.won ? state.guesses.length : state.over ? "X" : state.guesses.length}/6\n\n${rows.join("\n")}\n${location.origin}`;
    try {
      if (navigator.share) await navigator.share({ title: "Cosmic Word", text: message });
      else { await navigator.clipboard.writeText(message); $("shareStatus").textContent = "Results copied."; }
    } catch {
      try { await navigator.clipboard.writeText(message); $("shareStatus").textContent = "Results copied."; }
      catch { $("shareStatus").textContent = message; }
    }
  });

  document.querySelectorAll(".close-button").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  window.addEventListener("resize", updateBoardDimensions);
  window.addEventListener("focus", checkRollover);
  window.addEventListener("pageshow", checkRollover);

  updateHeader();
  loadSettings();
  render();
  updateStats();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();