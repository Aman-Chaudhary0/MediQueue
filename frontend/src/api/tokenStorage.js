const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const TOKEN_EVENT = "mediqueue:token-updated";

export const getStoredAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || "";

export const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) || "";

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser || rawUser === "undefined") {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

export const setStoredSession = (user, accessToken, refreshToken) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  window.dispatchEvent(new CustomEvent(TOKEN_EVENT, { detail: { accessToken } }));
};

export const updateStoredAccessToken = (accessToken) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  window.dispatchEvent(new CustomEvent(TOKEN_EVENT, { detail: { accessToken: accessToken || "" } }));
};

export const clearStoredSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent(TOKEN_EVENT, { detail: { accessToken: "" } }));
};

export const TOKEN_STORAGE_EVENT = TOKEN_EVENT;
