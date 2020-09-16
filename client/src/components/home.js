import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import Bulb from "react-bulb";
import Switch from "react-switch";
import "./home.css";

const ENDPOINT = "http://localhost:3700";

export default function ClientComponent() {
  const [checked, setChecked] = useState(Boolean);
  const [checked1, setChecked1] = useState(Boolean);
  const [data, setData] = useState("");
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setChecked(data.value);
      setData("node id : " + data.nodeId);
    });
  }, [socket]);

  const handleChange = (event) => {
    console.log(checked);
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
    </div>
  );
}
