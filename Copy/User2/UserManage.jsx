import React from 'react'
import Layout from '../Top/Layout'
import { useState,useEffect,useRef } from 'react';
import {Form} from 'react-bootstrap';
import CustomSelect from '../maintain/CustomSelect';
import Backdrop from '@mui/material/Backdrop';
import logo from '../images/favicon.png';
import { Grid ,Box,Typography,Button,IconButton} from '@mui/material';
import CustomTextField from '../maintain/CustomTextField';
import { userActive} from '../dropoption/PlanPermiumTrail';
import CustomDataGrid from '../maintain/CustomDataGrid';
import CustomSearch from '../maintain/CustomSearch';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';

function UserManagement2() {
  const [formData, setFormData] = useState({
    sUserId: '',
    sUserName: '',
    sUserEmailId: '',
    bIsUserActive: '',
  });
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [practiceOptions, setPracticeOptions] = useState([]);
  const [open, setOpen] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchText, setSearchText] = useState("");  
  const  userRef=useRef(null);
  const  nameRef=useRef(null);
  const  emailRef=useRef(null);
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  
    if (email.length < 6) {
      alert("Email must be at least 6 characters long.");
      return false;
    }
  
    if (email.length > 256) {
      alert("Email must not exceed 256 characters.");
      return false;
    }
  
    if (!emailPattern.test(email)) {
      alert("Email must contain '@gmail.com'.");
      return false;
    }
  
    return true; // If all conditions are met, return true
  };
  useEffect(() => {
    fetch('/React/web/index.php?r=api/client-list')
    .then(response => response.json())
    .then(data => {
        // Transform the data into an array of objects with id and label
        const options = [
            { id: '', label: '---Select---' },  // Add default option here
            ...Object.entries(data).map(([key, value]) => ({
                id: key,
                label: value
            }))
        ];
        setPracticeOptions(options);
    })
    .catch(error => console.error('Error fetching data:', error));
}, []);



useEffect(() => {
 
    fetch(`/React/web/index.php?r=api/super-admin-user-view&clientId`)
      .then((response) => response.json())
      .then((result) => {
        if (Array.isArray(result)) {
          const transformedData = result.map((item, index) => ({
            ...item,
            id: index + 1,
            serialNumber: index + 1,
            dtCreatedOn: item.dtCreatedOn,
          
          }));
          setData(transformedData);
          
        } else {
          console.error('Unexpected data format:', result);
          setData([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setData([]);
      });
  },
 [practiceOptions]);



const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value, // This will update the correct field based on the name
    }));
};

const validateFormData = () => {
    if (!formData.sUserId) {
        alert('User ID is required');
        userRef.current?.focus();
        return false;
    }
    if (!formData.sUserName) {
        alert('Name is required');
        nameRef.current?.focus();
        return false;
    }
    if (!validateEmail(formData.sUserEmailId)) {
        emailRef.current?.focus();
        return false;
    }
   
    return true; // Return true if all validations pass
};
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
        return; // Stop submission if validation fails
    }

    setOpen(true);

    const postData = {
        sUserName: formData.sUserName || "",
        sUserEmailId: formData.sUserEmailId || "",
        sUserId: formData.sUserId || "",
        bIsUserActive: formData.bIsUserActive || "1",
    };

    try {
        const response = isEditing
            ? await fetch(`/React/web/index.php?r=api/super-admin-user-save&clientId&id=${formData.iUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            })
            : await fetch(`/React/web/index.php?r=api/super-admin-user-save&clientId=`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error("Failed to save provider data: " + errorData.message);
        }

        const dataResponse = await response.json();
        const newRecord = isEditing
            ? { ...postData, id: formData.iUserId }
            : { id: dataResponse.id, ...postData };

        setData((prevState) => {
            const updatedData = isEditing
                ? prevState.map(item => (item.id === newRecord.id ? newRecord : item))
                : [...(prevState || []), newRecord];

            localStorage.setItem("providerData", JSON.stringify(updatedData));
            return updatedData;
        });

        alert(isEditing ? "Record Updated Successfully" : " Record Created Successfully");
        handleReset(); // Ensure this resets your form fields
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setOpen(false);
    }
};

useEffect(() => {
  const savedData = localStorage.getItem("providerData");
  if (savedData) {
    setData(JSON.parse(savedData));
  }
}, []);


const handleEdit = (id) => {
  const itemToEdit = data.find((item) => item.id === id);

  if (!itemToEdit) {
    console.error('Item to edit not found:', id);
    return;
  }
  setOpen(true);
  setFormData({
    ...itemToEdit,
    
    sUserId: itemToEdit.sUserId || "",
    sUserName: itemToEdit.sUserName || "",
    sUserEmailId: itemToEdit.sUserEmailId || "",
    bIsUserActive: itemToEdit.bIsUserActive || "1"
  });

  setIsEditing(true);
  window.scrollTo(0, 0);
  setTimeout(() => {
    setOpen(false);
  }, 3000);
};

const handleReset = () => {
  setFormData({
    sUserName: '',
    sUserId: '',
    sUserEmailId: '',
    bIsUserActive: '1',
  });
  setIsEditing(false);
  setTimeout(() => {
    setOpen(false);
  }, 1000);

}



const columns = [
    {
        field: 'serialNumber',
        headerName: 'SNO',
        minWidth: 120,
        headerClassName:"sample",
        flex:1,
    },
  {field:'sUserId',headerName:'User ID' ,minWidth:250,headerClassName:"sample",flex:1,},
  { field: 'sUserEmailId', headerName: 'Email ID', minWidth: 250 ,headerClassName:"sample",flex:1,},
  { field: 'sUserName', headerName: ' Name', minWidth: 200 ,headerClassName:"sample",flex:1,},
 {
    field: 'bIsUserActive',
    headerName: 'IS Active',
    minWidth: 200,
    flex:1,
    disableColumnMenu: true,
    headerClassName: 'sample',
    renderCell: params => {
        const option = userActive.find(
          option => option.value === String(params.value)
        );
        return option ? option.label : params.value;
      }
},
  {
    field: 'actions',
    headerName: 'Actions',
    minWidth: 100,
    flex:1,
    disableColumnMenu:true,
    headerClassName: 'sample',
    renderCell: (params) => (
      <IconButton
      onClick={() => handleEdit(params.row.id)}
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

const handlePageChange = (event, newPage) => {
  setPage(newPage);
};

const handlePageSizeChange = (event) => {
  setPageSize(Number(event.target.value));
};

const handleSearchTextChange = (event) => {
  setSearchText(event.target.value);
};

const convertToString = (value, options) => {
  const parsedValue = parseInt(value, 10);
  return options[parsedValue] || ''; 
};
useEffect(() => {
  const filtered = data.filter(item => {
    const active = convertToString(item.bIsUserActive, {
      '1': 'Active',
      '0': 'Inactive',
    });

    const searchableFields = [
      item.iProviderType || '',
      item.sUserName || '',
      item.sUserId || '',
      active || '',
    ];

    
    return searchableFields
    .map(field => String(field).toLowerCase())
    .some(value => value.includes(searchText.toLowerCase()));
});
setFilteredRows(filtered);
}, [data, searchText]);

// Pagination Handling
const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

// const handleExportToExcel = () => {
  
//   const dataToExport = data.map(provider => ({
//     'User ID': provider.sUserId,
//     'Name': provider.sUserName,
//     'Email ID': provider.sUserEmailId,
//     'IS Active': provider.bIsUserActive ? 'Active' : 'Inactive',
//   }));
//   const ws = XLSX.utils.json_to_sheet(dataToExport);

//   // Set column widths
//   const columnWidths = [
//     { wch: 30 }, 
//     { wch: 20 }, 
//     { wch: 35 }, 
//     { wch: 20 }, 
//   ];
//   ws['!cols'] = columnWidths;

//   // Apply header styles
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

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, ws, 'User Management');

//   XLSX.writeFile(workbook, 'User Management.xlsx');
// };

  return (
    <Layout> 
    
           <Form onSubmit={handleSubmit} 
           style={{ width: '100%', margin: '0 auto', boxSizing: 'border-box',marginRight:'1400px'}}>
        <Grid container spacing={2} style={{ boxSizing: 'border-box' }}>
           <Grid item xs={12} sm={6} style={{ padding: '20px' }}>
          
        <CustomTextField
          label="User ID"
          name="sUserId"
          value={formData.sUserId}
          onChange={handleChange}
          star
          ref={userRef}
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
        />
            <CustomSelect
              label="Is Active"
              name="bIsUserActive"
              value={formData.bIsUserActive}
              onChange={ handleChange}
              options={userActive}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button
              type="submit"
              style={{ marginRight: '30px',backgroundColor: '#00e5ff', color: 'black', }}
              onClick={handleSubmit}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button  onClick={handleReset} style={{backgroundColor: 'black', color: 'white', }}>
              Reset
            </Button>
          </Grid>
          </Grid>
          <br/>
          {!isEditing && (
            <>
          <Box mt={5}>
        <Typography style={{alignItems:'center',marginLeft:isSmallScreen?'':'20px',fontSize:'large',
        marginBottom:'8px',color: '#29B6F6'}}
        >User Management List</Typography>
       {/* <IconButton onClick={handleExportToExcel} color="primary" style={{ marginLeft: isSmallScreen?'150px':'260px', 
        marginTop:'-70px' }}>
              <FaFileExcel size={30} style={{ color: 'green' }} />
            </IconButton> */}
     <div style={{marginLeft:isSmallScreen?'-1px':'390px'}}>
            <CustomSearch 
        searchText={searchText}
        handleSearchTextChange={handleSearchTextChange} 
      />
      </div>
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
</>)}
        </Form>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <img src={logo} alt="loading" />
      </Backdrop>

  </Layout>
  )
}
export default UserManagement2;