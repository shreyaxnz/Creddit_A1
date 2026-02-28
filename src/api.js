const BASE = "https://awf-api.lvl99.dev";

export async function login() {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      username: "spatel1176",
      password: "8911176",
    }),
  });

  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  return data.access_token;
}

export async function getForums(token) {
  const res = await fetch(`${BASE}/forums`, {
    headers: { accept: "application/json", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to load forums");
  return res.json();
}

export async function getForumPosts(token, slug, limit = 10) {
  const res = await fetch(`${BASE}/forums/${encodeURIComponent(slug)}?limit=${limit}`, {
    headers: { accept: "application/json", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}