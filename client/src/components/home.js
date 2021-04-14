import React, { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
import Bulb from "react-bulb";
import Switch from "react-switch";
import "./home.css";
import FolderTree from "./folderTree";
import Box from '@material-ui/core/Box';
// import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Deployment from "./deployment";

import GridLayout from 'react-grid-layout'; 

import { Container, Grid, Divider, Header, Icon } from 'semantic-ui-react'; 

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
      <React.Fragment>
        {/* <Grid container spacing={1} alignItems="center"> */}
        {/* <Grid> */}
          <Grid relaxed>
            <Grid.Row>
              
              <Grid.Column width={4} floated='left'>
                <Box bgcolor="darkblue" color="white" fontWeight="bold" fontSize="auto" >
                  <h1>TITLE GOES HERE</h1>
                </Box>
              </Grid.Column>

              <Grid.Column width={12} floated='right'>
                <Box bgcolor="lightblue" >
                    <Tabs variant="tabs" defaultActiveKey="/home">
                        <Tab href={Home} label="HOME" />
                        <Tab label="Deployment" href={Deployment} />
                    </Tabs>
                </Box>
              </Grid.Column>

            </Grid.Row>
            
            <Grid.Row>

              <Grid.Column>
                <FolderTree ></FolderTree>
              </Grid.Column>

            </Grid.Row>

            <Grid.Row>

              <Grid.Column>
                <Box bgcolor="lightblue" color="black">
                  <Bulb size={30} color={checked ? "green" : "red"} />
                  <p></p>
                  <div>
                    <p> {data}</p>
                    <Switch onChange={handleChange} checked={checked1} />
                  </div>
                </Box>
              </Grid.Column>

            </Grid.Row>
              
            
          </Grid> 
          
          

          {/* <Grid item xs={3}>
            <FolderTree ></FolderTree>
          </Grid> */}

          {/* <Grid item xs>
            <Box bgcolor="lightblue" color="black">
              <Bulb size={30} color={checked ? "green" : "red"} />
              <p></p>
              <div>
                <p> {data}</p>
                <Switch onChange={handleChange} checked={checked1} />
              </div>
            </Box>
          </Grid> */}
          
        {/* </Grid> */}
        
      </React.Fragment>

    </div>
  );
}
