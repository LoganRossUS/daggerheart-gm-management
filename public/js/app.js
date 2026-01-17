// Main app integration for auth and cloud features
// This module is loaded alongside the existing embedded JS in the GM control panel

import { initAuth, onAuthChange, signOut, getCurrentUser } from './lib/auth.js';
import { initEntitlements, waitForEntitlement } from './lib/entitlements.js';
import { api } from './lib/api.js';
import { canUse, getEntitlement } from './lib/features.js';
import { initNotes, setNotes, getNotes, resetNotes } from './components/notes.js';

let currentCampaignId = null;
let currentSceneId = null;
let autoSaveTimeout = null;

function clearCampaignState() {
  // Clear campaign and scene IDs
  currentCampaignId = null;
  currentSceneId = null;

  // Clear auto-save timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }

  // Reset campaign dropdown
  const campaignSelect = document.getElementById('campaign-select');
  if (campaignSelect) {
    campaignSelect.innerHTML = '<option value="">Select Campaign...</option>';
    campaignSelect.value = '';
  }

  // Reset scene dropdown and disable scene controls
  const sceneSelect = document.getElementById('scene-select');
  if (sceneSelect) {
    sceneSelect.innerHTML = '<option value="">Select Scene...</option>';
    sceneSelect.value = '';
    sceneSelect.disabled = true;
  }
  document.getElementById('new-scene-btn')?.setAttribute('disabled', '');
  document.getElementById('save-scene-btn')?.setAttribute('disabled', '');

  // Clear save status
  updateSaveStatus('');

  // Reset notes (legacy module)
  resetNotes();

  // Clear embedded notes and characters
  if (typeof window.setNotesState === 'function') {
    window.setNotesState([]);
  }
  if (typeof window.setCharactersState === 'function') {
    window.setCharactersState([]);
  }
}

// Initialize auth and entitlements (non-blocking for demo mode)
export async function initCloudFeatures() {
  try {
    await initAuth();
    await initEntitlements();
    setupAuthUI();
  } catch (err) {
    console.error('Cloud features initialization failed:', err);
    // App continues to work in demo mode
  }
}

function setupAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  const userTier = document.getElementById('user-tier');

  loginBtn?.addEventListener('click', () => {
    // Redirect to landing page for authentication options
    window.location.href = '/';
  });

  logoutBtn?.addEventListener('click', async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  });

  onAuthChange(async (user) => {
    if (user) {
      loginBtn?.classList.add('hidden');
      userMenu?.classList.remove('hidden');
      if (userName) userName.textContent = user.displayName || user.email;
      // Wait for entitlement verification before loading campaigns
      await waitForEntitlement();
      if (userTier) userTier.textContent = getEntitlement().toUpperCase();
      loadCampaigns();
    } else {
      loginBtn?.classList.remove('hidden');
      userMenu?.classList.add('hidden');
      clearCampaignState();
    }
  });
}

async function loadCampaigns() {
  if (!canUse('campaigns')) return;

  try {
    const { campaigns } = await api.campaigns.list();
    const select = document.getElementById('campaign-select');
    if (!select) return;

    select.innerHTML = '<option value="">Select Campaign...</option>' +
      campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    // Add event listener for campaign selection
    select.removeEventListener('change', handleCampaignSelect);
    select.addEventListener('change', handleCampaignSelect);
  } catch (err) {
    console.error('Failed to load campaigns:', err);
  }
}

function handleCampaignSelect(e) {
  const campaignId = e.target.value;
  if (campaignId) {
    loadCampaign(campaignId);
  } else {
    // Campaign deselected - clear scenes
    currentCampaignId = null;
    currentSceneId = null;
    const sceneSelect = document.getElementById('scene-select');
    if (sceneSelect) {
      sceneSelect.innerHTML = '<option value="">Select Scene...</option>';
      sceneSelect.disabled = true;
    }
    document.getElementById('new-scene-btn')?.setAttribute('disabled', '');
    document.getElementById('save-scene-btn')?.setAttribute('disabled', '');
    document.getElementById('delete-campaign-btn')?.setAttribute('disabled', '');
    document.getElementById('delete-scene-btn')?.setAttribute('disabled', '');
  }
}

async function loadCampaign(campaignId) {
  if (!campaignId || !canUse('campaigns')) return;

  try {
    currentCampaignId = campaignId;
    currentSceneId = null;

    // Load full campaign data including notes and characters
    const campaign = await api.campaigns.get(campaignId);
    console.log('[loadCampaign] Campaign data received:', {
      campaignId,
      notesCount: campaign.notes?.length || 0,
      charactersCount: campaign.characters?.length || 0,
      notes: campaign.notes,
      characters: campaign.characters
    });

    // Initialize notes if we have the notes feature
    if (canUse('notes')) {
      // Use embedded notes panel (new system) - preferred
      if (typeof window.setNotesState === 'function') {
        window.setNotesState(campaign.notes || []);
        // Do NOT initialize legacy module when embedded panel exists
        // The legacy module's initNotes() overwrites the embedded panel's innerHTML
      } else {
        // Fallback to legacy notes module only if embedded panel doesn't exist
        initNotes(campaignId);
        setNotes(campaign.notes);
      }
    }

    // Load characters into the embedded Characters tab
    if (typeof window.setCharactersState === 'function') {
      window.setCharactersState(campaign.characters || []);
    }

    // Load scenes for this campaign
    await loadScenes(campaignId);

    // Enable scene creation button, save button, and delete campaign button
    document.getElementById('new-scene-btn')?.removeAttribute('disabled');
    document.getElementById('save-scene-btn')?.removeAttribute('disabled');
    document.getElementById('delete-campaign-btn')?.removeAttribute('disabled');

    updateSaveStatus('Campaign loaded');
  } catch (err) {
    console.error('Failed to load campaign:', err);
    updateSaveStatus('Load failed');
  }
}

async function loadScenes(campaignId) {
  if (!campaignId || !canUse('campaigns')) return;

  try {
    const { scenes } = await api.scenes.list(campaignId);
    const select = document.getElementById('scene-select');
    if (!select) return;

    select.innerHTML = '<option value="">Select Scene...</option>' +
      scenes.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    select.disabled = false;

    // Add event listener for scene selection
    select.removeEventListener('change', handleSceneSelect);
    select.addEventListener('change', handleSceneSelect);
  } catch (err) {
    console.error('Failed to load scenes:', err);
  }
}

function handleSceneSelect(e) {
  const sceneId = e.target.value;
  if (sceneId) {
    loadScene(sceneId);
  } else {
    currentSceneId = null;
    // Note: save-scene-btn stays enabled for campaign-level saves (characters/notes)
    // Only disable delete-scene-btn since no scene is selected
    document.getElementById('delete-scene-btn')?.setAttribute('disabled', '');
  }
}

async function loadScene(sceneId) {
  if (!currentCampaignId || !sceneId || !canUse('campaigns')) return;

  try {
    const scene = await api.scenes.get(currentCampaignId, sceneId);
    currentSceneId = sceneId;

    // Restore encounter state if it exists
    if (scene.encounter && typeof window.loadEncounterState === 'function') {
      window.loadEncounterState(scene.encounter);
    }

    // Enable save and delete buttons
    document.getElementById('save-scene-btn')?.removeAttribute('disabled');
    document.getElementById('delete-scene-btn')?.removeAttribute('disabled');

    updateSaveStatus('Scene loaded');
  } catch (err) {
    console.error('Failed to load scene:', err);
    updateSaveStatus('Load failed');
  }
}

export async function saveScene() {
  if (!currentCampaignId || !currentSceneId || !canUse('cloudSave')) return;

  try {
    updateSaveStatus('Saving...');

    const data = {
      encounter: typeof window.getCurrentEncounterState === 'function'
        ? window.getCurrentEncounterState()
        : null,
    };

    await api.scenes.update(currentCampaignId, currentSceneId, data);
    updateSaveStatus('Saved');
  } catch (err) {
    console.error('Failed to save scene:', err);
    updateSaveStatus('Save failed');
  }
}

// Save campaign-level data (notes and characters)
export async function saveCampaign() {
  if (!currentCampaignId || !canUse('cloudSave')) {
    console.log('[saveCampaign] Skipping - no campaign or no cloudSave access', { currentCampaignId, canUseCloudSave: canUse('cloudSave') });
    return;
  }

  try {
    updateSaveStatus('Saving...');

    // Get notes from embedded panel or legacy module
    const notes = typeof window.getNotesState === 'function'
      ? window.getNotesState()
      : getNotes();

    // Get characters from embedded panel
    const characters = typeof window.getCharactersState === 'function'
      ? window.getCharactersState()
      : [];

    console.log('[saveCampaign] Saving campaign data:', {
      campaignId: currentCampaignId,
      notesCount: notes?.length || 0,
      charactersCount: characters?.length || 0,
      notes,
      characters
    });

    // Save campaign-level data
    await api.campaigns.update(currentCampaignId, { notes, characters });
    console.log('[saveCampaign] Campaign data saved successfully');

    // Also save scene data if we have a scene selected
    if (currentSceneId) {
      await saveScene();
    }

    updateSaveStatus('Saved');
  } catch (err) {
    console.error('[saveCampaign] Failed to save campaign:', err);
    console.error('[saveCampaign] Error details:', { status: err.status, message: err.message, stack: err.stack });
    updateSaveStatus('Save failed');
    if (err.status === 403) {
      alert(err.message || 'Limit reached. Upgrade to premium for more capacity.');
    }
  }
}

export async function createNewCampaign() {
  if (!canUse('campaigns')) return;

  const name = prompt('Enter campaign name:');
  if (!name) return;

  try {
    const campaign = await api.campaigns.create({ name });
    currentCampaignId = campaign.campaignId;
    await loadCampaigns(); // Refresh the list

    // Select the new campaign
    const select = document.getElementById('campaign-select');
    if (select) {
      select.value = campaign.campaignId;
    }

    // Load the campaign (which will enable scene controls)
    await loadCampaign(campaign.campaignId);

    updateSaveStatus('Created');
  } catch (err) {
    console.error('Failed to create campaign:', err);
    if (err.status === 403) {
      alert(err.message || 'Campaign limit reached. Upgrade to premium for more campaigns.');
    }
  }
}

export async function createNewScene() {
  if (!currentCampaignId || !canUse('campaigns')) return;

  const name = prompt('Enter scene name:');
  if (!name) return;

  try {
    const scene = await api.scenes.create(currentCampaignId, { name });
    currentSceneId = scene.sceneId;

    // Refresh the scenes list
    await loadScenes(currentCampaignId);

    // Select the new scene
    const select = document.getElementById('scene-select');
    if (select) {
      select.value = scene.sceneId;
    }

    // Enable save button
    document.getElementById('save-scene-btn')?.removeAttribute('disabled');

    updateSaveStatus('Scene created');
  } catch (err) {
    console.error('Failed to create scene:', err);
    if (err.status === 403) {
      alert(err.message || 'Scene limit reached. Upgrade to premium for more scenes.');
    }
  }
}

export function scheduleAutoSave() {
  if (!currentCampaignId || !canUse('cloudSave')) return;

  if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(saveCampaign, 2000);
  updateSaveStatus('Unsaved changes');
}

function updateSaveStatus(status) {
  const statusEl = document.getElementById('save-status');
  if (statusEl) statusEl.textContent = status;
}

// Upload file to R2 cloud storage
export async function uploadFile(file) {
  if (!canUse('cloudSave')) {
    throw new Error('Cloud storage requires subscription');
  }
  return api.upload.uploadFile(file);
}

// List user's uploaded files from R2 storage
export async function listFiles() {
  if (!canUse('cloudSave')) {
    throw new Error('Cloud storage requires subscription');
  }
  return api.files.list();
}

export async function deleteScene() {
  if (!currentCampaignId || !currentSceneId || !canUse('campaigns')) return;

  const sceneSelect = document.getElementById('scene-select');
  const sceneName = sceneSelect?.options[sceneSelect.selectedIndex]?.text || 'this scene';

  if (!confirm(`Are you sure you want to delete "${sceneName}"? This cannot be undone.`)) {
    return;
  }

  try {
    updateSaveStatus('Deleting...');
    await api.scenes.delete(currentCampaignId, currentSceneId);

    // Clear current scene
    currentSceneId = null;

    // Disable delete-scene button (no scene selected)
    // Note: save-scene-btn stays enabled for campaign-level saves (characters/notes)
    document.getElementById('delete-scene-btn')?.setAttribute('disabled', '');

    // Refresh scenes list
    await loadScenes(currentCampaignId);

    updateSaveStatus('Scene deleted');
  } catch (err) {
    console.error('Failed to delete scene:', err);
    updateSaveStatus('Delete failed');
  }
}

export async function deleteCampaign() {
  if (!currentCampaignId || !canUse('campaigns')) return;

  const campaignSelect = document.getElementById('campaign-select');
  const campaignName = campaignSelect?.options[campaignSelect.selectedIndex]?.text || 'this campaign';

  if (!confirm(`Are you sure you want to delete "${campaignName}"? This will delete all scenes, notes, and characters in this campaign. This cannot be undone.`)) {
    return;
  }

  try {
    updateSaveStatus('Deleting...');
    await api.campaigns.delete(currentCampaignId);

    // Clear state
    currentCampaignId = null;
    currentSceneId = null;

    // Clear and disable scene controls
    const sceneSelect = document.getElementById('scene-select');
    if (sceneSelect) {
      sceneSelect.innerHTML = '<option value="">Select Scene...</option>';
      sceneSelect.disabled = true;
    }
    document.getElementById('new-scene-btn')?.setAttribute('disabled', '');
    document.getElementById('save-scene-btn')?.setAttribute('disabled', '');
    document.getElementById('delete-scene-btn')?.setAttribute('disabled', '');
    document.getElementById('delete-campaign-btn')?.setAttribute('disabled', '');

    // Clear notes and characters
    if (typeof window.setNotesState === 'function') {
      window.setNotesState([]);
    }
    if (typeof window.setCharactersState === 'function') {
      window.setCharactersState([]);
    }

    // Refresh campaigns list
    await loadCampaigns();

    updateSaveStatus('Campaign deleted');
  } catch (err) {
    console.error('Failed to delete campaign:', err);
    updateSaveStatus('Delete failed');
  }
}

export async function deleteAccount() {
  try {
    await api.account.delete();

    // Clear local state
    currentCampaignId = null;
    currentSceneId = null;

    // Sign out
    await signOut();

    return true;
  } catch (err) {
    console.error('Failed to delete account:', err);
    throw err;
  }
}

// Export for use by existing app
window.cloudFeatures = {
  initCloudFeatures,
  saveCampaign,
  createNewCampaign,
  saveScene,
  createNewScene,
  deleteScene,
  deleteCampaign,
  deleteAccount,
  scheduleAutoSave,
  canUse,
  getEntitlement,
  uploadFile,
  listFiles,
};
