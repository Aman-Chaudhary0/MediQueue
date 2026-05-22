const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const TOKEN_EVENT = "mediqueue:token-updated";

export const getStoredAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || "";

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

export const setStoredSession = (user, accessToken) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
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
  window.dispatchEvent(new CustomEvent(TOKEN_EVENT, { detail: { accessToken: "" } }));
};

export const TOKEN_STORAGE_EVENT = TOKEN_EVENT;
