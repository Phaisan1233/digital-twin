import React, { useEffect, useState } from "react";
import GridLayout from 'react-grid-layout';
import { Container, Grid, Divider, Header, Icon } from 'semantic-ui-react';
import Box from '@material-ui/core/Box';
import Home from "./home";
// import './home.css';
import './hometest.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Deployment from "./deployment"; 
import Bulb from "react-bulb";
import Switch from "react-switch";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket;

//Make the DIV element draggagle:
// dragElement(document.getElementById("leftColumn-Container"));

// function dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   if (document.getElementById(elmnt.id + "header")) {
//     /* if present, the header is where you move the DIV from:*/
//     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//   } else {
//     /* otherwise, move the DIV from anywhere inside the DIV:*/
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//   }

//   function closeDragElement() {
//     /* stop moving when mouse button is released:*/
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }

export default function RecursiveTreeView() {

	useEffect(() => {

	}, []);

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
		<div className="grid-container">

			<div className="titleContainer">
				<h2>TITLE GOES HERE</h2>
			</div>

			<div className="navContainer">
				<Tabs variant="tabs" defaultActiveKey="/home">
					{/* <Tab href={Home} label="HOME" /> */}
					<Tab href="/" label="HOME" />
					<Tab label="Deployment" href="/deployment" />
				</Tabs>
			</div>

			<div className="leftColumn-Container" id="leftColumn-Container">
				<h2>Left side</h2>

				<div id="bulb-drag">
					<Bulb size={30} color={checked ? "green" : "red"} />
				</div>

				<p></p>

				<div id="switch-drag">
					<p> {data}</p>
					<Switch onChange={handleChange} checked={checked1} />
				</div>

			</div>

			<div className="middleColumn-Container">
				<h2>middle section</h2> 
			</div>

			{/* <div className="rightColumn-Container">
				<h2>right side</h2>
			</div> */}


		</div>
		
	
	);
}
