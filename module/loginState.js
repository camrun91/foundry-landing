// Login state management
const LOGIN_STATE_KEY = "foundry_landing_logged_in";
const EXPIRY_HOURS = 16;

export function isFirstLogin() {
  const loginData = sessionStorage.getItem(LOGIN_STATE_KEY);
  if (!loginData) return true;

  try {
    const { timestamp } = JSON.parse(loginData);
    const now = Date.now();
    const expiryTime = EXPIRY_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds

    // Check if more than 16 hours have passed
    if (now - timestamp > expiryTime) {
      clearLoginState(); // Clear expired state
      return true;
    }

    return false;
  } catch (error) {
    console.error("Foundry Landing Page | Error parsing login state:", error);
    clearLoginState(); // Clear invalid state
    return true;
  }
}

export function setLoggedIn() {
  const loginData = {
    timestamp: Date.now(),
    loggedIn: true,
  };
  sessionStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(loginData));
}

export function clearLoginState() {
  console.log("Foundry Landing Page | Clearing login state");
  sessionStorage.removeItem(LOGIN_STATE_KEY);
}
