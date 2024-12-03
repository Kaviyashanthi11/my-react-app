import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  
  Snackbar,
  Typography,
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  makeStyles,
  DialogActions,  
  IconButton,
} from "@material-ui/core";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useAuth } from './Top/UserContext';
import logoImage from "../src/images/favicon (1).webp"
import CommonAuthLayout from "../src/component/maintain/FrontLogREgForgot/CommonAuthLayout";
import ImageSecure from "../src/component/Session/CheckSecurity/CheckSecurityImage";
import SecurityQuestion from "../src/component/Session/CheckSecurity/CheckSecurityQuestion";
import CustomLoginTextField from "../src/maintain/LoginTextfield";
import { useLocation } from "react-router-dom";
import AgreementText from '../src/component/Session/AgreementText ';
import CheckImageQuestionSecure from "../src/component/Session/CheckSecurity/CheckSecurityImage";
import CheckSecurityQuestionLogin from "../src/component/Session/CheckSecurity/CheckSecurityQuestionLogin";
import SnackbarContent from '@mui/material/SnackbarContent';
import clsx from 'clsx';
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  dialogContent: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  radioGroup: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: theme.spacing(2),
  },
  dialogActions: {
    justifyContent: "center",
    flexDirection: "column",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(1),
  },
 
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: "dark",
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  radio: {
    color: "#212121",
    '&.Mui-checked': {
      color: "#039be5",
    },
  },
}));

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentDialog, setCurrentDialog] = useState(null); 
  const [selectedValue, setSelectedValue] = useState("");
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [securityAnswers, setSecurityAnswers] = useState({
    securityQuestion1: "",
    securityQuestion1Answer: "",
    securityQuestion2: "",
    securityQuestion2Answer: "",
    securityQuestion3: "",
    securityQuestion3Answer: "",
  }); 
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
fetch(`${API_BASE_URL}/api/react-view`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("API call failed:", error));

  const [iUserId, setIUserId] = useState(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const { loginUser } = useAuth();
    const navigate = useNavigate();
  const classes = useStyles();  
  const location = useLocation();
  const [snackbarColor, setSnackbarColor] = useState('info'); 

  const [isUsernameDisabled, setIsUsernameDisabled] = useState(false);
  useEffect(() => {
    if (location.state && location.state.userName) {
      setUsername(location.state.userName);
      setUsernameChecked(true);
    }
  }, [location.state]);

  
  const handleArrowClick = async () => {
    try {
      if (username.trim() === "") {
        setSnackbarMessage("Please enter a username");
        setSnackbarOpen(true);
        return;
      }
  
      setIsLoading(true);
  
      // Attempt to login and retrieve user data
      const response = await fetch(`${API_BASE_URL}/React/web/index.php?r=api/login-api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sUserName: username }),
      });
  
      const data = await response.json();
      console.log("Username check response:", data);
  
      if (data.error) {
        setSnackbarMessage(data.error);
        setSnackbarColor('error');
        setSnackbarOpen(true);
        setUsernameChecked(false);
      } else {
        // Successful login
        if (data.bIsFirstLogin === true) {
          setCurrentDialog("agreement");
        } else if (data.bIsMultiAuthEnabled === true) {
          if (data.isPreviousImageCorrect === false) {
                  
            setCurrentDialog("multiQuestion");
          } else if (data.isPreviousImageCorrect === true) {
            setCurrentDialog("multiImage");
          }
        } else {
          setUsernameChecked(true);
          setCurrentDialog(null);
          setIsUsernameDisabled(true);
        }
  
        setIUserId(data.iUserId); 
      }
    } catch (error) {
      setSnackbarMessage("Error checking username: " + error.message);
      setSnackbarColor('error');
      setSnackbarOpen(true);
      console.error("Error checking username:", error);
    } finally {
      setIsLoading(false);
    }
  };
     
  const handleNextAfterImageSecure = async (selectedImage) => {
    setSelectedImage(selectedImage);
  
    try {
      const response = await fetch("/React/web/index.php?r=api/login-first", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sUserName: username }), 
      });
  
      const data = await response.json();
      console.log("Login first response:", data);
  
      if (
        data.securityQuestion1 === null ||
        data.securityQuestion2 === null ||
        data.securityQuestion3 === null
      ) {
        setCurrentDialog("securityQuestion");
      } else {
        setCurrentDialog("submitDialog");
      }
    } catch (error) {
      console.error("Error checking security questions:", error);
      setSnackbarMessage("Error checking security questions: " + error.message);
      setSnackbarColor('error');
      setSnackbarOpen(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");
  
    try {
      const response = await fetch("/React/web/index.php?r=api/login-first-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          sUserName: username, 
          sUserPassword: password 
        }),
      });
  
      const data = await response.json();
      if (response.data) {
        loginUser({
          // What properties are you setting here?
          userName: response.data.userName,
          // other properties...
        });
      }
      console.log("Login response:", data);
  
      if (data.error) {
        setSnackbarMessage(data.error);
        setSnackbarColor('error');
        setSnackbarOpen(true);
        return;
      }
  
      // Extract data from response
      const { iUserId, sUserName, bIsUserFirstLogin, isPasswordExpired, iUserRole, User } = data;  
      if (bIsUserFirstLogin) {
        navigate("/newPassword", {
          state: { userId: iUserId, userName: sUserName }
        });
      } else if (isPasswordExpired) {
        navigate("/resetlogin", {
          state: { userId: iUserId, userName: sUserName }
        });
      }else {
        let redirectRoute = "";
        switch (iUserRole) {
          case 1:
            redirectRoute = "/client";
            break;
          case 4:
            redirectRoute = "/dashboard";
            break;
          case 2:
            redirectRoute = "/admin/user-management";
            break;
          default:
            redirectRoute = "/";
        }
  
        // Save user data to localStorage and call loginUser
        const userData = { id: iUserId, name: sUserName, role: iUserRole, userask: User };
        localStorage.setItem("user", JSON.stringify(userData));
        loginUser(userData);
  
  
        // Navigate to appropriate route
        navigate(redirectRoute);
  
        setSnackbarMessage("Login successful");
        setSnackbarColor('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setPasswordError("Failed to log in");
      setSnackbarMessage("Failed to log in");
      setSnackbarColor('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleAgreementAccepted = () => {
    if (selectedValue === "accept") {
      setCurrentDialog("imageSecure");
      setAgreementAccepted(true);
    } else if (selectedValue === "decline") {
      navigate("/");
      handleCloseDialog(); 
    }
  };
    
 const handleSecurityQuestionSubmit = (answers) => {
    setSecurityAnswers(answers);
    setCurrentDialog("submitDialog");
  };

  const handleSubmitDialog = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const postData = {
        iUserId: iUserId.toString(),
        sUserName: username,
        isEulaAccepted: agreementAccepted,
        iImageSelected: selectedImage.toString(),
        securityQuestion1: securityAnswers.securityQuestion1.toString(),
        securityQuestion1Answer: securityAnswers.securityQuestion1Answer,
        securityQuestion2: securityAnswers.securityQuestion2.toString(),
        securityQuestion2Answer: securityAnswers.securityQuestion2Answer,
        securityQuestion3: securityAnswers.securityQuestion3.toString(),
        securityQuestion3Answer: securityAnswers.securityQuestion3Answer,
      };
      
      const response = await fetch(
        "/React/web/index.php?r=api/login-security",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );
  
      const data = await response.json();
      console.log("Submit dialog response:", data);
  
      if (data.status) {
        // Show success message or handle success scenario
        setSnackbarMessage(data.message || "Data saved successfully");
        setSnackbarColor('success');
        setSnackbarOpen(true);
      } else {
        // Show error message or handle error scenario
        setSnackbarMessage(data.message || "Failed to save data");
        setSnackbarColor('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error submitting login form:", error);
      setSnackbarMessage("Error submitting login form: " + error.message);
      setSnackbarColor('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false); // Hide loading backdrop
      setCurrentDialog(null);
    }
  };
  
  const handleCloseDialog = () => {
    setCurrentDialog(null);
    setSelectedValue("");
    setAgreementAccepted(false);
    setSelectedImage(null);
    setSecurityAnswers({
      securityQuestion1: "",
      securityQuestion1Answer: "",
      securityQuestion2: "",
      securityQuestion2Answer: "",
      securityQuestion3: "",
      securityQuestion3Answer: "",
    });
    setSubmitDialogOpen(false);
    setUsernameChecked(false);
  };
    
  const renderDialog = () => {
  switch (currentDialog) {
    case "agreement":
      return (
        <Dialog
          open={true}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          style={{ top: "-170px" }}
        >
          <DialogTitle>End User Agreement</DialogTitle>
          <DialogContent className={classes.dialogContent}>
              <AgreementText />
          </DialogContent>

          <DialogActions className={classes.dialogActions}>
          <RadioGroup
           className={classes.radioGroup}
           name="agreement"
            value={selectedValue}
             onChange={(e) => setSelectedValue(e.target.value)}
            >
          <FormControlLabel value="accept" control={<Radio className={classes.radio} />} label="Accept" />
          <FormControlLabel value="decline" control={<Radio className={classes.radio} />} label="Decline" />
        </RadioGroup>

            <Box className={classes.buttonGroup}>
              <Button
                onClick={handleAgreementAccepted}
                color="primary"
                variant="contained"
                disabled={!selectedValue}
                style={{
                  backgroundColor: selectedValue ? "#4fc3f7" : "#9e9e9e",
                  color: selectedValue ? "#212121" : "#424242",
                }}
                >
                Submit
              </Button>
              <Button
                onClick={handleCloseDialog}
                color="default"
                variant="contained"
                style={{ marginLeft: "10px",backgroundColor:"#212121",color:"#fafafa" }}
              >
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      );
    case "imageSecure":
      return <ImageSecure onNext={handleNextAfterImageSecure} onClose={handleCloseDialog}/>;
    case "securityQuestion":
      return <SecurityQuestion onSubmit={handleSecurityQuestionSubmit} onClose={handleCloseDialog} />;
    case "submitDialog":
      return (
        <Dialog
          open={true}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          style={{ top: "-170px" }} 
        >
          <DialogTitle>Submit Confirmation</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure want to submitted?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="default"
              variant="contained"
              style={{ marginLeft: "10px",backgroundColor:"#212121",color:"#fafafa" }}
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => { setSubmitDialogOpen(false); handleSubmitDialog(e); }}
              color="primary"
              variant="contained"
              style={{
                backgroundColor: "#4fc3f7",
                color: "#212121",
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      );
    case "multiImage":
        return <CheckImageQuestionSecure onClose={handleCloseDialog} iUserId={iUserId} setUsernameChecked={setUsernameChecked} />;
    case "multiQuestion":
        return <CheckSecurityQuestionLogin onClose={handleCloseDialog} iUserId={iUserId} />;
      default:
        return null;
  }
};

  return (
    <>
    <form autoComplete="on">
      <CustomLoginTextField
        type="text"
        label="Username"
        name="username"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        disabled={isUsernameDisabled}       
      />
      {!usernameChecked && (
        <div style={{ position: "absolute", top: "calc(74% - 11px)", right: 12, zIndex: 1, display: "flex" }}>
        <IconButton
          onClick={handleArrowClick}
          style={{ padding: 0, minWidth: "auto" }}
        >
          <ArrowCircleRightIcon style={{ color: "#4dd0e1", fontSize: "2rem" }} />
        </IconButton>

      </div>
      )}

      {usernameChecked && (
        <>
          <CustomLoginTextField
            type="password"
            label="Password"
            name="Password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="small"
            fullWidth
            style={{backgroundColor:"#4fc3f7"}}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </>
      )}  
      <Typography
        variant="body2"
        style={{
          position: "absolute",
          bottom: 20,
          right: 15,
          fontSize: "0.8rem",
          color: "#2196f3",
        }}
      >
        <Link
          to="/forgotPassword"
          style={{
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          Forgot Password?
        </Link>
      </Typography>
      <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <SnackbarContent
    className={clsx(classes[snackbarColor])}
    message={
      <span id="client-snackbar" className={classes.message}>
        {snackbarMessage}
      </span>
    }
  />
  </Snackbar>
      <Backdrop open={isLoading} style={{ zIndex: 1 }}>
        <img
          src={logoImage}
          alt="Logo"
          style={{ width: "30px", height: "auto" }}
        />
      </Backdrop>

      {renderDialog()}
      </form>
    </>
  );
};

export default CommonAuthLayout(Login);