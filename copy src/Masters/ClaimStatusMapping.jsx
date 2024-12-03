import { Button, Typography } from "@mui/material";
import Layout from "../Top/Layout";
import { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import logo from "../images/favicon.png";
import { enrollmentYesorNO } from "../dropoption/PlanPermiumTrail";
import CustomSelect from "../maintain/CustomSelect";
import { Mappingpayername } from "../dropoption/PlanPermiumTrail";
import CustomDataGrid from "../maintain/CustomDataGrid";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const ClaimStatusMapping = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchText] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch(
        "/React/web/index.php?r=api/claim-status-mapping-view"
      );
      const result = await response.json();
      if (response.ok) {
        const transformedData = result.map(item => ({
          ...item,
          id: item.iClaimStausRequiredFieldsMappingId
        }));
        setData(transformedData);
      } else {
        console.error("Error fetching data:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSave = (row, rowIndex) => {
    const scrollPosition = window.scrollY;
    setOpen(true);
    const requestData = {
      bNPIId: row.bNPIId || "0",
      bSubscriberId: row.bSubscriberId || "0",
      bLastName: row.bLastName || "0",
      bFirstName: row.bFirstName || "0",
      bDateOfBirth: row.bDateOfBirth || "0",
      bSex: row.bSex || "0",
      bClaimNumber: row.bClaimNumber || "0",
      bBillType: row.bBillType || "0",
      bBilledAmount: row.bBilledAmount || "0",
      bGroupNumber: row.bGroupNumber || "0",
      bBeginningDateOfService: row.bBeginningDateOfService || "0",
      bEndingDateOfService: row.bEndingDateOfService || "0",
      bPatLastName: row.bPatLastName || "0",
      bPatFirstName: row.bPatFirstName || "0",
      bPatDateOfBirth: row.bPatDateOfBirth || "0"
    };
    const url = `/React/web/index.php?r=api/claim-status-mapping-save&claimStatusMappingId=${row.iClaimStausRequiredFieldsMappingId}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.Success) {
          console.log("Save successful:", data.Success);
          alert("Data Saved Successfully");
          localStorage.setItem("savedData", JSON.stringify(requestData));
        } else {
          console.error("Save failed:", data);
        }
      })
      .catch(error => console.error("Error saving data:", error))
      .finally(() => {
        setOpen(false); // Close the modal or loading indicator
        window.scrollTo(0, scrollPosition); // Restore the scroll position
      });
  };
  useEffect(() => {
    const savedData = localStorage.getItem("savedData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
    }
  }, []);

  const handleSelectChange = (field, value, rowId) => {
    setData(prevData => {
      console.log("Before Update:", prevData);
      const updatedData = prevData.map(
        row => (row.id === rowId ? { ...row, [field]: value } : row)
      );
      console.log("After Update:", updatedData);
      return updatedData;
    });
  };

  const CustomRenderCell = ({
    field,
    value,
    handleSelectChange,
    options,
    rowId
  }) =>
    <div
      style={{
        alignItems: "start",
        fontSize: "0.8rem",
        marginLeft: "-60px"
      }}
    >
      <CustomSelect
        value={value}
        onChange={e => handleSelectChange(field, e.target.value, rowId)} // Ensure e.target.value is passed
        options={options}
      />
    </div>;

  const columns = [
    {
      field: "iClaimStausRequiredFieldsMappingId",
      headerName: "SNO",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample"
    },
    {
      field: "iPayerId",
      headerName: "Payer Name",
      headerClassName: "sample",
      flex: 1,
      minWidth: 250,
      renderCell: params => {
        const option = Mappingpayername.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : ""; // Ensure params.value is handled correctly
      }
    },
    {
      field: "bActiveStatus",
      headerName: "Status",
      minWidth: 110,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample",
      renderCell: params => {
        const isActive = params.value; // Assuming params.value is a boolean

        const textColor = isActive ? "green" : "red";

        return (
          <div
            style={{
              color: textColor,
              textAlign: "center",
              textTransform: "uppercase"
            }}
          >
            {isActive ? "Active" : "Inactive"}
          </div>
        );
      }
    },
    {
      field: "bNPIId",
      headerName: "Provider",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bNPIId"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bSubscriberId",
      headerName: "Member ID",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bSubscriberId"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bLastName",
      headerName: "Sub.Last Name",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bLastName"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bFirstName",
      headerName: "Sub.First Name",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bFirstName"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bDateOfBirth",
      headerName: "Sub.Date of Birth",
      minWidth: 140,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bDateOfBirth"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bSex",
      headerName: "Sub.Gender",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bSex"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bClaimNumber",
      headerName: "Claim #",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bClaimNumber"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bBillType",
      headerName: "Type of Service",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bBillType"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bBilledAmount",
      headerName: "Total Charge",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bBilledAmount"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bGroupNumber",
      headerName: "Group Number",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bGroupNumber"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bBeginningDateOfService",
      headerName: "From DOS",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bBeginningDateOfService"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bEndingDateOfService",
      headerName: "To DOS",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bEndingDateOfService"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bPatLastName",
      headerName: "Pat.Last Name",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bPatLastName"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bPatFirstName",
      headerName: "Pat.First Name",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bPatFirstName"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },
    {
      field: "bPatDateOfBirth",
      headerName: "Pat.Date of Birth",
      minWidth: 130,
      flex: 1,
      headerClassName: "sample",
      renderCell: params =>
        <CustomRenderCell
          field="bPatDateOfBirth"
          value={params.value}
          handleSelectChange={handleSelectChange}
          options={enrollmentYesorNO}
          rowId={params.id}
        />
    },

    {
      field: "actions",
      headerName: "Actions",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample",
      renderCell: params =>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSave(params.row, params.rowIndex)}
          style={{
            backgroundColor: "#0091ea",
            color: "white",
            height: "20px",
            fontSize: "0.8rem"
          }}
        >
          Save
        </Button>
    },
    {
      field: "history",
      headerName: "History",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample",
      renderCell: params =>
        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#66bb6a",
            color: "white",
            height: "20px",
            fontSize: "0.8rem"
          }}
        >
          History
        </Button>
    }
  ];

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = event => {
    setPageSize(Number(event.target.value));
  };
  const convertToString = (value, options) => {
    const parsedValue = parseInt(value, 10);
    return options[parsedValue] || "";
  };
  useEffect(
    () => {
      if (Array.isArray(data)) {
        const filtered = data.filter(row => {
          const eligibility = convertToString(row.bActiveStatus, {
            1: "Active",
            0: "Inactive"
          });

          const searchableFields = [
            row.bNPIId || "",
            row.bSubscriberId || "",
            row.bLastName || "",
            row.bFirstName || "",
            row.bDateOfBirth || "",
            row.bSex || "",
            row.bClaimNumber || "",
            row.bBillType || "",
            row.bBilledAmount || "",
            row.bGroupNumber || "",
            row.bBeginningDateOfService || "",
            row.bEndingDateOfService || "",
            row.bPatLastName || "",
            row.bPatFirstName || "",
            row.bPatDateOfBirth || "",
            eligibility || ""
          ];

          return searchableFields
            .map(field => String(field).toLowerCase())
            .some(value => value.includes(searchText.toLowerCase()));
        });
        setFilteredRows(filtered); // Ensure this is always an array
      } else {
        setFilteredRows([]); // Reset to empty array if data is not an array
      }
    },
    [data, searchText]
  );

  // Ensure filteredRows is treated as an array
  const paginatedRows = Array.isArray(filteredRows)
    ? filteredRows.slice((page - 1) * pageSize, page * pageSize)
    : [];

  return (
    <Layout>
      <Box mt={5}>
        <Typography
          style={{
            color: "#29B6F6",
            fontSize: "large",
            marginBottom: isSmallScreen ? "25px" : "40px"
          }}
        >
          Claim Status Mapping List
        </Typography>
        <CustomDataGrid
          rows={paginatedRows}
          columns={columns}
          pageSize={pageSize}
          handlePageSizeChange={handlePageSizeChange}
          handlePageChange={handlePageChange}
          page={page}
          filteredRows={filteredRows}
        />
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <img src={logo} alt="loading" />
      </Backdrop>
    </Layout>
  );
};

export default ClaimStatusMapping;
