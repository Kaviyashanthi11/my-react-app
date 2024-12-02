import React from 'react';
import { useState 

} from 'react';
import { Form } from 'react-bootstrap';
import { Grid,IconButton,Button} from '@mui/material';
import { useEffect ,useRef} from 'react';
import Box from '@mui/material/Box';
import * as XLSX from 'sheetjs-style';
import { FaFileExcel } from 'react-icons/fa'
import Backdrop from '@mui/material/Backdrop';
import logo from '../images/favicon.png';
import CustomTextField from '../maintain/CustomTextField';
import CustomSelect from '../maintain/CustomSelect';
import CustomTextArea from '../maintain/CustomTextArea';
import CustomMultiSelect from '../maintain/CustomMultiSelect';
import CustomSearch from '../maintain/CustomSearch';
import CustomDataGrid from '../maintain/CustomDataGrid';
import EditIcon from '@mui/icons-material/Edit';
import {
  clearingHouseOptions,
  rateCategory,
  enrollmentYesorNO,
  activeOrinactive,
  planPremiumTrail,
  npiType,
  Submission,
} from '../dropoption/PlanPermiumTrail';
import Layout from '../Top/Layout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@material-ui/core';
const ClaimStatusPayerMaster = () => {
  const [formData, setFormData] = useState(  {
    "iClearingHouseMasterID":"",
    "iPlanMasterID":"",
    "iRateCategoryID":"",
    "iClaimstatusPayerType":"",
    "sPayerName":"",
    "sCHPayerName":"",
    "sPayerID":"",
    "dGatewayFee":"",
    "iNPIType":"",
    "bIsEnrollmentRequired":"",
    "sAPIPayerName":"",
    "bIsRateCategoryVsRateActive":"",
    "sInactiveReason":"",
    "sSubmissionType":"1,2,3,4",
    "sComments":"",
  });
 const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false); 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const payerNameRef = useRef(null);
  const chPayerNameRef = useRef(null);
  const payerIDRef = useRef(null);
  const apiPayerIDRef = useRef(null);
  const inactiveReasonRef = useRef(null);
  const gatewayFeeRef = useRef(null);
  const clearingHouseRef = useRef(null);
  const planNameRef = useRef(null);
  const rateCategoryRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/React/web/index.php?r=api/claimstatus-payer-master-view');
      const result = await response.json();
      if (response.ok) {
        const transformedData = result.map((item, index) => ({
          ...item,
          id: item.iClaimStatusMasterID || index, // Ensure unique ID
          dtCreatedOn: item.dtCreatedOn,
          // bIsEnrollmentRequired: item.bIsEnrollmentRequired != null 
          // ? item.bIsEnrollmentRequired 
          // : "0", // Set default if null
        }));
        setData(transformedData);
      } else {
        console.error('Error fetching data:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const columns = [
    {
      field: "iClaimStatusMasterID",
      headerName: "SI No",
      minWidth: 60,
      headerClassName: "sample",
      flex:1,
    },
    { field: 'iClearingHouseMasterID', headerName: 'Clearing House Name', minWidth: 200 ,disableColumnMenu: true ,headerClassName:"sample" , flex:1,

      renderCell: params => {
        const option = clearingHouseOptions.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
    },
    { field: 'iPlanMasterID', headerName: 'Plan Name', minWidth: 150 ,disableColumnMenu: true ,headerClassName:"sample" , flex:1,

      renderCell: params => {
        const option = planPremiumTrail.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
    },
    { field: 'iRateCategoryID', headerName: 'Rate Category', minWidth: 180 ,disableColumnMenu: true ,headerClassName:"sample" , flex:1,
      renderCell: params => {
        const option = rateCategory.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
    },
    { field: 'sPayerName', headerName: 'Payer Name', minWidth: 200,disableColumnMenu: true, headerClassName:"sample",flex:1, },
    { field: 'sCHPayerName', headerName: 'CH Payer Name', minWidth: 300,disableColumnMenu: true ,headerClassName:"sample",flex:1, },
    { field: 'sPayerID', headerName: 'Payer ID', minWidth: 100,disableColumnMenu: true,headerClassName:"sample" ,flex:1,  },
    { field: 'sInactiveReason', headerName: 'Inactive Reason', minWidth: 150,disableColumnMenu: true,headerClassName:"sample",flex:1,  },
   { field: 'bIsEnrollmentRequired', headerName: 'Enrollment required', minWidth: 180, disableColumnMenu: true, headerClassName: "sample",flex:1,
      renderCell: params => {
        const option = enrollmentYesorNO.find(option => option.value === String(params.value));
        return option ? option.label : params.value;
      }
    },   
  { field: 'iNPIType', headerName: 'NPI Type', minWidth: 200 ,disableColumnMenu: true ,headerClassName:"sample" ,flex:1,
    renderCell: params => {
      const option = npiType.find(
        option => option.value === String(params.value)
      );
      return option ? option.label : params.value;
    }
  },
    { field: 'dGatewayFee', headerName: 'Gateway Fee', minWidth: 120,disableColumnMenu: true ,headerClassName:"sample" ,flex:1, },
    { field: 'sAPIPayerName', headerName: 'API Payer ID', minWidth: 150,disableColumnMenu: true,headerClassName:"sample",flex:1, },
   
    {
      field: 'sSubmissionType', 
      headerName: 'Submission Type', 
      minWidth: 150, 
      disableColumnMenu: true, 
      flex:1,
      headerClassName: "sample",
      renderCell: (params) => {
        const value = params.value;
        return (
          <span>{Array.isArray(value) ? value.join(', ') : value}</span>
        );
      },
    },
    
    { field: 'sComments', headerName: 'Comments', width: 200 ,headerClassName:"sample",flex:1,},
    {
      field: 'bIsRateCategoryVsRateActive',
      headerName: 'Status',
      minWidth: 150,
      disableColumnMenu: true,
      headerClassName: 'sample',
      flex:1,
      renderCell: (params) => {
          const isActive = params.value; // Assuming params.value is a boolean
          
          const textColor = isActive ? 'green' : 'red';

          return (
              <div style={{ color: textColor, textAlign: 'center',textTransform:'uppercase'}}>
                  {isActive ? 'Active' : 'Inactive'}
              </div>
          );
      },
  },
    {
      field:'actions',
      headerName: 'Actions',
      minWidth: 130,
      flex:1,
      headerClassName: "sample",
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
        onClick={() => handleEdit(params.row, params.rowIndex)}
          sx={{
            backgroundColor: '#00CED1',
            padding: '4px',
            alignItems:"center",
            '&:hover': {
              backgroundColor: '#00CED1',
            },
          }}
        >
          <EditIcon sx={{ 
            fontSize: '16px',
            color: '#ffffff'
          }} />
        </IconButton>
      )
    }
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
 
  const handleSelectChange = (name, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };
  const nameRegex = /^[A-Za-z\s]+$/;
  const validateFormData = () => {
    if (!formData.iClearingHouseMasterID) { // Assuming `selectedCustomOption` is your select field's state
      alert('Clearing House Name is required')
      clearingHouseRef.current?.focus(); // Replace with your actual ref for the select field
      return false;
    }
    if (!formData.iPlanMasterID) { // Assuming `selectedCustomOption` is your select field's state
      alert('Plan Name is required')
      planNameRef.current?.focus(); // Replace with your actual ref for the select field
      return false;
    }
    if (!formData.iRateCategoryID) { // Assuming `selectedCustomOption` is your select field's state
      alert('Rate Category is required')
      rateCategoryRef.current?.focus(); // Replace with your actual ref for the select field
      return false;
    }
    if (!formData.sPayerName || formData.sPayerName.length < 1 || formData.sPayerName.length > 60) {
      alert('Payer Name must be between 1 and 60 characters.');
      payerNameRef.current?.focus();
      return false;
    }
    
    if (!nameRegex.test(formData.sPayerName)) {
      alert('Payer Name must only contain alphabetic characters.');
      payerNameRef.current?.focus();
      return false;
    }
    if (!formData.sCHPayerName || formData.sCHPayerName.length < 1 || formData.sCHPayerName.length > 60) {
      alert('CH Payer Name must be between 1 and 60 characters.');
      chPayerNameRef.current?.focus();
      return false;
    }
    if (!nameRegex.test(formData.sPayerName)) {
      alert('CH Payer Name must only contain alphabetic characters.');
      chPayerNameRef.current?.focus();
      return false;
    }


   
    if (!/^[a-zA-Z0-9]*$/.test(formData.sPayerID) || formData.sPayerID.length < 2 || formData.sPayerID.length > 20) {
      alert('Payer ID must be alphanumeric and between 2 and 20 characters.');
      payerIDRef.current?.focus();
      return false;
    }

    if (!/^[a-zA-Z0-9]*$/.test(formData.sAPIPayerName) || formData.sAPIPayerName.length !== 8) {
      alert('API Payer ID must be alphanumeric and exactly 8 characters.');
      apiPayerIDRef.current?.focus();
      return false;
    }

    if (formData.sInactiveReason.length > 512) {
      alert('Reason for Inactive must not exceed 512 characters.');
      inactiveReasonRef.current?.focus();
      return false;
    }

    if (formData.dGatewayFee && !/^\d+(\.\d{1,2})?$/.test(formData.dGatewayFee)) {
      alert('Gateway Fee must be a valid decimal value.');
      gatewayFeeRef.current?.focus();
      return false;
    }
   
  
    return true;
  };  
    const handleEdit = (params) => {
      const itemToEdit = data.find((item) => item.id === params.id);
      console.log(itemToEdit);
    
      // Default values for submission type
      const defaultSubmissionType = Submission.slice(1, 5)
        .map((option) => option.value)
        .join(",");
    
      setOpen(true);
      setFormData({
        ...itemToEdit,
        // bIsEnrollmentRequired: itemToEdit.bIsEnrollmentRequired != null ? 
        // itemToEdit.bIsEnrollmentRequired.toString() : '0',
        bIsRateCategoryVsRateActive: itemToEdit.bIsRateCategoryVsRateActive != null ? itemToEdit.bIsRateCategoryVsRateActive.toString() : '1',
        sSubmissionType: itemToEdit.sSubmissionType || defaultSubmissionType,
      });
      setIsEditing(true);
    
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!validateFormData()) {
        return;
      }
    
      setOpen(true);
    
      // Check if it's an update operation
      if (isEditing) {
        const updatedRowData = {
          ...formData,
          bIsEnrollmentRequired: formData.bIsEnrollmentRequired || "0",  // Ensure non-null value
          bIsRateCategoryVsRateActive: formData.bIsRateCategoryVsRateActive || "1",
        };
    
        console.log("Updated Row Data:", updatedRowData);
    
        fetch(`/React/web/index.php?r=api/claimstatus-payer-master-save&id=${formData.iClaimStatusMasterID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRowData),
        })
          .then((response) => {
            if (response.ok) {
              // Update local state after successful server update
              const updatedTableData = data.map((item) =>
                item.iClaimStatusMasterID === formData.iClaimStatusMasterID ? updatedRowData : item
              );
              setData(updatedTableData);
              alert("Record Updated successfully");
              handleReset(); // Clear the form and reset the state
            } else {
              throw new Error("Failed to update row");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const SubmissionType = Submission.slice(0, 5)
          .map((option) => option.value)
          .join(",");
    
        const postData = {
          iClearingHouseMasterID: formData.iClearingHouseMasterID || "",
          iPlanMasterID: formData.iPlanMasterID || "",
          iRateCategoryID: formData.iRateCategoryID || "",
          sPayerName: formData.sPayerName || "",
          sCHPayerName: formData.sCHPayerName || "",
          sPayerID: formData.sPayerID || "",
          dGatewayFee: formData.dGatewayFee || "",
          iNPIType: formData.iNPIType || "1",
          sAPIPayerName: formData.sAPIPayerName || "",
          sInactiveReason: formData.sInactiveReason || "",
          sSubmissionType: formData.sSubmissionType || SubmissionType,
          bIsEnrollmentRequired: formData.bIsEnrollmentRequired || "0", // Fix casing here
          bIsRateCategoryVsRateActive: formData.bIsRateCategoryVsRateActive || "1",
          sComments: formData.sComments || "",
        };
    
        console.log(postData);
    
        fetch("/React/web/index.php?r=api/claimstatus-payer-master-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
          .then((response) => response.json())
          .then((data) => {
            const iClaimStatusMasterID = data.length + 1;
            const newRow = {
              id: iClaimStatusMasterID,
              ...data,
              sSubmissionType: SubmissionType,
            };
            setData((prevState) => [...prevState, newRow]);
            alert("Record Created successfully");
            fetchData(); // Refresh data
            handleReset(); // Clear the form and reset the state
          })
          .catch((error) => console.error("Error adding:", error));
      }
    };
const handleReset = () => {
  setOpen(true)
  setFormData({
    iClearingHouseMasterID: '',
    iPlanMasterID: '',
    iRateCategoryID: '',
    sPayerName: '',
    sCHPayerName: '',
    sPayerID: '',
    dGatewayFee: '',
    sAPIPayerName: '',
    bIsEnrollmentRequired: '',
    bIsRateCategoryVsRateActive: '',
    iNPIType: '',
    sInactiveReason: '',
    sComments: '',
    sSubmissionType: Submission.slice(0, 5).map((option) => option.value).join(","), // Default values for submission type
    bIsExtended: false
  });
  setIsEditing(false);
  setTimeout(() => {
    setOpen(false); // Close the backdrop after a delay or after an async operation
  }, 1000); // Adjust time as needed
};

  const handleExportToExcel = () => {
    const dataToExport =
    data.length > 0
      ? data.map(item => ({
      "S NO":item.iClaimStatusMasterID,
      'Clearing House Name': clearingHouseOptions.find(option => option.value === String(item.iClearingHouseMasterID))?.label || item.iClearingHouseMasterID,
      'Plan Name': planPremiumTrail.find(option => option.value === String(item.iPlanMasterID))?.label || item.iPlanMasterID,
      'Rate Category': rateCategory.find(option => option.value === String(item.iRateCategoryID))?.label || item.iRateCategoryID, 
      'Payer Name': item.sPayerName,
      'Payer ID': item.sPayerID,
      'API Payer ID': item.sAPIPayerName,
      'Enrollment required':  enrollmentYesorNO.find(option => option.value === String(item.bIsEnrollmentRequired))?.label || item.bIsEnrollmentRequired,
      'Status': item.bIsRateCategoryVsRateActive ? 'Active' : 'Inactive',
      'NPI Type': npiType.find(option => option.value === String(item.iNPIType))?.label || item.iNPIType, 
      'Inactive Reason': item.sInactiveReason,
      'Comments': item.sComments,
    }))  : [
      { "No results found": "No results found." } // Add a single row indicating no results
    ];
  
    const headers = ['S NO','Clearing House Name', 'Plan Name', 'Rate Category',  'Payer Name', 
       'Payer ID', 'API Payer ID', 'Enrollment required', 'Status', 'NPI Type',
        'Inactive Reason',  'Comments',];
      
        const ws = XLSX.utils.aoa_to_sheet([
          ['Claim Status Payer Master'], // Title row
          [], // Empty row
          headers, // Headers in third row
          ...dataToExport.map(Object.values) // Data rows
        ]);

    ws['!cols'] = [
      {wch:10},
      { wch: 23 },  
      { wch: 18 }, 
      { wch: 36 }, 
      { wch: 30 }, 
      { wch: 20 }, 
      { wch: 26 },
      { wch: 25 }, 
      { wch: 25 }, 
      { wch: 20 }, 
      {wch:39},
      {wch:80},
    ];
  
    const headerStyle = {
      font: {
        name: 'Calibri',
        sz: 9,
        bold: true,
      },
      fill: {
        fgColor: { rgb: 'C2E0F9' }  // Blue background for the header
      },
      border: {
        top: {  color: { rgb: '808080' } },  // Grey border
        bottom: {  color: { rgb: '808080' } },
        left: { color: { rgb: '808080' } },
        right: {  color: { rgb: '808080' } }
      },
      alignment: {
        horizontal: 'center',   // Center-align text
        vertical: 'center'
      }
    };
  
    const styles = {
      leftAligned: {
        alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
        font: { name: 'Calibri', sz: 8 },
      },
      centerAligned: {
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        font: { name: 'Calibri', sz: 8 },
      },
    };
    
  
    // Style the title cell (centered, font size 8, bold)
    ws['A1'] = {
      v: 'Claim Status Payer Master',
      t: 's',
      s: {
        font: { name: 'Calibri', sz: 10, bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: {
          fgColor: { rgb: 'C2E0F9' }  // Blue background for the header
        },
      },
     
    };
  
    // Get the range after creating the worksheet
    const range = XLSX.utils.decode_range(ws['!ref']);
  
    // Merge cells for title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
  
    // Apply styles to header row (now row 3)
    for (let C = 0; C <= 11; C++) {
      const headerCell = XLSX.utils.encode_cell({ r: 2, c: C }); // Changed to r: 2 for third row
      if (!ws[headerCell]) continue;
      ws[headerCell].s = headerStyle;
    }
  
   
    for (let R = 3; R <= range.e.r; R++) { // Start from data rows
      for (let C = 0; C <= range.e.c; C++) { // Iterate through all columns
        const dataCell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[dataCell]) continue;
    
        // Apply styles based on column
        if (C === 1 || C === 2 || C === 4 || C === 11 ||  C === 9 || C === 10) {
          // Left-aligned columns: 'Clearing House Name', 'Plan Name', etc.
          ws[dataCell].s = styles.leftAligned;
        } else {
          // Default to center-aligned
          ws[dataCell].s = styles.centerAligned;
        }
      }
    }
  
    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Details');
  
    // Save file
    XLSX.writeFile(wb, 'ClaimStatus Payer Master.xlsx', {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      cellStyles: true
    });
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
  }
  

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const convertToString = (value, options) => {
    const parsedValue = parseInt(value, 10);
    return options[parsedValue] || ''; 
  };
  useEffect(() => {
    const filtered = data.filter(row => {
      const enrolledString = convertToString(row.bIsEnrollmentRequired, {
        '1': 'Yes',
        '0': 'No',
      });
      
      const searchableFields = [
        row.iClaimStatusMasterID || '',
        row.sCHPayerName || '',
        row.sPayerName || '',
        row.iClearingHouseMasterID || '',
        row.iPlanMasterID || '',
        enrolledString || '',
        row.sAPIPayerID || '',
        row.sPayerID || '',
        row.sInactiveReason || '',
        row.sComments || '',
        row.dGatewayFee || '',
        row.sSubmissionType || '',
      ];

      return searchableFields
        .map(field => String(field).toLowerCase())
        .some(value => value.includes(searchText.toLowerCase()));
    });
    setFilteredRows(filtered);
  }, [data, searchText]);

  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Layout >
   <Form 
       style={{ width: '100%', 
        margin: '0 auto', boxSizing: 'border-box' ,marginRight:'1400px'}}>
        <Grid container spacing={2} style={{ boxSizing: 'border-box' }}>
          <Grid item xs={12} sm={6} style={{ padding: '16px' }}>
        <CustomSelect
          label="Clearing House Name"
          name="iClearingHouseMasterID"
          value={formData.iClearingHouseMasterID}
          onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
          options={clearingHouseOptions}
          star={true}
          ref={clearingHouseRef}
        />
        <CustomSelect
          label="Plan Name"
          name="iPlanMasterID"
          value={formData.iPlanMasterID}
            onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
          options={planPremiumTrail}
          star
          ref={planNameRef}
        />
        <CustomSelect
          label="Rate Category Name"
          name="iRateCategoryID"
          value={formData.iRateCategoryID}
          onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
          options={rateCategory}
          star
          ref={rateCategoryRef}
        />
       
        <CustomTextField
          label="Payer Name"
          name="sPayerName"
          value={formData.sPayerName}
          onChange={handleChange}
          star
          ref={payerNameRef}
        />
        <CustomTextField
          label="CH Payer Name"
          name="sCHPayerName"
          value={formData.sCHPayerName}
          onChange={handleChange}
          star
          ref={chPayerNameRef}
        />
         <CustomTextField
          label="Payer ID"
          name="sPayerID"
          value={formData.sPayerID}
          onChange={handleChange}
          star
          ref={payerIDRef}
        />
        <CustomTextField
          label="API Payer ID"
          name="sAPIPayerName"
          value={formData.sAPIPayerName}
          onChange={handleChange}
          star
          ref={apiPayerIDRef}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <CustomSelect
          label="NPI Type"
          name="iNPIType"
          value={formData.iNPIType}
          onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
          options={npiType}
          star
        />
        <CustomSelect
          label="Is Enrollment required?"
          name="bIsEnrollmentRequired"
          value={formData.bIsEnrollmentRequired || '0'} 
          onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
          options={enrollmentYesorNO}
          star
        />
           <CustomMultiSelect
        options={Submission}
        value={formData.sSubmissionType}
        onChange={handleChange}
        name="sSubmissionType"
        label="Submission Type"
        star={true}
      />
      <br></br>
        <CustomSelect
          label="Status?"
          name="bIsRateCategoryVsRateActive"
          value={formData.bIsRateCategoryVsRateActive}
          onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
          options={activeOrinactive}
          star
        />
        <CustomTextArea
          label="Reason for Inactive"
          name="sInactiveReason"
          value={formData.sInactiveReason}
          onChange={handleSelectChange}
          rows={3}
        />
        <CustomTextArea
          label="Comments"
          name="sComments"
          value={formData.sComments}
          onChange={handleSelectChange}
          rows={3}
        />
        <CustomTextField
          label="Gateway Fee"
          name="dGatewayFee"
          value={formData.dGatewayFee}
          onChange={handleChange}
          ref={gatewayFeeRef}
        />
      </Grid>
    </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px'}}>
            <Button  onClick={handleSubmit} style={{marginRight:'30px',backgroundColor: '#00e5ff', color: 'black', }}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button  onClick={handleReset} style={{backgroundColor: 'black', color: 'white', }}>
             Reset
              </Button>
          </Grid>
       <br/><br/>
          {!isEditing && (
<>
<Typography style={{marginBottom:isSmallScreen?"-48px":"-48px",fontSize:'large',color: '#29B6F6'}}>Claim Status Payer List</Typography>   
        <Box mt={5}>
            <IconButton onClick={handleExportToExcel} color="primary" style={{ marginLeft: isSmallScreen ? '190px':'250px', 
        marginTop:isSmallScreen?'-30px':'-30px' }}>
              <FaFileExcel size={30} style={{ color: 'green' }} />
            </IconButton>
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
      showColumnVisibility={true}
    />
</Box>
      </>
      )}
       
       <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={open}
      >
    <img src={logo} alt="loading" />
      </Backdrop>
      </Form>
      </Layout>
);
}

export default ClaimStatusPayerMaster;
