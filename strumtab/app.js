let activeSongId = null;

function init() {
  renderSongList();
  // Auto-load the first song so there's something to see immediately
  if (songs.length > 0) selectSong(songs[0].id);
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function renderSongList() {
  const list = document.getElementById('song-list');
  list.innerHTML = songs.map(song => {
    const active = song.id === activeSongId ? 'active' : '';
    const diff = song.difficulty || 'beginner';
    return `
      <li>
        <div class="song-item ${active}" onclick="selectSong('${song.id}')">
          <div class="song-item-title">${esc(song.title)}</div>
          <div class="song-item-artist">${esc(song.artist)}</div>
          <div class="difficulty-badge ${diff}">${diff}</div>
        </div>
      </li>
    `;
  }).join('');
}

function selectSong(id) {
  activeSongId = id;
  const song = songs.find(s => s.id === id);
  if (!song) return;
  renderSongList();
  renderSong(song);
  document.getElementById('content').scrollTop = 0;
}

// ─── Song view ────────────────────────────────────────────────────────────────

function renderSong(song) {
  const diff = song.difficulty || 'beginner';

  const html = `
    <div class="song-header">
      <div class="song-title">${esc(song.title)}</div>
      <div class="song-artist">${esc(song.artist)}</div>
      <div class="song-meta">
        <span class="meta-badge">Key: ${esc(song.key)}</span>
        <span class="difficulty-badge ${diff}" style="font-size:11px">${diff}</span>
      </div>
    </div>

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
        <span style="font-size:14px;color:var(--gold)">▌</span>
        <span>Gold border = chord change</span>
      </div>
      <div class="legend-item">
        <span style="color:var(--tab-text);font-size:14px">Tab</span>
        <span>= fingerpicking section</span>
      </div>
    </div>

    ${song.sections.map(renderSection).join('')}
  `;

  document.getElementById('song-view').innerHTML = html;
}

// ─── Section renderers ────────────────────────────────────────────────────────

function renderSection(section) {
  return section.type === 'tab'
    ? renderTabSection(section)
    : renderChordSection(section);
}

function renderTabSection(section) {
  const note = section.note
    ? `<div class="tab-note">${esc(section.note)}</div>`
    : '';

  // Render each line; blank lines become empty <div> spacers for readability
  const tabLines = section.tab.map(line =>
    line === '' ? '\n' : line
  ).join('\n');

  return `
    <div class="song-section">
      <div class="section-name tab-section-name">♩ ${esc(section.name)}</div>
      <div class="tab-block">
        ${note}
        <pre class="tab-strings">${esc(tabLines)}</pre>
      </div>
    </div>
  `;
}

function renderChordSection(section) {
  return `
    <div class="song-section">
      <div class="section-name">${esc(section.name)}</div>
      ${section.lines.map(renderChordLine).join('')}
    </div>
  `;
}

// ─── Chord line ───────────────────────────────────────────────────────────────

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
  strums.forEach((strum, i) => {
    const isChordStart = i === 0 || strum.chord !== strums[i - 1].chord;

    // Insert a vertical bar separator at every chord boundary (except the first)
    if (isChordStart && i > 0) {
      html += '<div class="chord-sep"></div>';
    }

    const arrow     = strum.dir === 'd' ? '↓' : '↑';
    const arrowCls  = strum.dir === 'd' ? 'down' : 'up';
    const tokenCls  = isChordStart ? 'strum-token chord-start' : 'strum-token';

    html += `
      <div class="${tokenCls}">
        <span class="strum-chord-name">${esc(strum.chord)}</span>
        <span class="strum-arrow ${arrowCls}">${arrow}</span>
      </div>
    `;
  });
  return html;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Boot
document.addEventListener('DOMContentLoaded', init);
