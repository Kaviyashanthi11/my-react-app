import React from "react";
import Sidenav from "../components/Sidenav";
import Menubar from "../components/Menubar";
import AccordingDas from "../components/AccordingDas";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
//import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import "../Das.css";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
function Home() {
  return (
    <>
      <div className="bgcolor">
        <Menubar />
        <Box height={50} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Stack spacing={2} direction="row">
                  <Card
                    sx={{ minWidth: 49 + "%", height: 150 }}
                    className="gradient"
                  >
                    <CardContent>
                      <div className="iconstyle">
                        <CreditCardIcon />
                      </div>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "whitesmoke" }}
                      >
                        $500
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        component="div"
                        sx={{ color: "#ccd1d1" }}
                      >
                        Total Earnings
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card
                    sx={{ minWidth: 49 + "%", height: 150 }}
                    className="gradientlight"
                  >
                    <CardContent>
                      <div className="iconstyle">
                        <CreditCardIcon />
                      </div>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "whitesmoke" }}
                      >
                        $400
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        component="div"
                        sx={{ color: "#ccd1d1" }}
                      >
                        Total Orders
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={2}>
                  <Card sx={{ maxWidth: 345 }} className="gradientlight">
                    <Stack spacing={2} direction="row">
                      <div className="iconstyle">
                        <MonetizationOnIcon />
                      </div>

                      <div className="paddingall">
                        <span className="pricetitle">$253k</span>
                        <br />
                        <span className="pricesubtitle">Total Income</span>
                      </div>
                    </Stack>
                  </Card>
                  <Card sx={{ maxWidth: 345 }} className="gradient1">
                    <Stack spacing={2} direction="row">
                      <div className="iconstyle">
                        <MonetizationOnIcon />
                      </div>
                      <div className="paddingall">
                        <span className="pricetitle">$500k</span>
                        <br />
                        <span className="pricesubtitle">Total Income</span>
                      </div>
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
            <Box height={30} />
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Card sx={{ height: 60 + "vh" }}>
                  <CardContent></CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ height: 60 + "vh" }}>
                  <CardContent>
                    <AccordingDas />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </>
  );
}

export default Home;
