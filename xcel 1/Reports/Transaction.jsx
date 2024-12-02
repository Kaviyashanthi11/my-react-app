import React, { useState, useEffect, useRef } from "react";
import Layout from "../Top/Layout";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomSelect from "../maintain/CustomSelect";
import ExcelJS from 'exceljs';
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
import { transactionType1, eligibility } from "../dropoption/PlanPermiumTrail";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../images/favicon.png";
import moment from "moment-timezone";
import { useAuth } from "../Top/UserContext";
import logo1 from "../images/logo.png";

const Transaction = () => {
  const { userRole } = useAuth();
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    transactiontype: "",
    EligibilityStatus: ""
  });

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:900px)");

  const activeRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const eligibilityRef = useRef(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [value, setValue] = React.useState(0);
  const selectedPractice = sessionStorage.getItem("selectedPractice");
  const parsedPractice = selectedPractice ? JSON.parse(selectedPractice) : null;
  const practiceLabel = parsedPractice ? parsedPractice.label : "";
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
    console.log("Field Changed:", name, "Value:", value);
  
    setFormData(prevFormData => {
      // Handle specific logic for transactiontype
      if (name === "transactiontype") {
        return {
          ...prevFormData,
          [name]: value,
          EligibilityStatus: (value === "1" || value === "4") 
            ? prevFormData.EligibilityStatus 
            : "", // Clear EligibilityStatus for other transaction types
        };
      }
  
      // Default case for other fields
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };
  

  const handleDateTimeChange = (name, newValue) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: newValue || ""
    }));
  };

  const formatDate = (dateString) => {
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
    if (!formData.transactiontype) {
      alert("Please select Transaction Type");
      return;
    }
    if (
      (formData.transactiontype === 1 || formData.transactiontype === 4) &&
      !formData.EligibilityStatus
    ) {
      alert("Please select Eligibility Status Type");
      return;
    }

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

    setOpen(true);

    const parsedPractice = selectedPractice
      ? JSON.parse(selectedPractice)
      : null;
    const practiceValue = parsedPractice ? parsedPractice.value : "";

    const requestData = {
      FromDate: formatDate(formData.fromDate || ""),
      ToDate: formatDate(formData.toDate || ""),
      Transactiontype: formData.transactiontype,
      EligibilityStatus: formData.EligibilityStatus,
      iUserRole: userRole,
      Practicename: practiceValue
    };
    try {
      const response = await fetch(
        "/React/web/index.php?r=report/transaction-reports",
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
              acc.totalResponses += Number(item["#ofResponseReceived"] || 0);
              return acc;
            },
            { totalResponses: 0 }
          );
          const dataWithTotals = [
            ...result.map((item, index) => ({ ...item, SNo: index + 1, })),
            ...(formData.transactiontype === "1" ||
            formData.transactiontype === "4"
              ? [
                  {
                    SNo: "Total",
                    "#ofResponseReceived": totals.totalResponses
                  }
                ]
              : [])
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
      transactiontype: "",
      EligibilityStatus: ""
    });
    setData([]);
    setIsEditing(false);
  };

  const columns = [
    // General columns
    ...(formData.transactiontype !== "5" && formData.transactiontype !== "6" 
      ? [
          { field: "SNo", headerName: "SNo", width: 100 },
          ...(formData.transactiontype === "3"
            ? [{ field: "PayerName", headerName: "Payer Name", width: 250 }]  // This should be wrapped in an array
            : [{ field: "Payer", headerName: "Payer", width: 250 }]  // Same here, ensure it's an array
          ),
          { field: "PolicyID", headerName: "Policy ID", width: 250 },
          { field: "PatientName", headerName: "Patient Name", width: 250 },
          { field: "DOB", headerName: "DOB", width: 250 },
          {
            field: "FromDOS",
            headerName: "From",
            width: 250
          },
          {
            field: "ToDOS",
            headerName: "To",
            width: 250
          }
        ]
      : []),
  
    // Fields to show when transactiontype is 5 or 6
    ...(formData.transactiontype === "5" || formData.transactiontype === "6" 
      ? [
          { field: "SNo", headerName: "SNo", width: 100 },
          { field: "PatientName", headerName: "Patient Name", width: 250 },
          {
            field: "PatientDOB",
            headerName: "Patient DOB",
            width: 270
          },
          {
            field: "PatientGender",
            headerName: "Patient Gender",
            width: 280
          },
          {
            field: "DateOfService",
            headerName: "Date of Service",
            width: 270
          },
          {
            field: "Address",
            headerName: "Address",
            width: 350
          },
          {
            field: "Details",
            headerName: "Details",
            width: 200,
            renderCell: (params) => (
              <Link
                to={`/details/${params.row.id}`}
                style={{ textDecoration: "none", color: "blue", textAlign: "center" }}
              >
                View
              </Link>
            )
          },
          {
            field: "ResponseDate",
            headerName: "Response Date",
            width: 220,
            renderCell: params => {
              return formatDate(params.value);
            }          }
        ]
      : []),
   ...(formData.transactiontype === "1" || formData.transactiontype === "4"
      ? [
          {
            field: "Status",
            headerName: "Status",
            width: 270
          },
          {
            field: "#ofResponseReceived",
            headerName: "# of Response Received",
            width: 280
          }
        ]
      : []),
   // General columns
   ...(formData.transactiontype !== "5" && formData.transactiontype !== "6" 
    ? [
    {
      field: "Details",
      headerName: "Details",
      width: 200,
      renderCell: (params) => (
        <Link
          to={`/details/${params.row.id}`}
          style={{ textDecoration: "none", color: "blue", textAlign: "center" }}
        >
          View
        </Link>
      )
    },
    {
      field: "ResponseDate",
      headerName: "Response Date",
      width: 220,
      renderCell: params => {
        return formatDate(params.value);
      }    },
  ]
  : []),
  ];


  const handleExportToExcel = async () => {
    const headerStyle = {
      font: { name: "Calibri", size: 9, bold: true, color: { argb: "FF000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6DBFF" } }, // Light blue background
      alignment: { horizontal: "center", vertical: "middle" },
    };
  
    const cellStyle = {
      font: { name: "Calibri", size: 8, color: { argb: "FF000000" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
     
    };
  
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transaction Reports");
    for (let row = 1; row <= 4; row++) {
      for (let col = 1; col <= 3; col++) {
        worksheet.getCell(row, col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFFFF" },  // White background (ARGB hex for white)
        };
      }
    }
  
    // Adjust row height and column width to accommodate the image
    worksheet.getRow(1).height =15;  // Increase row height to fit image
    worksheet.getRow(3).height =15;  // Increase row height to fit image
    worksheet.getColumn(1).width = 10; // Adjust column width for image
    worksheet.getColumn(2).width = 10; // Adjust column width for image
    worksheet.getColumn(3).width = 20; // Adjust column width for image

  
    // Add logo
    try {
      const response = await fetch(logo1);  // Assuming 'logo1' is the URL of the image
      const imageBuffer = await response.arrayBuffer();
      const logoImage = workbook.addImage({
        buffer: imageBuffer,
        extension: "png",
      });
  
      const logoWidth = 100;  // Adjust width as per your requirement
      const logoHeight = 60;  // Adjust height as per your requirement
  
      // Add the image to the worksheet with the correct size and position
      worksheet.addImage(logoImage, {
        tl: { col: 0, row: 1 },  // Top-left corner (column, row)
        br: { col: 2, row: 4 },  // Bottom-right corner (column, row)
        width: logoWidth,        // Custom width for the image
        height: logoHeight,      // Custom height for the image
      });
    } catch (error) {
      console.error("Error adding logo:", error);
    }

// Prepare data for export
const dataToExport = data.length > 0 ? data.map((item) => {
  const payerField = formData.transactiontype === '3' ? 'PayerName' : 'Payer';
  const payerFieldName = formData.transactiontype === '3' ? 'Payer Name' : 'Payer'; // Dynamically change the field name
  const payerValue = item[payerField];

  const commonData = {
    SNO: item.SNo,
    [payerFieldName]: payerValue,  // Use the dynamic field name
    'Policy ID': item['PolicyID'],
    'Patient Name': item['PatientName'],
    DOB: item.DOB,
    FromDOS: item.FromDOS,
    ToDOS: item.ToDOS,
  };

  if (formData.transactiontype === '1' || formData.transactiontype === '4') {
    return {
      ...commonData,
      Status: item.Status,
      '# of Response Received': item['#ofResponseReceived'],
      'Response Date': item['ResponseDate'],  // Ensure this is always last
    };
  }

  if (formData.transactiontype === '5' || formData.transactiontype === '6') {
    return {
      SNO: item.SNo,
      'Patient Name': item['PatientName'],
      'Patient Gender': item['PatientGender'],
      'Patient DOB': item['PatientDOB'],
      'Date Of Service': item['DateOfService'],
      Address: item.Address,
      'Response Date': item['ResponseDate'],  // Ensure this is always last
    };
  }

  return {
  ...commonData,
   'Response Date': item['ResponseDate'],  // Ensure this is always last

  }
}) : [
  { 'No results found': 'No results found.' }  // Add a single row indicating no results
];

    // Prepare headers
    const headers = formData.transactiontype === "5" || formData.transactiontype === "6"
      ? ["SNO", "Patient Name", "Patient Gender", "Patient DOB", "Date Of Service", "Address", "Response Date"]
      : ["SNO", "Payer", "Policy ID", "Patient Name", "DOB", "From DOS", "To DOS"];
  
    if (formData.transactiontype === "1" || formData.transactiontype === "4") {
      headers.push("Status", "#ofResponseReceived","ResponseDate");
    }
    const columnWidths = {
      "SNO": 14,
      "Patient Name": 20,
      "Patient Gender": 15,
      "Patient DOB": 20,
      "Date Of Service": 25,
      "Address": 40, // Increased width
      "Response Date": 20
    };
    
    headers.forEach((header, colIndex) => {
      worksheet.getColumn(colIndex + 1).width = columnWidths[header] || 20; // Default width: 15
    });
    
// Dynamically calculate the last column letter
const lastColumnLetter = worksheet.getColumn(headers.length).letter;

// Merge cells for the title dynamically based on the number of columns
worksheet.mergeCells(`A5:${lastColumnLetter}5`);
const titleCell = worksheet.getCell('A5');

// Conditionally set the title text
const titleText = (formData.transactiontype === '1' || formData.transactiontype === '4')
  ? `Transaction Reports - ${eligibility.find(option => option.value === String(formData.EligibilityStatus))?.label || formData.EligibilityStatus}`
  : 'Transaction Reports';  // Use a generic title for other transaction types

// Set the title value
titleCell.value = titleText;
// Apply styles to the title cell
titleCell.font = {
  name: 'Calibri',
  size: 9,
  bold: true,
  color: { argb: 'FF000000' }, // Black text
};
titleCell.alignment = {
  horizontal: 'center',
  vertical: 'middle',
};
titleCell.fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFC6DBFF' }, // Light blue background
};

    // Add report information
    const reportInfo = [
      ["Generated on", currentDateTime],
      ["Practice Name", practiceLabel],
      ["Input Parameters", ""],
      ["Transaction Type", transactionType1.find((option) => option.value === String(formData.transactiontype))?.label || formData.transactiontype],
      ...(formData.transactiontype.toString() === '1' || formData.transactiontype.toString() === '4'
      ? [["Eligibility Status", eligibility.find((option) => option.value === String(formData.EligibilityStatus))?.label || formData.EligibilityStatus]]
      : []), // Include "Eligibility Status" only for types 1 and 4
      ["From Date", formatDate(formData.fromDate)],
      ["To Date", formatDate(formData.toDate)],
    ];
  // Add report info (starting from row 6, no empty rows)
// Add report information (starting from row 6, no empty rows)
reportInfo.forEach((row, index) => {
  const rowNum = index + 6; // Row numbers after the title and empty rows
  const labelCell = worksheet.getCell(`A${rowNum}`);
  const valueCell = worksheet.getCell(`B${rowNum}`);

  labelCell.value = row[0];
  labelCell.font = { name: "Calibri", size: 9, bold: row[0] === "Input Parameters" };
  labelCell.alignment = { horizontal: "left", vertical: "middle" };

  valueCell.value = row[1];
  valueCell.font = { name: "Calibri", size: 8 }; // Smaller font size for answers
  valueCell.alignment = { horizontal: "left", vertical: "middle" };
});

// Add one empty row before the headers
worksheet.addRow([]); // Empty row 1

// Add headers (starting from row 15, after one empty row)
const headerRow = worksheet.getRow(15); // Row 15 for headers
headers.forEach((header, colIndex) => {
  const cell = headerRow.getCell(colIndex + 1);
  cell.value = header;

  // Apply header styles
  cell.fill = headerStyle.fill;
  cell.font = headerStyle.font;
  cell.alignment = headerStyle.alignment;
  cell.border = headerStyle.border;
});

// Add data (starting from row 16, after one empty row and the header)
const dataStartRow = 16; // Start data from row 16
dataToExport.forEach((row, rowIndex) => {
  const currentRow = worksheet.getRow(dataStartRow + rowIndex);
  Object.values(row).forEach((value, colIndex) => {
    const cell = currentRow.getCell(colIndex + 1);
    cell.value = value;

    // Apply data cell styles
    cell.font = cellStyle.font;
    cell.alignment = cellStyle.alignment;
    cell.border = cellStyle.border;
  });
});


// Generate and download the Excel file
try {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Transaction Reports.xlsx";
  link.click();
  window.URL.revokeObjectURL(url);
} catch (error) {
  console.error("Error generating Excel file:", error);
}
  }
  
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
            <CustomSelect
              label="Transaction Type"
              name="transactiontype"
              value={formData.transactiontype || ""}
              onChange={e =>
                handleSelectChange("transactiontype", e.target.value)}
              options={transactionType1}
              star
              ref={activeRef}
            />
          </Grid>
          {(formData.transactiontype === "1" ||
            formData.transactiontype === "4") &&
            <Grid item xs={12} sm={3}>
              <CustomSelect
                label="Eligibility Status"
                name="EligibilityStatus"
                value={formData.EligibilityStatus || ""}
                onChange={e =>
                  handleSelectChange("EligibilityStatus", e.target.value)}
                options={eligibility}
                star
                ref={eligibilityRef}
              />
            </Grid>}

          <Grid item xs={12} sm={3} style={{ whiteSpace: "nowrap" }}>
            <CustomDatePicker
              label="From Date"
              name="fromDate"
              value={formData.fromDate}
              onChange={newValue => handleDateTimeChange("fromDate", newValue)}
              star
              ref={fromRef}
            />
          </Grid>

          <Grid item xs={12} sm={3} style={{ whiteSpace: "nowrap" }}>
            <CustomDatePicker
              label="To Date"
              name="toDate"
              value={formData.toDate}
              onChange={newValue => handleDateTimeChange("toDate", newValue)}
              star
              ref={toRef}
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
              label="Details"
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
            <Button
              onClick={handleExportToExcel}
              color="primary"
              style={{
                backgroundColor: "skyblue",
                color: "black",
                marginLeft: isSmallScreen ? "180px" : "650px",
                marginTop: "30px"
              }}
            >
              Export
            </Button>
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

export default Transaction;
