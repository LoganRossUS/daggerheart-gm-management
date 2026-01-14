const FEATURES = {
  cloudSave: ['basic', 'premium'],
  campaigns: ['basic', 'premium'],
  notes: ['basic', 'premium'],
  battlemapUpload: ['basic', 'premium'],
  communityRepo: ['premium'],
};

let currentEntitlement = 'demo';

export function setEntitlement(tier) {
  currentEntitlement = tier || 'demo';
  updateUIForEntitlement();
}

export function canUse(feature) {
  return FEATURES[feature]?.includes(currentEntitlement) || false;
}

export function getEntitlement() {
  return currentEntitlement;
}

function updateUIForEntitlement() {
  // Update tier badge
  const tierBadge = document.getElementById('user-tier');
  if (tierBadge) {
    tierBadge.textContent = currentEntitlement.toUpperCase();
  }

  // Show/hide elements based on entitlement
  document.querySelectorAll('[data-requires]').forEach(el => {
    const required = el.dataset.requires;
    if (canUse(required)) {
      el.classList.remove('hidden');
      el.disabled = false;
    } else {
      el.classList.add('hidden');
      el.disabled = true;
    }
  });

  // Show upgrade prompts for demo users
  document.querySelectorAll('[data-upgrade-prompt]').forEach(el => {
    if (currentEntitlement === 'demo') {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}
