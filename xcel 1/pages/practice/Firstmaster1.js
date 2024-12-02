import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { specialities } from "./specialities";
import {
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  TextFieldLabel,
  MenuItem,
  FormControl,
  FormGroup,
  TextField,
  InputLabel,
  makeStyles,
  FormHelperText,
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import "./style.css";
const useStyle = makeStyles((theme) => ({
  formStyle: {
    width: "40%",
    margin: "auto",
    padding: 20,
    //border: "1px solid black",
    paddingTop: 20,
    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
  },
  myBtn: {
    marginTop: 10,
    width: "20%",
    marginLeft: 300,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
function FirstMasters() {
  const classes = useStyle();
  const [iProviderType, setProviderType] = useState("");
  const [sProviderOrgName, setProviderOrgName] = useState("");
  const [sProviderLastName, setProviderLastName] = useState("");
  const [sProviderFirstName, setProviderFirstName] = useState("");
  const [sProviderMiddleName, setProviderMiddleName] = useState("");
  const [sProviderSuffixName, setProviderSuffixName] = useState("");

  const [sProviderAddress1, setProviderAddress1] = useState("");
  const [sProviderAddress2, setProviderAddress2] = useState("");
  const [sProviderCity, setProviderCity] = useState("");
  const [sUSStateMaster, setUSStateMaster] = useState("");
  const [sProviderZIP, setProviderZIP] = useState("");
  const [sProviderTaxId, setProviderTaxId] = useState("");
  const [sProviderNPI, setProviderNPI] = useState("");
  const [sMedicaidPin, setMedicaidPin] = useState("");
  const [bIsProviderActive, setProviderActive] = useState("");
  const [iSpeciality, setSpeciality] = useState([]);
  const [bIsInsuranceDiscoveryEnrolled, setInsuranceDiscoveryEnrolled] =
    useState("");
  const [editiProviderType, setEditedProviderType] = useState("");
  const [editsProviderOrgName, setEditedProviderOrgName] = useState("");
  const [editsProviderLastName, setEditedProviderLastName] = useState("");
  const [editsProviderFirstName, setEditedProviderFirstName] = useState("");
  const [editsProviderMiddleName, setEditedProviderMiddleName] = useState("");
  const [editsProviderSuffixName, setEditedProviderSuffixName] = useState("");
  const [editsProviderAddress1, setEditedProviderAddress1] = useState("");
  const [editsProviderAddress2, setEditedProviderAddress2] = useState("");
  const [editsProviderCity, setEditedProviderCity] = useState("");
  const [editsUSStateMaster, setEditedUSStateMaster] = useState("");
  const [editsProviderZIP, setEditedProviderZIP] = useState("");
  const [editsProviderTaxId, setEditedProviderTaxId] = useState("");
  const [editsProviderNPI, setEditedProviderNPI] = useState("");
  const [editsMedicaidPin, setEditedMedicaidPin] = useState("");
  const [editbIsProviderActive, setEditedProviderActive] = useState("");
  const [editiSpeciality, setEditedSpeciality] = useState("");
  const [
    editbIsInsuranceDiscoveryEnrolled,
    setEditedInsuranceDiscoveryEnrolled,
  ] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false); // dialog open state
  const [id, setId] = useState(-1); // index of row being edited
  const [ai, setAI] = useState("");
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(15);
  const [searchText, setSearchText] = useState("");
  const [bIsOptionSelected, setBIsOptionSelected] = useState(false);
  const [bIsOptionState, setBIsOptionState] = useState(false);
  const [editOptionSelected, seteditOptionSelected] = useState(false);
  const [editOptionState, seteditOptionState] = useState(false);
  const [isZipCodeValid, setIsZipCodeValid] = useState(false);
  const [isZipCodeTouched, setIsZipCodeTouched] = useState(false);

  const handleSpecialitiesChange = (event) => {
    setSpeciality(event.target.value);
  };

  const handleProviderTypeChange = (event) => {
    setProviderType(event.target.value);
    setBIsOptionSelected(event.target.value !== "Select");
  };
  const handleChangeState = (event) => {
    setUSStateMaster(event.target.value);
    setBIsOptionState(event.target.value !== "none");
  };
  const handleeditProvider = (event) => {
    setEditedProviderType(event.target.value);
    seteditOptionSelected(event.target.value !== "Select");
  };
  const handleeditState = (event) => {
    setEditedUSStateMaster(event.target.value);
    seteditOptionState(event.target.value !== "none");
  };

  // const handleZipChange = (event) => {
  //   const zipCode = event.target.value;
  //   setProviderZIP(zipCode);

  //   const isZipCodeValid = /(^\d{5}$)|(^\d{5}-\d{4}$)|(^\d{5} \d{4}$)/.test(
  //     zipCode
  //   );

  //   if (isZipCodeValid) {
  //     setZipValidationMsg("Zip Code is valid");
  //   } else {
  //     setZipValidationMsg("Zip Code is invalid");
  //   }
  // };
  const handleZipChange = (event) => {
    const zipCode = event.target.value;
    setProviderZIP(zipCode);

    const isValid = /(^\d{5}$)|(^\d{5}-\d{4}$)|(^\d{5} \d{4}$)/.test(zipCode);
    setIsZipCodeTouched(true);
    setIsZipCodeValid(isValid);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );
  useEffect(() => {
    refreshData();
  }, []);
  const refreshData = async () => {
    try {
      let res = await fetch(
        `/Availity_v0.0.4/web/index.php?r=api/react-view&_=${new Date().getTime()}`
      );
      let data = await res.json();
      // Assign ID based on length of data array
      data = data.map((row) => ({
        ...row,
        id: data.indexOf(row),
      }));
      setData(data);
    } catch (err) {
      console.log(err);
      setMessage("Some error occurred");
    }
  };
  const handleOpen = (params) => {
    setId(params.id);
    setAI(params.row.iProviderId);
    setEditedProviderType(params.row.iProviderType);
    setEditedProviderOrgName(params.row.sProviderOrgName);
    setEditedProviderLastName(params.row.sProviderLastName);
    setEditedProviderFirstName(params.row.sProviderFirstName);
    setEditedProviderMiddleName(params.row.sProviderMiddleName);
    setEditedProviderSuffixName(params.row.sProviderSuffixName);
    setEditedProviderAddress1(params.row.sProviderAddress1);
    setEditedProviderAddress2(params.row.sProviderAddress2);
    setEditedProviderCity(params.row.sProviderCity);
    setEditedUSStateMaster(params.row.sUSStateMaster);
    setEditedProviderZIP(params.row.sProviderZIP);
    setEditedProviderTaxId(params.row.sProviderTaxId);
    setEditedProviderNPI(params.row.sProviderNPI);
    setEditedMedicaidPin(params.row.sMedicaidPin);
    setEditedProviderActive(params.row.bIsProviderActive);
    setEditedSpeciality(params.row.iSpeciality);
    setEditedInsuranceDiscoveryEnrolled(
      params.row.bIsInsuranceDiscoveryEnrolled
    );
    setOpen(true);
  };

  const handleClose = () => {
    setId(-1);
    setEditedProviderType("");
    setEditedProviderOrgName("");
    setEditedProviderLastName("");
    setEditedProviderFirstName("");
    setEditedProviderMiddleName("");
    setEditedProviderSuffixName("");
    setEditedProviderAddress1("");
    setEditedProviderAddress2("");
    setEditedProviderCity("");
    setEditedUSStateMaster("");
    setEditedProviderZIP("");
    setEditedProviderTaxId("");
    setEditedProviderNPI("");
    setEditedMedicaidPin("");
    setEditedProviderActive("");
    setEditedSpeciality("");
    setEditedInsuranceDiscoveryEnrolled("");
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      let res = await fetch(
        `/Availity_v0.0.4/web/index.php?r=api/react-save&id=` + ai,
        {
          method: "PUT",
          body: JSON.stringify({
            iProviderType: editiProviderType,
            sProviderOrgName: editsProviderOrgName,
            sProviderLastName: editsProviderLastName,
            sProviderFirstName: editsProviderFirstName,
            sProviderMiddleName: editsProviderMiddleName,
            sProviderSuffixName: editsProviderSuffixName,
            sProviderAddress1: editsProviderAddress1,
            sProviderAddress2: editsProviderAddress2,
            sProviderCity: editsProviderCity,
            sUSStateMaster: editsUSStateMaster,
            sProviderZIP: editsProviderZIP,
            sProviderTaxId: editsProviderTaxId,
            sProviderNPI: editsProviderNPI,
            sMedicaidPin: editsMedicaidPin,
            bIsProviderActive: editbIsProviderActive,
            iSpeciality: editiSpeciality,
            bIsInsuranceDiscoveryEnrolled: editbIsInsuranceDiscoveryEnrolled,
          }),
        }
      );
      let resJson = await res.json();
      if (res.status === 200) {
        const newData = [...data];
        newData[id] = {
          ...newData[id],
          iProviderType: editiProviderType,
          sProviderOrgName: editsProviderOrgName,
          sProviderLastName: editsProviderLastName,
          sProviderFirstName: editsProviderFirstName,
          sProviderMiddleName: editsProviderMiddleName,
          sProviderSuffixName: editsProviderSuffixName,
          sProviderAddress1: editsProviderAddress1,
          sProviderAddress2: editsProviderAddress2,
          sProviderCity: editsProviderCity,
          sUSStateMaster: editsUSStateMaster,
          sProviderZIP: editsProviderZIP,
          sProviderTaxId: editsProviderTaxId,
          sProviderNPI: editsProviderNPI,
          sMedicaidPin: editsMedicaidPin,
          bIsProviderActive: editbIsProviderActive,
          iSpeciality: editiSpeciality,
          bIsInsuranceDiscoveryEnrolled: editbIsInsuranceDiscoveryEnrolled,
        };
        setData(newData);
        // data[id]["sName"] = editedName;
        // data[id]["sEmailId"] = editedEmail;

        setEditedProviderType("");
        setEditedProviderOrgName("");
        setEditedProviderLastName("");
        setEditedProviderFirstName("");
        setEditedProviderMiddleName("");
        setEditedProviderSuffixName("");
        setEditedProviderAddress1("");
        setEditedProviderAddress2("");
        setEditedProviderCity("");
        setEditedUSStateMaster("");
        setEditedProviderZIP("");
        setEditedProviderTaxId("");
        setEditedProviderNPI("");
        setEditedMedicaidPin("");
        setEditedProviderActive("");
        setEditedSpeciality("");
        setEditedInsuranceDiscoveryEnrolled("");
        handleClose();
        alert("User updated successfully");
        console.log(data[ai]);
      } else {
        setMessage("Some error occurred");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let res = await fetch(`/Availity_v0.0.4/web/index.php?r=api/react-save`, {
        method: "POST",
        body: JSON.stringify({
          iProviderType: iProviderType,
          sProviderOrgName: sProviderOrgName,
          sProviderLastName: sProviderLastName,
          sProviderFirstName: sProviderFirstName,
          sProviderMiddleName: sProviderMiddleName,
          sProviderSuffixName: sProviderSuffixName,
          sProviderAddress1: sProviderAddress1,
          sProviderAddress2: sProviderAddress2,
          sProviderCity: sProviderCity,
          sUSStateMaster: sUSStateMaster,
          sProviderZIP: sProviderZIP,
          sProviderTaxId: sProviderTaxId,
          sProviderNPI: sProviderNPI,
          sMedicaidPin: sMedicaidPin,
          bIsProviderActive: bIsProviderActive,
          iSpeciality: iSpeciality,
          bIsInsuranceDiscoveryEnrolled: bIsInsuranceDiscoveryEnrolled,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        let id = resJson.iReactTestId;
        await refreshData();
        setProviderType("");
        setProviderOrgName("");
        setProviderLastName("");
        setProviderFirstName("");
        setProviderMiddleName("");
        setProviderSuffixName("");
        setProviderAddress1("");
        setProviderAddress2("");
        setProviderCity("");
        setUSStateMaster("");
        setProviderZIP("");
        setProviderTaxId("");
        setProviderNPI("");
        setMedicaidPin("");
        setProviderActive("");
        setSpeciality("");
        setInsuranceDiscoveryEnrolled("");
        alert("User added successfully");
      } else {
        setMessage("Some error occurred");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      field: "iProviderId",
      headerName: "ID",
      width: 100,
      headerClassName: "custom-header",
    },
    {
      field: "iProviderType",
      headerName: "iProviderType",
      width: 200,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderOrgName",
      headerName: "Organization Name",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderLastName",
      headerName: "Last Name",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderFirstName",
      headerName: "FirstName",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderMiddleName",
      headerName: "MiddleName",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderSuffixName",
      headerName: "Suffix Name",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderAddress1",
      headerName: "Address1",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderAddress2",
      headerName: "Address2",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderCity",
      headerName: "City",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sUSStateMaster",
      headerName: "State",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderZIP",
      headerName: "ZIP",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderTaxId",
      headerName: "TaxId",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sProviderNPI",
      headerName: "NPI",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "sMedicaidPin",
      headerName: "MedicaidPin",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "bIsProviderActive",
      headerName: "Provider Active",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "iSpeciality",
      headerName: "Speciality",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "bIsInsuranceDiscoveryEnrolled",
      headerName: "Insurance Discovery",
      width: 300,
      headerClassName: "custom-header",
    },

    {
      field: "edit",
      headerName: "Edit",
      width: 350,
      disableClickEventBubbling: true,
      headerClassName: "custom-header",
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleOpen(params)}
        >
          Edit
        </Button>
      ),
    },
  ];
  function CustomToolbar() {
    return (
      <GridToolbarContainer style={{ backgroundColor: "lightblue" }}>
        <h2 style={{ margin: "0 16px", color: "#333" }}>Data</h2>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormGroup className={classes.formStyle} onSubmit={handleSubmit}>
          <h3>Practice </h3>
          <Grid container>
            <Grid item sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  select
                  label="Provider Type"
                  value={iProviderType}
                  onChange={handleProviderTypeChange}
                  variant="outlined"
                  margin="dense"
                  size="small"
                  required
                  fullWidth
                >
                  <MenuItem value="Select">Select</MenuItem>
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Organization">Organization</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            {/* {!bIsOptionSelected && (
            <p style={{ color: "red" }}>Please select an option</p>
          )} */}
            <br />
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Organization Name"
                  type="text"
                  size="small"
                  value={sProviderOrgName}
                  onChange={(event) => setProviderOrgName(event.target.value)}
                  disabled={
                    iProviderType === "Select" ||
                    iProviderType === "Individual" ||
                    iProviderType === ""
                  }
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                />
              </FormControl>
            </Grid>
            <br />
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Last Name"
                  type="text"
                  size="small"
                  value={sProviderLastName}
                  onChange={(event) => setProviderLastName(event.target.value)}
                  disabled={
                    iProviderType === "Select" ||
                    iProviderType === "Organization" ||
                    iProviderType === ""
                  }
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
                <br />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="First Name"
                  type="text"
                  size="small"
                  value={sProviderFirstName}
                  onChange={(event) => setProviderFirstName(event.target.value)}
                  disabled={
                    iProviderType === "Select" ||
                    iProviderType === "Organization" ||
                    iProviderType === ""
                  }
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
              </FormControl>
            </Grid>

            <br />
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Middle Name"
                  type="text"
                  size="small"
                  value={sProviderMiddleName}
                  onChange={(event) =>
                    setProviderMiddleName(event.target.value)
                  }
                  disabled={
                    iProviderType === "Select" ||
                    iProviderType === "Organization" ||
                    iProviderType === ""
                  }
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <br />
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Suffix Name"
                  type="text"
                  size="small"
                  value={sProviderSuffixName}
                  onChange={(event) =>
                    setProviderSuffixName(event.target.value)
                  }
                  disabled={
                    iProviderType === "Select" ||
                    iProviderType === "Organization" ||
                    iProviderType === ""
                  }
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="Address1"
                  size="small"
                  type="text"
                  value={sProviderAddress1}
                  onChange={(e) => setProviderAddress1(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="Address2"
                  size="small"
                  type="text"
                  value={sProviderAddress2}
                  onChange={(e) => setProviderAddress2(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="City"
                  size="small"
                  type="text"
                  value={sProviderCity}
                  onChange={(e) => setProviderCity(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item sm={6}>
              <FormControl
                className={classes.formControl}
                error={sUSStateMaster === "none"}
              >
                <TextField
                  select
                  label="State"
                  size="small"
                  variant="outlined"
                  type="text"
                  margin="dense"
                  value={sUSStateMaster}
                  onChange={handleChangeState}
                  required
                >
                  <MenuItem value="none" required>
                    --Select--
                  </MenuItem>
                  {US_STATES.map((state) => (
                    <MenuItem key={uuidv4()} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
                {sUSStateMaster === "none" && (
                  <FormHelperText>Required</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="Zip"
                  type="text"
                  size="small"
                  value={sProviderZIP}
                  // onChange={(e) => setProviderZIP(e.target.value)}
                  onChange={handleZipChange}
                  required
                />
                {/* {isZipCodeTouched && (
                  <div style={{ color: isZipCodeValid ? "green" : "red" }}>
                    {isZipCodeValid
                      ? "Zip Code is valid"
                      : "Zip Code is invalid"}
                  </div>
                )} */}
                {isZipCodeTouched && !isZipCodeValid && (
                  <div style={{ color: "red" }}>Zip Code is invalid</div>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="Tax ID"
                  type="text"
                  size="small"
                  value={sProviderTaxId}
                  onChange={(e) => setProviderTaxId(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="NPI Number"
                  type="text"
                  size="small"
                  value={sProviderNPI}
                  onChange={(e) => setProviderNPI(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="Medicaid Pin"
                  type="text"
                  size="small"
                  value={sMedicaidPin}
                  onChange={(e) => setMedicaidPin(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="Active"
                  size="small"
                  type="text"
                  value={bIsProviderActive}
                  onChange={(e) => setProviderActive(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                className={classes.formControl}
                variant="outlined"
                size="small"
                required
              >
                <InputLabel id="speciality-label">Speciality</InputLabel>
                <Select
                  variant="outlined"
                  labelId="speciality-label"
                  label="Speciality"
                  id="speciality"
                  size="small"
                  type="text"
                  multiple
                  value={iSpeciality}
                  onChange={handleSpecialitiesChange}
                  //onChange={(e) => setSpeciality(e.target.value)}
                  required
                >
                  {specialities.map((speciality) => (
                    <MenuItem key={speciality.value} value={speciality.value}>
                      {speciality.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  label="Insurance Discovery"
                  size="small"
                  type="text"
                  value={bIsInsuranceDiscoveryEnrolled}
                  onChange={(e) =>
                    setInsuranceDiscoveryEnrolled(e.target.value)
                  }
                  required
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!bIsOptionSelected || !bIsOptionState}
          >
            Submit
          </Button>
        </FormGroup>
      </form>
      <div style={{ height: 30, width: "15%" }}>
        <TextField
          label="Search"
          value={searchText}
          onChange={handleSearchTextChange}
          variant="outlined"
          margin="normal"
          fullWidth
        />
      </div>

      <div style={{ height: 400, width: "60%" }}>
        <DataGrid
          rowHeight={25}
          rows={filteredData}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          rowsPerPageOptions={[15, 25, 50]}
          pagination
          components={{ Toolbar: CustomToolbar }}
          style={{
            border: "5px solid gray",
          }}
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            select
            autoFocus
            id="iProviderType"
            label="Provider Type"
            value={editiProviderType}
            onChange={handleeditProvider}
            //  onChange={(event) => setEditedProviderType(event.target.value)}
            variant="outlined"
            margin="dense"
            size="small"
            required
            fullWidth
          >
            <MenuItem value="Select">Select</MenuItem>
            <MenuItem value="Individual">Individual</MenuItem>
            <MenuItem value="Organization">Organization</MenuItem>
          </TextField>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="sProviderOrgName"
            label="Organization Name"
            type="text"
            size="small"
            value={editsProviderOrgName}
            onChange={(event) => setEditedProviderOrgName(event.target.value)}
            disabled={
              editiProviderType === "Select" ||
              editiProviderType === "Individual" ||
              editiProviderType === ""
            }
            variant="outlined"
            required
          />
          <TextField
            autoFocus
            label="Last Name"
            type="text"
            size="small"
            value={editsProviderLastName}
            onChange={(event) => setEditedProviderLastName(event.target.value)}
            disabled={
              editiProviderType === "Select" ||
              editiProviderType === "Organization" ||
              editiProviderType === ""
            }
            variant="outlined"
            margin="dense"
            fullWidth
          />
          <TextField
            autoFocus
            label="First Name"
            type="text"
            size="small"
            value={editsProviderFirstName}
            onChange={(event) => setEditedProviderFirstName(event.target.value)}
            disabled={
              editiProviderType === "Select" ||
              editiProviderType === "Organization" ||
              editiProviderType === ""
            }
            variant="outlined"
            margin="dense"
            fullWidth
          />
          <TextField
            label="Middle Name"
            autoFocus
            type="text"
            size="small"
            value={editsProviderMiddleName}
            onChange={(event) =>
              setEditedProviderMiddleName(event.target.value)
            }
            disabled={
              editiProviderType === "Select" ||
              editiProviderType === "Organization" ||
              editiProviderType === ""
            }
            variant="outlined"
            margin="dense"
            fullWidth
          />
          <TextField
            label="Suffix Name"
            autoFocus
            type="text"
            size="small"
            value={editsProviderSuffixName}
            onChange={(event) =>
              setEditedProviderSuffixName(event.target.value)
            }
            disabled={
              editiProviderType === "Select" ||
              editiProviderType === "Organization" ||
              editiProviderType === ""
            }
            variant="outlined"
            margin="dense"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="sProviderAddress1"
            label="Address1"
            type="text"
            value={editsProviderAddress1}
            onChange={(e) => setEditedProviderAddress1(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="sProviderAddress2"
            label="Address2"
            type="text"
            value={editsProviderAddress2}
            onChange={(e) => setEditedProviderAddress2(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="sProviderCity"
            label="City"
            type="text"
            value={editsProviderCity}
            onChange={(e) => setEditedProviderCity(e.target.value)}
          />
          <FormControl
            className={classes.formControl}
            error={sUSStateMaster === "none"}
          >
            <TextField
              select
              label="State"
              autoFocus
              id="sUSStateMaster"
              size="small"
              variant="outlined"
              type="text"
              margin="dense"
              value={editsUSStateMaster}
              onChange={handleeditState}
              //onChange={(e) => setEditedUSStateMaster(e.target.value)}
              required
            >
              <MenuItem value="none" required>
                --Select--
              </MenuItem>
              {US_STATES.map((state) => (
                <MenuItem key={uuidv4()} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
            {sUSStateMaster === "none" && (
              <FormHelperText>Required</FormHelperText>
            )}
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="sProviderZIP"
            label="Zip"
            type="text"
            value={editsProviderZIP}
            onChange={(e) => setEditedProviderZIP(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="sProviderTaxId"
            label="Tax ID"
            type="text"
            value={editsProviderTaxId}
            onChange={(e) => setEditedProviderTaxId(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="sProviderNPI"
            label="NPI Number"
            type="text"
            value={editsProviderNPI}
            onChange={(e) => setEditedProviderNPI(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="sMedicaidPin"
            label="Medicaid Pin"
            type="text"
            value={editsMedicaidPin}
            onChange={(e) => setEditedMedicaidPin(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="bIsProviderActive"
            label="Active"
            type="text"
            value={editbIsProviderActive}
            onChange={(e) => setEditedProviderActive(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="iSpeciality"
            label="Speciality"
            type="text"
            value={editiSpeciality}
            onChange={(e) => setEditedSpeciality(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            id="bIsInsuranceDiscoveryEnrolled"
            label="Insurance Discovery"
            type="text"
            value={editbIsInsuranceDiscoveryEnrolled}
            onChange={(e) =>
              setEditedInsuranceDiscoveryEnrolled(e.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            disabled={!editOptionSelected || !editOptionState}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default FirstMasters;
