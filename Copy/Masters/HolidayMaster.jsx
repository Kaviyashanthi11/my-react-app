import React from 'react'
import Layout from '../Top/Layout'
import { Form } from 'react-bootstrap';
import CustomSelect from '../maintain/CustomSelect'
import { useState,useEffect,useRef } from 'react'
import {Button,Grid,IconButton, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import logo from '../images/favicon.png';
import { activeOrinactive } from '../dropoption/PlanPermiumTrail'
import CustomSearch from '../maintain/CustomSearch';
import CustomDataGrid from '../maintain/CustomDataGrid';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomDatePicker from '../maintain/DatePicker';
import CustomTiny from '../maintain/CutomTiny';
import EditIcon from '@mui/icons-material/Edit';

const  HolidayMaster=()=> {

const [formData, setFormData] = useState({
  sHolidayDesc: "",
  dtHolidayDate: "",
  bIsActive: "1",
});
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false); 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filteredRows, setFilteredRows] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState([]);
    const activeRef=useRef(null)
    const holidayRef=useRef(null)
    const [editorContent, setEditorContent] = useState("");
    useEffect(() => {
      const localData = localStorage.getItem('holidayData');
      if (localData) {
          setData(JSON.parse(localData)); // Load from localStorage
      } else {
          fetchData(); // If no local data, fetch from API
      }
  }, []);
  
    
      const fetchData = async () => {
        try {
          const response = await fetch('/React/web/index.php?r=api/holiday-master-view');
          const result = await response.json();
          if (response.ok) {
            const transformedData = result.map((item, index) => ({
              ...item,
              id: item.iHolidayId || index, 
              dtHolidayDate: item.dtHolidayDate || "",
              dtCreatedOn: item.dtCreatedOn,
            }));
            setData(transformedData);
            localStorage.setItem('holidayData', JSON.stringify(transformedData));
          } else {
            console.error('Error fetching data:', result);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const handleSelectChange = (name, value) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value
        }));
      };
     
const handleEdit = (row) => {
  const itemToEdit = data.find((item) => item.id === row.id);

  if (!itemToEdit) {
      console.error('Item not found.');
      return;
  }

  setFormData({
      ...itemToEdit,
      bIsActive: itemToEdit.bIsActive !== undefined ? itemToEdit.bIsActive.toString() : '1',
      sHolidayDesc: itemToEdit.sHolidayDesc || "", 
      dtHolidayDate: formatDate(itemToEdit.dtHolidayDate) || "", 
  });
  
  setEditorContent(itemToEdit.sHolidayDesc || ""); // Update editor content
  setIsEditing(true);
};
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission

  if (!formData.dtHolidayDate) {
    alert("Please select Holiday Date");
    return; // Exit the function if any field is missing
  }
  setOpen(true); 

  // Prepare request payload
  const requestData = {
      sHolidayDesc: formData.sHolidayDesc || "",
      dtHolidayDate: formatDate(formData.dtHolidayDate || ""),
      bIsActive: formData.bIsActive || "1",
  };

  if (isEditing) {
      // Update existing record
      fetch(`/React/web/index.php?r=api/holiday-master-save&id=${formData.iHolidayId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
      })
      .then((response) => {
          if (!response.ok) throw new Error("Failed to update row");
          return response.json();
      })
      .then(() => {
          const updatedTableData = data.map((item) =>
              item.iHolidayId === formData.iHolidayId
                  ? { ...item, ...requestData }
                  : item
          );
          setData(updatedTableData);
          localStorage.setItem('holidayData', JSON.stringify(updatedTableData)); // Update localStorage
          alert("Record Updated successfully");
          handleReset(); 
      })
      .catch((error) => console.error("Update failed:", error));
  } else {
      // Create new record
      fetch("/React/web/index.php?r=api/holiday-master-save", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
      })
      .then((response) => response.json())
      .then((data) => {
          const newRow = { id: data.iHolidayId || (data.length + 1), ...requestData }; // Ensure you get correct ID
          setData((prevState) => [...prevState, newRow]);
          const updatedTableData = [...data, newRow]; // Update your state
          localStorage.setItem('holidayData', JSON.stringify(updatedTableData)); // Save to localStorage
          alert("Record Created successfully");
          handleReset(); 
      })
      .catch((error) => console.error("Error adding:", error));
  }
};

  const handleDateTimeChange = (name, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue || "", // Ensure it resets to an empty string if needed
    }));
  };
  
  
      const handlePageChange = (event, newPage) => {
        setPage(newPage);
      };
      const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
      }
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return ""; 
        }
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`; 
    };

      const columns = [
        {
          field: "iHolidayId",
          headerName: "SI No",
          flex:1,
          headerClassName: "sample",
        },
          {
            field: 'sHolidayDesc',
            headerName: 'Holiday Description',
            flex: 1,
            disableColumnMenu: true,
            headerClassName: "sample",
            renderCell: (params) => params.value, 
          },
          {
            field: 'dtHolidayDate',
            headerName: 'Holiday Date',
            flex: 1,
            disableColumnMenu: true,
            headerClassName: "sample",
            renderCell: (params) => {
              return formatDate(params.value); // Ensure params.value is a valid date string
          },
          },
        {
          field: 'bIsActive',
          headerName: 'Status',
          flex:1,
         disableColumnMenu: true,
          headerClassName: 'sample',
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
          const eligibility = convertToString(row.bIsActive, {
            1: 'Active',
            0: 'Inactive',
          });
        
          const searchableFields = [
            row.sHolidayDesc || '',  
            row.dtHolidayDate || '',
            row.iHolidayId || '',
            eligibility || '',
          ];
    
          return searchableFields
            .map(field => String(field).toLowerCase())
            .some(value => value.includes(searchText.toLowerCase()));
        });
        setFilteredRows(filtered);
      }, [data, searchText]);
    
      const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
      const handleReset = () => {
        setFormData({
          sHolidayDesc:"",
          dtHolidayDate:"",
          bIsActive: "1",
      });  // Reset form data to initial state
        setEditorContent("");  // Reset the editor content
        setIsEditing(false);
        setOpen(false); 
    };
    
  return (
  <Layout>
     <Form 
       style={{ width: '100%', 
        margin: '0 auto', boxSizing: 'border-box' ,marginRight:'1400px'}}>
            <Grid container spacing={2} style={{ boxSizing: 'border-box' }}>
        {/* Left Column */}
        <Grid item xs={12} sm={6}>
            <CustomTiny
              label="Holiday Description"
              value={editorContent}
              onChange={(value) => {
                  setEditorContent(value);
                  setFormData((prevFormData) => ({
                      ...prevFormData,
                      sHolidayDesc: value,
                  }));
              }}
              star
          />

            <Grid item xs={12} sm={12}>
            <CustomDatePicker
              label="Holiday Date"
              name="dtHolidayDate"
              value={formData.dtHolidayDate}
              onChange={(newValue) => handleDateTimeChange("dtHolidayDate", newValue)}
              star
              ref={holidayRef}
            />
          </Grid>
            <CustomSelect
            label="Is Active?"
            name="bIsActive"
            value={formData.bIsActive}
            onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
            options={activeOrinactive}
            star
            ref={activeRef}
            />
        </Grid>
        </Grid>

         <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px',marginRight:isSmallScreen?'':'400px'}}>
            <Button  onClick={handleSubmit} style={{marginRight:'30px',backgroundColor: '#00e5ff', color: 'black', }}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button  onClick={handleReset} style={{backgroundColor: 'black', color: 'white', }}>
             Reset
              </Button>
          </Grid>
       
          {!isEditing && (
<>
        <Box mt={5}>
         <Typography style={{marginLeft:'20px',fontSize:'large',color: '#29B6F6'}}>Holiday List</Typography>

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
export default HolidayMaster;