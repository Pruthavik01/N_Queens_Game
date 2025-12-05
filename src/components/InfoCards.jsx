import React from "react";
import "./InfoCards.css";

export default function InfoCards() {
  return (
    <div className="info-cards-container">
      <div className="info-card">
        <div className="card-header">
          <h3 className="card-title">About N Queens</h3>
        </div>
        <div className="card-body">
          <p className="card-text">
            The N Queens puzzle is a classic chess problem where you must place
            N queens on an N×N chessboard so that no two queens can attack each
            other.
          </p>
        </div>
      </div>

      <div className="info-card">
        <div className="card-header">
          <h3 className="card-title">How to Play</h3>
        </div>
        <div className="card-body">
          <ul className="card-list">
            <li>Click on empty squares to place a queen</li>
            <li>Queens attack horizontally, vertically, and diagonally</li>
            <li>Try to place all queens without conflicts</li>
          </ul>
        </div>
      </div>

      <div className="info-card">
        <div className="card-header">
          <h3 className="card-title">Rules</h3>
        </div>
        <div className="card-body">
          <ul className="card-list">
            <li>No two queens in the same row</li>
            <li>No two queens in the same column</li>
            <li>No two queens on the same diagonal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

