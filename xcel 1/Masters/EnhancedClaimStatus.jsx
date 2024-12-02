import React from 'react';
import { useState

} from 'react';
import { Form} from 'react-bootstrap';
import {IconButton, Typography,Button} from '@mui/material';
import { useEffect,useRef } from 'react';
import Box from '@mui/material/Box';
import * as XLSX from 'sheetjs-style';
import { FaFileExcel } from 'react-icons/fa'
import { Grid } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import logo from '../images/favicon.png';
import CustomTextField from '../maintain/CustomTextField';
import CustomSelect from '../maintain/CustomSelect';
import CustomTextArea from '../maintain/CustomTextArea';
import CustomMultiSelect from '../maintain/CustomMultiSelect';
import CustomSearch from '../maintain/CustomSearch';
import CustomDataGrid from '../maintain/CustomDataGrid';
import CustomOrderedList from '../maintain/CustomOrderedList';
import useMediaQuery from '@mui/material/useMediaQuery';
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

const EnhancedClaimStatus = () => {
  const [formData, setFormData] = useState( 
    {
      "iClearingHouseMasterID":"",
      "iPlanMasterID":"",
      "iRateCategoryID":"",
      "sPayerName":"",
      "sCHPayerName":"",
      "sPayerID":"",
      "sAPIPayerName":"",
      "iNPIType":"",
      "bIsEnrollmentrequired":"",
      "sSubmissionType":"1,2,3,4",
      "bIsRateCategoryVsRateActive":"",
      "sInactiveReason":"",
      "sComments":"",
      "dGatewayFee":"",
      "bClaimNumber":0,
      "bClaimAmount":0,
      "bFacilityTypeCode":0,
      "bFrequencyTypeCode":0,
      "bPatAcctNum":0,
      "bPatGender":0,
      "bProviderPayerAssignedId":0,
      "bProviderTax":0
    }
    );
    const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false); 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [currentComment, setCurrentComment] = useState("");
  const [commentsHistory, setCommentsHistory] = useState([]); 
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
      const response = await fetch('/React/web/index.php?r=api/enhanced-claim-status-payer-master-view');
      const result = await response.json();
      if (response.ok) {
        const transformedData = result.map((item, index) => ({
          ...item,
          id: item.iEnhancedClaimStatusMasterID || index, // Ensure unique ID
          dtCreatedOn: item.dtCreatedOn,
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
      field: "iEnhancedClaimStatusMasterID",
      headerName: "SI No",
      minWidth: 60,
      flex:1,
      headerClassName: "sample",
    },
    { field: 'iClearingHouseMasterID', headerName: 'Clearing House Name', minWidth: 200 ,disableColumnMenu: true ,headerClassName:"sample" ,flex:1,
      renderCell: params => {
        const option = clearingHouseOptions.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
    },
    { field: 'iPlanMasterID', headerName: 'Plan Name', minWidth: 150 ,disableColumnMenu: true ,headerClassName:"sample" ,flex:1,
      renderCell: params => {
        const option = planPremiumTrail.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
    },
    { field: 'iRateCategoryID', headerName: 'Rate Category', minWidth: 180 ,disableColumnMenu: true ,headerClassName:"sample" ,flex:1,
      renderCell: params => {
        const option = rateCategory.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
    },
    { field: 'sPayerName', headerName: 'Payer Name', minWidth: 200,disableColumnMenu: true, headerClassName:"sample",flex:1, },
    { field: 'sCHPayerName', headerName: 'CH Payer Name', minWidth: 300,disableColumnMenu: true ,headerClassName:"sample" ,flex:1,},
    { field: 'sPayerID', headerName: 'Payer ID', minWidth: 100,disableColumnMenu: true,headerClassName:"sample"  ,flex:1, },
    { field: 'sInactiveReason', headerName: 'Inactive Reason', minWidth: 150,disableColumnMenu: true,headerClassName:"sample",flex:1,  },
   { field: 'bIsEnrollmentrequired', headerName: 'Enrollment required', minWidth: 180, disableColumnMenu: true, headerClassName: "sample",flex:1,
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
    { field: 'dGatewayFee', headerName: 'Gateway Fee', minWidth: 120,disableColumnMenu: true ,headerClassName:"sample",flex:1,  },
    { field: 'sAPIPayerName', headerName: 'API Payer ID', minWidth: 150,disableColumnMenu: true,headerClassName:"sample",flex:1, },
   
    {
      field: 'sSubmissionType', 
      headerName: 'Submission Type', 
      minWidth: 150, 
      disableColumnMenu: true, 
      headerClassName: "sample",
      flex:1,
      renderCell: (params) => {
        const value = params.value;
        return (
          <span>{Array.isArray(value) ? value.join(', ') : value}</span>
        );
      },
    },
    
    { field: 'sComments', headerName: 'Comments', minWidth: 200 ,headerClassName:"sample",flex:1,},
    {
      field: 'bIsRateCategoryVsRateActive',
      headerName: 'Status',
      minWidth: 150,
      disableColumnMenu: true,
      headerClassName: 'sample',
      flex:1,
      renderCell: (params) => {
          const isActive = params.value;
          
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
      disableColumnMenu:true,
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
    if (name === "sComments" && isEditing) {
      // Special handling for comments when editing
      setCurrentComment(value);
    } else {
      // General form data update
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
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
      rateCategoryRef.current?.focus();
      return false;
    }
    if (!formData.sPayerName || formData.sPayerName.length < 1 || formData.sPayerName.length > 60) {
      alert('Payer Name must be between 1 and 60 characters.');
      payerNameRef.current?.focus();
      return false;
    }
    if (!nameRegex.test(formData.sPayerName)) {
      alert(' Payer Name must only contain alphabetic characters.');
      payerNameRef.current?.focus();
      return false;
    }
    if (!formData.sCHPayerName || formData.sCHPayerName.length < 1 || formData.sCHPayerName.length > 60) {
      alert('CH Payer Name must be between 1 and 60 characters.');
      chPayerNameRef.current?.focus();
      return false;
    }
    if (!nameRegex.test(formData.sCHPayerName)) {
      alert(' CH Payer Name must only contain alphabetic characters.');
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
        bIsRateCategoryVsRateActive: itemToEdit.bIsRateCategoryVsRateActive.toString(),
        sSubmissionType: itemToEdit.sSubmissionType || defaultSubmissionType,
      });
      setCurrentComment("");  // This will hold the comment being edited
      setCommentsHistory([...(itemToEdit.sCommentsHistory || []), itemToEdit.sComments]); // Load comment history if available
      setIsEditing(true);
      window.scrollTo(0, 0);
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
          sComments: currentComment,
          sCommentsHistory: [...commentsHistory, currentComment],// Append new comment to history
          bClaimNumber: formData.bClaimNumber || "0",
          bClaimAmount: formData.bClaimAmount || "0",
          bFacilityTypeCode: formData.bFacilityTypeCode || "0",
          bFrequencyTypeCode: formData.bFrequencyTypeCode || "0",
          bPatAcctNum: formData.bPatAcctNum || "0",
          bPatGender: formData.bPatGender || "0",
          bProviderPayerAssignedId: formData.bProviderPayerAssignedId || "0",
          bProviderTax: formData.bProviderTax || "0"
        };
    
        console.log("Updated Row Data:", updatedRowData);
    
        fetch(
          `/React/web/index.php?r=api/enhanced-claim-status-payer-master-save&id=` +
          formData.iEnhancedClaimStatusMasterID, {
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
                item.iEnhancedClaimStatusMasterID === formData.iEnhancedClaimStatusMasterID ? updatedRowData : item
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
          bIsEnrollmentrequired: formData.bIsEnrollmentrequired || "0",
          sAPIPayerName: formData.sAPIPayerName || "",
          bIsRateCategoryVsRateActive: formData.bIsRateCategoryVsRateActive || "1",
          sInactiveReason: formData.sInactiveReason || "",
          sSubmissionType: formData.sSubmissionType || SubmissionType,
          sComments: formData.sComments || "",
          sCommentsHistory: [currentComment],
    
        };
    
        console.log(postData);
    
        fetch("/React/web/index.php?r=api/enhanced-claim-status-payer-master-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
          .then((response) => response.json())
          .then((data) => {
            const iEnhancedClaimStatusMasterID = data.length + 1;
            const newRow = {
              id: iEnhancedClaimStatusMasterID,
              iClearingHouseMasterID: data.iClearingHouseMasterID,
              iPlanMasterID: data.iPlanMasterID,
              iRateCategoryID: data.iRateCategoryID,
              sPayerName: data.sPayerName,
              sCHPayerName: data.sCHPayerName,
              sPayerID: data.sPayerID,
              dGatewayFee: data.dGatewayFee,
              iNPIType: data.iNPIType,
              bIsEnrollmentrequired: data.bIsEnrollmentrequired,
              sAPIPayerName: data.sAPIPayerName,
              bIsRateCategoryVsRateActive: data.bIsRateCategoryVsRateActive,
              sInactiveReason: data.sInactiveReason,
              sComments: data.sComments,
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
      setOpen(true);
      setFormData({
        iClearingHouseMasterID: '',
        iPlanMasterID: '',
        iRateCategoryID: '',
        sPayerName: '',
        sCHPayerName: '',
        sPayerID: '',
        dGatewayFee: '',
        sAPIPayerName: '',
        bIsEnrollmentrequired: '0', // Set default value
        bIsRateCategoryVsRateActive: '1', // Set default value
        iNPIType: '1', // Set default value
        sInactiveReason: '',
        sComments: '',
        sSubmissionType: Submission.slice(0, 5).map((option) => option.value).join(","), // Default values for submission type
        bIsExtended: false,
      });
      setIsEditing(false);
    
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    };
    

  const handleExportToExcel = () => {
    const dataToExport = data.map(item => ({
      'S No':item.iEnhancedClaimStatusMasterID,
      'Clearing House Name': clearingHouseOptions.find(option => option.value === String(item.iClearingHouseMasterID))?.label || item.iClearingHouseMasterID,
      'Plan Name': planPremiumTrail.find(option => option.value === String(item.iPlanMasterID))?.label || item.iPlanMasterID,
      'Rate Category': rateCategory.find(option => option.value === String(item.iRateCategoryID))?.label || item.iRateCategoryID, 
      'Payer Name': item.sPayerName,
      'CH Payer Name': item.sCHPayerName,
      'Payer ID': item.sPayerID,
      'Gateway Fee': item.dGatewayFee,    
      'API Payer ID': item.sAPIPayerName,
      'Enrollment required': item.bIsEnrollmentrequired ? 'Yes' : 'No',
      'Is Active': item.bIsRateCategoryVsRateActive ? 'Active' : 'Inactive',
      'NPI Type': npiType.find(option => option.value === String(item.iNPIType))?.label || item.iNPIType, 
      'Inactive Reason': item.sInactiveReason,
      'Submission Type':  Submission.find(option => option.value === String(item.sSubmissionType))?.label || item.sSubmissionType,
      'Comments': item.sComments,
      
    }));
  
const headers= ['S No','Clearing House Name', 'Plan Name', 'Rate Category',  'Payer Name', 
        'CH Payer Name', 'Payer ID', 'Gateway Fee', 'API Payer ID', 'Enrollment required', 'Is Active', 'NPI Type',
        'Inactive Reason', 'Submission Type','Comments',];
        const ws = XLSX.utils.aoa_to_sheet([
          ['Enhanced Claim Status Payer Master'], // Title row
          [], // Empty row
          headers, // Headers in third row
          ...dataToExport.map(Object.values) // Data rows
        ]);
  
    ws['!cols'] = [
      {wch:10},
      { wch: 23 },  
      { wch: 15}, 
      { wch: 18 }, 
      { wch: 35 }, 
      { wch: 35 }, 
      { wch: 23 },
      { wch: 15 }, 
      { wch: 15 }, 
      { wch: 26 },
      { wch: 20 }, 
      { wch: 32 }, 
      { wch: 20 },
      { wch: 20 }, 
      {wch:40},
    ];
  
    const headerStyle = {
      font: {
        name: 'Calibri',
        sz: 9,
        bold: true,
      },
      fill: {
        fgColor: { rgb: 'C6DBFF' }  // Blue background for the header
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
  
    // Define cell style (grey borders, left-aligned text)
    const cellStyle = {
      font: {
        name: 'Calibri',
        sz: 8,
        color: { rgb: '000000' }
      },
      border: {
        top: {  color: { rgb: '808080' } },
        bottom: {  color: { rgb: '808080' } },
        left: {  color: { rgb: '808080' } },
        right: {  color: { rgb: '808080' } }
      },
      alignment: {
        horizontal: 'center',  // Center-align text
        vertical: 'center',
        wrapText: true  
      }
    };
  
    // Style the title cell (centered, font size 8, bold)
    ws['A1'] = {
      v: 'Enhanced Claim Status Payer Master',
      t: 's',
      s: {
        font: { name: 'Calibri', sz: 8, bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: {
          fgColor: { rgb: 'C6DBFF' }  // Blue background for the header
        },
      },
     
    };
  
    // Get the range after creating the worksheet
    const range = XLSX.utils.decode_range(ws['!ref']);
  
    // Merge cells for title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }];
  
    // Apply styles to header row (now row 3)
    for (let C = 0; C <= 14; C++) {
      const headerCell = XLSX.utils.encode_cell({ r: 2, c: C }); // Changed to r: 2 for third row
      if (!ws[headerCell]) continue;
      ws[headerCell].s = headerStyle;
    }
  
    // Apply styles to data cells (starting from row 4)
    for (let R = 3; R <= range.e.r; R++) { // Start from row 4 (index 3)
      for (let C = 0; C <= 14; C++) {
        const dataCell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[dataCell]) continue;
        ws[dataCell].s = cellStyle;
      }
    }
  
    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Enhanced Claim');
  
    // Save file
    XLSX.writeFile(wb, 'Enhanced Claim.xlsx', {
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
      const enrolledString = convertToString(row.bIsEnrollmentrequired, {
        '1': 'Yes',
        '0': 'No',
      });
      
      const eligibility = convertToString(row.bIsRateCategoryVsRateActive, {
        1: 'Active',
        0: 'Inactive',
      });
    
      const searchableFields = [
        row.sCHPayerName || '',
        row.sPayerName || '',
        row.iClearingHouseMasterID || '',
        row.iPlanMasterID || '',
        enrolledString || '',
        eligibility || '',
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

  // Pagination Handling
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const handleEnhanceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
          star
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
          name="bIsEnrollmentrequired"
          value={formData.bIsEnrollmentrequired}
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
          label="Is Active?"
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
  value={isEditing ? currentComment : formData.sComments} // Adjust based on edit mode
  onChange={handleSelectChange} // Pass the handler directly
  rows={3}
/>

        <CustomTextField
          label="Gateway Fee"
          name="dGatewayFee"
          value={formData.dGatewayFee}
          onChange={handleChange}
          ref={gatewayFeeRef}
        /><br/><br/>
          {isEditing && (
       <>
      <CustomOrderedList
        label="Comments History"
        name="sComments"
        value={formData.sComments} // Always show the original value in Comment history
        disabled
        onChange={() => {}}
      />
  </>)}
           </Grid>
           </Grid>
    {!isEditing && (
        <>
          <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px'}}>
            <Button onClick={handleSubmit} style={{marginRight:'30px',backgroundColor: '#00e5ff', color: 'black', }}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleReset} style={{backgroundColor: 'black', color: 'white', }} >
             Reset
              </Button>
          </Grid>
       <br/><br/><br/>
       </>
    )}
       {isEditing && (
       <>
      
          <Typography style={{marginLeft:isSmallScreen ?'150px':'700px',color:'#29b6f6',fontWeight:'bold',fontSize:'large'}}>Enhanced</Typography>
          <br/><br/>
          
          <Grid container spacing={6} style={{ boxSizing: 'border-box' }}>
          <Grid item xs={12} sm={6}>
          <CustomSelect
          label="Claim Number"
          name="bClaimNumber"
          value={formData.bClaimNumber}
          onChange={handleEnhanceChange}
          options={enrollmentYesorNO}
        />
        
          <CustomSelect
          label="Claim Amount"
          name="bClaimAmount"
          value={formData.bClaimAmount}
          onChange={handleEnhanceChange}
          options={enrollmentYesorNO}

        />
          <CustomSelect
          label="Facility Type Code"
          name="bFacilityTypeCode"
          value={formData.bFacilityTypeCode}
          onChange={handleEnhanceChange}
          options={enrollmentYesorNO}
        />
          <CustomSelect
          label="Frequency Type Code"
          name="bFrequencyTypeCode"
          value={formData.bFrequencyTypeCode}
          onChange={handleEnhanceChange}
          options={enrollmentYesorNO}
        />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <CustomSelect
          label="Patient Account Number"
          name="bPatAcctNum"
          value={formData.bPatAcctNum}
          onChange={handleEnhanceChange}
          options={enrollmentYesorNO}
        />
          <CustomSelect
          label="Patient Gender"
          name="bPatGender"
          value={formData.bPatGender}
          onChange={handleEnhanceChange}
          options={enrollmentYesorNO}
        />
          <CustomSelect
          label="Provider Payer Assigned Id"
          name="bProviderPayerAssignedId"
          value={formData.bProviderPayerAssignedId}
          onChange={handleEnhanceChange}
          options={enrollmentYesorNO}
          
        />
          <CustomSelect
          label="Provider Tax"
          name="bProviderTax"
          value={formData.bProviderTax}
          onChange={handleEnhanceChange}
          options={enrollmentYesorNO}
        />
</Grid>
</Grid>
<Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px'}}>
            <Button  onClick={handleSubmit} style={{marginRight:'30px',backgroundColor: '#00e5ff', color: 'black', }}>
             Save
            </Button>
            <Button  onClick={handleReset} style={{backgroundColor: 'black', color: 'white', }}>
             Cancel
              </Button>
          </Grid>
          </>)}
          {!isEditing && (
<>
        <Box mt={5}>
        <Typography style={{alignItems:'center',marginLeft:isSmallScreen?'':'20px',marginBottom:isSmallScreen?'-20px':'-23px',color: '#29B6F6',fontSize:isSmallScreen?'0.8rem':'1rem',fontWeight:'bold'}}
        >Enhanced Claim Status Payer</Typography>
       <IconButton onClick={handleExportToExcel} color="primary" style={{ marginLeft: isSmallScreen?'190px':'260px', marginTop: isSmallScreen?'-15px':'-21px' }}>
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

export default EnhancedClaimStatus;
