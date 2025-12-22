import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 16, margin: 16 }}>
      <img src={logo} alt="Logo HBnB" width={40} />
      <h1 style={{margin:0}}>HBnB</h1>
      <div style={{ marginLeft: "auto" }}>
        {token ? (
          <>
            <span style={{marginRight: 10}}>¡Bienvenido usuario!</span>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <span>Por favor inicia sesión</span>
        )}
      </div>
    </nav>
  );
}