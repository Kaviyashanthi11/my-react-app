import React, { useState, useEffect } from "react";
import CustomTable from "../maintain/second/CustomTable";
import Layout from "../Top/Layout";
import moment from "moment-timezone";
import * as XLSX from "sheetjs-style";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button } from "@mui/material";
const ActivePremiumCustomer = () => {
  const [data, setData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  useEffect(() => {
    const updateDateTime = () => {
      const chicagoDateTime = moment()
        .tz("America/Chicago")
        .format("MM/DD/YYYY HH:mm:ss");
      setCurrentDateTime(chicagoDateTime);
    };

    updateDateTime(); // Initial call to set the time immediately
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "/React/web/index.php?r=report/active-premium-customer"
      );
      const result = await response.json();
      if (response.ok) {
        const transformedData = result.map((item, index) => ({
          ...item,
          id: index + 1,
          serialNumber: index + 1,
          dtCreatedOn: item.dtCreatedOn
        }));
        setData(transformedData);
      } else {
        console.error("Error fetching data:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "SNo",
      headerName: "SI No",
      headerClassName: "sample",
      width: 50
    },
    {
      field: "Customer Type",
      headerName: "Customer Type",
      width: 150
    },
    {
      field: "Customer ID",
      headerName: "Customer ID",
      width: 150
    },
    {
      field: "Customer Name",
      headerName: "Customer Name",
      width: 200
    },
    {
      field: "Address 1",
      headerName: "Address 1",
      width: 150
    },
    {
      field: "Address 2",
      headerName: "Address 2",
      width: 150
    },
    {
      field: "City",
      headerName: "City",
      width: 100
    },
    {
      field: "State",
      headerName: "State",
      width: 100
    },
    {
      field: "ZIP",
      headerName: "Zip",
      width: 100
    },
    {
      field: "Active From",
      headerName: "Active From",
      width: 150
    },
    {
      field: "Active To",
      headerName: "Active To",
      width: 150
    },
    {
      field: "Contact Name",
      headerName: "Contact Name",
      width: 150
    },
    {
      field: "Contact No",
      headerName: "Contact No",
      width: 150
    },
    {
      field: "Email ID",
      headerName: "Email ID",
      width: 200
    }
  ];
  const headerStyle = {
    font: {
      name: "Calibri",
      sz: 9,
      bold: true
    },
    fill: {
      fgColor: { rgb: "C2E0F9" } // Blue background for the header
    },
    border: {
      top: { color: { rgb: "808080" } }, // Grey border
      bottom: { color: { rgb: "808080" } },
      left: { color: { rgb: "808080" } },
      right: { color: { rgb: "808080" } }
    },
    alignment: {
      horizontal: "center", // Center-align text
      vertical: "center"
    }
  };

  const styles = {
    leftAligned: {
      alignment: { horizontal: "left", vertical: "center", wrapText: true },
      font: { name: "Calibri", sz: 8 }
    },
    centerAligned: {
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      font: { name: "Calibri", sz: 8 }
    }
  };

  const handleExportToExcel = () => {
    const dataToExport =
      data.length > 0
        ? data.map(item => ({
            SNO: item.SNo,
            "Customer Type": item["Customer Type"],
            "Customer Name": item["Customer Name"],
            "Customer ID": item["Customer ID"],
            "Address 1": item["Address 1"],
            "Address 2": item["Address 2"],
            City: item.City,
            State: item.State,
            Zip: item.ZIP,
            "Active From": item["Active From"],
            "Active To": item["Active To"],
            "Contact Name": item["Contact Name"],
            "Contact No": item["Contact No"],
            "Email ID": item["Email ID"]
          }))
        : [
            { "No results found": "No results found." } // Add a single row indicating no results
          ];

    const headers = [
      "SNO",
      "Customer Type",
      "Customer Name",
      "Customer ID",
      "Address 1",
      "Address 2",
      "City",
      "State",
      "Zip",
      "Active From",
      "Active To",
      "Contact Name",
      "Contact No",
      "Email ID"
    ];
    const ws = XLSX.utils.aoa_to_sheet([
      ["Active Premium Customers Reports"], // Title row
      ["Generated on", currentDateTime], // Generated date row
      [], // Empty row
      [], // Empty row
      headers, // Header row
      ...dataToExport.map(Object.values) // Data rows
    ]);

    // Apply column widths
    ws["!cols"] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 20 },
      { wch: 30 },
      { wch: 23 },
      { wch: 15 },
      { wch: 15 },
      { wch: 26 },
      { wch: 20 },
      { wch: 32 },
      { wch: 20 },
      { wch: 20 },
      { wch: 60 }
    ];

    // Style the title cell (centered, font size 8, bold)
    ws["A1"] = {
      v: "Active Premium Customers Report",
      t: "s",
      s: {
        font: { name: "Calibri", sz: 10, bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        fill: {
          fgColor: { rgb: "C2E0F9" } // Blue background for the header
        }
      }
    };

    // Get the range after creating the worksheet
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // Merge cells for title
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 13 } }];

    // Apply styles to header row (now row 5)
    for (let C = 0; C <= 13; C++) {
      const headerCell = XLSX.utils.encode_cell({ r: 4, c: C });
      if (!ws[headerCell]) continue;
      ws[headerCell].s = headerStyle;
    }
    // Apply styles to data cells (starting from row 4)
    for (let R = 5; R <= range.e.r; R++) {
      // Start from data rows
      for (let C = 0; C <= range.e.c; C++) {
        // Iterate through all columns
        const dataCell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[dataCell]) continue;

        // Apply styles based on column
        if (
          C === 1 ||
          C === 2 ||
          C === 4 ||
          C === 5 ||
          C === 6 ||
          C === 7 ||
          C === 13
        ) {
          // Left-aligned columns: 'Clearing House Name', 'Plan Name', etc.
          ws[dataCell].s = styles.leftAligned;
        } else {
          // Default to center-aligned
          ws[dataCell].s = styles.centerAligned;
        }
      }
    }
    ws["A2"] = {
      v: "Generated on",
      t: "s",
      s: {
        font: { name: "Calibri", sz: 9, bold: true },
        alignment: { horizontal: "left", vertical: "center" }
      }
    };

    ws["B2"] = {
      v: currentDateTime,
      t: "s",
      s: {
        font: { name: "Calibri", sz: 9, bold: true },
        alignment: { horizontal: "left", vertical: "center" }
      }
    };
    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Details");

    // Save file
    XLSX.writeFile(wb, "Active Premium.xlsx", {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
      cellStyles: true
    });
  };
  return (
    <Layout>
      <div>
        <h6
          style={{
            name: "Calibri",
            fontWeight: "bold",
            fontSize: "0.8rem",
            color: { rgb: "000000" },
            marginLeft: "-20px",
            position: "fixed",
            marginTop: "-10px"
          }}
        >
          Generated on: {currentDateTime}
        </h6>
        <br />
        <br />
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
    </Layout>
  );
};

export default ActivePremiumCustomer;
