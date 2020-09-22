import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/home";
import FolderTree from "./components/folderTree";

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={Home} />
        {/* <Route path="/test" exact component={FolderTree} /> */}
      </div>
    </Router>
  );
}

export default App;
