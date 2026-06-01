const BASE_URL = "https://mock.apidog.com/m1/1264304-1262085-default";
const APIDOG_TOKEN = import.meta.env.VITE_APIDOG_TOKEN;

export async function apiRequest(path, options = {}) {
  if (!APIDOG_TOKEN) {
    throw Error("Se requiere el token de APIDOG!");
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      apidogToken: APIDOG_TOKEN,
      ...options.headers,
    },
  });
  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return data;
}

export function loginRequest(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}
