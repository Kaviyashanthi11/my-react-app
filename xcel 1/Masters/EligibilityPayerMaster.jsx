import React from 'react';
import { useState

} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Form} from 'react-bootstrap';
import { Grid,IconButton,Button } from '@mui/material';
import { useEffect,useRef } from 'react';
import Box from '@mui/material/Box';
import * as XLSX from 'sheetjs-style';
import { FaFileExcel } from 'react-icons/fa'
import Backdrop from '@mui/material/Backdrop';
import logo from '../images/favicon.png';
import CustomSelect from '../maintain/CustomSelect';
import CustomTextField from '../maintain/CustomTextField';
import CustomTextArea from '../maintain/CustomTextArea';
import CustomCheckbox from '../maintain/CustomCheck';
import CustomDataGrid from '../maintain/CustomDataGrid';
import CustomSearch from '../maintain/CustomSearch';
import CustomSelectWithCheckbox from '../maintain/CustomSelectCheck';

import {
  clearingHouseOptions,
  rateCategory,
  payer,
  enrollmentYesorNO,
  activeOrinactive,
  planPremiumTrail,searchoption
} from '../dropoption/PlanPermiumTrail';
import Layout from '../Top/Layout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@material-ui/core';
const EligibilityPayerMasterForm = () => {
  const [formData, setFormData] = useState({
    selectedOption: null,
    iClearingHouseMasterID: '',
    iPlanMasterID: '',
    iRateCategoryID: '',
    iEligibilityPayerType: '',
    sPayerName: '',
    sCHPayerName: '',
    sPayerID: '',
    dGatewayFee: '',
    sAPIPayerID: '',
    bIsEnrollmentrequired: '',
    bIsRateCategoryVsRateActive: '',
    bIsPdfrequired: '',
    sInactiveReason: '',
    sSearchOption: [],
    sComments: '',
    bIsExtended: false
  });
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);  
  const payerNameRef = useRef(null);
  const chPayerNameRef = useRef(null);
  const payerIDRef = useRef(null);
  const apiPayerIDRef = useRef(null);
  const inactiveReasonRef = useRef(null);
  const gatewayFeeRef = useRef(null);
  const payerTypeRef = useRef(null);
  const clearingHouseRef = useRef(null);
  const planNameRef = useRef(null);
  const rateCategoryRef = useRef(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/React/web/index.php?r=api/eligibility-payer-master-view');
      const result = await response.json();
      if (response.ok) {
        const transformedData = result.map((item,index) => ({
          ...item,
          id: index + 1,
          serialNumber: index + 1,
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
      field: "serialNumber",
      headerName: "SI No",
      minWidth: 60,
      headerClassName: "sample",
      flex:1
    },
    { field: 'iClearingHouseMasterID', headerName: 'Clearing House Name', minWidth: 200 ,disableColumnMenu: true ,
      headerClassName:"sample" , flex:1,
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
    { field: 'iRateCategoryID', headerName: 'Rate Category', minWidth: 150 ,disableColumnMenu: true ,headerClassName:"sample" , flex:1,
      renderCell: params => {
        const option = rateCategory.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
    },
    { field: 'iEligibilityPayerType', headerName: 'Payer Type', minWidth: 200 ,disableColumnMenu: true ,headerClassName:"sample" , flex:1,
      renderCell: params => {
        const option = payer.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
    },
    { field: 'sPayerName', headerName: 'Payer Name', minWidth: 200,disableColumnMenu: true, headerClassName:"sample", flex:1 },
    { field: 'sCHPayerName', headerName: 'CH Payer Name', minWidth: 300,disableColumnMenu: true ,headerClassName:"sample", flex:1 },
    { field: 'sPayerID', headerName: 'Payer ID', minWidth: 100,disableColumnMenu: true,headerClassName:"sample"  , flex:1 },
    { field: 'sAPIPayerID', headerName: 'API Payer ID', minWidth: 120,disableColumnMenu: true,headerClassName:"sample", flex:1 },
    { field: 'sInactiveReason', headerName: 'Inactive Reason', minWidth: 150,disableColumnMenu: true,headerClassName:"sample" , flex:1 },
    { field: 'bIsEnrollmentrequired', headerName: 'Enrollment required', minWidth: 180,disableColumnMenu: true, flex:1,
      headerClassName:"sample"  , renderCell: (params) => (params.value ? 'Yes' : 'No') },
    {
      field: 'bIsRateCategoryVsRateActive',
      headerName: 'Status',
      minWidth: 100,
      disableColumnMenu: true,
      flex:1,
      headerClassName: 'sample',
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
    { field: 'bIsExtended', headerName: 'Is Extended?', minWidth: 120, disableColumnMenu: true ,headerClassName:"sample" , flex:1,
      renderCell: (params) => (params.value ? 'Yes' : 'No') },
    { field: 'dGatewayFee', headerName: 'Gateway Fee', minWidth: 120,disableColumnMenu: true ,headerClassName:"sample"  ,flex:1, },
    { field: 'bIsPdfrequired', headerName: 'PDF required', minWidth: 150,disableColumnMenu: true,headerClassName:"sample",  flex:1,
      renderCell: (params) => (params.value ? 'Yes' : 'No') 
    },
    { field: 'sSearchOption', headerName: 'Search Option', minWidth: 150 ,disableColumnMenu: true,headerClassName:"sample", flex:1 },
    { field: 'sComments', headerName: 'Comments', minWidth: 200 ,headerClassName:"sample", flex:1},
    {
      field:'actions',
      headerName: 'Actions',
      minWidth: 100,
      headerClassName: "sample",
      flex:1,
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
    const { name, type, checked, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleCheckChange = (event) => {
    setSelectedOptions(event.target.value);
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
      if (!formData.sCHPayerName || formData.sCHPayerName.length < 1 || formData.sCHPayerName.length > 60) {
        alert('Payer Name must be between 1 and 60 characters.');
        chPayerNameRef.current?.focus();
        return false;
      }
      if (!nameRegex.test(formData.sCHPayerName)) {
        alert(' CH Payer Name must only contain alphabetic characters.');
        payerNameRef.current?.focus();
        return false;
      }
  
      if (!nameRegex.test(formData.sPayerName)) {
        alert('CH Payer Name must only contain alphabetic characters.');
        payerNameRef.current?.focus();
        return false;
      }
  
      if (!/^[a-zA-Z0-9]*$/.test(formData.sPayerID) || formData.sPayerID.length < 2 || formData.sPayerID.length > 20) {
        alert('Payer ID must be alphanumeric and between 2 and 20 characters.');
        payerIDRef.current?.focus();
        return false;
      }
  
      if (!/^[a-zA-Z0-9]*$/.test(formData.sAPIPayerID) || formData.sAPIPayerID.length !== 8) {
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
      const selectedOptionsArray = itemToEdit.sSearchOption ? itemToEdit.sSearchOption.split(',') : [];
      setOpen(true);
      setFormData({
        ...itemToEdit,
        bIsRateCategoryVsRateActive: itemToEdit.bIsRateCategoryVsRateActive.toString(),
        sSearchOption: selectedOptionsArray, 
      });
      setSelectedOptions(selectedOptionsArray);
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
      const searchOptionsString = selectedOptions.join(','); 
      // Check if it's an update operation
      if (isEditing) {
        const updatedRowData = {
          ...formData,
          sSearchOption: searchOptionsString, 
          
        };
    
        console.log("Updated Row Data:", updatedRowData);
    
        fetch(
          `/React/web/index.php?r=api/eligibility-payer-master-save&id=` +
            formData.iEligibilityPayerMasterID,
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
              // Update local state after successful server update
              const updatedTableData = data.map(
                item => (item.id === formData.id ? updatedRowData : item)
              );
              setData(updatedTableData);
              alert(" Data Updated successfully");
              handleReset();
              setIsEditing(false);
              setOpen(false);
            } else {
              throw new Error("Failed to update row");
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        const postData = {
          sCHPayerName: formData.sCHPayerName || "",
          bIsRateCategoryVsRateActive:
            formData.bIsRateCategoryVsRateActive || "1",
          sPayerName: formData.sPayerName || "",
          iClearingHouseMasterID: formData.iClearingHouseMasterID || "",
          iPlanMasterID: formData.iPlanMasterID || "",
          iRateCategoryID: formData.iRateCategoryID || "",
          iEligibilityPayerType: formData.iEligibilityPayerType || "1",
          sAPIPayerID: formData.sAPIPayerID || "",
          sPayerID: formData.sPayerID || "",
          bIsEnrollmentRequired: formData.bIsEnrollmentRequired || "0",
          sSearchOption: searchOptionsString,
          sInactiveReason: formData.sInactiveReason || "",
          sComments: formData.sComments || "",
          bIsPdfRequired: formData.bIsPdfRequired || false,
          bIsExtended: formData.bIsExtended || false,
          dGatewayFee: formData.dGatewayFee || ""
        };
  
        console.log(postData);
        fetch("/React/web/index.php?r=api/eligibility-payer-master-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(postData)
        })
          .then(response => response.json())
          .then(data => {
            const iEligibilityPayerMasterID = data.length + 1;
            const newRow = {
              id: iEligibilityPayerMasterID,
              sCHPayerName: data.sCHPayerName,
              bIsRateCategoryVsRateActive: data.bIsRateCategoryVsRateActive,
              sPayerName: data.sPayerName,
              iClearingHouseMasterID: data.iClearingHouseMasterID,
              iPlanMasterID: data.iPlanMasterID,
              iRateCategoryID: data.iRateCategoryID,
              iEligibilityPayerType: data.iEligibilityPayerType,
              sAPIPayerID: data.sAPIPayerID,
              sPayerID: data.sPayerID,
              bIsEnrollmentRequired: data.bIsEnrollmentRequired,
              sSearchOption: data.sSearchOption,
              sInactiveReason: data.sInactiveReason,
              sComments: data.sComments,
              bIsPdfRequired: data.bIsPdfRequired,
              bIsExtended: data.bIsExtended,
              dGatewayFee: data.dGatewayFee
            };
            setData(prevState => [...prevState, newRow]);
            alert("Data Created successfully");
            console.log(newRow);
            fetchData();
            handleReset();
            setIsEditing(false);
            setOpen(false);
          })
          .catch(error => console.error("Error adding:", error));
      }
    };
    const handleReset = () => {
      setOpen(true)
      setFormData({
        iClearingHouseMasterID: '',
        iPlanMasterID: '',
        iRateCategoryID: '',
        iEligibilityPayerType: '',
        sPayerName: '',
        sCHPayerName: '',
        sPayerID: '',
        dGatewayFee: '',
        sAPIPayerID: '',
        bIsEnrollmentrequired: '',
        bIsRateCategoryVsRateActive: '',
        bIsPdfrequired: '',
        sInactiveReason: '',
        sSearchOption: [],
        sComments: '',
        bIsExtended: false
      });
      setIsEditing(false);
      setSelectedOptions([])
      setTimeout(() => {
        setOpen(false); // Close the backdrop after a delay or after an async operation
      }, 1000); // Adjust time as needed
    };
  
    const handleExportToExcel = () => {
      // Prepare data for export
      const dataToExport = data.map(item => ({
        'S NO':item.serialNumber,
        'Clearing House Name': clearingHouseOptions.find(option => option.value === String(item.iClearingHouseMasterID))?.label || item.iClearingHouseMasterID,
        'Plan Name': planPremiumTrail.find(option => option.value === String(item.iPlanMasterID))?.label || item.iPlanMasterID,
        'Rate Category': rateCategory.find(option => option.value === String(item.iRateCategoryID))?.label || item.iRateCategoryID,
        'Payer Type': payer.find(option => option.value === String(item.iEligibilityPayerType))?.label || item.iEligibilityPayerType,
        'Payer Name': item.sPayerName,
        'CH Payer Name': item.sCHPayerName,
        'Payer ID': item.sPayerID,
        'Gateway Fee': item.dGatewayFee,
        'API Payer ID': item.sAPIPayerID,
        'Enrollment required': item.bIsEnrollmentrequired ? 'Yes' : 'No',
        'Is Active': item.bIsRateCategoryVsRateActive ? 'Active' : 'Inactive',
        'Is Extended?': item.bIsExtended ? 'Yes' : 'No',
        'Inactive Reason': item.sInactiveReason,
        'Search Option': item.sSearchOption,
        'Comments': item.sComments,
        'PDF required': item.bIsPdfrequired ? 'Yes' : 'No',
      }));
    
      // Create worksheet with headers in the third row
      const headers = ['S NO','Clearing House Name', 'Plan Name', 'Rate Category', 'Payer Type', 'Payer Name', 
        'CH Payer Name', 'Payer ID', 'Gateway Fee', 'API Payer ID', 'Enrollment required', 'Is Active', 
        'Is Extended?', 'Inactive Reason', 'Search Option', 'Comments', 'PDF required'];
    
      // Create worksheet with empty data first
      const ws = XLSX.utils.aoa_to_sheet([
        ['Eligibility Payer Master'], // Title row
        [], // Empty row
        headers, // Headers in third row
        ...dataToExport.map(Object.values) // Data rows
      ]);
    
      ws['!cols'] = [
        {wch: 20},
        { wch: 23 },  
        { wch: 15 }, 
        { wch: 18 }, 
        { wch: 20 }, 
        { wch: 40 }, 
        { wch: 36 },
        { wch: 15 }, 
        { wch: 13 }, 
        { wch: 15 },
        { wch: 21 }, 
        { wch: 12 }, 
        { wch: 15 },
        { wch: 12 }, 
        { wch: 14 }, 
        { wch: 70 },
        { wch: 20 },
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
        v: 'Eligibility Payer Master',
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
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 16 } }];
    
      // Apply styles to header row (now row 3)
      for (let C = 0; C <= 16; C++) {
        const headerCell = XLSX.utils.encode_cell({ r: 2, c: C }); // Changed to r: 2 for third row
        if (!ws[headerCell]) continue;
        ws[headerCell].s = headerStyle;
      }
    
      // Apply styles to data cells (starting from row 4)
      for (let R = 3; R <= range.e.r; R++) { // Start from row 4 (index 3)
        for (let C = 0; C <= 16; C++) {
          const dataCell = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[dataCell]) continue;
          ws[dataCell].s = cellStyle;
        }
      }
    
      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Eligibility Payer Master');
    
      // Save file
      XLSX.writeFile(wb, 'Eligibility Payer Master.xlsx', {
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
  
  // Function to convert value based on options
  const convertToString = (value, options) => {
    const parsedValue = parseInt(value, 10);
    return options[parsedValue] || '';
  };

  useEffect(() => {
  const filtered = data.filter(row => {
    const enrolledString = convertToString(row.bIsEnrollmentrequired, {
      1: 'Yes',
      0: 'No',
    });
    const eligibility = convertToString(row.bIsRateCategoryVsRateActive, {
      1: 'Active',
      0: 'Inactive',
    });

    const searchableFields = [
      row.serialNumber,
      row.sCHPayerName,
      row.sPayerName,
      row.iClearingHouseMasterID,
      row.iPlanMasterID,
      row.sAPIPayerID,
      row.sPayerID,
      row.iEligibilityPayerMasterID,
      enrolledString,
      eligibility,
      row.sSearchOption,
      row.sInactiveReason,
      row.sComments,
      row.bIsPdfrequired,
      row.bIsExtended,
      row.dGatewayFee,
    ];

    return searchableFields
    .map(field => String(field).toLowerCase())
    .some(value => value.includes(searchText.toLowerCase()));
});
setFilteredRows(filtered);
}, [data, searchText]);

const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);



  const handleSearchTextChange = event => {
    setSearchText(event.target.value);
  };


  return (
    <Layout>
     <Form 
          style={{ width: '100%', 
            margin: '0 auto', boxSizing: 'border-box' ,marginRight:'1400px'}}>
        <Grid container spacing={2} style={{ boxSizing: 'border-box' }}>
          <Grid item xs={12} md={6} style={{ padding: '16px' }}>
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
           name="sAPIPayerID"
           value={formData.sAPIPayerID}
           onChange={handleChange}
           ref={apiPayerIDRef}
         />
         <CustomSelect
           label="Payer Type"
           name="iEligibilityPayerType"
           value={formData.iEligibilityPayerType}
           onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
           options={payer}
           star
           ref={payerTypeRef}
         />
       </Grid>

       <Grid item xs={12} md={6}>

         <CustomSelect
           label="Is Enrollment required?"
           name="bIsEnrollmentrequired"
           value={formData.bIsEnrollmentrequired}
           onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
           options={enrollmentYesorNO}
           star
         />
           <CustomSelect
           label="Is Active?"
           name="bIsRateCategoryVsRateActive"
           value={formData.bIsRateCategoryVsRateActive}
           onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
           options={activeOrinactive}
           star
         />
      <CustomSelectWithCheckbox
        options={searchoption}
        label="Select Options"
        selectedOptions={selectedOptions}
        handleSelectChange={handleCheckChange}
      />

       <br></br>
         <CustomTextArea
           label="Reason for Inactive"
           name="sInactiveReason"
           value={formData.sInactiveReason}
           onChange={handleSelectChange}
           rows={3}
           ref={inactiveReasonRef}
         />
         <CustomTextArea
           label="Comments"
           name="sComments"
           value={formData.sComments}
           onChange={ handleSelectChange}
           rows={3}
         />
         <CustomCheckbox
        label="Is Extended?"
        name="bIsExtended"
        checked={formData.bIsExtended}
        onChange={(e) => setFormData({ ...formData, bIsExtended: e.target.checked })}
      />
       <CustomCheckbox
        label="Is PDF required"
        name="bIsPdfrequired"
        checked={formData.bIsPdfrequired}
        onChange={(e) => setFormData({ ...formData, bIsPdfrequired: e.target.checked })}
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
            <Button onClick={handleSubmit} style={{marginRight:'30px',backgroundColor: '#00e5ff', color: 'black', }}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleReset} style={{backgroundColor: 'black', color: 'white', }}>
             Reset
              </Button>
          </Grid>
          {!isEditing && (
<>
        <Box mt={4}>
        <Typography style={{marginLeft:'10px',marginBottom:isSmallScreen?"-20px":"-15px",fontSize:'large',color: '#29B6F6'}}>Eligibility Payer List</Typography>
       <IconButton onClick={handleExportToExcel} color="primary" style={{ marginLeft: isSmallScreen?'180px':'250px',
         marginTop: isSmallScreen?"-25px":"-26px" }}>
              <FaFileExcel size={30} style={{ color: 'green' }} />
            </IconButton>
            <CustomSearch 
            style={{marginLeft:isSmallScreen?'-40px':''}}
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

export default EligibilityPayerMasterForm;
