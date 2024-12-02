import React from 'react'
import Layout from '../Top/Layout'
import { Form } from 'react-bootstrap';
import CustomTextField from '../maintain/CustomTextField'
import CustomSelect from '../maintain/CustomSelect'
import { useState,useEffect } from 'react'
import { Grid,Button,IconButton, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import logo from '../images/favicon.png';
import { activeOrinactive } from '../dropoption/PlanPermiumTrail'
import CustomSearch from '../maintain/CustomSearch';
import CustomDataGrid from '../maintain/CustomDataGrid';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';

import { useRef } from 'react';
const  PlanMaster=()=> {
    const [formData, setFormData] = useState(  {
        "sPlanMasterName":"",
        "dPlanRate":"",
        "iNoOfFreeTransaction":"",
        "bIsPlanMasterActive":"",
    })
    const planNameRef = useRef(null);
    const monthAmountRef = useRef(null);
    const freeRef = useRef(null);
    const activRef=useRef(null)
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false); 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filteredRows, setFilteredRows] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        try {
          const response = await fetch('/React/web/index.php?r=api/plan-master-view');
          const result = await response.json();
          if (response.ok) {
            const transformedData = result.map((item, index) => ({
              ...item,
              id: item.iPlanMasterID || index, // Ensure unique ID
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
      const handleChange = (e) => {
        const { name, value } = e.target;
      
        // Allow only numeric input for certain fields
        if (name === "dPlanRate" || name === "iNoOfFreeTransaction") {
          // Prevent non-numeric characters
          if (!/^\d*\.?\d*$/.test(value)) {
            return;
          }
        }
        setFormData({
          ...formData,
          [name]: value
        });
      };
      
     
      const handleSelectChange = (name, value) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value
        }));
      };
      const handleEdit = (params) => {
        const itemToEdit = data.find((item) => item.id === params.id);
        console.log(itemToEdit);
      
        setOpen(true);
        setFormData({
          ...itemToEdit,
          bIsPlanMasterActive: itemToEdit.bIsPlanMasterActive !== undefined ? 
          itemToEdit.bIsPlanMasterActive.toString() : '1',
        });
        setIsEditing(true);
      
        setTimeout(() => {
          setOpen(false);
        }, 3000);
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        const fields = [
          { ref: planNameRef, name: 'sPlanMasterName',label:'Plan Name' },
          { ref: monthAmountRef, name: 'dPlanRate',label:'Monthly Amount'},
          { ref: freeRef, name: 'iNoOfFreeTransaction' ,label:'No.Of Free Transaction'},
          { ref: activRef, name: 'bIsPlanMasterActive' },
      ];

      for (const field of fields) {
        if (!formData[field.name] && field.ref.current) { // Check if ref is defined
            field.ref.current.focus(); // Set focus to the first empty field
            alert(`${field.label} is required`); // Show alert with the correct field name
            return; // Stop further execution after the first empty field
        }
    }

        setOpen(true);
      
        // Check if it's an update operation
        if (isEditing) {
          const updatedRowData = {
            ...formData,
          };
      
          console.log("Updated Row Data:", updatedRowData);
      
          fetch(`/React/web/index.php?r=api/plan-master-save&id=${formData.iPlanMasterID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRowData),
          })
            .then((response) => {
              if (response.ok) {
           
                const updatedTableData = data.map((item) =>
                  item.iPlanMasterID === formData.iPlanMasterID ? updatedRowData : item
             );
                setData(updatedTableData);
                alert("Record Updated successfully");
                handleReset(); 
              } else {
                throw new Error("Failed to update row");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } 
          
          const postData = {
            sPlanMasterName: formData.sPlanMasterName || "",
            dPlanRate: formData.dPlanRate || "",
            iNoOfFreeTransaction: formData.iNoOfFreeTransaction || "",
            bIsPlanMasterActive: formData.bIsPlanMasterActive || "1",
         
          };
      
          console.log(postData);
      
          fetch("/React/web/index.php?r=api/plan-master-save ", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          })
            .then((response) => response.json())
            .then((data) => {
              const iPlanMasterID = data.length + 1;
              const newRow = {
                id: iPlanMasterID,
                ...data,
              };
              setData((prevState) => [...prevState, newRow]);
              alert("Record Created successfully");
              fetchData(); // Refresh data
              handleReset(); // Clear the form and reset the state
            })
            .catch((error) => console.error("Error adding:", error));
      };
      const handlePageChange = (event, newPage) => {
        setPage(newPage);
      };
      const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
      }
      const columns = [
        {
          field: "iPlanMasterID",
          headerName: "SI No",
          minWidth: 100,
          flex:1,
          headerClassName: "sample",
        },
        { field: 'sPlanMasterName', headerName: 'Plan Name', minWidth: 200,disableColumnMenu: true,flex:1,
          headerClassName:"sample" },
        { field: 'dPlanRate', headerName: 'Monthly Amount', minWidth: 300,disableColumnMenu: true ,headerClassName:"sample" ,flex:1,},
        { field: 'iNoOfFreeTransaction', headerName: 'No.of Free Transaction', minWidth: 250,
          disableColumnMenu: true,headerClassName:"sample",flex:1,   },
        {
          field: 'bIsPlanMasterActive',
          headerName: 'Status',
          minWidth: 200,
          flex:1,
          disableColumnMenu: true,
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
        {
          field:'actions',
          headerName: 'Actions',
          minWidth: 140,
          disableColumnMenu:true,
          headerClassName: "sample",
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
    
      const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
      };
    
      const convertToString = (value, options) => {
        const parsedValue = parseInt(value, 10);
        return options[parsedValue] || ''; 
      };
      useEffect(() => {
        const filtered = data.filter(row => {
          const eligibility = convertToString(row.bIsRateCategoryVsRateActive, {
            1: 'Active',
            0: 'Inactive',
          });
        
          const searchableFields = [
            row.dPlanRate || '',
            row.sPlanMasterName || '',
            row.iPlanMasterID || '',
            eligibility || '',
            row.iNoOfFreeTransaction || '',
          ];
    
          return searchableFields
            .map(field => String(field).toLowerCase())
            .some(value => value.includes(searchText.toLowerCase()));
        });
        setFilteredRows(filtered);
      }, [data, searchText]);
    
      const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
      const handleReset = () => {
        setOpen(true)
        setFormData({
          sPlanMasterName: '',
          dPlanRate: '',
          iNoOfFreeTransaction: '',
          bIsPlanMasterActive: '',
        });
        setIsEditing(false);
        setTimeout(() => {
          setOpen(false); // Close the backdrop after a delay or after an async operation
        }, 1000); // Adjust time as needed
      };
      // const handleExportToExcel = () => {
      //   // Prepare data for export
      //   const dataToExport = data.map(item => ({
      //     'Plan Name': item.sPlanMasterName || '', // Ensure a default value
      //     'Monthly Amount': item.dPlanRate || '',   // Ensure a default value
      //     'No. of Free Transactions': item.iNoOfFreeTransaction || '', // Ensure a default value
      //     'Status': item.bIsPlanMasterActive ? 'Active' : 'Inactive',
      //   }));
      
      //   // Create the worksheet from the prepared data
      //   const ws = XLSX.utils.json_to_sheet(dataToExport, {
      //     header: ['Plan Name', 'Monthly Amount', 'No. of Free Transactions', 'Status'],
      //     skipHeader: false,
      //   });
      
      //   // Set column widths
      //   ws['!cols'] = [
      //     { wch: 20 },  
      //     { wch: 20 }, 
      //     { wch: 28 }, 
      //     { wch: 15 }, 
      //   ];
      //   const headerStyle = {
      //     font: { bold: true, sz: 14, color: { rgb: '000000' } },
      //     fill: { fgColor: { rgb: '00FFFF' } },
      //   };
      //   const headerRange = XLSX.utils.decode_range(ws['!ref']).e.r; // Get the last row index
      
      //   for (let C = 0; C <= headerRange; C++) {
      //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      //     if (!ws[cellAddress]) continue;
      //     ws[cellAddress].s = headerStyle;
      //   }
      //   const wb = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(wb, ws, 'Plan Master');
      //   XLSX.writeFile(wb, 'Plan Master.xlsx');
      // };
      
      
  return (
  <Layout>
     <Form onSubmit={handleSubmit} 
   style={{ width: '100%', 
    margin: '0 auto', boxSizing: 'border-box' ,marginRight:'1400px'}}>
        <Grid container spacing={2} style={{ boxSizing: 'border-box' }}>
          <Grid item xs={12} sm={6} style={{ padding: '16px' }}>
          <CustomTextField
          label="Plan Name"
          name="sPlanMasterName"
          value={formData.sPlanMasterName}
          onChange={handleChange}
          star={true}
          ref={planNameRef}
        />
        <CustomTextField
          label="Monthly Amount"
          name="dPlanRate"
          value={formData.dPlanRate}
          onChange={handleChange}
          star={true}
          ref={monthAmountRef}
        />
         <CustomTextField
          label="No.of Free Transaction"
          name="iNoOfFreeTransaction"
          value={formData.iNoOfFreeTransaction}
          onChange={handleChange}
          star={true}
          ref={freeRef}
        />
         <CustomSelect
          label="Is Active?"
          name="bIsPlanMasterActive"
          value={formData.bIsPlanMasterActive}
          onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
          options={activeOrinactive}
          star={true}
          ref={activRef}
        />
        </Grid>
        </Grid>
         <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px',marginRight:isSmallScreen?'':'400px'}}>
            <Button  type="submit" style={{marginRight:'30px',backgroundColor: '#00e5ff', color: 'black', }}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button  onClick={handleReset} style={{backgroundColor: 'black', color: 'white', }} >
             Reset
              </Button>
          </Grid>
       
          {!isEditing && (
<>
        <Box mt={5}>
         <Typography style={{marginLeft:'20px',fontSize:'large',color: '#29B6F6'}}>Plan List</Typography>
       {/* <IconButton onClick={handleExportToExcel} color="primary" style={{ marginLeft: isSmallScreen ? '210px':'230px', 
        marginTop: '-70px' }}>
              <FaFileExcel size={30} style={{ color: 'green' }} />
            </IconButton> */}
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
  )
}
export default PlanMaster;