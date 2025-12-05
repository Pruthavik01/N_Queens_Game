import React from "react";
import Header from "./Header";
import Grid from "./Grid";
import InfoCards from "./InfoCards";
import Footer from "./Footer";
import "../index.css";

export default function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <InfoCards />
          <Grid n={8} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

