import { api } from '../lib/api.js';
import { canUse } from '../lib/features.js';

const NOTE_CATEGORIES = [
  { id: 'session', name: 'Session Notes', icon: 'S' },
  { id: 'npc', name: 'NPCs', icon: 'N' },
  { id: 'location', name: 'Locations', icon: 'L' },
  { id: 'plot', name: 'Plot Threads', icon: 'P' },
  { id: 'rules', name: 'House Rules', icon: 'R' },
];

let currentCampaignId = null;
let notes = [];
let selectedNoteId = null;

export function initNotes(campaignId) {
  currentCampaignId = campaignId;
  renderNotesPanel();
}

export function setNotes(loadedNotes) {
  notes = loadedNotes || [];
  renderNotesList();
}

function renderNotesPanel() {
  const panel = document.getElementById('notes-panel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="notes-container">
      <div class="notes-sidebar">
        <div class="notes-categories">
          ${NOTE_CATEGORIES.map(cat => `
            <button class="category-btn" data-category="${cat.id}">
              [${cat.icon}] ${cat.name}
            </button>
          `).join('')}
        </div>
        <div class="notes-list" id="notes-list"></div>
        <button class="add-note-btn" id="add-note-btn">+ Add Note</button>
      </div>
      <div class="notes-editor">
        <input type="text" id="note-title" placeholder="Note title..." />
        <select id="note-category">
          ${NOTE_CATEGORIES.map(cat => `
            <option value="${cat.id}">${cat.name}</option>
          `).join('')}
        </select>
        <textarea id="note-content" placeholder="Write your note here..."></textarea>
        <div class="note-actions">
          <button id="save-note-btn">Save</button>
          <button id="delete-note-btn">Delete</button>
        </div>
      </div>
    </div>
  `;

  attachNoteEventListeners();
  renderNotesList();
}

function renderNotesList() {
  const list = document.getElementById('notes-list');
  if (!list) return;

  list.innerHTML = notes.map(note => `
    <div class="note-item ${note.id === selectedNoteId ? 'selected' : ''}"
         data-note-id="${note.id}">
      <span class="note-category-icon">
        [${NOTE_CATEGORIES.find(c => c.id === note.category)?.icon || 'S'}]
      </span>
      <span class="note-title">${note.title || 'Untitled'}</span>
    </div>
  `).join('');
}

function attachNoteEventListeners() {
  document.getElementById('add-note-btn')?.addEventListener('click', createNewNote);
  document.getElementById('save-note-btn')?.addEventListener('click', saveCurrentNote);
  document.getElementById('delete-note-btn')?.addEventListener('click', deleteCurrentNote);

  document.getElementById('notes-list')?.addEventListener('click', (e) => {
    const noteItem = e.target.closest('.note-item');
    if (noteItem) {
      selectNote(noteItem.dataset.noteId);
    }
  });
}

function selectNote(noteId) {
  selectedNoteId = noteId;
  const note = notes.find(n => n.id === noteId);

  if (note) {
    document.getElementById('note-title').value = note.title || '';
    document.getElementById('note-category').value = note.category || 'session';
    document.getElementById('note-content').value = note.content || '';
  }

  renderNotesList();
}

async function createNewNote() {
  if (!canUse('notes') || !currentCampaignId) return;

  const newNote = {
    id: crypto.randomUUID(),
    title: 'New Note',
    category: 'session',
    content: '',
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);
  selectNote(newNote.id);
}

async function saveCurrentNote() {
  if (!selectedNoteId || !currentCampaignId) return;

  const noteIndex = notes.findIndex(n => n.id === selectedNoteId);
  if (noteIndex === -1) return;

  notes[noteIndex] = {
    ...notes[noteIndex],
    title: document.getElementById('note-title').value,
    category: document.getElementById('note-category').value,
    content: document.getElementById('note-content').value,
    updatedAt: new Date().toISOString(),
  };

  renderNotesList();

  // Save to server as part of campaign update
  // This will be called by auto-save or manual save
}

async function deleteCurrentNote() {
  if (!selectedNoteId) return;

  notes = notes.filter(n => n.id !== selectedNoteId);
  selectedNoteId = null;

  document.getElementById('note-title').value = '';
  document.getElementById('note-category').value = 'session';
  document.getElementById('note-content').value = '';

  renderNotesList();
}

export function getNotes() {
  return notes;
}

export function resetNotes() {
  currentCampaignId = null;
  notes = [];
  selectedNoteId = null;

  // Only clear the notes list if it exists (don't wipe the entire panel)
  // The embedded panel in gm-control-panel has its own structure that shouldn't be cleared
  const notesList = document.getElementById('notes-list');
  if (notesList) {
    notesList.innerHTML = '';
  }
}
