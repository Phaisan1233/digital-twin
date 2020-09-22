import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Card from "@material-ui/core/Card";

const ENDPOINT = "http://localhost:5000";
let socket;

const data1 = {
  id: "root",
  name: "Parent",
  children: [
    {
      id: "1",
      name: "Child - 1",
    },
    {
      id: "3",
      name: "Child - 3",
      children: [
        {
          id: "4",
          name: "Child - 4",
        },
      ],
    },
  ],
};

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function RecursiveTreeView() {
  const classes = useStyles();
  const [data, setData] = useState({});
  const [nodeID, setNodeID] = useState("");

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);

    socket.on("roofFolder", (messages) => {
      console.log(messages);
      console.log(data1);
      setData(messages);
    });

    // socket.on("message", (message) => {
    //   setMessages((messages) => [...messages, message]);
    // });

    // socket.on("roomData", ({ users }) => {
    //   setUsers(users);
    // });
    return;
  }, []);

  const handleSelect = (event, nodeIds) => {
    event.preventDefault();
    console.log(nodeIds);
    setNodeID(nodeIds);
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <div>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["RootFolder"]}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeSelect={handleSelect}
        multiSelect={false}>
        {renderTree(data)}
      </TreeView>
      <p>{nodeID}</p>
    </div>
  );
}
