// Firebase Auth wrapper
// Using ES modules from CDN

let auth = null;
let currentUser = null;
let authChangeCallbacks = [];

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
};

export async function initAuth() {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
  const { getAuth, onAuthStateChanged } =
    await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      authChangeCallbacks.forEach(cb => cb(user));
      resolve(user);
    });
  });
}

export async function signIn() {
  const { signInWithPopup, GoogleAuthProvider } =
    await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOut() {
  const { signOut: fbSignOut } =
    await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

  await fbSignOut(auth);
}

export function onAuthChange(callback) {
  authChangeCallbacks.push(callback);
  if (currentUser !== null) {
    callback(currentUser);
  }
  return () => {
    authChangeCallbacks = authChangeCallbacks.filter(cb => cb !== callback);
  };
}

export async function getIdToken() {
  if (!currentUser) return null;
  return currentUser.getIdToken();
}

export function getCurrentUser() {
  return currentUser;
}
