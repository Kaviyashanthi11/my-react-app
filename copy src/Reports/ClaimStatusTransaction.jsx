import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { Button } from "@mui/material";
import CustomTextField from "../maintain/CustomTextField";
import { useAuth } from "../Top/UserContext";
import { Grid } from "@material-ui/core";
import Layout from "../Top/Layout";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Form } from "react-bootstrap";
import logo from "../images/favicon.png";
import Backdrop from "@mui/material/Backdrop";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment-timezone";

const ClaimStatusTransaction = () => {
  const [formData, setFormData] = useState({
    BatchID: ""
  });
  const [open, setOpen] = useState(false);
  const { userRole } = useAuth();
  const batchRef = useRef();
  const isSmallScreen = useMediaQuery("(max-width:900px)");
  const selectedPractice = sessionStorage.getItem("selectedPractice");
  const parsedPractice = selectedPractice ? JSON.parse(selectedPractice) : null;
  const practiceValue = parsedPractice ? parsedPractice.value : "";
  const practiceLabel = parsedPractice ? parsedPractice.label : "";
  const [currentDateTime, setCurrentDateTime] = useState("");

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

  const createParametersSheet = (workbook, formData, practiceLabel, currentDateTime) => {
    const headerStyle = {
      font: { name: "Calibri", size: 9, bold: true, color: { argb: "FF000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "C2E0F9" } },
      alignment: { horizontal: "center", vertical: "middle" }
    };
  
    const inputParam = {
      font: { name: "Calibri", size: 9, bold: true, color: { argb: "FF000000" } },
      alignment: { horizontal: "left", vertical: "middle" }
    };
  
    const styles = {
      leftAligned: {
        font: { name: "Calibri", size: 8, color: { argb: "FF000000" } },
        alignment: { horizontal: "left", vertical: "center", wrapText: true }
      }
    };
  
    const sheet = workbook.addWorksheet("Parameters");
    const data = [
      ["Claim Status Transaction Report"],
      ["Generated On", currentDateTime],
      ["Practice Name", practiceLabel],
      ["Input Parameters"],
      ["Batch Id", formData.BatchID]
    ];
  
    sheet.addRows(data);
  
    // Merge and style headers
    sheet.mergeCells("A1:B1");
    sheet.getCell("A1").style = headerStyle;
    sheet.mergeCells("A4:B4");
    sheet.getCell("A4").style = inputParam;
  
    // Apply styles to other rows
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1 && rowNumber !== 4) {
        row.eachCell(cell => {
          cell.style = styles.leftAligned;
        });
      }
    });
  
    // Set column widths
    sheet.columns.forEach((column, index) => {
      column.width = index === 0 ? 14 : 27;
    });
  };
  
  const createStatusCodeSummarySheet = (workbook, batchId, data) => {
    // Define style for the title
    const titleStyle = {
      font: { name: "Calibri", size: 9, bold: true, color: { argb: "FF000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "739BD0" } },
      alignment: { horizontal: "center", vertical: "middle" },
    };
  
    // Define style for the header
    const headerStyle = {
      font: { name: "Calibri", size: 9, bold: true, color: { argb: "FF000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "CFEBFD" } },
      alignment: { horizontal: "center", vertical: "middle" },
      border: {
        top: { color: { rgb: "808080" }, style: "thin" },
        bottom: { color: { rgb: "808080" }, style: "thin" },
        left: { color: { rgb: "808080" }, style: "thin" },
        right: { color: { rgb: "808080" }, style: "thin" },
      },
    };
  
    // Define style for data cells
    const dataCellStyle = {
      default: {
        font: { name: "Calibri", size: 8 },
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        border: {
          top: { color: { rgb: "808080" }, style: "thin" },
          bottom: { color: { rgb: "808080" }, style: "thin" },
          left: { color: { rgb: "808080" }, style: "thin" },
          right: { color: { rgb: "808080" }, style: "thin" },
        },
      },
      leftAligned: {
        font: { name: "Calibri", size: 8 },
        alignment: { horizontal: "left", vertical: "middle", wrapText: true },
        border: {
          top: { color: { rgb: "808080" }, style: "thin" },
          bottom: { color: { rgb: "808080" }, style: "thin" },
          left: { color: { rgb: "808080" }, style: "thin" },
          right: { color: { rgb: "808080" }, style: "thin" },
        },
      },
      rightAligned: {
        font: { name: "Calibri", size: 8 },
        alignment: { horizontal: "right", vertical: "middle", wrapText: true },
        border: {
          top: { color: { rgb: "808080" }, style: "thin" },
          bottom: { color: { rgb: "808080" }, style: "thin" },
          left: { color: { rgb: "808080" }, style: "thin" },
          right: { color: { rgb: "808080" }, style: "thin" },
        },
      },
    };
  
    // Create a new worksheet
    const sheet = workbook.addWorksheet("Status Code Summary");
  
    // Log the batch ID for debugging purposes
    console.log("Batch ID:", batchId);
  
    // Add the title row (merged across A1:E1)
    const title = `Claim Status Code Summary for Batch ID ${batchId}`;
    console.log(`Generated Title: ${title}`);
    sheet.addRow([title]); // Add title to the first row
  
    // Merge cells from A1 to E1 for the title
    sheet.mergeCells('A1:E1');
  
    // Apply title style to the merged title cell
    const titleRow = sheet.getRow(1);
    titleRow.eachCell(cell => {
      cell.style = titleStyle;
    });
  
    // Define headers as per the given column names
    const columns = [
      "CPT Status Code1/2",
      "CPT Status Description",
      "# of Line Items",
      "Charges",
      "Payments",
    ];
  
    // Add header row in the second row
    const headerRow = sheet.addRow(columns); // Add headers in the second row
    headerRow.eachCell((cell, colIndex) => {
      cell.style = headerStyle; // Apply header style
    });
  
    // Add data rows starting from row 3
data.forEach((rowData, rowIndex) => {
  const row = sheet.addRow([
    rowData["CPTStatusCode1/2"], 
    rowData["CPTStatusDescription"], 
    rowData["#ofLineItems"], // Accessing with quotes due to special character
    rowData["Charges"], 
    rowData["Payments"]
  ]); // Add row data to the sheet

  row.eachCell((cell, colIndex) => {
    // Apply alignment styles based on column index
    if (colIndex === 2) {  // Assume third column (index 2) needs left alignment
      cell.style = dataCellStyle.leftAligned;
    } else if (colIndex === 4 || colIndex === 5) { // Assume Charges and Payments columns need right alignment
      cell.style = dataCellStyle.rightAligned;
    } else {
      cell.style = dataCellStyle.default; // Default to center alignment
    }
  });
});

  
    // Set column widths
    sheet.getColumn(1).width = 20;  // CPTStatusCode1/2
    sheet.getColumn(2).width = 46;  // CPTStatusDescription
    sheet.getColumn(3).width = 18;  // #ofLineItems
    sheet.getColumn(4).width = 9;   // Charges
    sheet.getColumn(5).width = 9;   // Payments
  };
  
  
  const createCPTLevelStatusSheet = (workbook, data) => {
    const headerStyle = {
      font: { name: "Calibri", size: 9, color: { argb: "FF000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "CFEBFD" } },
      alignment: { horizontal: "center", vertical: "middle" },
      border: {
        top: { color: { rgb: "808080" }, style: "thin" },
        bottom: { color: { rgb: "808080" }, style: "thin" },
        left: { color: { rgb: "808080" }, style: "thin" },
        right: { color: { rgb: "808080" }, style: "thin" },
      },
    };
  
    const dataStyle = {
      default: {
        font: { name: "Calibri", size: 8 },
        alignment: { horizontal: "left", vertical: "middle", wrapText: true },
        border: {
          top: { color: { rgb: "808080" }, style: "thin" },
          bottom: { color: { rgb: "808080" }, style: "thin" },
          left: { color: { rgb: "808080" }, style: "thin" },
          right: { color: { rgb: "808080" }, style: "thin" },
        },
      },
      rightAligned: {
        font: { name: "Calibri", size: 8 },
        alignment: { horizontal: "right", vertical: "bottom", wrapText: true },
        border: {
          top: { color: { rgb: "808080" }, style: "thin" },
          bottom: { color: { rgb: "808080" }, style: "thin" },
          left: { color: { rgb: "808080" }, style: "thin" },
          right: { color: { rgb: "808080" }, style: "thin" },
        },
      },
    };
  
    const sheet = workbook.addWorksheet("CPT Level Status");
  
    // Define columns with specific widths
    sheet.columns = [
      { header: "SNo", key: "SNo", width: 10 },
      { header: "Last Name(Input)", key: "LastName(Input)", width: 20 },
      { header: "First Name(Input)", key: "FirstName(Input)", width: 20 },
      { header: "Last Name(Payer)", key: "LastName(Payer)", width: 20 },
      { header: "First Name(Payer)", key: "FirstName(Payer)", width: 20 },
      { header: "Patient Control#", key: "PatientControl#", width: 20 },
      { header: "Insurance/MemberID", key: "Insurance/MemberID", width: 25 },
      { header: "From DOS", key: "FromDOS", width: 10 },
      { header: "To DOS", key: "ToDOS", width: 10 },
      { header: "CPT", key: "CPT", width: 10 },
      { header: "Modifier", key: "Modifier", width: 10 },
      { header: "Units", key: "Units", width: 10 },
      { header: "Line Charge", key: "LineCharge", width: 15 },
      { header: "Status Eff Dt.", key: "StatusEffDt.", width: 20 },
      { header: "Adjudication Date", key: "AdjudicationDate", width: 20 },
      { header: "EFT/Check Date", key: "EFT/CheckDate", width: 20 },
      { header: "EFT/Check Number", key: "EFT/CheckNumber", width: 20 },
      { header: "Claim Number", key: "ClaimNumber", width: 20 },
      { header: "Line Payment", key: "LinePayment", width: 15 },
      { header: "Claim Payment", key: "ClaimPayment", width: 15 },
      { header: "Claim Category Codes", key: "ClaimCategoryCodes", width: 25 },
      { header: "Claim Status Codes", key: "ClaimStatusCodes", width: 25 },
      { header: "CPT Category Codes", key: "CPTCategoryCodes", width: 25 },
      { header: "CPT Status Code1", key: "CPTStatusCode1", width: 20 },
      { header: "CPT Status Code2", key: "CPTStatusCode2", width: 20 },
      { header: "CPT Status Code3", key: "CPTStatusCode3", width: 20 },
      { header: "CPT Status Code4", key: "CPTStatusCode4", width: 20 },
      { header: "CPT Status Code5", key: "CPTStatusCode5", width: 20 },
      { header: "CPT Status Code6", key: "CPTStatusCode6", width: 20 },
      { header: "CPT Status Code7", key: "CPTStatusCode7", width: 20 },
      { header: "CPT Status Code8", key: "CPTStatusCode8", width: 20 },
      { header: "CPT Status Code9", key: "CPTStatusCode9", width: 20 },
    ];
  
    // Style the header row
    const headerRow = sheet.getRow(1);
    headerRow.eachCell(cell => {
      cell.style = headerStyle;
    });
  
    // Add data rows with conditional styling
    data.forEach(rowData => {
      const row = sheet.addRow(rowData);
      row.eachCell((cell, colIndex) => {
        if ([1, 6, 13, 19, 20].includes(colIndex)) {
          // Apply right alignment for specified columns
          cell.font = dataStyle.rightAligned.font;
          cell.alignment = dataStyle.rightAligned.alignment;
          cell.border = dataStyle.rightAligned.border;
        } else {
          // Apply default style for other columns
          cell.font = dataStyle.default.font;
          cell.alignment = dataStyle.default.alignment;
          cell.border = dataStyle.default.border;
        }
      });
    });
  };
  
  
  const createClaimLevelStatusSheet = (workbook, data) => {
    const headerStyle = {
      font: { name: "Calibri", size: 9, color: { argb: "FF000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "CFEBFD" } },
      alignment: { horizontal: "center", vertical: "middle" },
      border: {
        top: { color: { rgb: "808080" }, style: "thin" },
        bottom: { color: { rgb: "808080" }, style: "thin" },
        left: { color: { rgb: "808080" }, style: "thin" },
        right: { color: { rgb: "808080" }, style: "thin" },
      },
    };
  
    const dataStyle = {
      default: {
        font: { name: "Calibri", size: 8 },
        alignment: { horizontal: "left", vertical: "bottom", wrapText: true },
        border: {
          top: { color: { rgb: "808080" }, style: "thin" },
          bottom: { color: { rgb: "808080" }, style: "thin" },
          left: { color: { rgb: "808080" }, style: "thin" },
          right: { color: { rgb: "808080" }, style: "thin" },
        },
      },
      rightAligned: {
        font: { name: "Calibri", size: 8 },
        alignment: { horizontal: "right", vertical: "bottom", wrapText: true },
        border: {
          top: { color: { rgb: "808080" }, style: "thin" },
          bottom: { color: { rgb: "808080" }, style: "thin" },
          left: { color: { rgb: "808080" }, style: "thin" },
          right: { color: { rgb: "808080" }, style: "thin" },
        },
      },
    };
  
    const sheet = workbook.addWorksheet("Claim Level Status");
  
    // Set specific column widths
    const columns = [
      { header: "SNo", key: "SNo", width: 10 }, // 1st Column
      { header: "Patient Last Name", key: "PatientLastName", width: 20 },
      { header: "Patient First Name", key: "PatientFirstName", width: 20 },
      { header: "Patient Control#", key: "PatientControl#", width: 15 }, // 4th Column
      { header: "Insurance/Member ID#", key: "Insurance/MemberID#", width: 20 },
      { header: "From DOS", key: "FromDOS", width: 10 },
      { header: "To DOS", key: "ToDOS", width: 10 },
      {
        header: "Claim Status Details",
        key: "ClaimStatusDetails",
        width: 150,
        style: { alignment: { horizontal: "left", vertical: "middle", wrapText: true } },
      },
    ];
    sheet.columns = columns;
  
    // Style the header row
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.style = headerStyle;
    });
 // Add data rows and apply styling
data.forEach((rowData) => {
  const row = sheet.addRow(rowData);

  row.eachCell((cell, colIndex) => {
    if (colIndex === 1 || colIndex === 4) {
      // Right align for 1st and 4th columns
      cell.font = dataStyle.rightAligned.font;
      cell.alignment = dataStyle.rightAligned.alignment;
      cell.border = dataStyle.rightAligned.border;
    } else if (colIndex === sheet.columns.length) {
      // Specific style for the last column
      cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
      cell.font = dataStyle.default.font; // Use default font
      cell.border = dataStyle.default.border; // Use default border
    } else {
      // Default style for other columns
      cell.font = dataStyle.default.font;
      cell.alignment = dataStyle.default.alignment;
      cell.border = dataStyle.default.border;
    }
       // Optional: Set uniform row height
       row.height = 50;
  });
});
   
  };
  
  
 const createDescriptionsSheet = (workbook, data) => {
  const headerStyle = {
    font: { name: "Calibri", size: 9, color: { argb: "FF000000" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "CFEBFD" } },
    alignment: { horizontal: "center", vertical: "middle" },
    border: {
      top: { color: { rgb: "808080" }, style: "thin" },
      bottom: { color: { rgb: "808080" }, style: "thin" },
      left: { color: { rgb: "808080" }, style: "thin" },
      right: { color: { rgb: "808080" }, style: "thin" },
    },
  };

  const dataStyle = {
    leftAligned: {
      alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
      font: { name: 'Calibri', size: 8 },
      border: {
        top: { color: { rgb: "808080" }, style: "thin" },
        bottom: { color: { rgb: "808080" }, style: "thin" },
        left: { color: { rgb: "808080" }, style: "thin" },
        right: { color: { rgb: "808080" }, style: "thin" },
      },
    },
    centerAligned: {
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      font: { name: 'Calibri', size: 8 },
      border: {
        top: { color: { rgb: "808080" }, style: "thin" },
        bottom: { color: { rgb: "808080" }, style: "thin" },
        left: { color: { rgb: "808080" }, style: "thin" },
        right: { color: { rgb: "808080" }, style: "thin" },
      },
    },
  };

  const sheet = workbook.addWorksheet("Descriptions");
  const columns = Object.keys(data[0]).map(key => ({ header: key, key, width: 20 }));
  sheet.columns = columns;

  // Style the header row
  const headerRow = sheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.style = headerStyle;
  });

  // Add data rows with conditional styling based on column index
  data.forEach(rowData => {
    const row = sheet.addRow(rowData);
    
    row.eachCell((cell, colIndex) => {
      if (colIndex === 1) {
        // For the first column (index 1), use center alignment
        cell.style = dataStyle.centerAligned;
      } else if (colIndex === 2) {
        // For the second column (index 2), use left alignment
        cell.style = dataStyle.leftAligned;
      }
    });

    // Set row height
    row.height = 16;
  });

  // Set column widths
  sheet.columns.forEach((column, index) => {
    column.width = index === 0 ? 7 : 115; // Set first column width to 7, others to 115
  });
};

  const handleSubmit = async () => {
    
    // Check if a practice is selected
    if (!formData.BatchID.length) {
      alert("Batch ID is required");
      batchRef.current?.focus(); // Set focus to the practice dropdown
      return; // Prevent further execution if no practice is selected
  }

    setOpen(true);
    const url = "/React/web/index.php?r=report/claim-status-transaction-report";

    const requestBody = {
      BatchID: formData.BatchID,
      iUserRole: userRole,
      Practicename: practiceValue
    };
 
try {
      // Sending the POST request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API Response Data:", responseData);

      if (!Array.isArray(responseData) || responseData.length === 0) {
        throw new Error("Invalid or empty data received from server.");
      }

      setOpen(false);

      // Create a new Excel workbook
  
      const workbook = new ExcelJS.Workbook();
  
              // Create the Parameters sheet
            // Assuming the workbook, formData, and responseData are already defined
        createParametersSheet(workbook, formData, practiceLabel, currentDateTime); // Create Parameters sheet

        // Find the StatusCodeSummary data from the responseData
        const statusCodeSummaryData = responseData.find(item => item.StatusCodeSummary)?.StatusCodeSummary;
        console.log('StatusCodeSummary data:', statusCodeSummaryData); // Log to check the data

        // Check if StatusCodeSummary data exists
        if (statusCodeSummaryData) {
          // Check if formData contains a valid BatchID
          if (formData && formData.BatchID) {
            // Pass the BatchID and statusCodeSummaryData to createStatusCodeSummarySheet function
            createStatusCodeSummarySheet(workbook, formData.BatchID, statusCodeSummaryData);
          } else {
            console.log("BatchID is not defined in formData.");
          }
        } else {
          console.log("No StatusCodeSummary found in responseData.");
        }

      const cptLevelStatusData = responseData.find(item => item.CPTLevelStatus)?.CPTLevelStatus;
      if (cptLevelStatusData) {
        createCPTLevelStatusSheet(workbook, cptLevelStatusData);
      }
  
      const claimLevelStatusData = responseData.find(item => item.ClaimLevelStatus)?.ClaimLevelStatus;
      if (claimLevelStatusData) {
        createClaimLevelStatusSheet(workbook, claimLevelStatusData);
      }
  
      const descriptionsData = responseData.find(item => item.Descriptions)?.Descriptions;
      if (descriptionsData) {
        createDescriptionsSheet(workbook, descriptionsData);
      }
  
      // Save the Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "Claim_Status_Transaction_Report.xlsx");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      BatchID: ""
    });
  };

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
          <Grid item xs={12} sm={3}>
            <CustomTextField
              label="Batch ID"
              name="BatchID"
              value={formData.BatchID}
              onChange={handleChange}
              star
              ref={batchRef}
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
            Submit
          </Button>
          <Button
            onClick={handleReset}
            style={{ backgroundColor: "black", color: "white" }}
          >
            Reset
          </Button>
        </Grid>
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

export default ClaimStatusTransaction;
