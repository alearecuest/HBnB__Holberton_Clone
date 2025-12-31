import { useAuth } from "../context/AuthContext";
import logo from "/logo.png";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 24, margin: 24 }}>
      <img src={logo} alt="HBnB logo" width={120} height={40} style={{ marginRight: 20, marginLeft: 4 }} />
      {/* <h1 style={{margin:0, letterSpacing:"-1px"}}>HBnB</h1> */}
      <div style={{ marginLeft: "auto" }}>
        {token ? (
          <>
            <span style={{marginRight: 12}}>Hello, {user?.firstName || user?.email}!</span>
            <button onClick={logout}>Sign out</button>
          </>
        ) : (
          <span>Please sign in</span>
        )}
      </div>
    </nav>
  );
}