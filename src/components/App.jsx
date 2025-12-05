import React from "react";
import Header from "./Header";
import Grid from "./Grid";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "../index.css";

export default function App() {
  const generateNumber = () => {
    //number between 4 and 10
    return Math.floor(Math.random() * 7) + 4;
  }
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <Grid n={generateNumber()} />  
        </div>
      </main>
      <Sidebar />
      <Footer />
    </div>
  );
}

