import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import Bulb from "react-bulb";
import Switch from "react-switch";
import "./home.css";
import FolderTree from "./folderTree";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Home from "./home";

const ENDPOINT = "http://localhost:5000";
let socket;

export default function Deployment() {
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
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={3}>
            <Box bgcolor="lightblue" color="black" fontWeight="bold" fontSize="auto" >
              TITLE GOES HERE
            </Box>
          </Grid> 
          
          <Box bgcolor="lightblue" >
            <Grid item xs>
            <Tabs variant="tabs" defaultActiveKey="/home">
                  <Tab href={Home} label="Home" />
                  <Tab label="Deployment" href={Deployment} />
              </Tabs>
            </Grid>
          </Box>

          <Grid item xs={3}>
            <FolderTree ></FolderTree>
          </Grid>

          <Grid item xs>
            
          </Grid>
          
        </Grid>
        
      </React.Fragment>

    </div>
  );
}
