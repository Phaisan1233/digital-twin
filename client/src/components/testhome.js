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

export default function RecursiveTreeView() {

	useEffect(() => {

	}, []);



	return (
		<div className="grid-container">

			<div className="nav">

				<div className="titleContainer">
					<h2>TITLE GOES HERE</h2>
				</div>

				<div className="navContainer">
					<Tabs variant="tabs" defaultActiveKey="/home">
						<Tab href={Home} label="HOME" />
						<Tab label="Deployment" href={Deployment} />
					</Tabs>
				</div>

			</div>
			
			<div className="leftColumn-Container">
				<h2>Left side</h2>
			</div>

			<div className="middleColumn-Container">
				<h2>Middle section</h2> 
			</div>

			<div className="rightColumn-Container">
				<h2>Right side</h2>
			</div>

		</div>
		

	
	);
}
