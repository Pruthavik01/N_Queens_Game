import React from "react";
import Header from "./Header";
import Grid from "./Grid";
import InfoCards from "./InfoCards";
import Footer from "./Footer";
import "../index.css";
import infoIcon from "../assets/info.png"; // Import the info icon

export default function App() {
  const generateNumber = () => {
    //number between 4 and 10
    return Math.floor(Math.random() * 7) + 4;
  }
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="content-wrapper" style={{ position: "relative" }}>
          <img
            src={infoIcon}
            alt="Info"
            className="info-icon"
            style={{
              position: "absolute",
              top: "1px",
              left: "1px",
              width: "25px",
              height: "25px",
              zIndex: 2,
            }}
            onClick={}
          />
          <Grid n={generateNumber()} />  
          <InfoCards />
        </div>
      </main>
      <Footer />
    </div>
  );
}

