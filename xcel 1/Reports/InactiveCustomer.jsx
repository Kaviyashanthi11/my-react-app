import React, { useState, useEffect } from "react";
import CustomTable from "../maintain/second/CustomTable";
import Layout from "../Top/Layout";
import moment from "moment-timezone";
import * as XLSX from "sheetjs-style";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button } from "@mui/material";
const InactiveCustomers = () => {
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
        "/React/web/index.php?r=report/inactive-customers"
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
      field: "CustomerType",
      headerName: "Customer Type",
      width: 150
    },
    {
      field: "CustomerID",
      headerName: "Customer ID",
      width: 150
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      width: 200
    },
    {
      field: "Practice",
      headerName: "Practice",
      width: 150
    },
    {
      field: "NPI",
      headerName: "NPI",
      width: 200
    },
    {
      field: "Address1",
      headerName: "Address 1",
      width: 150
    },
    {
      field: "Address2",
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
      field: "ActiveFrom",
      headerName: "Active From",
      width: 150
    },
    {
      field: "ActiveTo",
      headerName: "Active To",
      width: 150
    },
    {
      field: "ContactName",
      headerName: "Contact Name",
      width: 180
    },
    {
      field: "ContactNo",
      headerName: "Contact No",
      width: 150
    },
    {
      field: "EmailID",
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
      fgColor: { rgb: "C6DBFF" } // Blue background for the header
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

  // Define cell style (grey borders, left-aligned text)
  const cellStyle = {
    font: {
      name: "Calibri",
      sz: 8,
      color: { rgb: "000000" }
    },
    border: {
      top: { color: { rgb: "808080" } },
      bottom: { color: { rgb: "808080" } },
      left: { color: { rgb: "808080" } },
      right: { color: { rgb: "808080" } }
    },
    alignment: {
      horizontal: "center", // Center-align text
      vertical: "center",
      wrapText: true
    }
  };

  const handleExportToExcel = () => {
    // Prepare data for export
    const dataToExport = data.map(item => ({
      SNO: item.SNo,
      "Customer Type": item["CustomerType"],
      "Customer Name": item["CustomerName"],
      "Customer ID": item["CustomerID"],
      "Address 1": item["Address1"],
      "Address 2": item["Address2"],
      Practice: item.Practice,
      NPI: item.NPI,
      City: item.City,
      State: item.State,
      Zip: item.ZIP,
      "Active From": item["ActiveFrom"],
      "Active To": item["ActiveTo"],
      "Contact Name": item["ContactName"],
      "Contact No": item["ContactNo"],
      "Email ID": item["EmailID"]
    }));

    const headers = [
      "SNO",
      "Customer Type",
      "Customer Name",
      "Customer ID",
      "Address 1",
      "Address 2",
      "Practice",
      "NPI",
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
      ["Inactive Customers Reports"], // Title row
      ["Generated on", currentDateTime], // Generated date row
      [], // Empty row
      [], // Empty row
      headers, // Header row
      ...dataToExport.map(Object.values) // Data rows
    ]);

    // Apply column widths
    ws["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 30 },
      { wch: 23 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 26 },
      { wch: 20 },
      { wch: 32 },
      { wch: 20 },
      { wch: 20 },
      { wch: 40 }
    ];

    // Style the title cell (centered, font size 8, bold)
    ws["A1"] = {
      v: "Inactive Customers Report",
      t: "s",
      s: {
        font: { name: "Calibri", sz: 8, bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        fill: {
          fgColor: { rgb: "C6DBFF" } // Blue background for the header
        }
      }
    };

    // Get the range after creating the worksheet
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // Merge cells for title
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 15 } }];

    // Apply styles to header row (now row 5)
    for (let C = 0; C <= 15; C++) {
      const headerCell = XLSX.utils.encode_cell({ r: 4, c: C });
      if (!ws[headerCell]) continue;
      ws[headerCell].s = headerStyle;
    }
    // Apply styles to data cells (starting from row 4)
    for (let R = 5; R <= range.e.r; R++) {
      // Start from row 4 (index 3)
      for (let C = 0; C <= 15; C++) {
        const dataCell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[dataCell]) continue;
        ws[dataCell].s = cellStyle;
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
    XLSX.utils.book_append_sheet(wb, ws, "Inactive Customers");

    // Save file
    XLSX.writeFile(wb, "Inactive Customers.xlsx", {
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

export default InactiveCustomers;
