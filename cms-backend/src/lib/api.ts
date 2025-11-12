// API client for making requests to the Express backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const url = \`\${API_BASE_URL}\${endpoint}\`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = \`Bearer \${token}\`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Request failed",
    }));
    throw new Error(error.error || \`HTTP \${response.status}\`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

