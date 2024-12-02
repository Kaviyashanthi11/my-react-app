import React from "react";
import Sidenav from "../../components/Sidenav";
import Menubar from "../../components/Menubar";
import { Box } from "@mui/material";
function About() {
  return (
    <>
      <Menubar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />

        <h1>Create-react-app</h1>
      </Box>
    </>
  );
}

export default About;
