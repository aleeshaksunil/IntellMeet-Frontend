function Navbar({ user }) {
  return (
    <nav
      style={{
        background: "#4f46e5",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,.2)"
      }}
    >
      <h2 style={{ margin: 0 }}>
        IntellMeet
      </h2>

      <div>
        Welcome, <b>{user}</b>
      </div>
    </nav>
  );
}

export default Navbar;