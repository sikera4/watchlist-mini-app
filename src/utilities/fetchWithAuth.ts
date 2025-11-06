const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  "X-Forwarded-Host": "api.themoviedb.org",
};

const DEFAULT_CONFIG: RequestInit = {
  credentials: "omit",
  headers: DEFAULT_HEADERS,
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...DEFAULT_CONFIG,
    ...options,
  });

  return response.json();
};
