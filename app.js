(() => {
  "use strict";
  const WORDS = window.COSMIC_WORDS || { answers: ["LUNAR","SOLAR","COMET"], allowed: [] };
  const answerSet = new Set(WORDS.answers.map(w => w.toUpperCase()).filter(w => /^[A-Z]{5}$/.test(w)));
  const allowedSet = new Set([...(WORDS.allowed || []), ...answerSet].map(w => w.toUpperCase()).filter(w => /^[A-Z]{5}$/.test(w)));
  const $ = id => document.getElementById(id);
  const ROWS = 6, COLS = 5;
  const EPOCH = Date.UTC(2026, 0, 1);
  const dayIndex = () => Math.floor((Date.now() - EPOCH) / 86400000);
  const dateKey = () => new Date().toISOString().slice(0,10);
  const answerFor = (day) => WORDS.answers[((day % WORDS.answers.length) + WORDS.answers.length) % WORDS.answers.length].toUpperCase();
  const keyFor = day => `cosmic-word-state-v1-${day}`;
  let day = dayIndex();
  let answer = answerFor(day);
  let state = loadState();
  let toastTimer;
  const board = $("board"), keyboard = $("keyboard");
  const keyRows = ["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
  const labelDate = new Intl.DateTimeFormat(undefined, {month:"short",day:"numeric",year:"numeric",timeZone:"UTC"}).format(new Date());
  $("todayDate").textContent = labelDate.toUpperCase();
  $("year").textContent = new Date().getUTCFullYear();
  $("wordCount").textContent = `${new Set(WORDS.answers).size}+`;
  $("missionNumber").textContent = `MISSION ${String(Math.max(1,day+1)).padStart(3,"0")}`;

  function emptyState() {
    return { guesses: [], statuses: [], current: "", over: false, won: false, completedDay: null };
  }
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(keyFor(day)) || "null");
      if (saved && Array.isArray(saved.guesses) && saved.guesses.every(w => typeof w === "string" && w.length === 5)) return {...emptyState(), ...saved};
    } catch {}
    return emptyState();
  }
  function saveState() {
    try { localStorage.setItem(keyFor(day), JSON.stringify(state)); } catch {}
  }
  function checkDayRollover() {
    const nextDay = dayIndex();
    if (nextDay !== day) {
      day = nextDay;
      answer = answerFor(day);
      state = loadState();
      $("missionNumber").textContent = `MISSION ${String(Math.max(1,day+1)).padStart(3,"0")}`;
      render(); updateStats();
      $("gameHint").textContent = "A NEW TRANSMISSION HAS ARRIVED.";
    }
  }
  function buildBoard() {
    board.innerHTML = "";
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.setAttribute("role","gridcell");
      tile.id = `tile-${r}-${c}`;
      board.appendChild(tile);
    }
  }
  function buildKeyboard() {
    keyboard.innerHTML = "";
    const rows = [keyRows[0], keyRows[1], "ENTER"+keyRows[2]+"BACK"];
    rows.forEach((letters, idx) => {
      const row = document.createElement("div"); row.className = "key-row";
      if (idx < 2) {
        [...letters].forEach(ch => row.appendChild(makeKey(ch, ch)));
      } else {
        row.appendChild(makeKey("ENTER","ENTER",true));
        [...keyRows[2]].forEach(ch => row.appendChild(makeKey(ch,ch)));
        row.appendChild(makeKey("⌫","BACK",true));
      }
      keyboard.appendChild(row);
    });
  }
  function makeKey(label, value, wide=false) {
    const btn = document.createElement("button");
    btn.className = "key" + (wide ? " wide" : "");
    btn.textContent = label;
    btn.dataset.key = value;
    btn.setAttribute("aria-label", value === "BACK" ? "Delete letter" : value === "ENTER" ? "Submit guess" : value);
    btn.addEventListener("click", () => handleKey(value));
    return btn;
  }
  function evaluate(guess, target=answer) {
    const result = Array(COLS).fill("absent");
    const remaining = target.split("");
    for (let i=0;i<COLS;i++) if (guess[i] === target[i]) { result[i] = "correct"; remaining[i] = null; }
    for (let i=0;i<COLS;i++) {
      if (result[i] === "correct") continue;
      const found = remaining.indexOf(guess[i]);
      if (found !== -1) { result[i] = "present"; remaining[found] = null; }
    }
    return result;
  }
  function render() {
    buildBoard(); buildKeyboard();
    state.guesses.forEach((word, row) => {
      const statuses = state.statuses[row] || evaluate(word);
      [...word].forEach((ch,col) => {
        const tile = $(`tile-${row}-${col}`);
        tile.textContent = ch; tile.classList.add(statuses[col],"reveal");
      });
    });
    if (!state.over && state.guesses.length < ROWS) {
      [...state.current].forEach((ch,col) => {
        const tile = $(`tile-${state.guesses.length}-${col}`);
        if (tile) { tile.textContent = ch; tile.classList.add("filled"); }
      });
    }
    applyKeyboardStatuses();
    if (state.over) {
      $("gameHint").textContent = state.won ? `SIGNAL DECODED IN ${state.guesses.length} ${state.guesses.length === 1 ? "TRY" : "TRIES"}.` : `MISSION COMPLETE · ANSWER: ${answer}`;
    }
  }
  function applyKeyboardStatuses() {
    const ranks = {absent:1,present:2,correct:3};
    const perKey = {};
    state.guesses.forEach((w,i) => [...w].forEach((ch,j) => {
      const status = (state.statuses[i] || [])[j];
      if (status && (!perKey[ch] || ranks[status] > ranks[perKey[ch]])) perKey[ch] = status;
    }));
    keyboard.querySelectorAll(".key").forEach(k => {
      const ch = k.dataset.key;
      k.classList.remove("correct","present","absent");
      if (perKey[ch]) k.classList.add(perKey[ch]);
    });
  }
  function flash(message) {
    $("gameHint").textContent = message;
    $("toast").textContent = message;
    $("toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("show"),1700);
  }
  function handleKey(key) {
    checkDayRollover();
    if (state.over) { flash("THIS TRANSMISSION IS COMPLETE."); return; }
    if (key === "BACK") { state.current = state.current.slice(0,-1); render(); $("gameHint").textContent="TYPE A GUESS · PRESS ENTER TO TRANSMIT"; return; }
    if (key === "ENTER") { submitGuess(); return; }
    if (/^[A-Z]$/.test(key) && state.current.length < COLS) {
      state.current += key; render(); $("gameHint").textContent="TYPE A GUESS · PRESS ENTER TO TRANSMIT";
    }
  }
  function submitGuess() {
    if (state.current.length !== COLS) { flash("FIVE LETTERS REQUIRED."); return; }
    const guess = state.current;
    if (!allowedSet.has(guess) && !answerSet.has(guess)) { flash("WORD NOT IN THE TRANSMISSION DICTIONARY."); return; }
    const statuses = evaluate(guess);
    state.guesses.push(guess); state.statuses.push(statuses); state.current="";
    if (guess === answer) { state.over=true; state.won=true; state.completedDay=day; recordResult(true,state.guesses.length); flash("SIGNAL DECODED. BEAUTIFULLY DONE."); }
    else if (state.guesses.length >= ROWS) { state.over=true; state.won=false; state.completedDay=day; recordResult(false,state.guesses.length); }
    saveState(); render(); updateStats();
  }
  function recordResult(won, tries) {
    try {
      const all = JSON.parse(localStorage.getItem("cosmic-word-stats-v1") || '{"played":0,"wins":0,"streak":0,"bestStreak":0,"lastDay":null,"distribution":[0,0,0,0,0,0]}');
      if (all.lastDay !== day) {
        all.played++;
        if (won) { all.wins++; all.streak = all.lastDay === day-1 ? all.streak+1 : 1; all.bestStreak = Math.max(all.bestStreak,all.streak); all.distribution[tries-1]++; }
        else all.streak = 0;
        all.lastDay = day;
        localStorage.setItem("cosmic-word-stats-v1",JSON.stringify(all));
      }
    } catch {}
  }
  function readStats() {
    try { return JSON.parse(localStorage.getItem("cosmic-word-stats-v1") || "null"); } catch { return null; }
  }
  function updateStats() {
    const s = readStats() || {played:0,wins:0,streak:0,bestStreak:0,distribution:[0,0,0,0,0,0]};
    $("played").textContent=s.played||0; $("winRate").textContent=s.played ? Math.round(s.wins/s.played*100)+"%" : "0%";
    $("streak").textContent=s.streak||0; $("bestStreak").textContent=s.bestStreak||0;
    const max = Math.max(1,...(s.distribution||[]));
    $("distribution").innerHTML="";
    (s.distribution||[0,0,0,0,0,0]).forEach((n,i)=>{
      const row=document.createElement("div");row.className="dist-row";
      const label=document.createElement("span");label.textContent=i+1;
      const bar=document.createElement("div");bar.className="dist-bar"+(state.won&&state.guesses.length===i+1?" best":"");bar.style.width=Math.max(24,n/max*205)+"px";bar.textContent=n;
      row.append(label,bar);$("distribution").appendChild(row);
    });
  }
  function openDialog(id) { const dlg=$(id); if (dlg && typeof dlg.showModal === "function") dlg.showModal(); }
  $("helpButton").addEventListener("click",()=>openDialog("helpDialog"));
  $("statsButton").addEventListener("click",()=>{updateStats();openDialog("statsDialog");});
  $("settingsButton").addEventListener("click",()=>openDialog("settingsDialog"));
  $("launchButton").addEventListener("click",()=>{$("game").scrollIntoView({behavior:"smooth",block:"start"});setTimeout(()=>{const k=keyboard.querySelector(".key");if(k)k.focus({preventScroll:true});},250);});
  $("contrastToggle").addEventListener("change",e=>document.body.classList.toggle("high-contrast",e.target.checked));
  $("darkToggle").addEventListener("change",e=>document.body.classList.toggle("light",!e.target.checked));
  document.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.querySelector("dialog[open]")) return;
    if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    else if (e.key==="Enter") handleKey("ENTER");
    else if (e.key==="Backspace") handleKey("BACK");
  });
  $("shareButton").addEventListener("click", async () => {
    const rows = state.guesses.map((w,i)=>w.split("").map((_,j)=>({correct:"🟩",present:"🟨",absent:"⬛"}[state.statuses[i][j]]).repeat(1)).join(""));
    const message = `Cosmic Word · Mission ${day+1}\n${state.won ? state.guesses.length : "X"}/6\n\n${rows.join("\n")}\nPlay: ${location.origin}`;
    try { if (navigator.share) await navigator.share({title:"Cosmic Word",text:message}); else { await navigator.clipboard.writeText(message); $("shareStatus").textContent="Results copied to clipboard."; } }
    catch { try { await navigator.clipboard.writeText(message); $("shareStatus").textContent="Results copied to clipboard."; } catch { $("shareStatus").textContent=message; } }
  });
  document.querySelectorAll("dialog form[method=dialog]").forEach(form=>form.addEventListener("click",e=>{ if(e.target===form) return; }));
  document.querySelectorAll("dialog .close-button").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
  window.addEventListener("focus",checkDayRollover);
  buildBoard(); buildKeyboard(); render(); updateStats();
  // The welcome screen and the game share one page; opening Play scrolls down to the board.
})();