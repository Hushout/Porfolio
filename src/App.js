import React from "react";
import "./App.css";
import { HeaderContent } from "./app/components/HeaderContent/HeaderContent";
import { Navbar } from "./app/components/Navbar/Navbar";
import Signature from "./app/components/Signature/Signature";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="topHeader">
          <Signature />
          <Navbar />
        </div>
        <HeaderContent />
      </header>
      <body className="App-body"></body>
      <footer className="App-footer"></footer>
    </div>
  );
}

export default App;
