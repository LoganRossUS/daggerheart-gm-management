import { onAuthChange } from './auth.js';
import { api } from './api.js';
import { setEntitlement } from './features.js';

let userProfile = null;
let userEntitlement = null;
let entitlementResolve = null;
let entitlementPromise = null;

// Reset the entitlement promise for a new verification cycle
function resetEntitlementPromise() {
  entitlementPromise = new Promise((resolve) => {
    entitlementResolve = resolve;
  });
}

// Wait for entitlement to be verified (resolves immediately if already verified)
export function waitForEntitlement() {
  return entitlementPromise || Promise.resolve();
}

export async function initEntitlements() {
  onAuthChange(async (user) => {
    if (user) {
      resetEntitlementPromise();
      try {
        const response = await api.auth.verify();
        userProfile = response.profile;
        userEntitlement = response.entitlement;
        setEntitlement(userEntitlement.tier);
      } catch (err) {
        console.error('Failed to verify auth:', err);
        setEntitlement('demo');
      }
      entitlementResolve();
    } else {
      userProfile = null;
      userEntitlement = null;
      entitlementPromise = null;
      setEntitlement('demo');
    }
  });
}

export function getUserProfile() {
  return userProfile;
}

export function getUserEntitlement() {
  return userEntitlement;
}
