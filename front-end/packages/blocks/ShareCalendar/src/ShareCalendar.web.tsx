import React from "react";

import {
  Container,
  Box,
  Input,
  Button,
  InputLabel,
  Typography,
  InputAdornment,
  IconButton,
  // Customizable Area Start
  // Customizable Area End
} from "@material-ui/core";

// Customizable Area Start
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
      contrastText: "#fff",
    },
  },
  typography: {
   
    subtitle1: {
      margin: "20px 0px",
    },
  },
});
// Customizable Area End

import ShareCalendarController, {
  Props,
  configJSON,
} from "./ShareCalendarController";

export default class ShareCalendar extends ShareCalendarController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
      <ThemeProvider theme={theme}>
        <Container maxWidth={"sm"}>
          <Box sx={webPartStyle.mainWrapper}>
            <Typography variant="subtitle1">{configJSON.labelTitleText}</Typography>
            <Typography variant="subtitle1" component="div">
              {configJSON.labelBodyText}
            </Typography>
            <Box sx={webPartStyle.inputStyle}>
              <InputLabel id="service-shop-name">
                This is the reviced value:{this.state.txtSavedValue}{" "}
              </InputLabel>
              <Input
                data-test-id={"txtInput"}
                type={this.state.enableField ? "password" : "text"}
                placeholder={configJSON.txtInputPlaceholder}
                fullWidth={true}
                disableUnderline={true}
                value={this.state.txtInputValue}
                onChange={(event) => this.setInputValue(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton  edge="end"
                    onClick={this.setEnableField}
                      aria-label="toggle password visibility"
                     >
                      {this.state.enableField ? (<Visibility />) : (<VisibilityOff />)}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={webPartStyle.buttonStyle}  component="button"
            onClick={() => this.doButtonPressed()}
              data-test-id="btnAddExample"
              >
              <Button color={"primary"}>
                {configJSON.btnTitle}
                </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const webPartStyle = {
  mainWrapper: {
    flexDirection: "column",
    fontFamily: "Roboto-Medium",
    alignItems: "center",
    background: "#fff",
    paddingBottom: "30px",
    display: "flex",
  },
  inputStyle: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.6)",
    flexDirection: "column",
    justifyContent: "space-between",
    display: "flex",
    width: "100%",
    height: "100px",
  },
  buttonStyle: {
    marginTop: "40px",
    backgroundColor: "rgb(98, 0, 238)",
    width: "100%",
    height: "45px",
    border: "none",
  },
};
// Customizable Area End
