// editor.js — edit-mode rendering and all mutation helpers.
// Depends on: state, getSong, saveUserSongs, esc  (all from app.js)

// ─── Top-level edit render ────────────────────────────────────────────────────
// Called by renderMain() when mode === 'edit'.  Returns an HTML string.
function renderEditor(songId) {
  const song = getSong(songId);
  if (!song) return '';

  return `
    <div class="edit-toolbar">
      <button class="action-btn primary-btn" onclick="exitEditMode()">← Done</button>
      <div class="edit-toolbar-center">
        <span class="edit-mode-badge">Editing</span>
        <input class="version-name-input"
               value="${esc(song.versionName || song.title)}"
               oninput="patchSong('${songId}','versionName',this.value)"
               placeholder="Version name (shown in sidebar)">
      </div>
      <span class="autosave-hint">Auto-saved ✓</span>
    </div>

    <div class="edit-meta-row">
      <label class="meta-field">
        <span>Title</span>
        <input value="${esc(song.title)}"
               oninput="patchSong('${songId}','title',this.value)"
               placeholder="Song title">
      </label>
      <label class="meta-field">
        <span>Artist</span>
        <input value="${esc(song.artist)}"
               oninput="patchSong('${songId}','artist',this.value)"
               placeholder="Artist name">
      </label>
      <label class="meta-field">
        <span>Key</span>
        <input value="${esc(song.key)}"
               oninput="patchSong('${songId}','key',this.value)"
               placeholder="e.g. G major"
               style="width:110px">
      </label>
    </div>

    <div id="edit-sections">
      ${renderSectionList(songId)}
    </div>

    <div class="add-section-bar">
      <button class="action-btn" onclick="addSection('${songId}','chords')">+ Add Chord Section</button>
      <button class="action-btn" onclick="addSection('${songId}','tab')">+ Add Tab Section</button>
    </div>
  `;
}

// Re-renders only the sections container — used after structural mutations.
// Preserves focus on non-section elements (toolbar inputs, meta inputs).
function rerenderSections(songId) {
  const div = document.getElementById('edit-sections');
  if (div) div.innerHTML = renderSectionList(songId);
}

// ─── Section list ─────────────────────────────────────────────────────────────
function renderSectionList(songId) {
  const song = getSong(songId);
  return (song.sections || [])
    .map((sec, si) => renderSectionEditor(songId, si, song.sections.length))
    .join('');
}

function renderSectionEditor(songId, si, totalSections) {
  const song = getSong(songId);
  const section = song.sections[si];
  const body = section.type === 'tab'
    ? renderTabSectionEditor(songId, si)
    : renderChordSectionEditor(songId, si);
  const canDelete = totalSections > 1;

  return `
    <div class="song-section edit-section">
      <div class="edit-section-hdr">
        <span class="section-type-pill ${section.type === 'tab' ? 'tab-pill' : 'chord-pill'}">
          ${section.type === 'tab' ? 'Tab' : 'Chords'}
        </span>
        <input class="section-name-input"
               value="${esc(section.name)}"
               oninput="patchSection('${songId}',${si},'name',this.value)"
               placeholder="Section name">
        <div class="edit-section-controls">
          ${si > 0
            ? `<button class="ctrl-btn" onclick="moveSectionUp('${songId}',${si})" title="Move section up">↑</button>`
            : ''}
          ${si < totalSections - 1
            ? `<button class="ctrl-btn" onclick="moveSectionDown('${songId}',${si})" title="Move section down">↓</button>`
            : ''}
          ${canDelete
            ? `<button class="danger-btn" onclick="removeSection('${songId}',${si})">Delete section</button>`
            : ''}
        </div>
      </div>
      ${body}
    </div>
  `;
}

// ─── Tab section editor ───────────────────────────────────────────────────────
function renderTabSectionEditor(songId, si) {
  const section = getSong(songId).sections[si];
  const tabText = (section.tab || []).join('\n');
  const rows = Math.max(7, (section.tab || []).length + 1);

  return `
    <div class="tab-block edit-tab-block">
      <input class="tab-note-input"
             value="${esc(section.note || '')}"
             oninput="patchSection('${songId}',${si},'note',this.value)"
             placeholder="Optional note (e.g. 'Repeat 2x, fingerpick each note')">
      <textarea class="tab-textarea"
                rows="${rows}"
                oninput="patchTabContent('${songId}',${si},this.value)">${esc(tabText)}</textarea>
    </div>
  `;
}

// ─── Chord section editor ─────────────────────────────────────────────────────
function renderChordSectionEditor(songId, si) {
  const lines = getSong(songId).sections[si].lines || [];
  return `
    ${lines.map((_, li) => renderChordLineEditor(songId, si, li, lines.length)).join('')}
    <button class="add-line-btn" onclick="addLine('${songId}',${si})">+ Add line</button>
  `;
}

function renderChordLineEditor(songId, si, li, totalLines) {
  const line = getSong(songId).sections[si].lines[li];
  return `
    <div class="edit-chord-line">
      <div class="edit-line-hdr">
        <span class="line-num">Line ${li + 1}</span>
        ${totalLines > 1
          ? `<button class="danger-btn sm" onclick="removeLine('${songId}',${si},${li})">Remove line</button>`
          : ''}
      </div>
      <div class="strum-row-editor">
        ${renderStrumRowEditor(songId, si, li)}
      </div>
      <textarea class="lyric-input"
                rows="2"
                oninput="patchLyric('${songId}',${si},${li},this.value)"
                placeholder="Type lyrics here...">${esc(line.lyric)}</textarea>
    </div>
  `;
}

// ─── Strum row editor ─────────────────────────────────────────────────────────
function renderStrumRowEditor(songId, si, li) {
  const strums = getSong(songId).sections[si].lines[li].strums || [];
  let html = '';

  // Insert-before button (before strum 0)
  html += insertBtn(songId, si, li, -1);

  strums.forEach((strum, idx) => {
    const isStart = idx === 0 || strum.chord !== strums[idx - 1].chord;
    const arrow   = strum.dir === 'd' ? '↓' : '↑';
    const dirCls  = strum.dir === 'd' ? 'down' : 'up';
    const canRemove = strums.length > 1;

    html += `
      <div class="strum-token-editor ${isStart ? 'chord-start' : ''}">
        <button class="strum-remove-btn"
                onclick="removeStrum('${songId}',${si},${li},${idx})"
                ${canRemove ? '' : 'disabled'}
                title="Remove this strum">×</button>
        <input  class="chord-name-input"
                value="${esc(strum.chord)}"
                oninput="patchChord('${songId}',${si},${li},${idx},this.value)"
                onblur="commitChord('${songId}',${si},${li},${idx})"
                onkeydown="if(event.key==='Enter'){this.blur()}"
                placeholder="G">
        <button class="strum-dir-btn ${dirCls}"
                onclick="toggleDir('${songId}',${si},${li},${idx})"
                title="Click to flip: ↓ / ↑">
          ${arrow}
        </button>
      </div>
    `;

    html += insertBtn(songId, si, li, idx);
  });

  return html;
}

function insertBtn(songId, si, li, afterIdx) {
  return `<button class="strum-insert-btn"
                  onclick="insertStrum('${songId}',${si},${li},${afterIdx})"
                  title="Insert strum here">+</button>`;
}

// ─── Mutation helpers ─────────────────────────────────────────────────────────

// Patch top-level field (no re-render — user is typing)
function patchSong(songId, field, value) {
  const song = getSong(songId);
  if (!song) return;
  song[field] = value;
  saveUserSongs();
}

// Patch a section field (no re-render — user is typing)
function patchSection(songId, si, field, value) {
  const song = getSong(songId);
  if (!song) return;
  song.sections[si][field] = value;
  saveUserSongs();
}

// Patch tab content — splits raw text into array (no re-render)
function patchTabContent(songId, si, rawText) {
  const song = getSong(songId);
  if (!song) return;
  song.sections[si].tab = rawText.split('\n');
  saveUserSongs();
}

// Patch lyric (no re-render — user is typing)
function patchLyric(songId, si, li, value) {
  const song = getSong(songId);
  if (!song) return;
  song.sections[si].lines[li].lyric = value;
  saveUserSongs();
}

// Patch chord name silently during typing (no re-render — preserves focus)
function patchChord(songId, si, li, strumIdx, value) {
  const song = getSong(songId);
  if (!song) return;
  song.sections[si].lines[li].strums[strumIdx].chord = value;
  saveUserSongs();
}

// On blur/Enter: chord is already saved via patchChord; just re-render
// to update chord-change border highlights.
function commitChord(songId, si, li, strumIdx) {
  // Normalise: empty chord → 'G'
  const song = getSong(songId);
  if (!song) return;
  const strum = song.sections[si].lines[li].strums[strumIdx];
  if (!strum.chord.trim()) strum.chord = 'G';
  saveUserSongs();
  rerenderSections(songId);
}

// Toggle ↓ ↔ ↑ and re-render
function toggleDir(songId, si, li, strumIdx) {
  const song = getSong(songId);
  if (!song) return;
  const strum = song.sections[si].lines[li].strums[strumIdx];
  strum.dir = strum.dir === 'd' ? 'u' : 'd';
  saveUserSongs();
  rerenderSections(songId);
}

// Insert a new strum.  afterIdx=-1 inserts before position 0.
function insertStrum(songId, si, li, afterIdx) {
  const song = getSong(songId);
  if (!song) return;
  const strums = song.sections[si].lines[li].strums;
  const ref = strums[Math.max(0, afterIdx)] || { chord: 'G', dir: 'd' };
  strums.splice(afterIdx + 1, 0, { chord: ref.chord, dir: 'd' });
  saveUserSongs();
  rerenderSections(songId);
}

// Remove a strum (guard: at least 1 must remain)
function removeStrum(songId, si, li, strumIdx) {
  const song = getSong(songId);
  if (!song) return;
  const strums = song.sections[si].lines[li].strums;
  if (strums.length <= 1) return;
  strums.splice(strumIdx, 1);
  saveUserSongs();
  rerenderSections(songId);
}

// Add a line below the last one (copies strum pattern, blanks lyrics)
function addLine(songId, si) {
  const song = getSong(songId);
  if (!song) return;
  const lines = song.sections[si].lines;
  const ref = lines[lines.length - 1];
  lines.push({
    strums: JSON.parse(JSON.stringify(ref.strums)),
    lyric: ''
  });
  saveUserSongs();
  rerenderSections(songId);
}

// Remove a line (guard: at least 1 must remain)
function removeLine(songId, si, li) {
  const song = getSong(songId);
  if (!song) return;
  const lines = song.sections[si].lines;
  if (lines.length <= 1) return;
  lines.splice(li, 1);
  saveUserSongs();
  rerenderSections(songId);
}

// Add a new section at the end
function addSection(songId, type) {
  const song = getSong(songId);
  if (!song) return;
  const section = type === 'tab'
    ? { name: 'New Tab Section', type: 'tab', note: '', tab: ['e|---|', 'B|---|', 'G|---|', 'D|---|', 'A|---|', 'E|---|'] }
    : { name: 'New Section', type: 'chords', lines: [{
        strums: [
          { chord: 'G', dir: 'd' }, { chord: 'G', dir: 'u' },
          { chord: 'G', dir: 'd' }, { chord: 'G', dir: 'u' }
        ],
        lyric: ''
      }]
    };
  song.sections.push(section);
  saveUserSongs();
  rerenderSections(songId);
}

// Remove a section (guard: at least 1 must remain)
function removeSection(songId, si) {
  const song = getSong(songId);
  if (!song || song.sections.length <= 1) return;
  if (!confirm('Delete this section?')) return;
  song.sections.splice(si, 1);
  saveUserSongs();
  rerenderSections(songId);
}

function moveSectionUp(songId, si) {
  if (si === 0) return;
  const song = getSong(songId);
  [song.sections[si - 1], song.sections[si]] = [song.sections[si], song.sections[si - 1]];
  saveUserSongs();
  rerenderSections(songId);
}

function moveSectionDown(songId, si) {
  const song = getSong(songId);
  if (si >= song.sections.length - 1) return;
  [song.sections[si], song.sections[si + 1]] = [song.sections[si + 1], song.sections[si]];
  saveUserSongs();
  rerenderSections(songId);
}
