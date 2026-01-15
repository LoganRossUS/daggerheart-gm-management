// Firebase Auth wrapper
// Using ES modules from CDN

let auth = null;
let currentUser = null;
let authChangeCallbacks = [];

const firebaseConfig = {
apiKey: "AIzaSyA6GYyYWlW1ybQ07-K13u4YUaNFcV66Zj0",
authDomain: "daggerheart-8bdc1.firebaseapp.com",
databaseURL: "https://daggerheart-8bdc1-default-rtdb.firebaseio.com",
projectId: "daggerheart-8bdc1",
storageBucket: "daggerheart-8bdc1.firebasestorage.app",
messagingSenderId: "885297626381",
appId: "1:885297626381:web:9caf2af85fb793f819c444"
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

// Sign in with Google
export async function signIn() {
  const { signInWithPopup, GoogleAuthProvider } =
    await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// Sign in with email and password
export async function signInWithEmail(email, password) {
  const { signInWithEmailAndPassword } =
    await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// Sign up with email and password
export async function signUpWithEmail(email, password, displayName) {
  const { createUserWithEmailAndPassword, updateProfile } =
    await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

  const result = await createUserWithEmailAndPassword(auth, email, password);

  // Set display name if provided
  if (displayName) {
    await updateProfile(result.user, { displayName });
  } else {
    // Default to email prefix
    await updateProfile(result.user, { displayName: email.split('@')[0] });
  }

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

// Get auth error message
export function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/popup-closed-by-user':
      return null; // User closed popup, no error needed
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site.';
    default:
      return error.message || 'Authentication failed';
  }
}
