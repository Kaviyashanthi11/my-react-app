import React from 'react'
import Layout from '../Top/Layout'
import { useState,useEffect,useRef } from 'react';
import CustomMultipleSelect from '../maintain/CustomMultipleSelect';
import {Form} from 'react-bootstrap';
import CustomSelect from '../maintain/CustomSelect';
import Backdrop from '@mui/material/Backdrop';
import logo from '../images/favicon.png';
import { Grid ,Box,Typography,Button,IconButton} from '@mui/material';
import CustomTextField from '../maintain/CustomTextField';
import CustomSpec from '../maintain/CustomSpec';
import speciality from '../dropoption/specialitiess';
import CustomCheckbox from '../maintain/CustomCheck';
import sUSStateMaster from '../dropoption/sUSStateMaster'
import { activeOrinactive } from '../dropoption/PlanPermiumTrail';
import CustomDataGrid from '../maintain/CustomDataGrid';
import CustomSearch from '../maintain/CustomSearch';
import {validateNPI } from '../dropoption/NPIType';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';

function PracticeProviderManagement() {
  const [formData, setFormData] = useState({
    iProviderType: '',
    sProviderLastName: '',
    sProviderOrgName: '',
    sProviderFirstName: '',
    sProviderMiddleName: '',
    sProviderSuffixName: '',
    sProviderAddress1: '',
    sProviderAddress2: '',
    sProviderCity: '',
    sProviderZIP: '',
    sProviderNPI: '',
    sMedicaidPin: '',
    bIsProviderActive: null,
    iSpeciality: [],
    bIsInsuranceDiscoveryEnrolled: null,
    sUSStateMaster: '',
    sProviderTaxId: ''
  });
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const ProviderTypeOptions = [
    { value: 1, label: 'Individual' },
    { value: 2, label: 'Organization' }
  ];
  const [practiceOptions, setPracticeOptions] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [open, setOpen] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const  providerRef=useRef(null);
  const  firstRef=useRef(null);
  const  lastRef=useRef(null);
  const  orgRef=useRef(null);
  const  npiRef=useRef(null);
  const  specialityRef=useRef(null);
  const zipcodeRef=useRef(null)
  const practiceRef=useRef(null);
  const validateZipCode = (sProviderZIP) => {
    const zipCodePattern = /^(?:\d{5}|\d{5}-\d{4}|\d{5} \d{4})$/;
    return zipCodePattern.test(sProviderZIP);
  };

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

  


const handleGo=(e)=>
{
  e.preventDefault();
  if (!selectedPractice) {
    alert("Please select a practice ");
    practiceRef.current?.focus();  // Set focus to the practice dropdown
    return;  // Prevent form submission if no practice is selected
  }
  setOpen(true)
  setIsFormVisible(true); 
  setTimeout(() => {
    setOpen(false);
  }, 3000);
}
useEffect(() => {
  if (selectedPractice && practiceOptions.length > 0) {
    fetch(`/React/web/index.php?r=api/practice-provider-management-view&practiceId=${selectedPractice}`)
      .then((response) => response.json())
      .then((result) => {
        if (Array.isArray(result)) {
          const transformedData = result.map((item, index) => ({
            ...item,
            id: item.iProviderId || index,
            dtCreatedOn: item.dtCreatedOn,
            practiceName: practiceOptions.find((option) => option.id === selectedPractice)?.label || '',
            
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
  }
}, [selectedPractice, practiceOptions]);

const handleSelectChange = (e) => {
  const { name, value } = e.target;
  
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
    // Clear fields based on selected provider type
    sProviderOrgName: value === '1' ? '' : prevData.sProviderOrgName,
    sProviderLastName: value === '2' ? '' : prevData.sProviderLastName,
    sProviderFirstName: value === '2' ? '' : prevData.sProviderFirstName,
    sProviderMiddleName: value === '2' ? '' : prevData.sProviderMiddleName,
    sProviderSuffixName: value === '2' ? '' : prevData.sProviderSuffixName,
  }));
};

const handleChange = (e) => {
  const { name, type, value, checked } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

const validateFormData = () => {

  if(formData.iProviderType==='2')
    if (!formData.sProviderOrgName) { // Assuming `selectedCustomOption` is your select field's state
     alert('Org Name is required')
       orgRef.current?.focus(); // Replace with your actual ref for the select field
       return false;
     }
  if (!formData.sProviderLastName) { // Assuming `selectedCustomOption` is your select field's state
    alert('Last Name is required')
    lastRef.current?.focus(); // Replace with your actual ref for the select field
    return false;
  }
  if (!formData.sProviderFirstName) { // Assuming `selectedCustomOption` is your select field's state
    alert('First Name is required')
    firstRef.current?.focus(); // Replace with your actual ref for the select field
    return false;
  }

    if (!formData.sProviderNPI) { // Assuming `selectedCustomOption` is your select field's state
      alert('NPI is required')
      npiRef.current?.focus(); // Replace with your actual ref for the select field
      return false;
    }
    if (!formData.iSpeciality.length) { // Simple validation: check if the speciality field is empty
      alert('Speciality is required')
      specialityRef.current?.focus(); // Focus the TextField if validation fails
      return; // Prevent form submission if validation fails
    }
    if (!formData.iProviderType) { // Assuming `selectedCustomOption` is your select field's state
      providerRef.current?.focus(); // Replace with your actual ref for the select field
      return false;
    }
    if (!validateZipCode(formData.sProviderZIP)) {
      alert('Invalid ZIP code format.');
      zipcodeRef.current?.focus();
      return false;
    }
    if (!validateNPI(formData.sProviderNPI)) {
      alert('Invalid NPI number.');
      npiRef.current?.focus(); 
      return false;
    }
    return true;
}

const handleSubmit = async (e) => {
  e.preventDefault();
 
  if (!validateFormData()) {
    return;
  }

  setOpen(true);

  // Prepare data for submission
  const postData = {
    iProviderType: formData.iProviderType || 1,
    sProviderLastName: formData.sProviderLastName || "",
    sProviderFirstName: formData.sProviderFirstName || "",
    sProviderOrgName: formData.sProviderOrgName || "",
    sProviderMiddleName: formData.sProviderMiddleName || "",
    sProviderSuffixName: formData.sProviderSuffixName || "",
    sProviderAddress1: formData.sProviderAddress1 || "",
    sProviderAddress2: formData.sProviderAddress2 || "",
    sProviderCity: formData.sProviderCity || "",
    sProviderZIP: formData.sProviderZIP || "",
    sProviderNPI: formData.sProviderNPI || "",
    sMedicaidPin: formData.sMedicaidPin || "",
    bIsProviderActive: formData.bIsProviderActive === "true" || formData.bIsProviderActive === true,
    iSpeciality: formData.iSpeciality.map(option => option.value).join('|') || '',
    bIsInsuranceDiscoveryEnrolled: formData.bIsInsuranceDiscoveryEnrolled === "true" || formData.bIsInsuranceDiscoveryEnrolled === true,
    sUSStateMaster: formData.sUSStateMaster || null,
    sProviderTaxId: formData.sProviderTaxId || "",
  };

  try {
    const response = isEditing
      ? await fetch(`/React/web/index.php?r=api/practice-provider-management-save&practiceId=${selectedPractice}&id=${formData.iProviderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
      : await fetch(`/React/web/index.php?r=api/practice-provider-management-save&practiceId=${selectedPractice}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

    if (!response.ok) {
      throw new Error("Failed to save provider data");
    }

    const dataResponse = await response.json();
    const newRecord = isEditing
      ? { ...postData, id: formData.iProviderId }
      : { id: dataResponse.id, ...postData };

    // Update local state
    setData((prevState) => {
      const updatedData = isEditing
        ? prevState.map(item => (item.id === newRecord.id ? newRecord : item))
        : [...(prevState || []), newRecord];

      // Store updated data in localStorage
      localStorage.setItem("providerData", JSON.stringify(updatedData));

      return updatedData;
    });
    alert(isEditing ? "Record Updated Successfully" : "Provider Record Created Successfully");
    handleReset();
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

  const transformSpeciality = (specialityValue) => {
    if (typeof specialityValue === 'string') {
      return specialityValue.split('|').map(num => {
        const plan = speciality.find(plan => plan.value === num);
        return plan ? { value: plan.value, label: plan.label } : null;
      }).filter(item => item !== null);
    }
    return Array.isArray(specialityValue) ? specialityValue : [];
  };

  setOpen(true);
  const providerType = String(itemToEdit.iProviderType);
    const normalizedProviderType = ['1', '2'].includes(providerType) ? providerType : '1';
    const stateLabel = sUSStateMaster.find(state => state.value === String(itemToEdit.sUSStateMaster))?.label || '';
  setFormData({
    ...itemToEdit,
    iSpeciality: transformSpeciality(itemToEdit.iSpeciality),
    sProviderZIP: itemToEdit.sProviderZIP || "",
    sProviderNPI: itemToEdit.sProviderNPI || "",
    sProviderTaxId: itemToEdit.sProviderTaxId || "",
    iProviderType: normalizedProviderType,
    sProviderOrgName: normalizedProviderType === '2' ? itemToEdit.sProviderOrgName : '',
    sProviderLastName: normalizedProviderType === '1' ? itemToEdit.sProviderLastName : '',
    sProviderFirstName: normalizedProviderType === '1' ? itemToEdit.sProviderFirstName : '',
    sProviderMiddleName: normalizedProviderType === '1' ? itemToEdit.sProviderMiddleName : '',
    sProviderSuffixName: normalizedProviderType === '1' ? itemToEdit.sProviderSuffixName : '',
    sProviderAddress1: itemToEdit.sProviderAddress1 || "",
    sProviderAddress2: itemToEdit.sProviderAddress2 || "",
    sProviderCity: itemToEdit.sProviderCity || "",
    sUSStateMaster: stateLabel,
    bIsInsuranceDiscoveryEnrolled: itemToEdit.bIsInsuranceDiscoveryEnrolled || '',
    bIsProviderActive: itemToEdit.bIsProviderActive || ""
  });

  setIsEditing(true);
  window.scrollTo(0, 0);
  setTimeout(() => {
    setOpen(false);
  }, 3000);
};

const handleReset = () => {
  setFormData({
    iProviderType: "1",
    sProviderLastName: '',
    sProviderOrgName: '',
    sProviderFirstName: '',
    sProviderMiddleName: '',
    sProviderSuffixName: '',
    sProviderAddress1: '',
    sProviderAddress2: '',
    sProviderCity: '',
    sProviderZIP: '',
    sProviderNPI: '',
    sMedicaidPin: '',
    bIsProviderActive: null,
    iSpeciality: [],
    bIsInsuranceDiscoveryEnrolled: null,
    sUSStateMaster: '',
    sProviderTaxId: ''
  });
  setIsEditing(false);
  setTimeout(() => {
    setOpen(false);
  }, 1000);

}
const handleSpecialityChange = (event) => {
  setFormData(prevData => ({
    ...prevData,
    iSpeciality: event.target.value // This should be an array now
  }));
};


const columns = [
  {field:'iProviderId',headerName:'Provider Id' ,minWidth:190,headerClassName:"sample",flex:1},
  {
    field: 'iProviderType',
    headerName: 'Provider Type',
    minWidth: 180,
    flex:1,
    disableColumnMenu: true,
    headerClassName: "sample",
    renderCell: (params) => {
      // Ensure both values are strings to avoid type mismatch
      const option = ProviderTypeOptions.find(
        option => String(option.value) === String(params.value)
      );
      
      // Return the corresponding label or 'Unknown' if no match
      return option ? option.label : '';
    }
  },
  { field: 'sProviderOrgName', headerName: 'Organization Name', minWidth: 250 ,headerClassName:"sample",flex:1,},
  { field: 'sProviderLastName', headerName: 'Last Name', minWidth: 150 ,headerClassName:"sample",flex:1,},
  { field: 'sProviderFirstName', headerName: 'First Name', minWidth: 150 ,headerClassName:"sample",flex:1,},
  { field: 'sProviderMiddleName', headerName: 'Middle Name', minWidth: 150 ,headerClassName:"sample",flex:1,},
  { field: 'sProviderSuffixName', headerName: 'Suffix Name', minWidth: 150 ,headerClassName:"sample",flex:1,},
  { field: 'sProviderAddress1', headerName: 'Address 1', minWidth: 200 ,headerClassName:"sample",flex:1,},
  { field: 'sProviderAddress2', headerName: 'Address 2', minWidth: 200,headerClassName:"sample",flex:1, },
  { field: 'sProviderCity', headerName: 'City', minWidth: 150 ,headerClassName:"sample",flex:1,},
  {
    field: 'sUSStateMaster',
    headerName: 'State',
    minWidth: 180,
    flex:1,
    disableColumnMenu: true,
    headerClassName: "sample",
    renderCell: (params) => {
      // Assuming `sUSStateMaster` is the array of states
      const foundState = sUSStateMaster.find(state => state.value === params.value);
      return foundState ? foundState.label : ''; // Use .label if your state object has a label field
    }
  },
  { field: 'sProviderZIP', headerName: 'ZIP Code', minWidth: 120 ,headerClassName:"sample",flex:1,},
  { field: 'sProviderTaxId', headerName: 'Tax Id', minWidth: 120 ,headerClassName:"sample",flex:1,},
  { field: 'sProviderNPI', headerName: 'NPI Number', minWidth: 150,headerClassName:"sample" ,flex:1,},
  { field: 'sMedicaidPin', headerName: 'Medicaid PIN', minWidth: 150 ,headerClassName:"sample",flex:1,},
  {
    field: 'bIsProviderActive',
    headerName: 'Status',
    minWidth: 150,
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
},{
  field: 'iSpeciality', 
  headerName: 'Specialty', 
  minWidth: 150, 
  flex:1,
  disableColumnMenu: true, 
  headerClassName: "sample",
  renderCell: (params) => {
    let value = params.value;
    if (typeof value === 'string') {
      value = value.split(',');
    }
    return <span>{Array.isArray(value) ? value.join('| ') : value}</span>;
  }
},
{
  field: 'bIsInsuranceDiscoveryEnrolled',
  headerName: 'Insurance Discovery',
  minWidth: 180,
  flex:1,
  disableColumnMenu: true,
  headerClassName: "sample",
  renderCell: (params) => (params.value ? 'Yes' : 'No') 
},
  {
    field: 'actions',
    headerName: 'Actions',
    minWidth: 100,
    flex:1,
    headerClassName: 'sample',
    disableColumnMenu:true,
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
const handlePracticeChange = (event) => { 
  const selectedValues = event.target.value;
  
  // Check if the user selected the default option (no selection)
  if (selectedValues.length === 0) {
    setSelectedPractice([]); // Reset the selection if no options are selected
  } else {
    setSelectedPractice(selectedValues); // Otherwise, set the selected values
  }
};


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
    const active = convertToString(item.bIsProviderActive, {
      '1': 'Active',
      '0': 'Inactive',
    });

    const searchableFields = [
      item.iProviderType || '',
      item.sProviderLastName || '',
      item.sProviderFirstName || '',
      item.sProviderMiddleName || '',
      item.sProviderSuffixName || '',
      item.sProviderAddress1 || '',
      item.sProviderAddress2 || '',
      item.iProviderId || '',
      item.sProviderOrgName || '',
      active || '',
      item.sUSStateMaster || '',
      item.sProviderCity || '',
      item.sProviderNPI || '',
      item.sProviderTaxId || '',
      item.sMedicaidPin || '',
      item.sProviderZIP || '',
      item.sSpecialityType || '',
      item.bIsInsuranceDiscoveryEnrolled || '',
    ];

    
    return searchableFields
    .map(field => String(field).toLowerCase())
    .some(value => value.includes(searchText.toLowerCase()));
});
setFilteredRows(filtered);
}, [data, searchText]);
const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

// const handleExportToExcel = () => {
  
//   const dataToExport = data.map(provider => ({
//     'Provider Type': ProviderTypeOptions.find(option => 
//       option.value === Number(provider.iProviderType))?.label || provider.iProviderType,
//     'Organization Name': provider.sProviderOrgName,
//     'Last Name': provider.sProviderLastName,
//     'First Name': provider.sProviderFirstName,
//     'Middle Name': provider.sProviderMiddleName,
//     'Suffix Name': provider.sProviderSuffixName,
//     'Address 1': provider.sProviderAddress1,
//     'Address 2': provider.sProviderAddress2,
//     'City': provider.sProviderCity,
//     'State':  sUSStateMaster.find(state => state.value === String(provider.sUSStateMaster))?.label
//      || provider.sUSStateMaster, // Map state value to label
//     'ZIP Code': provider.sProviderZIP,
//     'Tax Id': provider.sProviderTaxId,
//     'NPI Number': provider.sProviderNPI,
//     'Medicaid PIN': provider.sMedicaidPin,
//     'Status': provider.bIsProviderActive ? 'Active' : 'Inactive',
//     'Speciality': provider.iSpeciality,
//     'Insurance Enrolled': provider.bIsInsuranceDiscoveryEnrolled ? 'Yes' : 'No'
//   }));
//   const ws = XLSX.utils.json_to_sheet(dataToExport);

//   // Set column widths
//   const columnWidths = [
//     { wch: 20 }, // Provider Type
//     { wch: 20 }, // Organization Name
//     { wch: 20 }, // Last Name
//     { wch: 20 }, // First Name
//     { wch: 20 }, // Middle Name
//     { wch: 20 }, // Suffix Name
//     { wch: 20 }, // Address 1
//     { wch: 20 }, // Address 2
//     { wch: 20 }, // City
//     { wch: 10 }, // State
//     { wch: 10 }, // ZIP Code
//     { wch: 20 }, // Tax Id
//     { wch: 20 }, // NPI Number
//     { wch: 20 }, // Medicaid PIN
//     { wch: 10 }, // Status
//     { wch: 20 }, // Speciality
//     { wch: 20 }  // Insurance Enrolled
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
//   XLSX.utils.book_append_sheet(workbook, ws, 'Practice Provider');

//   XLSX.writeFile(workbook, 'Practice Provider.xlsx');
// };

  return (
    <Layout>
        <Form 
          style={{ width: '100%',
            margin: '0 auto', boxSizing: 'border-box' ,marginRight:'1400px'}}>
      <Typography style={{ marginRight: '950px', whiteSpace: 'nowrap', color: '#29B6F6',fontSize:'large' }}>
        Practice Provider Management
      </Typography>
      <br />
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
      </Grid>
      <Button
        variant="info"
        onClick={handleGo}
        style={{ marginLeft: isSmallScreen?'150px':'350px', height: '30px',
          fontSize: 'small',backgroundColor: '#00e5ff', color: 'black', }}
      >
        Submit
      </Button>
      <br />
      <br />
      {isFormVisible && (
           <Form 
           style={{ width: '100%', margin: '0 auto', boxSizing: 'border-box' ,marginRight:'300px'}}>
        <Grid container spacing={2} style={{ boxSizing: 'border-box' }}>
           <Grid item xs={12} sm={6} style={{ padding: '20px' }}>
           <CustomSelect
          label="Provider Type"
          name="iProviderType"
          value={formData.iProviderType}
          onChange={handleSelectChange}
                  options={ProviderTypeOptions}
                  ref={providerRef}
        />
        <CustomTextField
          label="Organization Name"
          name="sProviderOrgName"
          value={formData.sProviderOrgName}
          onChange={handleChange}
          star={formData.iProviderType === '2'}
          disabled={formData.iProviderType === '1' || !formData.iProviderType} 
          ref={orgRef}
        />

        <CustomTextField
          label="Last Name"
          name="sProviderLastName"
          value={formData.sProviderLastName}
          onChange={handleChange}
          star={formData.iProviderType !== '2'}
          disabled={formData.iProviderType === '2'}
          ref={lastRef}
        />

        <CustomTextField
          label="First Name"
          name="sProviderFirstName"
          value={formData.sProviderFirstName}
          onChange={handleChange}
          star={formData.iProviderType !== '2'}
          disabled={formData.iProviderType === '2'} 
          ref={firstRef}
        />

        <CustomTextField
          label="Middle Name"
          name="sProviderMiddleName"
          value={formData.sProviderMiddleName}
          onChange={handleChange}
          disabled={formData.iProviderType === '2'} 
        />

        <CustomTextField
          label="Suffix Name"
          name="sProviderSuffixName"
          value={formData.sProviderSuffixName}
          onChange={handleChange}
          disabled={formData.iProviderType === '2'} 
        />

            <CustomTextField
              label="Address 1"
              name="sProviderAddress1"
              value={formData.sProviderAddress1}
              onChange={handleChange}
            />
            <CustomTextField
              label="Address 2"
              name="sProviderAddress2"
              value={formData.sProviderAddress2}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="City"
              name="sProviderCity"
              value={formData.sProviderCity}
              onChange={handleChange}
            />
            <CustomSelect
              label="State"
              name="sUSStateMaster"
              value={formData.sUSStateMaster}
              onChange={handleChange}
              options={sUSStateMaster.map(state => ({
                label: state.label,
                value: state.label, // Use the state abbreviation as the value
              }))}
            />

            <CustomTextField
              label="Zip Code"
              name="sProviderZIP"
              value={formData.sProviderZIP}
              onChange={handleChange}
              ref={zipcodeRef}
            />
            <CustomTextField
              label="Tax ID"
              name="sProviderTaxId"
              value={formData.sProviderTaxId}
              onChange={handleChange}
            />
            <CustomTextField
              label="NPI"
              name="sProviderNPI"
              value={formData.sProviderNPI}
              onChange={handleChange}
              star
              ref={npiRef}
            />
            <CustomTextField
              label="Medicaid PIN"
              name="sMedicaidPin"
              value={formData.sMedicaidPin}
              onChange={handleChange}
            />
            <CustomSpec
          options={speciality}  // Array of { value, label }
          value={formData.iSpeciality}  // Should be an array of selected objects
          onChange={handleSpecialityChange}
          name="iSpeciality"
          label="Speciality"
          star
          ref={specialityRef}
        />
          <CustomCheckbox
            label="Is Insurance Discovery Enrolled"
            name="bIsInsuranceDiscoveryEnrolled"
            checked={formData.bIsInsuranceDiscoveryEnrolled}
            onChange={(e) => setFormData({ ...formData, bIsInsuranceDiscoveryEnrolled: e.target.checked })}
    
          />

            <CustomSelect
              label="Is Active"
              name="bIsProviderActive"
              value={formData.bIsProviderActive}
              onChange={ handleChange}
              options={activeOrinactive}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button
              style={{ marginRight: '30px' ,backgroundColor: '#00e5ff', color: 'black', }}
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
          <Box mt={5}>
        <Typography style={{alignItems:'center',marginLeft:isSmallScreen?'':'20px',fontSize:'large',color: '#29B6F6',
        }}
        >Practice Provider List</Typography>
       {/* <IconButton onClick={handleExportToExcel} color="primary" style={{ marginLeft: isSmallScreen?'150px':'260px', 
        marginTop:'-70px' }}>
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
      showColumnVisibility={true}
      
    />
</Box>
        </Form>
      )}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <img src={logo} alt="loading" />
      </Backdrop>
      </Form>
  </Layout>
  )
}
export default PracticeProviderManagement;