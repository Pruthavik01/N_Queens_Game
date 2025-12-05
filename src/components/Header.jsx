import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">♛</span>
          <h1 className="logo-text">N Queens Puzzle</h1>
        </div>
        <p className="header-subtitle">
          Place queens on the board so that no two queens attack each other
        </p>
      </div>
    </header>
  );
}

