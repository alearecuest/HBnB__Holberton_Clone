import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <nav style={{textAlign:'center', margin: 12}}>
        <button onClick={()=>setShowLogin(true)}>Login</button>
        <button onClick={()=>setShowLogin(false)}>Registrarse</button>
      </nav>
      {showLogin ? <Login /> : <Register />}
    </>
  );
}

export default App;