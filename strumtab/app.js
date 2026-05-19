// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  activeSongId: null,
  mode: 'view',      // 'view' | 'edit'
  userSongs: {}      // id → song object (persisted to localStorage)
};

const STORAGE_KEY = 'strumtab_user_songs';

// ─── Boot ─────────────────────────────────────────────────────────────────────
function init() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state.userSongs = JSON.parse(raw);
  } catch (_) { state.userSongs = {}; }

  renderSidebar();
  if (songs.length > 0) selectSong(songs[0].id);
}

function saveUserSongs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.userSongs));
}

// ─── Song resolution ──────────────────────────────────────────────────────────
// User songs shadow source songs; check userSongs first.
function getSong(id) {
  return state.userSongs[id] || songs.find(s => s.id === id) || null;
}

function isUserSong(id) {
  return !!state.userSongs[id];
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function selectSong(id) {
  if (typeof stopRhythm === 'function') stopRhythm();
  state.activeSongId = id;
  state.mode = 'view';
  renderSidebar();
  renderMain();
  document.getElementById('content').scrollTop = 0;
}

function enterEditMode(id) {
  if (typeof stopRhythm === 'function') stopRhythm();
  if (id) state.activeSongId = id;
  state.mode = 'edit';
  renderMain();
}

function exitEditMode() {
  state.mode = 'view';
  renderSidebar(); // version name may have changed
  renderMain();
}

// ─── Versioning ───────────────────────────────────────────────────────────────
function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'v' + Date.now() + Math.random().toString(36).slice(2);
}

function forkSong(sourceId) {
  const source = getSong(sourceId);
  if (!source) return;
  const newId = generateId();
  const fork = JSON.parse(JSON.stringify(source)); // deep clone
  fork.id = newId;
  fork.sourceId = sourceId;
  fork.versionName = source.title + ' — my version';
  state.userSongs[newId] = fork;
  saveUserSongs();
  enterEditMode(newId);
  renderSidebar();
}

function newSong() {
  const newId = generateId();
  state.userSongs[newId] = {
    id: newId,
    sourceId: null,
    versionName: 'New Song',
    title: 'New Song',
    artist: '',
    key: '',
    difficulty: 'beginner',
    sections: [{
      name: 'Verse 1',
      type: 'chords',
      lines: [{
        strums: [
          { chord: 'G', dir: 'd' }, { chord: 'G', dir: 'u' },
          { chord: 'G', dir: 'd' }, { chord: 'G', dir: 'u' }
        ],
        lyric: 'Type lyrics here...'
      }]
    }]
  };
  saveUserSongs();
  enterEditMode(newId);
  renderSidebar();
}

function deleteSong(id) {
  if (!confirm('Delete this version? This cannot be undone.')) return;
  delete state.userSongs[id];
  saveUserSongs();
  // Navigate away if we deleted the active song
  if (state.activeSongId === id) selectSong(songs[0].id);
  else renderSidebar();
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function renderSidebar() {
  const list = document.getElementById('song-list');
  let html = '';

  songs.forEach(song => {
    const active = state.activeSongId === song.id && state.mode !== 'edit';
    const activeEdit = state.activeSongId === song.id && state.mode === 'edit';
    html += `
      <li>
        <div class="song-item ${active || activeEdit ? 'active' : ''}"
             onclick="selectSong('${song.id}')">
          <div class="song-item-title">${esc(song.title)}</div>
          <div class="song-item-artist">${esc(song.artist)}</div>
          <div class="song-item-footer">
            <span class="difficulty-badge ${song.difficulty||'beginner'}">${song.difficulty||'beginner'}</span>
            <button class="fork-btn"
                    onclick="event.stopPropagation();forkSong('${song.id}')"
                    title="Fork this song to edit it">Fork ✎</button>
          </div>
        </div>
      </li>
    `;

    // User versions forked from this source song
    Object.values(state.userSongs)
      .filter(v => v.sourceId === song.id)
      .forEach(ver => {
        const vActive = state.activeSongId === ver.id;
        html += `
          <li>
            <div class="song-item version-item ${vActive ? 'active' : ''}"
                 onclick="selectSong('${ver.id}')">
              <div class="version-label">↳ ${esc(ver.versionName || ver.title)}</div>
              <div class="song-item-footer">
                <button class="edit-ver-btn"
                        onclick="event.stopPropagation();enterEditMode('${ver.id}')">✎ Edit</button>
                <button class="delete-ver-btn"
                        onclick="event.stopPropagation();deleteSong('${ver.id}')"
                        title="Delete version">×</button>
              </div>
            </div>
          </li>
        `;
      });
  });

  // Songs created from scratch (no sourceId)
  const ownSongs = Object.values(state.userSongs).filter(v => !v.sourceId);
  if (ownSongs.length > 0) {
    html += `<li class="sidebar-group-label">My Songs</li>`;
    ownSongs.forEach(ver => {
      const vActive = state.activeSongId === ver.id;
      html += `
        <li>
          <div class="song-item version-item ${vActive ? 'active' : ''}"
               onclick="selectSong('${ver.id}')">
            <div class="version-label">${esc(ver.versionName || ver.title)}</div>
            <div class="song-item-footer">
              <button class="edit-ver-btn"
                      onclick="event.stopPropagation();enterEditMode('${ver.id}')">✎ Edit</button>
              <button class="delete-ver-btn"
                      onclick="event.stopPropagation();deleteSong('${ver.id}')"
                      title="Delete song">×</button>
            </div>
          </div>
        </li>
      `;
    });
  }

  list.innerHTML = html;
}

// ─── Main render dispatcher ───────────────────────────────────────────────────
function renderMain() {
  const song = getSong(state.activeSongId);
  const view = document.getElementById('song-view');

  if (!song) {
    view.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">♪</div>
        <h2>Welcome to StrumTab</h2>
        <p>Select a song from the sidebar to get started.</p>
      </div>`;
    return;
  }

  if (state.mode === 'edit' && isUserSong(song.id)) {
    // renderEditor is defined in editor.js
    view.innerHTML = renderEditor(song.id);
  } else {
    view.innerHTML = renderViewMode(song);
  }
}

// ─── View mode ────────────────────────────────────────────────────────────────
function renderViewMode(song) {
  const isUser = isUserSong(song.id);
  const source = isUser && song.sourceId ? songs.find(s => s.id === song.sourceId) : null;

  const actionBtn = isUser
    ? `<button class="action-btn primary-btn" onclick="enterEditMode('${song.id}')">✎ Edit</button>`
    : `<button class="action-btn" onclick="forkSong('${song.id}')">Fork &amp; Edit ✎</button>`;

  return `
    <div class="song-header">
      <div class="song-header-row">
        <div>
          <div class="song-title">${esc(song.title)}</div>
          <div class="song-artist">${esc(song.artist)}</div>
          <div class="song-meta">
            ${song.key ? `<span class="meta-badge">Key: ${esc(song.key)}</span>` : ''}
            <span class="difficulty-badge ${song.difficulty||'beginner'}">${song.difficulty||'beginner'}</span>
            ${source ? `<span class="meta-badge muted">from: ${esc(source.title)}</span>` : ''}
          </div>
        </div>
        <div class="header-actions">
          ${actionBtn}
          <button class="action-btn rhythm-toggle-btn" id="rhythm-toggle-btn" onclick="toggleRhythm()">&#9654; Start Rhythm</button>
        </div>
      </div>
      <div class="rhythm-controls">
        <span class="bpm-label">BPM: <strong id="bpm-display">120</strong></span>
        <input type="range" class="bpm-slider" id="bpm-slider"
               min="40" max="240" value="120"
               oninput="updateBPM(this.value)">
      </div>
    </div>
    ${renderLegend()}
    <div class="lyrics-container" id="lyrics-container">
      <div class="playhead" id="playhead"></div>
      ${song.sections.map(s => renderSection(s)).join('')}
    </div>
  `;
}

function renderLegend() {
  return `
    <div class="legend">
      <div class="legend-item">
        <span class="strum-arrow down legend-arrow">↓</span>
        <span>Down strum</span>
      </div>
      <div class="legend-item">
        <span class="strum-arrow up legend-arrow">↑</span>
        <span>Up strum</span>
      </div>
      <div class="legend-item">
        <span style="color:var(--gold);font-size:13px">▌</span>
        <span>Gold border = chord change</span>
      </div>
      <div class="legend-item">
        <span style="color:var(--tab-text)">Tab</span>
        <span>= fingerpicking section</span>
      </div>
    </div>
  `;
}

// ─── View-mode section renderers ──────────────────────────────────────────────
function renderSection(section) {
  return section.type === 'tab' ? renderTabSection(section) : renderChordSection(section);
}

function renderTabSection(section) {
  const note = section.note ? `<div class="tab-note">${esc(section.note)}</div>` : '';
  const content = (section.tab || []).join('\n');
  return `
    <div class="song-section">
      <div class="section-name tab-section-name">♩ ${esc(section.name)}</div>
      <div class="tab-block">${note}<pre class="tab-strings">${esc(content)}</pre></div>
    </div>
  `;
}

function renderChordSection(section) {
  return `
    <div class="song-section">
      <div class="section-name">${esc(section.name)}</div>
      ${(section.lines || []).map(line => renderChordLine(line)).join('')}
    </div>
  `;
}

function renderChordLine(line) {
  return `
    <div class="chord-line">
      <div class="strum-row">${renderStrumRow(line.strums)}</div>
      <div class="lyric-text">${esc(line.lyric)}</div>
    </div>
  `;
}

function renderStrumRow(strums) {
  let html = '';
  (strums || []).forEach((s, i) => {
    const isStart = i === 0 || s.chord !== strums[i - 1].chord;
    if (isStart && i > 0) html += '<div class="chord-sep"></div>';
    html += `
      <div class="strum-token ${isStart ? 'chord-start' : ''}">
        <span class="strum-chord-name">${esc(s.chord)}</span>
        <span class="strum-arrow ${s.dir === 'd' ? 'down' : 'up'}">${s.dir === 'd' ? '↓' : '↑'}</span>
      </div>
    `;
  });
  return html;
}

// ─── Shared utility ───────────────────────────────────────────────────────────
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', init);
