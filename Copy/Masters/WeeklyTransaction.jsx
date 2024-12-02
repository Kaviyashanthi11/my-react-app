import { Grid, Select,TextField,MenuItem,Button,Typography} from '@mui/material'; 
import Layout from '../Top/Layout';
import { Form } from 'react-bootstrap';
import { useState,useEffect,useRef } from 'react';
import Backdrop from '@mui/material/Backdrop';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomDataGrid from '../maintain/CustomDataGrid';
import logo from '../images/favicon.png';
import CustomMultipleSelect from '../maintain/CustomMultipleSelect';
import { activeOrinactive } from '../dropoption/PlanPermiumTrail';
import { useCallback } from 'react';
import Box from '@mui/material/Box';

const WeeklyTransaction = () => {   
     const [practiceOptions, setPracticeOptions] = useState([]);
    const [selectedPractice, setSelectedPractice] = useState([]);
       const [open, setOpen] = useState(false); 
       const [data, setData] = useState([]);
       const [page, setPage] = useState(1);
       const [pageSize, setPageSize] = useState(10); 
       const [isTableVisible, setIsTableVisible] = useState(false);
       const [filteredRows, setFilteredRows] = useState([]);
       const practiceRef=useRef(null)
       const isSmallScreen = useMediaQuery('(max-width:600px)');
       const [searchText] = useState("");  
  
      const validateEmail = (sInvoiceEmail) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (sInvoiceEmail.length < 6) {
            alert("Email must be at least 6 characters long.");
            return false;
        }
    
        if (sInvoiceEmail.length > 256) {
            alert("Email must not exceed 256 characters.");
            return false;
        }
    
        if (!emailPattern.test(sInvoiceEmail)) {
          alert("Email must contain '@gmail.com'.");
            return false;
        }
    
        return true; 
    };
    
        useEffect(() => {

          fetch('/React/web/index.php?r=api/invoice-email-client-list')
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json(); 
            })
            .then((data) => {
              if (data && typeof data === 'object') {
                const options = [
                  { id: '', label: '---Select---' }, 
                  ...Object.entries(data).map(([key, value]) => ({
                    id: key,
                    label: value
                  }))
                ];
                setPracticeOptions(options); 
              } else {
                console.error('Unexpected data format:', data);
                setPracticeOptions([]); 
              }
            })
            .catch((error) => {
              console.error('Error fetching practice list:', error);
              setPracticeOptions([]); 
            });
        }, []);

        const handleGo=(e)=>
          {
            e.preventDefault();
            if (!selectedPractice.length) {
              alert("Please select a practice ");
              practiceRef.current?.focus();  
              return; 
            }
            setOpen(true)
            setIsTableVisible(true); 
            setTimeout(() => {
              setOpen(false);
            }, 3000);
          }
        
          const fetchData = useCallback(async () => {
            try {
              console.log("Selected Practice:", selectedPractice);
              const response = await fetch(
                `/React/web/index.php?r=api/invoice-email-list&clientId=${selectedPractice}&_=${new Date().getTime()}`
              );
        
              if (!response.ok) {
                throw new Error(`Error fetching data. Status: ${response.status}`);
              }
              const data = await response.json();
              const transformedData = data.map((item, index) => ({
                ...item,
                id: index + 1, 
                serialNumber: index + 1,
                dtCreatedOn: item.dtCreatedOn,
                practiceId: selectedPractice,
              }));
              setData(transformedData); 
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }, [selectedPractice]); 
        
          useEffect(() => {
            if (isTableVisible && selectedPractice) {
              fetchData(); 
            }
          }, [isTableVisible, selectedPractice, fetchData]);
        
          const handleSubmit = async (row) => {
            try {
              if (!row || !validateEmail(row.sInvoiceEmail)) {
                console.error("Row is undefined or email is invalid");
                return; 
              }
        
              setOpen(true);
        
              let url = "";
              let method = "";
        
              if (row.iInvoiceEmailId) {
                url = `/React/web/index.php?r=api/invoice-email-save&clientId=${selectedPractice}&id=${row.iInvoiceEmailId}`;
                method = "PUT";
              } else {
                url = `/React/web/index.php?r=api/invoice-email-save&clientId=${selectedPractice}`;
                method = "POST";
              }
        
              const rowDataWithEmail = {
                ...row,
                sInvoiceEmail: row.sInvoiceEmail,
              };
        
              const { id, ...rowDataWithoutId } = rowDataWithEmail;
        
              const response = await fetch(url, {
                method: method,
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(rowDataWithoutId),
              });
        
              if (!response.ok) {
                throw new Error(`Error saving data. Status: ${response.status}`);
              }
        
              const responseData = await response.json();
              console.log(responseData);
        
              // Show alert for successful save or update
              if (row.iInvoiceEmailId) {
                alert("Update successfully");
              } else {
                alert("Created successfully");
              }
        
              fetchData(); // Refetch data to update the table
            } catch (error) {
              console.error("Error saving data:", error);
            }
            finally{
              setOpen(false)
            }
          };
        
    
    const handlePracticeChange = (event) => { 
        const selectedValues = event.target.value;
        if (selectedValues.length === 0) {
          setSelectedPractice([]); 
        } else {
          setSelectedPractice(selectedValues); 
        }
      };
    
      const handleAddRow = () => {
        setData((prevRows) => [
          ...prevRows,
          {
            id: prevRows.length + 1,
            sInvoiceEmail: "",
            bIsActive: 1,
            practiceId: selectedPractice,
          },
        ]);
      };
const handleIsActiveChange = (event, row) => {
  const newValue = event.target.value;
  setData((prevRows) =>
    prevRows.map((prevRow) =>
      prevRow.id === row.id ? { ...prevRow, bIsActive: newValue } : prevRow
    )
  );
};
const handleEmailChange = (event, row) => {
  const newValue = event.target.value.toUpperCase();
  setData((prevRows) =>
    prevRows.map((prevRow) =>
      prevRow.id === row.id
        ? { ...prevRow, sInvoiceEmail: newValue }
        : prevRow
    )
  );
};
    const columns = [
        {
            field: 'serialNumber',
            headerName: 'SNO',
            minWidth: 60,
            flex:1,
            headerClassName:"sample"
        },
        { 
          field: 'sInvoiceEmail', 
          headerName: 'Email ID', 
          minWidth: 550, 
          flex:1,
          headerClassName: "sample",
          renderCell: params => {
            return (
              <TextField
                name="sInvoiceEmail"
                value={params.row.sInvoiceEmail}
          onChange={(e) => handleEmailChange(e, params.row)}
                InputProps={{
                  style: {
                    width:'400px',
                    marginTop:'5px',
                    fontSize: '0.8rem', 
                    height: '20px', 
                    padding: '0', 
                  },
                }}
              />
            );
          }
        },
        {
            field: 'bIsActive',
            headerName: 'Is Active?',
            minWidth: 370,
            flex:1,
            headerClassName:"sample",
            renderCell: (params) => (
              <Select
              value={params.row.bIsActive}
              onChange={(event) => handleIsActiveChange(event, params.row)}
              style={{ height: 20 ,width:'300px'}}  
            >
              {activeOrinactive.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            )
        },
        {
          field: 'actions',
          headerName: 'Actions',
          minWidth: 202,
          flex:1,
          disableColumnMenu:true,
          headerClassName: "sample",
          renderCell: (params) => (
              <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit(params.row)}
                  style={{ backgroundColor: '#00e5ff', color: 'black', height: '21px', 
                    fontSize: 'small', }}
              >
                save
              </Button>
          )
      },
      
      //   {
      //     field: 'addRow',
      //     headerName: '',
      //     width: 50,
      //     headerClassName: "sample",
      //     renderCell: () => (
      //         <Button onClick={handleAddRow} style={{ color: 'black' ,backgroundColor:'white'}}>+</Button>
      //     )
      // }
    ];

        const handlePageSizeChange = (event) => {
          setPageSize(Number(event.target.value));
        };
        const handlePageChange = (event, newPage) => {
          setPage(newPage);
        };
    
        
        const convertToString = (value, options) => {
          const parsedValue = parseInt(value, 10);
          return options[parsedValue] || ''; 
        };
        useEffect(() => {
          const filtered = data.filter(item => {
            const active = convertToString(item.bIsActive, {
              '1': 'Active',
              '0': 'Inactive',
            });
        
            const searchableFields = [
              item.sInvoiceEmail || '',
              active || '',
            ];
        
            
            return searchableFields
            .map(field => String(field).toLowerCase())
            .some(value => value.includes(searchText.toLowerCase()));
        });
        setFilteredRows(filtered);
        }, [data, searchText]);
        const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
    return (
      <Layout>
      <Form 
          style={{ width: '100%', 
            margin: '0 auto', boxSizing: 'border-box' ,marginRight:'700px'}}>
      <Typography style={{ marginRight: '950px', whiteSpace: 'nowrap', color: '#29B6F6',fontSize:'large' }}>
      Weekly Transaction Summary Mailing List
      </Typography>
      <br />
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: '22px' }}>
      <Grid item xs={12} sm={8}> 
        <CustomMultipleSelect
          label="Select Client"
          options={practiceOptions}
          selectedValues={selectedPractice}
          handleChange={handlePracticeChange}
          star
          isMultiple={false}
          ref={practiceRef}
        />
      </Grid>
      </Grid>
      <Button
        onClick={handleGo}
        style={{ marginLeft: isSmallScreen?'150px':'350px', height: '30px', 
          fontSize: 'small',backgroundColor: '#00e5ff', color: 'black',  }}
      >
        Submit
      </Button>
      <br />
      <br />
      <br/>
      {isTableVisible && (
    <>
    <Typography style={{marginLeft:'20px',color: '#29B6F6',fontSize:'large'}}>Weekly Transaction List</Typography>
     <Box mt={4} >
      <CustomDataGrid
      rows={paginatedRows}
      columns={columns}
      pageSize={pageSize}
      handlePageSizeChange={handlePageSizeChange}
      handlePageChange={handlePageChange}
      page={page}
     filteredRows={filteredRows}
     handleAddRow={handleAddRow}
    />
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={handleAddRow}
          size='small'
          style={{ color: 'black', backgroundColor: 'white',marginTop:'-100px',height:'30px',
            marginRight:isSmallScreen? '-30px':''}}
        >
          + ADD ROW
        </Button>
      </Box>
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
    };
    export default WeeklyTransaction;
