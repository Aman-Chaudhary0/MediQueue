import { getStoredAccessToken } from "./tokenStorage.js";
import { refreshAccessToken } from "./axiosConfig.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const fetchWithAuth = async (input, init = {}) => {
  const url = typeof input === "string" && input.startsWith("http")
    ? input
    : `${API_BASE_URL}${input}`;

  const attemptRequest = async () => {
    const token = getStoredAccessToken();
    const headers = new Headers(init.headers || {});

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, {
      ...init,
      credentials: "include",
      headers,
    });
  };

  let response = await attemptRequest();

  if (response.status === 401) {
    await refreshAccessToken();
    response = await attemptRequest();
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const error = new Error(
      data?.message || (typeof data === "string" ? data : "Request failed")
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
