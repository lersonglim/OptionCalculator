import * as React from "react";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
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
import ShowChartIcon from "@mui/icons-material/ShowChart";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { ResponsiveLine } from "@nivo/line";

import "./styles.css";
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

const orangeTheme = createTheme({
  palette: {
    type: "dark", // Set the theme type to dark
    primary: {
      main: "#FFA726", // Orange color that complements dark theme
      contrastText: "#FFFFFF", // White font color
    },
  },

  typography: {
    button: {
      fontSize: "1.3rem", // Adjust button font size as needed
    },
  },
});

function OptionCalculatorApp(props) {
  const [optionType, setOptionType] = useState("european");
  const [callPut, setCallPut] = useState("call");
  const [underlyingPrice, setUnderlyingPrice] = useState(490);
  const [strike, setStrike] = useState(500);
  const [expiry, setExpiry] = useState(180);
  const [rate, setRate] = useState(5.25);
  const [volatility, setVolatility] = useState(20);
  const [showGrid, setShowGrid] = useState(false);
  const [response, setResponse] = useState(null);

  const [payOffRowData, setPayOffRowData] = useState([]);

  const [expiredPayOffRowData, setExpiredPayOffRowData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [number, setNumber] = useState(18);

  const onChangeHandler = (event, setFunc, type = "string") => {
    if (type === "string") {
      setFunc(event.target.value);
    } else if (type === "float") {
      setFunc(parseFloat(event.target.value));
    } else if (type === "integer") {
      setFunc(parseInt(event.target.value));
    }
  };

  const columnDefs = [
    {
      headerName: "",
      field: "fieldName",
      cellClass: "dark-column",
    },
    {
      headerName: "",
      field: "value",
      cellStyle: (params) => {
        return params.value >= 0 ? { color: "green" } : { color: "red" };
      },
      ValueFormatter: (params) => {
        if (typeof params.value === "number") {
          return `$ ${params.value.toFixed(2)}`;
        }
        return "";
      },
    },
  ];

  const rowData = [
    { fieldName: "Theoretical Price", value: response?.price },
    { fieldName: "Delta", value: response?.delta },
    { fieldName: "Gamma", value: response?.gamma },
    { fieldName: "Vega", value: response?.vega },
    { fieldName: "Theta", value: response?.theta },
    { fieldName: "Rho", value: response?.rho },
  ];

  const gridOptions = {
    headerHeight: 0, // Hide the headers
  };

  const handleButtonClick = async () => {
    setShowGrid(true);
    setLoading(true);
    setNumber(number + 1);

    try {
      const requestData = {
        callput: callPut,
        spot: underlyingPrice,
        strike: strike,
        expiry: expiry,
        rate: rate,
        vol: volatility,
      };

      const url = "http://localhost:8888/api/price";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      setResponse(data);

      console.log("Response data:", data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }

    try {
      const requestData = {
        callput: callPut,
        spot: underlyingPrice,
        strike: strike,
        expiry: expiry,
        rate: rate,
        vol: volatility,
      };

      const url = "http://localhost:8888/api/payoff";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      setPayOffRowData(data.payoff);
      setExpiredPayOffRowData(data.payoff_expired);

      console.log("Response data:", data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const payOffRowData = [
  //   { x: 1, y: number },
  //   { x: 2, y: 20 },
  //   { x: 3, y: 15 },
  //   { x: 4, y: 25 },
  //   { x: 5, y: number },
  //   // ... add more data points
  // ];

  const payOffData = [
    {
      id: "Now",
      color: "green",
      data: payOffRowData,
    },
    {
      id: "On Expiry",
      color: "yellow",
      data: expiredPayOffRowData,
    },
  ];

  // const payOffData = [
  //   {
  //     id: "series1",
  //     data: payOffRowData,
  //   },
  // ];

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
              Option Calculator <ShowChartIcon />
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Box
        display="flex"
        width="33.33%"
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
          <Typography variant="h6" marginRight={2} style={{ width: "30%" }}>
            Option Type
          </Typography>
          <FormControl style={{ width: "70%" }}>
            <Select
              value={optionType}
              onChange={(event) => onChangeHandler(event, setOptionType)}
            >
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
          <Typography variant="h6" marginRight={2} style={{ width: "30%" }}>
            Call/Put
          </Typography>
          <FormControl style={{ width: "70%" }}>
            <Select
              value={callPut}
              onChange={(event) => onChangeHandler(event, setCallPut)}
            >
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
          <Typography variant="h6" marginRight={2} style={{ width: "30%" }}>
            Underlying Price
          </Typography>
          <FormControl style={{ width: "70%" }}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              defaultValue={underlyingPrice}
              onChange={(event) =>
                onChangeHandler(event, setUnderlyingPrice, "float")
              }
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
          <Typography variant="h6" marginRight={2} style={{ width: "30%" }}>
            Strike
          </Typography>
          <FormControl style={{ width: "70%" }}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              defaultValue={strike}
              onChange={(event) => onChangeHandler(event, setStrike, "float")}
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
          <Typography variant="h6" marginRight={2} style={{ width: "30%" }}>
            Days Until Expiration
          </Typography>
          <FormControl style={{ width: "70%" }}>
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">days</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              defaultValue={expiry}
              onChange={(event) => onChangeHandler(event, setExpiry, "integer")}
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
          <Typography variant="h6" marginRight={2} style={{ width: "30%" }}>
            Interest Rates
          </Typography>
          <FormControl style={{ width: "70%" }}>
            <OutlinedInput
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              defaultValue={rate}
              onChange={(event) => onChangeHandler(event, setRate, "float")}
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
          <Typography variant="h6" marginRight={2} style={{ width: "30%" }}>
            Volatility
          </Typography>
          <FormControl style={{ width: "70%" }}>
            <OutlinedInput
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              defaultValue={volatility}
              onChange={(event) =>
                onChangeHandler(event, setVolatility, "float")
              }
            />
          </FormControl>
        </Box>
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          justifyContent="flex-end"
          paddingBottom={3}
        >
          <ThemeProvider theme={orangeTheme}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleButtonClick()}
            >
              Calculate
            </Button>
          </ThemeProvider>
        </Box>
      </Box>
      <Box
        display="flex"
        width="23.33%"
        flexDirection="column"
        alignItems="center"
        paddingTop={10}
        paddingLeft={10}
      >
        {showGrid && (
          <Box className="ag-theme-material" width="100%" paddingBottom={3}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              domLayout="autoHeight"
              style={{ width: "100%" }}
              gridOptions={gridOptions}
              defaultColDef={{
                cellStyle: {
                  border: "1px solid gray",
                  fontSize: "1.2rem",
                },
              }}
            />
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        width="40%"
        flexDirection="column"
        alignItems="center"
        paddingTop={10}
        paddingLeft={0}
      >
        {showGrid && (
          <Box style={{ width: "100%", height: "400px" }}>
            <div
              style={{
                textAlign: "center",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Payoff Chart
            </div>
            <ResponsiveLine
              data={payOffData}
              curve="linear"
              margin={{ top: 5, right: 60, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
                reverse: false,
              }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Underlying Price",
                legendPosition: "middle",
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Payoff",
                legendPosition: "middle", // Center the legend
                legendOffset: -50,
              }}
              enableGridX={false}
              colors={{ scheme: "dark2" }}
              enablePoints={true}
              enableArea={false}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              useMesh={true}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 1,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                },
              ]}
            />
          </Box>
        )}
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
