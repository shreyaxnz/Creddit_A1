import { useEffect, useState } from "react";
import { login } from "./api";

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

      {token && <p>Signed in ✅</p>}
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