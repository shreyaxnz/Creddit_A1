import { useEffect, useState } from "react";
import { login } from "./api";
import { getForums } from "./api";
import { getForumPosts } from "./api";

export default function App() {
  const [token, setToken] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const t = await login();
        setToken(t);
      } catch (e) {
        setAuthError(e.message);
      }
    })();
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.name}>Shreya Vipulbhai Patel</h1>
          <p style={styles.subtitle}>Creddit Favourites App</p>
        </div>
      </header>

      {authError && <p style={{ color: "crimson" }}>{authError}</p>}
      {!token && !authError && <p>Signing in...</p>}

      {token && <Home token={token} />}
    </div>
  );
}

function Home({ token }) {
  const [forums, setForums] = useState([]);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const f = await getForums(token);
        setForums(f);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [token]);

  const loadPosts = async () => {
    if (!slug) return;
    try {
      setError("");
      const p = await getForumPosts(token, slug, 10);
      setPosts(p);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Select a forum</h3>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <select value={slug} onChange={(e) => setSlug(e.target.value)}>
        <option value="">-- choose forum --</option>
        {forums.map((f) => {
          const s = f.slug || f.name;
          return (
            <option key={s} value={s}>
              {s}
            </option>
          );
        })}
      </select>

     <button onClick={loadPosts} style={styles.button}>
        Load top 10 posts
      </button>

      {slug && <p style={{ marginTop: 10 }}>Selected: {slug}</p>}

      <div style={{ marginTop: 20 }}>
        {posts.map((p) => (
          <div key={p.id} style={styles.card}>
            <h4 style={{ marginTop: 0 }}>{p.title}</h4>
            <p>{p.content}</p>
            <p style={styles.meta}>
              <b>Author:</b> {p.author} | <b>Likes:</b> {p.totalLikes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6fb",
    fontFamily: "Segoe UI, Arial, sans-serif",
    padding: 20,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    padding: "20px 25px",
    borderRadius: 12,
    background: "#28282e",
    color: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },
  name: { margin: 0, fontSize: 22, fontWeight: 600 },
  subtitle: { margin: 0, fontSize: 14, opacity: 0.9 },
};