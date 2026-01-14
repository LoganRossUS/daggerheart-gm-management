import { onAuthChange } from './auth.js';
import { api } from './api.js';
import { setEntitlement } from './features.js';

let userProfile = null;
let userEntitlement = null;

export async function initEntitlements() {
  onAuthChange(async (user) => {
    if (user) {
      try {
        const response = await api.auth.verify();
        userProfile = response.profile;
        userEntitlement = response.entitlement;
        setEntitlement(userEntitlement.tier);
      } catch (err) {
        console.error('Failed to verify auth:', err);
        setEntitlement('demo');
      }
    } else {
      userProfile = null;
      userEntitlement = null;
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
