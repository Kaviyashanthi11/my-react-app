import React, { useState, useEffect, useRef } from "react";
import Layout from "../Top/Layout";
import { Form } from "react-bootstrap";
import CustomSelect from "../maintain/CustomSelect";
import {
  Button,
  Grid,
  Box,
  Typography,
  Backdrop,
  Tab,
  Tabs
} from "@mui/material";
import CustomDatePicker from "../maintain/DatePicker";
import CustomTable from "../maintain/second/CustomTable";
import { transactionType1 } from "../dropoption/PlanPermiumTrail";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../images/favicon.png";
import moment from "moment-timezone";
import { useAuth } from "../Top/UserContext";

const Batchwise = () => {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    transactiontype: ""
  });

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const activeRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [value, setValue] = React.useState(0);
  const { userRole } = useAuth();
  const selectedPractice = sessionStorage.getItem("selectedPractice");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const chicagoDateTime = moment()
        .tz("America/Chicago")
        .format("MM/DD/YYYY HH:mm:ss");
      setCurrentDateTime(chicagoDateTime);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectChange = (name, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleDateTimeChange = (name, newValue) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: newValue || ""
    }));
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleSubmit = async () => {
    if (!formData.fromDate) {
      alert("Please select From Date");
      return;
    }

    const currentDate = moment();
    const minFromDate = currentDate.clone().subtract(90, "days");
    const fromDate = moment(formData.fromDate, "MM/DD/YYYY");

    if (fromDate.isBefore(minFromDate, "day")) {
      alert(
        "From Date should not be greater than 90 days from the current date."
      );
      return;
    }
    if (!formData.toDate) {
      alert("Please select To Date");
      return;
    }
    if (!formData.transactiontype) {
      alert("Please select Transaction Type");
      return;
    }
    setOpen(true);

    const parsedPractice = selectedPractice
      ? JSON.parse(selectedPractice)
      : null;
    const practiceValue = parsedPractice ? parsedPractice.value : ""; // Use value (e.g., "380")

    const requestData = {
      FromDate: formatDate(formData.fromDate || ""),
      ToDate: formatDate(formData.toDate || ""),
      Transactiontype: formData.transactiontype,
      iUserRole: userRole,
      Practicename: practiceValue // Use the value from the parsed object
    };
    console.log(requestData);
    try {
      const response = await fetch(
        "/React/web/index.php?r=report/batch-wise-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        }
      );

      const result = await response.json();
      if (response.ok && Array.isArray(result)) {
        if (result.length === 0) {
          setData([]);
          setIsEditing(true);
        } else {
          const totals = result.reduce(
            (acc, item) => {
              acc.totalClaims += Number(item["#ofClaims"] || 0);
              acc.totalResponses += Number(item["#ofResponseReceived"] || 0);
              acc.totalSuspended += Number(item["#ofSuspended"] || 0);
              return acc;
            },
            { totalClaims: 0, totalResponses: 0, totalSuspended: 0 }
          );

          const dataWithTotals = [
            ...result.map((item, index) => ({ ...item, SNo: index + 1 })),
            {
              SNo: "Total",
              "#ofClaims": totals.totalClaims,
              "#ofResponseReceived": totals.totalResponses,
              "#ofSuspended": totals.totalSuspended
            }
          ];

          setData(dataWithTotals);
          alert("Record Generated Successfully");
          setIsEditing(true);
        }
      } else {
        setData([]);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setData([]);
      setIsEditing(true);
    } finally {
      setOpen(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fromDate: "",
      toDate: "",
      transactiontype: ""
    });
    setData([]);
    setIsEditing(false);
  };

  const columns = [
    { field: "SNo", headerName: "SNo", width: 100 },
    { field: "BatchID", headerName: "Batch ID", width: 250 },
    { field: "UploadedOn", headerName: "Uploaded On", width: 250 },
    {
      field: "TypeOfTransaction",
      headerName: "Type of Transaction",
      width: 270
    },
    { field: "#ofClaims", headerName: "# of Claims", width: 230 },
    {
      field: "#ofResponseReceived",
      headerName: "# of Response Received",
      width: 280
    },
    { field: "#ofSuspended", headerName: "# of Suspended", width: 220 }
  ];

  return (
    <Layout>
      <Form
        style={{
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
          marginRight: "1400px"
        }}
      >
        <Grid container spacing={2} style={{ boxSizing: "border-box" }}>
          <Grid item xs={12} sm={4} style={{ whiteSpace: "nowrap" }}>
            <CustomDatePicker
              label="From Date"
              name="fromDate"
              value={formData.fromDate}
              onChange={newValue => handleDateTimeChange("fromDate", newValue)}
              star
              ref={fromRef}
            />
          </Grid>

          <Grid item xs={12} sm={4} style={{ whiteSpace: "nowrap" }}>
            <CustomDatePicker
              label="To Date"
              name="toDate"
              value={formData.toDate}
              onChange={newValue => handleDateTimeChange("toDate", newValue)}
              star
              ref={toRef}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomSelect
              label="Transaction Type"
              name="transactiontype"
              value={formData.transactiontype || ""}
              onChange={e => handleSelectChange(e.target.name, e.target.value)}
              options={transactionType1}
              star
              ref={activeRef}
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            textAlign: "center",
            marginTop: "20px",
            marginRight: isSmallScreen ? "" : "400px"
          }}
        >
          <Button
            onClick={handleSubmit}
            style={{
              marginRight: "30px",
              backgroundColor: "#00e5ff",
              color: "black"
            }}
          >
            Generate
          </Button>
          <Button
            onClick={handleReset}
            style={{ backgroundColor: "black", color: "white" }}
          >
            Reset
          </Button>
        </Grid>
        <Typography
          style={{
            marginTop: "30px",
            fontSize: "large",
            color: "#29B6F6",
            marginLeft: "-19px"
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#29B6F6"
              }
            }}
          >
            <Tab
              label="Summary"
              sx={{
                color: "#29B6F6",
                "&.Mui-selected": {
                  color: "#29B6F6"
                },
                fontSize: "large",
                textTransform: "none",
                fontWeight: value === 0 ? "bold" : "normal"
              }}
            />
          </Tabs>
        </Typography>

        {isEditing &&
          <Box mt={5}>
            <h6
              style={{
                name: "Calibri",
                fontWeight: "bold",
                fontSize: "0.8rem",
                color: { rgb: "000000" },
                marginTop: "-10px"
              }}
            >
              Generated on: {currentDateTime}
            </h6>
            <div
              style={{
                overflowX: isSmallScreen ? "scroll" : "auto"
              }}
            >
              <CustomTable rows={data} columns={columns} />
            </div>
          </Box>}
        <br />
        <br />

        <Backdrop
          sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <img src={logo} alt="loading" />
        </Backdrop>
      </Form>
    </Layout>
  );
};

export default Batchwise;
