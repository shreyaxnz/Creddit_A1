import { useEffect, useState } from "react";
import { login } from "./api";
import { getForums } from "./api";
import { getForumPosts } from "./api";

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
      {token && view === "favs" && <Favs />}
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
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Favs() {
  const [ids, setIds] = useState(loadFavIds());

  const refresh = () => setIds(loadFavIds());

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Your Favourites</h3>
      <p>Total favourites: {ids.length}</p>

      <button onClick={refresh} style={{ marginBottom: 10 }}>
        Refresh
      </button>

      {ids.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <ul>
          {ids.map((id) => (
            <li key={id} style={{ marginBottom: 6 }}>
              {id}{" "}
              <button
                onClick={() => {
                  removeFavId(id);
                  setIds(loadFavIds());
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
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