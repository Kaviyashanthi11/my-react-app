import React, { useEffect, useState, useRef } from "react";
import { Typography, Button, Grid, FormControlLabel, Checkbox } from "@mui/material";
import TopBar from "./component/layout/Navbar/TopbarNavigation/TopBar";
import Footer from './Footer';
import { AppBar as MuiAppBar, Toolbar, IconButton } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import CustomSelect from "./maintain/CustomSelect";
import { useAuth } from "./Top/UserContext";
import { useNavigate } from "react-router-dom";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#D3D3D3",
  height: "25px",
}));

const PracticeBilling = ({ selectedMenuItem, onDrawerToggle }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [practiceOptions, setPracticeOptions] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState(''); // Initially empty
  const [displayValue, setDisplayValue] = useState(''); // Initially empty
  const practiceRef = useRef(null);
  const [formData, setFormData] = useState({ ipractice: "" });
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Load user data from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id && parsedUser.role) {
        setUser(parsedUser);
      } else {
        console.error("Invalid user data in session storage:", parsedUser);
      }
    }
  }, [setUser]);

  // Fetch practice list when the user is loaded
  useEffect(() => {
    if (user?.id && user?.role) {
      fetch("/React/web/index.php?r=report/practice-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iUserId: user.id, iUserRole: user.role }),
      })
        .then((response) => response.json())
        .then((data) => {
          const options = [
            { label: "--select--", value: "" }, // Placeholder option
            ...data.map((practice) => ({
              label: practice.PracticeName,
              value: practice.PracticeId.toString(),
              practiceCode: practice.PracticeCode,
            })),
          ];
          setPracticeOptions(options);
          setSelectedPractice(""); // Start with no practice selected
          setDisplayValue(""); // Start with no display value
        })
        .catch((error) => {
          console.error("Error fetching practice list:", error);
        });
    }
  }, [user]);

  const handlePracticeChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedPractice(selectedValue);
    sessionStorage.setItem('selectedPractice', selectedValue);
    // Find the selected option and set its label as displayValue
    const selectedOption = practiceOptions.find(option => option.value === selectedValue);
    setDisplayValue(selectedOption?.label || ""); // Update displayValue with the label
    setFormData((prevData) => ({ ...prevData, ipractice: selectedValue ,
      practiceName: selectedOption?.label || "",
    }));
  };
  console.log(formData)
  
  // Handle submit action
  const handleGo = () => {
    if (!user) {
      alert("User not found. Please log in again.");
      return;
    }

    if (!selectedPractice) {
      alert("Please select a practice.");
      return;
    }

    // Update the user's role and redirect accordingly
    const updatedUser = { ...user, role: 4 };
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));

    const userRole = updatedUser.role;
    let redirectRoute = "";

    switch (userRole) {
      case 1:
        redirectRoute = "/client";
        break;
      case 4:
        redirectRoute = "/dashboard";
        break;
      case 2:
        redirectRoute = "/usermanage";
        break;
      default:
        console.error("Invalid or undefined userRole:", userRole);
        alert("Invalid user role. Cannot proceed with the redirection.");
        return;
    }

    // Set display value (practice name) after submission
    const selectedOption = practiceOptions.find(option => option.value === selectedPractice);
    setDisplayValue(selectedOption?.label || "");

    // Save both selected practice ID and display name to sessionStorage
    sessionStorage.setItem('selectedPractice', JSON.stringify(selectedOption));
    navigate(redirectRoute);
  };

  return (
    <>

     <TopBar
     selectedPractice={displayValue} // Correctly pass the display value
     selectedPracticeCode={selectedPractice} // Pass the practice code
     iUserRole={user?.role}
   />
 

      <AppBar
        position="fixed"
        sx={{ marginTop: isMdUp ? "90px" : "81px", marginLeft: "100px" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={onDrawerToggle}
            edge="start"
            sx={{
              color: "black",
              marginBottom: isMdUp ? "40px" : "30px",
              marginLeft: isMdUp ? "5px" : "-10px"
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            sx={{
              color: "black",
              marginBottom: isMdUp ? "40px" : "30px",
              fontSize: "0.8rem",
            }}
          >
            {selectedMenuItem}
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{ paddingTop: isMdUp ? "100px" : "130px", paddingBottom: "70px" }}>
        <Typography style={{ fontSize: 'large', color: '#29B6F6', marginTop: isSmallScreen ? '1px' : '50px' }}>
          Client Switchover
        </Typography>
        <br />
        <Grid container spacing={2} alignItems="center" style={{ marginBottom: '22px' }}>
          <Grid item xs={12} sm={4} style={{ marginLeft: isSmallScreen ? '' : '400px',marginRight: isSmallScreen ? '12px' : '' }}>
            <CustomSelect
              label="Select a Practice"
              options={practiceOptions}
              value={selectedPractice} // Empty initially
              onChange={handlePracticeChange}
              displayValue={displayValue} // Doesn't update immediately
              star
              isMultiple={false}
              ref={practiceRef}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Checkbox style={{ marginLeft: '10px' }} />}
              label="Mark this client as default"
              sx={{ marginTop: isSmallScreen ? '-30px' : '-20px' }}
            />
          </Grid>
        </Grid>

        <Button
          onClick={handleGo}
          style={{
            marginLeft: isSmallScreen ? '150px' : '850px',
            height: '30px',
            fontSize: 'small',
            backgroundColor: '#00e5ff',
            color: 'black',
            marginTop: '10px'
          }}
        >
          Submit
        </Button>
      </div>
      <Footer />
    </>
  );
};

export default PracticeBilling;
