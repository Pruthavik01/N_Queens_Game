import React from "react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          © {currentYear} N Queens Puzzle Game. Built with React & Vite.
        </p>
        <p className="footer-subtext">
          Challenge yourself with this classic chess puzzle!
        </p>
      </div>
    </footer>
  );
}

