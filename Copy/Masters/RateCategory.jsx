import React from 'react'
import Layout from '../Top/Layout'
import { Form } from 'react-bootstrap';
import CustomTextField from '../maintain/CustomTextField'
import CustomSelect from '../maintain/CustomSelect'
import { useState,useEffect,useRef } from 'react'
import { Grid,Button,IconButton, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import logo from '../images/favicon.png';
import { activeOrinactive, clearingHouseOptions } from '../dropoption/PlanPermiumTrail'
import CustomSearch from '../maintain/CustomSearch';
import CustomDataGrid from '../maintain/CustomDataGrid';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';

const  RateCategory=()=> {
    const [formData, setFormData] = useState(  {
        "iClearingHouseMasterID":"",
        "sRateCatetoryName":"",
        "dRateAmount":"",
        "bIsRateCategoryActive":"1"
    })
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false); 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filteredRows, setFilteredRows] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState([]);
    const clearNameRef = useRef(null);
    const rateNameRef = useRef(null);
    const AmountRef = useRef(null);
    const activRef=useRef(null)
    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        try {
          const response = await fetch('/React/web/index.php?r=api/rate-category-master-view');
          const result = await response.json();
          if (response.ok) {
            const transformedData = result.map((item, index) => ({
              ...item,
              id: item.iRateCategoryID || index, // Ensure unique ID
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
        if ( name === "dRateAmount") {
          // Prevent non-numeric characters
          if (!/^\d*\.?\d*$/.test(value)) {
            return;
          }
        }
      
        // Update form data
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
          bIsRateCategoryActive: itemToEdit.bIsRateCategoryActive !== undefined ? 
          itemToEdit.bIsRateCategoryActive.toString() : '1',        });
        setIsEditing(true);
      
        setTimeout(() => {
          setOpen(false);
        }, 3000);
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        const fields = [
          { ref: clearNameRef, name: 'iClearingHouseMasterID',label:'Clearing House Name' },
          { ref: rateNameRef, name: 'sRateCatetoryName',label:'Rate Category Name'},
          { ref: AmountRef, name: 'dRateAmount',label:' Amount' },
          { ref: activRef, name: 'bIsRateCategoryActive' },
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
      
          fetch(`/React/web/index.php?r=api/rate-category-master-save&id=${formData.iRateCategoryID}`, {
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
                  item.iRateCategoryID === formData.iRateCategoryID ? updatedRowData : item
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
        } 
          
          const postData = {
            iClearingHouseMasterID: formData.iClearingHouseMasterID || "",
            sRateCatetoryName: formData.sRateCatetoryName || "",
            dRateAmount: formData.dRateAmount || "",
            bIsRateCategoryActive: formData.bIsRateCategoryActive || "1",
         
          };
      
          console.log(postData);
      
          fetch("/React/web/index.php?r=api/rate-category-master-save ", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          })
            .then((response) => response.json())
            .then((data) => {
              const iRateCategoryID = data.length + 1;
              const newRow = {
                id: iRateCategoryID,
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
          field: "iRateCategoryID",
          headerName: "SI No",
          minWidth: 100,
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
        { field: 'sRateCatetoryName', headerName: 'Rate category Name', minWidth: 300,disableColumnMenu: true ,headerClassName:"sample",flex:1, },
        { field: 'dRateAmount', headerName: 'Amount', minWidth: 200,
          disableColumnMenu: true,headerClassName:"sample" ,flex:1,  },
        {
          field: 'bIsRateCategoryActive',
          headerName: 'Status',
          minWidth: 200,
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
          minWidth: 140,
          flex:1,
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
            row.sRateCatetoryName || '',
            row.iClearingHouseMasterID || '',
            row.iRateCategoryID || '',
            eligibility || '',
            row.dRateAmount || '',
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
          iClearingHouseMasterID: '',
          sRateCatetoryName: '',
          dRateAmount: '',
          bIsRateCategoryActive: '',
        });
        setIsEditing(false);
        setTimeout(() => {
          setOpen(false); // Close the backdrop after a delay or after an async operation
        }, 1000); // Adjust time as needed
      };
      
        // const handleExportToExcel = () => {
        //   // Prepare data for export
        //   const dataToExport = data.map(item => ({
        //     'Clearing House Name': clearingHouseOptions.find(option => 
        //         option.value === String(item.iClearingHouseMasterID))?.label || item.iClearingHouseMasterID,
        //     'Rate Category Name': item.sRateCatetoryName,
        //     'Amount': item.dRateAmount,
        //     'Status': item.bIsRateCategoryActive ? 'Active' : 'Inactive',
        //   }));
        
        //   const ws = XLSX.utils.json_to_sheet(dataToExport, {
        //     header: ['Clearing House Name', 'Rate Category Name', 'Amount',  'Status', ],
        //     skipHeader: false,
        //   });
        
        //   ws['!cols'] = [
        //     { wch: 24 },  
        //     { wch: 22}, 
        //     { wch: 18 }, 
        //     { wch: 20 }, 
        //   ];
        
        //   const headerStyle = {
        //     font: { bold: true, sz: 14, color: { rgb: '000000' } },
        //     fill: { fgColor: { rgb: '00FFFF' } },
        //   };
        
        //   const headerRange = XLSX.utils.decode_range(ws['!ref']).e.r;
        
        //   for (let C = 0; C <= headerRange; C++) {
        //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        //     if (!ws[cellAddress]) continue;
        //     ws[cellAddress].s = headerStyle;
        //   }
        
        //   const wb = XLSX.utils.book_new();
        //   XLSX.utils.book_append_sheet(wb, ws, 'Rate Category');
        //   XLSX.writeFile(wb, 'Rate Category.xlsx');
        // };
  return (
  <Layout>
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
          ref={clearNameRef}
        />
        <CustomTextField
          label="Rate Category Name"
          name="sRateCatetoryName"
          value={formData.sRateCatetoryName}
          onChange={handleChange}
          star
        ref={rateNameRef}
        />
         <CustomTextField
          label="Amount"
          name="dRateAmount"
          value={formData.dRateAmount}
          onChange={handleChange}
          star
          ref={AmountRef}
        />
         <CustomSelect
          label="Is Active?"
          name="bIsRateCategoryActive"
          value={formData.bIsRateCategoryActive}
          onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
          options={activeOrinactive}
          star
          ref={activRef}
        />
        </Grid>
        </Grid>
         <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px',marginRight:isSmallScreen?'':'400px'}}>
            <Button  onClick={handleSubmit} 
            style={{marginRight:'30px',backgroundColor: '#00e5ff', color: 'black', }}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button  onClick={handleReset} style={{backgroundColor: 'black', color: 'white', }}>
             Reset
              </Button>
          </Grid>
       
          {!isEditing && (
<>
        <Box mt={5}>
         <Typography style={{marginLeft:'20px',fontSize:'large',color: '#29B6F6'}}>Rate Category List</Typography>
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
export default RateCategory;