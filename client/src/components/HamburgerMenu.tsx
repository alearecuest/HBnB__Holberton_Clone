import React from "react";
import { slide as Menu } from "react-burger-menu";
import "./HamburgerMenu.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNav: (page: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  user?: { firstName?: string; email?: string };
}

export default function HamburgerMenu({
  isOpen,
  onClose,
  onNav,
  isLoggedIn,
  onLogin,
  onRegister,
  onLogout,
  user,
}: Props) {
  return (
    <Menu right isOpen={isOpen} onClose={onClose}>
      <div style={{ marginBottom: 16 }}>
        <img src="/logo.png" alt="HBnB logo" style={{ width: 110, marginBottom: 16 }} />
      </div>
      <a className="menu-item" onClick={() => { onNav("places"); onClose(); }}>
        Places
      </a>
      {isLoggedIn ? (
        <>
          <a className="menu-item" onClick={() => { onNav("create"); onClose(); }}>
            Create Place
          </a>
          <a className="menu-item" style={{ fontWeight: 800, pointerEvents: 'none', color: '#5279c8' }}>
            {user?.firstName || user?.email}
          </a>
          <a className="menu-item" onClick={() => { onLogout(); onClose(); }}>
            Sign out
          </a>
        </>
      ) : (
        <>
          <a className="menu-item" onClick={() => { onLogin(); onClose(); }}>
            Login
          </a>
          <a className="menu-item" onClick={() => { onRegister(); onClose(); }}>
            Register
          </a>
        </>
      )}
    </Menu>
  );
}