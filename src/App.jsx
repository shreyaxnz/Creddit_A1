import { useEffect, useState } from "react";
import { login } from "./api";
import { getForums } from "./api";
import { getForumPosts } from "./api";
import { getPostById } from "./api";

export default function App() {
  const [token, setToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [view, setView] = useState("home"); 

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

        <div>
          <button
            style={styles.navBtn}
            onClick={() => setView("home")}
          >
            Home
          </button>

          <button
            style={styles.navBtn}
            onClick={() => setView("favs")}
          >
            Favourites
          </button>
        </div>
      </header>

      {authError && <p style={{ color: "crimson" }}>{authError}</p>}
      {!token && !authError && <p>Signing in...</p>}

      {token && view === "home" && <Home token={token} />}
      {token && view === "favs" && <Favs token={token} />}
    </div>
  );
}

function Home({ token }) {
  const [forums, setForums] = useState([]);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [favVersion, setFavVersion] = useState(0);

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
    <div key={favVersion} style={{ marginTop: 20 }}>
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
            <button
              onClick={() => {
                addFavId(p.id);
                setFavVersion((v) => v + 1);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {isFavId(p.id) ? "★ Favourited" : "☆ Add to favourites"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Favs({ token }) {
  const [ids, setIds] = useState(loadFavIds());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIds(loadFavIds());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setError("");
        setLoading(true);

        const favIds = loadFavIds();
        setIds(favIds);

        if (favIds.length === 0) {
          setPosts([]);
          return;
        }

        const results = await Promise.all(favIds.map((id) => getPostById(token, id)));
        setPosts(results);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, ids.length]);

  const remove = (id) => {
    removeFavId(id);
    const newIds = loadFavIds();
    setIds(newIds);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Your Favourites</h3>
      <p>Total favourites: {ids.length}</p>

      {loading && <p>Loading favourites...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {ids.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <div style={{ marginTop: 12 }}>
          {posts.map((p) => (
            <div key={p.id} style={styles.card}>
              <h4 style={{ marginTop: 0 }}>{p.title}</h4>
              <p>{p.content}</p>
              <p style={styles.meta}>
                <b>Author:</b> {p.author} | <b>Likes:</b> {p.totalLikes}
              </p>

              <button onClick={() => remove(p.id)} style={styles.removeBtn}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
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
  name: { 
    margin: 0, 
    fontSize: 22, 
    fontWeight: 600 
  },
  subtitle: { 
    margin: 0, 
    fontSize: 14, 
    opacity: 0.9 
  },
  navBtn: {
    marginLeft: 10,
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
  },
  card: {
    background: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  meta: { opacity: 0.8 },
  removeBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#ffe4e6",
    fontWeight: 600,
  },
};

const FAV_KEY = "creddit_favs";

function loadFavIds() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveFavIds(ids) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

function addFavId(id) {
  const ids = loadFavIds();
  if (!ids.includes(id)) {
    ids.push(id);
    saveFavIds(ids);
  }
  return ids;
}

function removeFavId(id) {
  const ids = loadFavIds().filter((x) => x !== id);
  saveFavIds(ids);
  return ids;
}

function isFavId(id) {
  return loadFavIds().includes(id);
}