import { Grid, Select,MenuItem,Button, } from '@mui/material';
import Layout from '../Top/Layout';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { useState,useEffect ,useRef} from 'react';
import Backdrop from '@mui/material/Backdrop';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import logo from '../images/favicon.png';
import { Form } from 'react-bootstrap';
import CustomMultipleSelect from '../maintain/CustomMultipleSelect';
const ClaimStatusPayerEnrollment = () => {   
     const [practiceOptions, setPracticeOptions] = useState([]);
    const [selectedPractice, setSelectedPractice] = useState([]);
    const [providerOptions, setProviderOptions] = useState([]);
     const [selectedProviders, setSelectedProviders] = useState([]);
       const [tableData, setTableData] = useState([]);
       const [enrollmentData, setEnrollmentData] = useState({}); // To store selected enrollment status
       const [open, setOpen] = useState(false); 
       const [page, setPage] = useState(1);
       const [pageSize, setPageSize] = useState(10); 
       const [isTableVisible, setIsTableVisible] = useState(false);
       const practiceRef=useRef(null)
       const providerRef=useRef(null)
       useEffect(() => {
        fetch('/React/web/index.php?r=api/practice-list')
          .then((response) => response.json())
          .then((data) => {
            if (data && typeof data === 'object') {
              const options = [
                { id: '', label: '---Select---' },  // Add default option here
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
          .catch((error) => console.error('Error fetching practice list:', error));
      }, []);

    useEffect(() => {
        const savedEnrollmentData = localStorage.getItem('enrollmentData');
        if (savedEnrollmentData) {
            setEnrollmentData(JSON.parse(savedEnrollmentData));
        }
    }, []);

    useEffect(() => {
        if (selectedPractice) {
            fetch(`/React/web/index.php?r=api/provider-list-by-practice&id=${selectedPractice}`)
                .then(response => response.json())
                .then(data => {
                    const options = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        label: value
                    }));
                    setProviderOptions(options);
                })
                .catch(error => console.error('Error fetching provider data:', error));
        }
    }, [selectedPractice]);
   const handleGoClick = () => {
    if (!selectedPractice.length) {
        alert("Please select a practice");
        practiceRef.current?.focus(); // Set focus to the practice dropdown
        return; // Prevent further execution if no practice is selected
    }

    // Check if any provider is selected
    if (!selectedProviders.length) {
        alert("Please select a provider");
        providerRef.current?.focus(); // Set focus to the provider dropdown
        return; // Prevent further execution if no provider is selected
    }
    setOpen(true); // Show loading backdrop
      setIsTableVisible(true); // Show the table when "Go" is clicked
        const apiUrl = `/React/web/index.php?r=api/claimstatus-enrollment-list&practiceId=
        ${selectedPractice}&providerId=${selectedProviders}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Ensure each row has a unique id
                const rowsWithIds = data.map((row, index) => ({
                    id: row.PayerID, // Assuming PayerID is unique
                    ...row,
                    serialNumber: index + 1
                }));
             
                setTableData(rowsWithIds);
                setOpen(false)
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const handlePracticeChange = (event) => {
        const selectedValue = event.target.value;
      
        // Check if the user selected the default option
        if (selectedValue === '') {
            setSelectedPractice(null); // Reset the selection if default is chosen
        } else {
            setSelectedPractice(selectedValue); // Otherwise, set the selected value
        }
        setSelectedProviders([])
      };
      
    const handleProviderChange = (event) => {

        setSelectedProviders(event.target.value);
    };
    const handleEnrollmentChange = (id, value) => {
        const updatedData = {
            ...enrollmentData,
            [id]: value
        };
        setEnrollmentData(updatedData);
        localStorage.setItem('enrollmentData', JSON.stringify(updatedData));
    };
    const handleSave = (row, rowIndex) => {
        const scrollPosition = window.scrollY;
        setOpen(true);
        const enrollmentStatus = enrollmentData[row.id];
        if (enrollmentStatus !== undefined) {
            // Prepare the data according to the API request format
            const requestData = {
                providerId: selectedProviders,
                practiceId: selectedPractice,
                PayerID: row.PayerID,
                isEnrolled: enrollmentStatus === "Yes" ? 1 : 0
            };
    
            // Make an API call to save the enrollment status
            fetch('/React/web/index.php?r=api/claimstatus-enrollment-save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    console.log('Save successful:', data.message);
                    // Optionally, update the table data here to reflect the saved status
                } else {
                    console.error('Save failed:', data.message);
              
                }
                setEnrollmentData(enrollmentData);
                alert("Data Saved Successfully")
                setOpen(false)
                localStorage.setItem('enrollmentData', JSON.stringify(enrollmentData));
                window.scrollTo(0, scrollPosition);
            })
            .catch(error => console.error('Error saving data:', error));
            window.scrollTo(0, scrollPosition);
        } else {
            console.error('No enrollment status selected');
            window.scrollTo(0, scrollPosition);
        }
    };
    const NoPaginationDataGrid = styled(DataGrid)({
        '& .MuiTablePagination-root': {
          display: 'none', // Hide pagination controls
        },
      
      });
    const columns = [
        {
            field: 'serialNumber',
            headerName: 'SNO',
            minWidth: 100,
            flex:1,
            headerClassName:"sample"
        },
        { field: 'Payer', headerName: 'Payer Name', minWidth: 400,headerClassName:"sample",flex:1,},
        {
            field: 'isEnrolled',
            headerName: 'Enrollment Completed',
            minWidth: 400,
            headerClassName:"sample",
            flex:1,
            renderCell: (params) => (
                <Select
                    value={enrollmentData[params.row.PayerID] || "No"}
                    onChange={(e) => handleEnrollmentChange(params.row.PayerID, e.target.value)}
                    style={{ width: '100%',height:'25px',border:'0.5px solid grey'}}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                </Select>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 130,
            flex:1,
            disableColumnMenu: true,
            headerClassName:"sample",
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave(params.row, params.rowIndex)}
                    style={{backgroundColor: '#00e5ff', color: 'black', height:'20px',fontSize:'0.8rem', }}
                >
                    Save
                </Button>
            )
        }
    ];
    const handleReset = () => {
        setSelectedPractice('');  // Reset selected practice
        setSelectedProviders([]);
        };
    const handlePageChange = (event,newPage) => {
        setPage(newPage);
    };


    // Calculate the number of rows to display on the current page
    const paginatedRows = tableData.slice((page - 1) * pageSize, page * pageSize);
    return (
        <Layout> 
             <Form 
          style={{ width: '100%',
            margin: '0 auto', boxSizing: 'border-box' ,marginRight:'700px'}}>
             <Grid container spacing={2} alignItems="center" style={{ marginBottom: '22px' }}>
      <Grid item xs={12} sm={8}> {/* Adjust the Grid item size to allow for proper alignment */}
        <CustomMultipleSelect
          label="Select Practice"
          options={practiceOptions}
          selectedValues={selectedPractice}
          handleChange={handlePracticeChange}
          star
          isMultiple={false}
          ref={practiceRef}
        />
      </Grid>
      <Grid item xs={12} sm={8}> {/* Ensure each select has its own Grid item */}
        <CustomMultipleSelect
          label="Select Provider"
          options={providerOptions}
          selectedValues={selectedProviders}
          handleChange={handleProviderChange}
          star
          isMultiple={false}
          ref={providerRef}
        />
      </Grid>

                <Grid item xs={12} 
                style={{
                textAlign: 'center',
                 marginTop: '20px',
                marginRight:'500px', 
                 display: 'flex', 
                flexDirection: 'row', // Aligns items side by side
                justifyContent: 'center', // Centers the buttons horizontally
                flexWrap: 'nowrap', // Prevents wrapping, keeping buttons in a single line
                gap: '10px', 
                 }}>
                    <Button  onClick={handleGoClick} 
                    style={{backgroundColor: '#00e5ff', color: 'black', }}>
                        Go
                    </Button>
                    
                    <Button   onClick={handleReset} style={{marginLeft:'10px',backgroundColor: 'black', color: 'white'}}>
                       Reset
                    </Button>
                </Grid>
            </Grid>
            {isTableVisible && (
    <>
        <NoPaginationDataGrid
            rows={paginatedRows}
            columns={columns}
            pageSize={pageSize}
            rowHeight={30}
            disableRowSelectionOnClick 
            showCellVerticalBorder
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            disableColumnFilter
            pagination={false} // Disabling internal pagination
            style={{
                fontSize: 'small', 
                // Dynamically calculate the height based on the pageSize
                height: `${pageSize * 35.8}px` // rowHeight * pageSize + some extra padding
            }}
            sx={{
                "& .MuiDataGrid-footerContainer": {
                  display: "none"
                },
                "& .MuiDataGrid-virtualScroller": {
                    overflow: "hidden !important" // Prevent scrolling
                  },
                  "& .MuiDataGrid-main": {
                    overflow: "hidden !important" // Prevent scrolling
                  },
                "& .sample": {
                  backgroundColor: "#7BD9F6",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  height: "36px !important", // Force height with !important
                  minHeight: "32px !important", // Force minHeight with !important
                  lineHeight: "32px !important"
                  // Match the height
                }
              }}
        />
        <Stack 
            direction="row" 
            spacing={2}
            sx={{ 
                marginLeft: 'auto', 
                marginRight: 'auto', 
                marginTop: '20px',
                justifyContent: 'center', 
                alignItems: 'center',
                flexWrap: 'nowrap', 
                width: '100%' 
            }}
        >
            <Pagination
                variant="outlined"
                shape="rounded"
                color="primary"
                count={Math.ceil(tableData.length / pageSize)}
                page={page}
                onChange={handlePageChange}
            />
        </Stack>
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

    export default ClaimStatusPayerEnrollment;
