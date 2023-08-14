import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  Container,
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const drawerWidth = 240;
const navItems = ["Home"];

function OptionCalculatorApp(props) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <AppBar>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Option Calculator
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button key={item} sx={{ color: "#fff" }}>
                  {item}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Box
        display="flex"
        width="50%"
        flexDirection="column"
        alignItems="center"
        paddingTop={10}
        paddingLeft={5}
      >
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingBottom={3}
        >
          <Typography variant="h6" marginRight={2} style={{ width: "20%" }}>
            Option Type
          </Typography>
          <FormControl style={{ width: "20%" }}>
            <Select>
              <MenuItem value={"european"}>European</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingBottom={3}
        >
          <Typography variant="h6" marginRight={2} style={{ width: "20%" }}>
            Call/Put
          </Typography>
          <FormControl style={{ width: "20%" }}>
            {/* <InputLabel> Call/Put </InputLabel> */}
            <Select>
              <MenuItem value={"call"}>Call</MenuItem>
              <MenuItem value={"put"}>Put</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingBottom={3}
        >
          <Typography variant="h6" marginRight={2} style={{ width: "20%" }}>
            Underlying Price
          </Typography>
          <FormControl style={{ width: "20%" }}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />{" "}
          </FormControl>
        </Box>
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingBottom={3}
        >
          {/* <OutlinedInput
            id="outlined-adornment-amount"
            label="Amount"
          /> */}
          <Typography variant="h6" marginRight={2} style={{ width: "20%" }}>
            Strike
          </Typography>
          <FormControl style={{ width: "20%" }}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </FormControl>
        </Box>
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingBottom={3}
        >
          <Typography variant="h6" marginRight={2} style={{ width: "20%" }}>
            Days Until Expiration
          </Typography>
          <FormControl style={{ width: "20%" }}>
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">days</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </FormControl>
        </Box>
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingBottom={3}
        >
          <Typography variant="h6" marginRight={2} style={{ width: "20%" }}>
            Interest Rates
          </Typography>
          <FormControl style={{ width: "20%" }}>
            <OutlinedInput
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </FormControl>
        </Box>
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingBottom={5}
        >
          <Typography variant="h6" marginRight={2} style={{ width: "20%" }}>
            Volatility
          </Typography>
          <FormControl style={{ width: "20%" }}>
            <OutlinedInput
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </FormControl>
        </Box>
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingBottom={3}
        >
          <Button variant="contained" color="primary">
            Calculate
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

OptionCalculatorApp.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default OptionCalculatorApp;
