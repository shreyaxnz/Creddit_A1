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