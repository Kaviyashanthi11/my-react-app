import React, { useCallback } from "react";
import Layout from "../Top/Layout";
import Box from "@mui/material/Box";
import { useEffect, useState, useRef } from "react";
import CustomSearch from "../maintain/CustomSearch";
import CustomDataGrid from "../maintain/CustomDataGrid";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import { userActive } from "../dropoption/PlanPermiumTrail";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CustomTextField from "../maintain/CustomTextField";
import CustomSelect from "../maintain/CustomSelect";
import EditIcon from "@mui/icons-material/Edit";
import { Form } from "react-bootstrap";

function UserMaster() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const userRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const [formData, setFormData] = useState({
    sUserId: "",
    sUserName: "",
    sUserEmailId: "",
    bIsUserActive: "",
    tmUserLastLogin: "",
    bIsLoginSessionStatus: "",
    sIPAddress: "",
    iBillingOfficeId: ""
  });

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };
  const formatLastLogin = value => {
    // Replace "0000-00-00 00:00:00" with an empty string
    return value === "0000-00-00 00:00:00" ? "" : value;
  };
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("React/web/index.php?r=api/user-data-view");
      const result = await response.json();
      if (response.ok) {
        const transformedData = result.map((item, index) => ({
          ...item,
          id: index + 1,
          serialNumber: index + 1,
          tmUserLastLogin: formatLastLogin(item.tmUserLastLogin)
        }));
        setData(transformedData);
      } else {
        console.error("Error fetching data:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);
  useEffect(
    () => {
      fetchData();
    },
    [fetchData]
  );

  const handleEdit = params => {
    const itemToEdit = data.find(item => item.id === params.id);
    const formattedItemToEdit = {
      ...itemToEdit,

      bIsUserActive: itemToEdit.bIsUserActive.toString()
    };
    setFormData(formattedItemToEdit);
    setIsEditing(true);
    setOpen(true);
  };

  const handleSubmit = event => {
    event.preventDefault();

    const updatedRowData = {
      sUserName: formData.sUserName,
      sUserEmailId: formData.sUserEmailId,
      bIsUserActive: formData.bIsUserActive
    };
    delete updatedRowData.id;
    fetch(
      `/React/web/index.php?r=api/user-data-save&userId=` + formData.iUserId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedRowData)
      }
    )
      .then(response => {
        if (response.ok) {
          alert("Data Saved Successfully");
          const updatedTableData = data.map(
            item => (item.id === formData.id ? formData : item)
          );
          setData(updatedTableData);
          console.log(updatedRowData);
          setFormData({});
          setIsEditing(false);
          setOpen(false);
        } else {
          throw new Error("Failed to update row");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value // This will update the correct field based on the name
    }));
  };

  const columns = [
    {
      field: "serialNumber",
      headerName: "SI No",
      minWidth: 60,
      flex: 1,
      headerClassName: "sample"
    },
    {
      field: "sUserId",
      headerName: "User ID",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample"
    },
    {
      field: "sUserName",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample"
    },
    {
      field: "sUserEmailId",
      headerName: "Email ID",
      minWidth: 300,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample"
    },
    {
      field: "iBillingOfficeId",
      headerName: "Customer Name",
      headerClassName: "sample",
      minWidth: 300,
      flex: 1,
      renderCell: params => {
        const value = parseInt(params.value, 10);
        const BillingOffice = {
          117: "YYY BILLING COMPANY 08282018"
        };
        return BillingOffice[value] || "";
      }
    },
    {
      field: "bIsUserActive",
      headerName: "Status",
      minWidth: 100,
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
      field: "bIsLoginSessionStatus",
      headerName: "Login Status",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample",
      renderCell: params => {
        const text = params.value === 1 ? "Online" : "";
        const color = params.value === 1 ? "green" : "";
        return (
          <div style={{ color }}>
            {text}
          </div>
        );
      }
    },
    {
      field: "tmUserLastLogin",
      headerName: "Last Login",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample"
    },
    {
      field: "sIPAddress",
      headerName: "IP Address",
      minWidth: 180,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "sample"
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      headerClassName: "sample",
      flex: 1,
      disableColumnMenu: true,
      renderCell: params =>
        <IconButton
          onClick={() => handleEdit(params.row)}
          sx={{
            backgroundColor: "#00CED1",
            padding: "4px",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "#00CED1"
            }
          }}
        >
          <EditIcon
            sx={{
              fontSize: "16px",
              color: "#ffffff"
            }}
          />
        </IconButton>
    }
  ];
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = event => {
    setPageSize(Number(event.target.value));
  };

  // Function to convert value based on options
  const convertToString = (value, options) => {
    const parsedValue = parseInt(value, 10);
    return options[parsedValue] || "";
  };

  useEffect(
    () => {
      const filtered = data.filter(row => {
        const eligibility = convertToString(row.bIsUserActive, {
          1: "Active",
          0: "Inactive",
          2: "Auto Dormant",
          3: "Bad Attempt Lock",
          4: "Bad Security Question Lock"
        });

        const searchableFields = [
          row.iUserId,
          row.sUserId,
          row.sUserEmailId,
          row.sUserName,
          row.bIsUserActive,
          row.tmUserLastLogin,
          row.bIsLoginSessionStatus,
          row.iUserId,
          eligibility,
          row.sIPAddress,
          row.iBillingOfficeId
        ];

        return searchableFields
          .map(field => String(field).toLowerCase())
          .some(value => value.includes(searchText.toLowerCase()));
      });
      setFilteredRows(filtered);
    },
    [data, searchText]
  );

  const paginatedRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSearchTextChange = event => {
    setSearchText(event.target.value);
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
        <Box mt={5}>
          <Typography
            style={{
              marginefLt: "10px",
              fontSize: "large",
              color: "#29B6F6"
            }}
          >
            User List
          </Typography>
         
            <CustomSearch
              searchText={searchText}
              handleSearchTextChange={handleSearchTextChange}
            />
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

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle style={{ marginLeft: "150px", color: "#29B6F6" }}>
            {" "}User Master
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={18} style={{ marginRight: "80px" }}>
                <CustomTextField
                  label="User ID"
                  name="sUserId"
                  value={formData.sUserId}
                  onChange={handleChange}
                  star
                  ref={userRef}
                  disabled={isEditing}
                />

                <CustomTextField
                  label="Name"
                  name="sUserName"
                  value={formData.sUserName}
                  onChange={handleChange}
                  star
                  ref={nameRef}
                />

                <CustomTextField
                  label="Email-ID"
                  name="sUserEmailId"
                  value={formData.sUserEmailId}
                  onChange={handleChange}
                  star
                  ref={emailRef}
                  disabled={isEditing}
                />
                <CustomSelect
                  label="Is Active"
                  name="bIsUserActive"
                  value={formData.bIsUserActive}
                  onChange={handleChange}
                  options={userActive}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{ marginRight: "120px", marginBottom: "20px" }}>
            <Button
              onClick={handleSubmit}
              style={{ color: "black", backgroundColor: "#29B6F6" }}
            >
              Submit
            </Button>
            <Button
              onClick={handleClose}
              style={{ color: "black", backgroundColor: "#81c784" }}
            >
              Resend Password
            </Button>
            <Button
              onClick={handleClose}
              style={{ color: "White", backgroundColor: "black" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Form>
    </Layout>
  );
}

export default UserMaster;
