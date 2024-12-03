import React from "react";
import Sidenav from "../components/Sidenav";
import Menubar from "../components/Menubar";
import { Box } from "@mui/material";
function Settings() {
  return (
    <>
      <Menubar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />

        <h1>Settings</h1>
      </Box>
    </>
  );
}

export default Settings;
