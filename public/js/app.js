// Main app integration for auth and cloud features
// This module is loaded alongside the existing embedded JS in the GM control panel

import { initAuth, onAuthChange, signIn, signOut, getCurrentUser } from './lib/auth.js';
import { initEntitlements } from './lib/entitlements.js';
import { api } from './lib/api.js';
import { canUse, getEntitlement } from './lib/features.js';
import { initNotes, setNotes, getNotes } from './components/notes.js';

let currentCampaignId = null;
let autoSaveTimeout = null;

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

  loginBtn?.addEventListener('click', async () => {
    try {
      await signIn();
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  });

  logoutBtn?.addEventListener('click', async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  });

  onAuthChange((user) => {
    if (user) {
      loginBtn?.classList.add('hidden');
      userMenu?.classList.remove('hidden');
      if (userName) userName.textContent = user.displayName || user.email;
      if (userTier) userTier.textContent = getEntitlement().toUpperCase();
      loadCampaigns();
    } else {
      loginBtn?.classList.remove('hidden');
      userMenu?.classList.add('hidden');
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
  }
}

async function loadCampaign(campaignId) {
  if (!campaignId || !canUse('campaigns')) return;

  try {
    const campaign = await api.campaigns.get(campaignId);
    currentCampaignId = campaignId;

    // Restore encounter state if it exists
    if (campaign.encounter && typeof window.loadEncounterState === 'function') {
      window.loadEncounterState(campaign.encounter);
    }

    // Initialize notes if we have the notes feature
    if (canUse('notes')) {
      initNotes(campaignId);
      setNotes(campaign.notes);
    }

    updateSaveStatus('Loaded');
  } catch (err) {
    console.error('Failed to load campaign:', err);
    updateSaveStatus('Load failed');
  }
}

export async function saveCampaign() {
  if (!currentCampaignId || !canUse('cloudSave')) return;

  try {
    updateSaveStatus('Saving...');

    const data = {
      encounter: typeof window.getCurrentEncounterState === 'function'
        ? window.getCurrentEncounterState()
        : null,
      notes: getNotes(),
    };

    await api.campaigns.update(currentCampaignId, data);
    updateSaveStatus('Saved');
  } catch (err) {
    console.error('Failed to save campaign:', err);
    updateSaveStatus('Save failed');
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

    updateSaveStatus('Created');
  } catch (err) {
    console.error('Failed to create campaign:', err);
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

// Export for use by existing app
window.cloudFeatures = {
  initCloudFeatures,
  saveCampaign,
  createNewCampaign,
  scheduleAutoSave,
  canUse,
  getEntitlement,
};
