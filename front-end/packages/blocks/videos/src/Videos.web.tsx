import React from "react";

// Customizable Area Start
import { Container, Box, Typography } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
// Customizable Area End

import VideosController, { Props, configJSON } from "./VideosController";

export default class Videos extends VideosController {
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
          <Box sx={webStyle.mainWrapper}>
            <Typography variant="h6">{configJSON.labelTitleText}</Typography>
            <Typography variant="subtitle1" component="div">
              {configJSON.labelBodyText}
            </Typography>
            <video width="1600" height="900" controls>
              <source src={configJSON?.exampleVideoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Container>
      </ThemeProvider>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
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

const webStyle = {
  mainWrapper: {
    display: "flex",
    fontFamily: "Roboto-Medium",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
    background: "#fff",
  },
};
// Customizable Area End
