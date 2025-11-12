import React from "react";

// Customizable Area Start
import {
  Container,
  Box,
  Button,
  Typography,
  InputLabel,
  Input,
  InputAdornment,
} from "@material-ui/core";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
      contrastText: "#fff",
    },
  },
  typography: {
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      margin: "20px 0px",
    },
  },
});
// Customizable Area End

import RandomNumberGeneratorController, {
  Props,
  configJSON,
} from "./RandomNumberGeneratorController";

export default class RandomNumberGenerator extends RandomNumberGeneratorController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth={"sm"}>
          <Box sx={webStyle.mainWrapper}>
            <Typography variant="h6">{configJSON.labelTitleText}</Typography>
            <Typography variant="subtitle1" component="div">
              {configJSON.labelBodyText}
            </Typography>
            {this.state.numberholder}
            <InputLabel id="lowerbound">
              Lowerbound:{this.state.lowerbound}{" "}
            </InputLabel>
            <Input
              data-test-id={"lowerbound"}
              type={"text"}
              placeholder={"Lowerbound"}
              fullWidth={true}
              disableUnderline={true}
              value={this.state.lowerbound}
              //@ts-ignore
              onChange={(e) => this.setLowerBound(e.target.value)}
            />
            <InputLabel id="upperboud">
              Lowerbound:{this.state.upperbound}{" "}
            </InputLabel>
            <Input
              data-test-id={"upperbound"}
              type={"text"}
              placeholder={"Upperbound"}
              fullWidth={true}
              disableUnderline={true}
              value={this.state.upperbound}
              //@ts-ignore
              onChange={(e) => this.setUpperBound(e.target.value)}
            />
            <Box
              data-test-id="btnGenerateRandomNumber"
              onClick={() => this.generateRandomNumber()}
              component="button"
              sx={webStyle.buttonStyle}
            >
              <Button color={"primary"}>{configJSON.btnExampleTitle}</Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const webStyle = {
  mainWrapper: {
    display: "flex",
    fontFamily: "Roboto-Medium",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
    background: "#fff",
  },
  inputStyle: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.6)",
    width: "100%",
    height: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonStyle: {
    width: "100%",
    height: "45px",
    marginTop: "40px",
    border: "none",
    backgroundColor: "rgb(98, 0, 238)",
  },
};
// Customizable Area End
