import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import Bulb from "react-bulb";
import Switch from "react-switch";
import "./home.css";
import FolderTree from "./folderTree";

const ENDPOINT = "http://localhost:5000";
let socket;

export default function Home() {
  const [checked, setChecked] = useState(Boolean);
  const [checked1, setChecked1] = useState(Boolean);
  const [data, setData] = useState("");

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);

    socket.on("message", (data) => {
      console.log(data);
      setChecked(data.value);

      setChecked1(data.value);
      setData("node id : " + data.nodeId);
    });
  }, []);

  const handleChange = (event) => {
    console.log(checked1);
    socket.emit("getData", {
      value: checked,
    });
    setChecked1(!checked1);
  };

  return (
    <div>
      <div className="title-box">
        <div id="title">
          <h1>TITLE GOES HERE</h1>
        </div>
      </div>
      <div className="body-box">
        <Bulb size={30} color={checked ? "green" : "red"} />
      </div>
      <p></p>
      <div>
        <p> {data}</p>
        <Switch onChange={handleChange} checked={checked1} />
      </div>
      <FolderTree></FolderTree>
    </div>
  );
}
