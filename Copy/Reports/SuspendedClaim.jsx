import React, { useState, useEffect, useRef } from "react";
import CustomSelectwithSearch from "../maintain/CustomSearch";
import Layout from "../Top/Layout";
import { Box, Button, Grid, Stack, Avatar, Backdrop } from "@mui/material";
import CustomDatePicker from "../maintain/DatePicker";
import CustomTextField from "../maintain/CustomTextField";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import excelImage from "../images/excel.png";
import moment from "moment-timezone";
import logoImage from "../images/favicon (1).webp";
import Table from "../maintain/Seconda/Table";
import { useAuth } from "../Top/UserContext"
import { usePractice } from '../PracticeContext';
const SuspendedClaim = () => {
  const [customerOptions, setCustomerOptions] = useState([]);
  const [practiceOptions, setpracticeOptions] = useState([]);
  const practiceOptionsRef = useRef(practiceOptions);
  const [formData, setFormData] = useState({
    iCustomername: "",
    iPracticename: "",
    dtFromDateTime: "",
    dtToDateTime: "",
    ibatchid: ""
  });
  const [showProviderTable, setShowProviderTable] = useState(false);
  const hiddenColumns = [];
  const practiceRef = useRef(null);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [open, setOpen] = useState(false);
  const { selectedPractice } = usePractice();
  const { user } = useAuth();
  //console.log("UserRole:", user.role);
  const iUserRole = user?.role;
  const [columns] = useState([
    {
      field: "SNo",
      headerName: "S.No",
      minWidth: 70
    },
    {
      field: "Practice Name",
      headerName: "Practice Name",
      minWidth: 200
    },
    {
      field: "Payer",
      headerName: "Payer",
      minWidth: 200
    },
    {
      field: "Batch ID",
      headerName: "Batch ID",
      minWidth: 200
    },
    {
      field: "Subscriber Name",
      headerName: "Subscriber Name",
      minWidth: 200
    },
    {
      field: "Insurance/Member ID",
      headerName: "Insurance/Member ID",
      minWidth: 200
    },
    {
      field: "Subscriber DOB",
      headerName: "Subscriber DOB",
      minWidth: 150
    },
    {
      field: "Patient Name",
      headerName: "Patient Name",
      minWidth: 200
    },
    {
      field: "Patient DOB",
      headerName: "Patient DOB",
      minWidth: 150
    },
    {
      field: "Service Date",
      headerName: "Service Date",
      minWidth: 150
    },
    {
      field: "Reason for Reject",
      headerName: "Reason for Reject",
      minWidth: 300
    },
    {
      field: "Batch Created By",
      headerName: "Batch Created By",
      minWidth: 200
    },
    {
      field: "Created On",
      headerName: "Created On",
      minWidth: 200
    }
  ]);

  useEffect(() => {
    fetchDataForFirstField();
  }, []);

  const fetchDataForFirstField = async () => {
    try {
      const practiceResponse = await fetch(
        "/React/web/index.php?r=report/customer-name"
      );
      const practiceData = await practiceResponse.json();
      const customerOptions = Object.entries(
        practiceData
      ).map(([value, label]) => ({
        value,
        label
      }));

      const defaultPracticeOption = { value: "", label: "All" };
      setCustomerOptions([defaultPracticeOption, ...customerOptions]);

      setFormData(prevData => ({
        ...prevData,
        iCustomername: defaultPracticeOption.value
      }));
    } catch (error) {
      console.error("Error fetching practice field data:", error);
    }
  };
  useEffect(() => {
    const fetchDefaultPracticeNames = async () => {
      try {
        const providerResponse = await fetch(
          "/React/web/index.php?r=report/practice-name"
        );
        const practiceData = await providerResponse.json();
        const practiceOptions = Object.entries(
          practiceData
        ).map(([value, label]) => ({
          value,
          label
        }));
        const defaultPracticeOption = { value: "", label: "--select--" };
        setpracticeOptions([defaultPracticeOption, ...practiceOptions]);
        setFormData(prevData => ({
          ...prevData,
          iCustomername: defaultPracticeOption.value
        }));
        // console.log("Practice api :",practiceResponse )
      } catch (error) {
        console.error("Error fetching default practice names:", error);
      }
    };

    fetchDefaultPracticeNames();
  }, []);

  useEffect(
    () => {
      const fetchSecondFieldData = async () => {
        try {
          const clientId =
            formData.iCustomername === "" || formData.iCustomername === "All"
              ? ""
              : formData.iCustomername;
          const providerResponse = await fetch(
            `/React/web/index.php?r=report/customer-by-practice-list&clientId=${clientId}`
          );

          const providerData = await providerResponse.json();
          const practiceOptions = Object.entries(
            providerData
          ).map(([value, label]) => ({
            value,
            label
          }));
          const defaultProviderOption = { value: "", label: "--select--" };
          setpracticeOptions([defaultProviderOption, ...practiceOptions]);
          practiceOptionsRef.current = practiceOptions;
        } catch (error) {
          console.error("Error fetching provider field data:", error);
        }
      };

      fetchSecondFieldData();
    },
    [formData.iCustomername]
  );
  const handleFirstFieldChange = event => {
    setFormData(prevData => ({
      ...prevData,
      iPracticename: "",
      iCustomername: event.target.value
    }));
  };

  const handleSecondFieldChange = event => {
    const selectedOption = event.target.value;
    setFormData(prevData => ({
      ...prevData,
      iPracticename: selectedOption
    }));
  };
  const handleChange = event => {
    const { name, value } = event.target || event;
    console.log("name:", name, "value:", value);

    // Check date validation if both dates are set
    if (
      (name === "dtFromDateTime" &&
        formData.dtToDateTime &&
        new Date(value) > new Date(formData.dtToDateTime)) ||
      (name === "dtToDateTime" &&
        formData.dtFromDateTime &&
        new Date(value) < new Date(formData.dtFromDateTime))
    ) {
      alert("From Date should not be greater than To Date");
      return;
    }

    // Format date inputs as mm/dd/yyyy
    if (name === "dtFromDateTime" || name === "dtToDateTime") {
      // Parse the input date
      const parsedDate = new Date(value);

      // Validate if the parsed date is valid
      if (!isNaN(parsedDate)) {
        // Format date as mm/dd/yyyy
        const formattedDate =
          ("0" + (parsedDate.getMonth() + 1)).slice(-2) +
          "/" +
          ("0" + parsedDate.getDate()).slice(-2) +
          "/" +
          parsedDate.getFullYear();

        setFormData(prevData => {
          const updatedFormData = {
            ...prevData,
            [name]: formattedDate
          };
          const fromDate = new Date(updatedFormData.dtFromDateTime);
          const toDate = new Date(updatedFormData.dtToDateTime);

          // Calculate the difference in days
          const dateDifference =
            Math.abs(toDate - fromDate) / (1000 * 60 * 60 * 24);

          if (dateDifference > 90) {
            alert("Date range should not exceed 90 days.");
            return prevData;
          }

          return updatedFormData;
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const alertAndFocus = (message, fieldName) => {
    alert(message);

    const fieldMap = {
      iPracticename: practiceRef,
      dtFromDateTime: fromDateRef,
      dtToDateTime: toDateRef
    };

    const fieldRef = fieldMap[fieldName];

    if (fieldRef && fieldRef.current) {
      fieldRef.current.focus();

      if (fieldRef.current.style) {
        fieldRef.current.style.borderColor = "#007bff"; // Set the border color
        fieldRef.current.style.boxShadow = "0 0 5px #007bff"; // Set the box shadow

        // Add an event listener to keep the focus style when typing
        fieldRef.current.addEventListener("input", () => {
          fieldRef.current.style.borderColor = "#007bff";
          fieldRef.current.style.boxShadow = "0 0 5px #007bff";
        });

        // Optionally, add a blur event to reset styles if you want
        fieldRef.current.addEventListener("blur", () => {
          fieldRef.current.style.borderColor = ""; // Reset border color
          fieldRef.current.style.boxShadow = ""; // Reset box shadow
        });
      }
    }
  };

  // const handleGo = async event => {
  //   event.preventDefault();
  //   setOpen(true);

  //   if (!formData.dtFromDateTime) {
  //     alertAndFocus("From Date is required.", "dtFromDateTime");
  //     setOpen(false);
  //     return;
  //   }
  //   if (!formData.dtToDateTime) {
  //     alertAndFocus("To Date is required.", "dtToDateTime");
  //     setOpen(false);
  //     return;
  //   }
  //   if (iUserRole === 1) {
  //     if (!formData.iPracticename) {
  //       alertAndFocus('Practice Name is required.', 'iPracticename');
  //       setOpen(false);
  //       return;
  //     }
  //   }
 
  //   const requestBody = {
  //     FromDate: formData.dtFromDateTime,
  //     ToDate: formData.dtToDateTime,
  //     Customername: formData.iCustomername,
  //     Practicename: formData.iPracticename || selectedPractice.value,
  //     BatchId: formData.ibatchid,
  //     iUserRole: user.role
  //   };
  
  //   // Log the request body to the console
  //   console.log("Request Body:", requestBody);
  //   try {
  //     const response = await fetch(
  //       "/React/web/index.php?r=report/claim-status-suspended-report",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify(requestBody)
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.status === false) {
  //       setRows([]);
  //       setShowProviderTable(true);
  //       setOpen(false);
  //       return;
  //     }
  //     if (Array.isArray(data)) {
  //       const rowsWithId = data.map((row, index) => ({
  //         id: index,
  //         ...row
  //       }));
  //       setRows(rowsWithId);
  //     } else {
  //       console.error("Data fetched is not an array:", data);
  //       setRows([]);
  //     }
  //     setShowProviderTable(true);
  //     setOpen(false);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setRows([]);
  //   }
  // };
  const handleGo = async event => {
    event.preventDefault();
    setOpen(true);
  
    if (!formData.dtFromDateTime) {
      alertAndFocus("From Date is required.", "dtFromDateTime");
      setOpen(false);
      return;
    }
    if (!formData.dtToDateTime) {
      alertAndFocus("To Date is required.", "dtToDateTime");
      setOpen(false);
      return;
    }
  
    // Determine practice name based on user role
    const practiceName = iUserRole === 1 ? formData.iPracticename : selectedPractice?.value;
  
    if (iUserRole === 1 && !practiceName) {
      alertAndFocus('Practice Name is required.', 'iPracticename');
      setOpen(false);
      return;
    }
  
    const requestBody = {
      FromDate: formData.dtFromDateTime,
      ToDate: formData.dtToDateTime,
      Customername: formData.iCustomername,
      Practicename: practiceName,
      BatchId: formData.ibatchid,
      iUserRole: user.role
    };
  
    // Log the request body to the console
    console.log("Request Body:", requestBody);
    
    try {
      const response = await fetch(
        "/React/web/index.php?r=report/claim-status-suspended-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );
  
      const data = await response.json();
  
      if (data.status === false) {
        setRows([]);
        setShowProviderTable(true);
        setOpen(false);
        return;
      }
      if (Array.isArray(data)) {
        const rowsWithId = data.map((row, index) => ({
          id: index,
          ...row
        }));
        setRows(rowsWithId);
      } else {
        console.error("Data fetched is not an array:", data);
        setRows([]);
      }
      setShowProviderTable(true);
      setOpen(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
    }
  };
  
  const handleReset = () => {
    setFormData({
      iCustomername: "",
      iPracticename: "",
      dtFromDateTime: "",
      dtToDateTime: "",
      ibatchid: ""
    });
    setShowProviderTable(false);
  };
  function formatDate(date) {
    const chicagoTime = moment.tz(date, "America/Chicago");
    return chicagoTime.format("MM/DD/YYYY hh:mm:ss A");
  }
  function Datesvalue(date) {
    const chicagoTime = moment(date).tz("America/Chicago");
    return chicagoTime.format("MM/DD/YYYY");
  }
  const handleExportToExcel = () => {
    const currentDate = new Date();
    const generatedOnText = "Generated On:";
    const formattedDate = formatDate(currentDate);
    const Dates = Datesvalue(new Date());
    const name = "Suspended List Claim Status Report";
    // Helper function to get the label for a given value from options
    const getLabel = (options, value) => {
      if (value === "") {
        return "";
      }
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    };
    // Form data to be exported with labels instead of raw values
    const formDataToExport = [
      ["From Date", formData.dtFromDateTime],
      ["To Date", formData.dtToDateTime],
      ["Customer Name", getLabel(customerOptions, formData.iCustomername)],
      ["Practice Name", getLabel(practiceOptions, formData.iPracticename)],
      ["Batch ID", formData.ibatchid]
    ];
    const visibleColumns = [
      { field: "SNo", headerName: "SI NO" },
      { field: "Practice Name", headerName: "Practice Name" },
      { field: "Payer", headerName: "Payer" },
      { field: "Batch ID", headerName: "Batch ID" },
      { field: "Subscriber Name", headerName: "Subscriber Name" },
      { field: "Insurance/Member ID", headerName: "Insurance/Member ID" },
      { field: "Subscriber DOB", headerName: "Subscriber DOB" },
      { field: "Patient Name", headerName: "Patient Name" },
      { field: "Service Date", headerName: "Service Date" },
      { field: "Reason for Reject", headerName: "Reason for Reject" },
      { field: "Batch Created By", headerName: "Batch Created By" },
      { field: "Created On", headerName: "Created On" }
    ]
      .filter(({ field }) => !hiddenColumns.includes(field))
      .filter(({ field }) => field !== "edit");
    const rowsToExport = rows.map(row =>
      visibleColumns.reduce((acc, { field }) => {
        let value = row[field];
        acc[field] = value != null ? value.toString() : "";
        return acc;
      }, {})
    );
    const data = [
      [name],
      [generatedOnText + " " + formattedDate],
      [],
      ...formDataToExport,
      [],
      visibleColumns.map(({ headerName }) => headerName)
    ];
    if (rowsToExport.length === 0) {
      data.push(["No rows selected"]);
    } else {
      rowsToExport.forEach(row => {
        data.push(visibleColumns.map(({ field }) => row[field]));
      });
    }
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 }
    ];
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }
    ];
    const titleStyle = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      fill: {
        fgColor: { rgb: "adcaf7" }
      }
    };
    const headerStyle = {
      fill: { fgColor: { rgb: "adcaf7" } },
      font: { bold: true, sz: 10 },
      alignment: { horizontal: "center", vertical: "center" }
    };
    const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
    if (!worksheet[titleCell]) worksheet[titleCell] = {};
    worksheet[titleCell].s = titleStyle;
    worksheet[titleCell].v = name;
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({
        r: formDataToExport.length + 4,
        c: C
      });
      if (!worksheet[headerCell]) worksheet[headerCell] = {};
      worksheet[headerCell].s = headerStyle;
    }
    const generatedOnStyle = {
      font: { bold: true, sz: 10 }
    };
    const generatedOnCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
    if (!worksheet[generatedOnCell]) worksheet[generatedOnCell] = {};
    worksheet[generatedOnCell].s = generatedOnStyle;
    worksheet[generatedOnCell].v = generatedOnText + " " + formattedDate;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    const fileName = `Suspended List - Claim Status Report_${Dates}.xlsx`;
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      fileName
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <Layout>
      <form>
      <Grid
            container
            columnSpacing={2}
            sx={{
              order: { xs: 3, sm: 3 }
            }}
          >
          <Grid item >
            <CustomDatePicker
              name="dtFromDateTime"
              value={formData.dtFromDateTime || ""}
              onChange={value =>
                handleChange({ target: { name: "dtFromDateTime", value } })}
              label="From Date"
              star="true"
              ref={fromDateRef}
            />
          </Grid>
          <Grid item >
            <CustomDatePicker
              name="dtToDateTime"
              value={formData.dtToDateTime || ""}
              onChange={value =>
                handleChange({ target: { name: "dtToDateTime", value } })}
              label="To Date"
              star="true"
              ref={toDateRef}
            />
          </Grid>
          {iUserRole === 1 && (
            <>
          <Grid item >
            <CustomSelectwithSearch
              label="Customer Name"
              name="iCustomername"
              options={customerOptions}
              onChange={handleFirstFieldChange}
              value={formData.iCustomername}
              width="200px"
            />
          </Grid>
          <Grid item >
            <CustomSelectwithSearch
              label="Practice Name"
              name="iPracticename"
              options={practiceOptions}
              onChange={handleSecondFieldChange}
              value={formData.iPracticename}
              ref={practiceRef}
              star="true"
              width="200px"
            />
          </Grid>
          </>
          )}
          <Grid item >
            <CustomTextField
              label="Batch ID"
              name="ibatchid"
              value={formData.ibatchid}
              onChange={e => handleChange("ibatchid", e.target.value)}
            />
          </Grid>
        </Grid>

        <Box mt={1} display="flex" justifyContent="center">
          <Stack spacing={2} direction="row">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              style={{ backgroundColor: "#29b6f6" }}
              onClick={handleGo}
            >
              Go
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ backgroundColor: "#424242" }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </form>
      <Box>
        {showProviderTable &&
          <p style={{ fontWeight: "bold", fontSize: "16px", margin: "10px 0" }}>
            Generated On: {formatDate(currentDate)}
          </p>}
        {showProviderTable &&
          <Grid item>
            <Button onClick={handleExportToExcel}>
              <Avatar
                src={excelImage}
                alt="excel"
                sx={{ width: "2rem", height: "2rem" }}
                variant="square"
              />
            </Button>
          </Grid>}
        {showProviderTable &&
          <Table
            rows={rows}
            columns={columns}
            hiddenColumns={hiddenColumns}
            showPagination={false}
            enableSearch={false}
          />}
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <img src={logoImage} alt="loading.." />
      </Backdrop>
    </Layout>
  );
};

export default SuspendedClaim;
