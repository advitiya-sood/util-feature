import React, { useEffect, useState } from 'react';
import { Typography, Select, MenuItem, Button, AppBar, Toolbar, Grid, TextField, Tabs, Tab } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from './HeldHinesLogo.jpg'

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb'
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';



const Header = ({ name, Cases, setChat, email }) => {
    const [selectedCase, setSelectedCase] = useState('');
    const [value, setValue] = React.useState("Veris");
    const [caseValue,setCaseValue]=React.useState('');

    const handleCaseChange = (newValue) => {

      
        setChat(newValue.S);
        setCaseValue(newValue.S)
    
    };
    

    const handleDownload = () => {
        const uploadPageUrl = `http://13.53.36.79:3000?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
        window.location.href = uploadPageUrl;
    };

    

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };


    const pages = ['Products', 'Pricing', 'Blog'];
const settings = [`${name}`, 'Settings','Logout'];


    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };




    const handleSettingClick = (setting) => {
      handleCloseUserMenu(); 
    
      
      if (setting === "Logout") {
        localStorage.removeItem("name")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("email")


        window.location.href = 'https://verisage.auth.us-east-1.amazoncognito.com/login?client_id=6ej0b5k8ljvmfd6vndgaokeb8b&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fverisage.ai%3A3000'

        
      } 
    };

    return (
     
      <AppBar sx={{backgroundColor:"#2980B9"}}  position="static">
        <Container maxWidth="auto">
          <Toolbar   disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              VERIS
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  width: 500,
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem
                  onClick={handleCloseNavMenu}
                  sx={{
                    width: "300px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                    sx={{ width: "90%" }}
                  >
                    Upload
                  </Button>
                </MenuItem>
                <MenuItem sx={{ display: "flex", justifyContent: "center" }}>
                  <Autocomplete
                    id="caseSelect"
                    options={Cases}
                    getOptionLabel={(option) => option.S}
                    value={Cases.find(
                      (caseItem) => caseItem.S === selectedCase
                    )}
                    onChange={(event, newValue) => {
                      handleCaseChange(newValue);
                      handleCloseNavMenu(); // Close the dropdown after selecting an option
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Case List"
                        variant="outlined"
                        InputLabelProps={{ style: { fontWeight: "bold" } }}
                      />
                    )}
                    style={{ width: "90%" }}
                  />
                </MenuItem>
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              VERIS
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  maxWidth: "200px",
                  maxHeight: "100px",
                  width: "auto",
                  height: "auto",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "30%",
                marginRight: "10px",
              }}
            >
              <Tabs
                value={value}
                textColor="White"
                indicatorColor="secondary"
                outline="none"
                onChange={handleChange}
                centered
                sx={{ indicatorColor: "white", disableGutters: "true" }}
              >
                <Tab
                  value="Veris"
                  label="Veris"
                  disableRipple="true"
                  outline="none"
                  sx={{
                    "&.Mui-selected": {
                      outline: "none",
                    },
                  }}
                />
                <Tab
                  value="Upload"
                  label="Upload"
                  disableRipple="true"
                  onClick={handleDownload}
                  sx={{
                    "&.Mui-selected": {
                      outline: "none",
                    },
                  }}
                />
                <Tab
                  value="Other Tabs"
                  disableRipple="true"
                  label="Other Tabs"
                  sx={{
                    "&.Mui-selected": {
                      outline: "none",
                    },
                  }}
                />
              </Tabs>
            </Box>

            {/* <Box
              sx={{
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "25%",
                marginRight: "40px",
                display: { xs: "none", md: "flex" },
                color: "#fff",
                borderRadius: "8px",
                padding: "5px",
              }}
            >
            

            <div style={{width:"20%"}}>Case List</div>
              <Autocomplete
                id="caseSelect"
                options={Cases}
                getOptionLabel={(option) => option.S}
                val
                value={Cases.find((caseItem) => caseItem.S === caseValue)}
                onChange={(event, newValue) => handleCaseChange(newValue)}
                
                sx={{ borderRadius:"70px",height:"50px", justifyContent:"center", alignItems:"center",textAlign:"center",overflow:"hidden", borderBlockColor:"white", border:0,  backgroundColor:"white",  borderRadius:"70px", "& input": { color: "black" },
                 }}

                renderInput={(params) => (
                 
                  <TextField
                    {...params}
                    // label="Case List"
                    variant="filled"
                    InputLabelProps={{
                      style: { fontWeight: "bold", color: "black"},
                    }}
                    // sx={{  backgroundColor:"white",  borderRadius:"70px", "& input": { color: "black" } }}
                  />
                )}
                style={{ marginLeft: "6px", width: "80%" }}
              />
              
            </Box> */}


<Box
  sx={{
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "22%",
    marginRight: "40px",
    display: { xs: "none", md: "flex" },
    color: "#fff",
    borderRadius: "8px",
    padding: "5px",
    paddingBottom:"5px"
  }}
>
  <div style={{ width: "16%" }}>Case </div>
  <Autocomplete
    id="caseSelect"
    options={Cases}
    getOptionLabel={(option) => option.S}
    value={Cases.find((caseItem) => caseItem.S === caseValue)}
    onChange={(event, newValue) => handleCaseChange(newValue)}
    sx={{
      borderRadius: "70px",
      height: "40px",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      overflow: "hidden",
      borderBlockColor: "white",
      border: 0,
      backgroundColor: "white",
      borderRadius: "70px",
      "& .MuiAutocomplete-inputRoot": { textAlign: "center" },
      "& .MuiAutocomplete-input": { textAlign: "center" },
      "& .MuiAutocomplete-tag": {
        justifyContent: "center",
        alignItems: "center",
      },
      "& input": { color: "black" },
      "& .MuiAutocomplete-endAdornment": {
        justifyContent: "center", // Center align horizontally
        alignItems: "center", // Center align vertically
      },
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        InputLabelProps={{
          style: { fontWeight: "bold", color: "black" },
        }}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {params.InputProps.endAdornment}
  
            </>
          ),
        }}
      />
    )}
    style={{  width: "80%" }}
  />
</Box>




            <Box sx={{ flexGrow: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  <Typography>Welcome {name}</Typography>
                </Box>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={name} src="" />
                </IconButton>
              </Box>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
};

export default Header;




