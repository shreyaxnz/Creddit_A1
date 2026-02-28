export default function App() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.name}>Shreya Vipulbhai Patel</h1>
          <p style={styles.subtitle}>Creddit Favourites App</p>
        </div>
      </header>

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
    fontWeight: 600,
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    marginTop: 30,
    fontSize: 16,
  },
};