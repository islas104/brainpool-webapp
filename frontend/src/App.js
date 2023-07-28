import React from "react";
import ImageUploader from "./components/ImageUploader";
import "./App.css";

const App = () => (
  <div className="App">
    <header>
      <h1>Fast Neural Style Transfer Web App</h1>
      <ImageUploader />
    </header>
  </div>
);

export default App;
