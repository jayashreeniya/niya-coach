import React from "react";

import {
  Container,
  Box,
  Button,
  InputLabel,
  Typography,

  // Customizable Area Start
  // Customizable Area End
} from "@material-ui/core";

// Customizable Area Start
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Loader from "../../../components/src/Loader";


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

import TimeTrackingBillingController, {
  Props,
} from "./TimeTrackingBillingController";

export default class TimeTrackingBilling extends TimeTrackingBillingController {
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
        <Box style={{ flex: 1 }}>
          <Box style={{
            maxWidth: "100%",
            backgroundColor: "#9A6DB2",
            marginBottom: "20px"
          }}
          >
            <Box style={{ padding: "10px 20px", maxWidth: "100%" }} >
              <Typography style={{ flex: 1, textAlign: 'left', color: '#fff', fontSize: 20, flexWrap: 'wrap' }}>Time Tracking and Billing</Typography>
            </Box>
          </Box>

          <Container >

            <Box sx={webStyle.mainWrapper}>
              {this.state.loading ? (
                <Loader loading={this.state.loading} />
              ) :
                (
                  <>
                    {
                      this.state.TrackingDataList.map((item, index) => {
                        const { id, full_name } = item;

                        return (
                          <Button style={webStyle.buttonStyle} key={index} onClick={() => this.routeChange(id)}>
                            {"Name: "}{full_name}
                          </Button>
                        )

                      })
                    }
                    <Button style={webStyle.loadButtonStyle} onClick={() => this.fetchMoreData()}>
                      Load More
                    </Button>
                  </>

                )
              }

            </Box>
          </Container>
        </Box>
      </ThemeProvider>
      // Customizable Area End
    );
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
    marginTop: "15px",
    border: "1px solid #D6A6EF",
    color: "#9A6DB2",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
  },
  loadButtonStyle: {
    width: "200px",
    height: "45px",
    marginTop: "15px",
    border: "1px solid #D6A6EF",
    color: "#fff",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    background: '#9A6DB2'
  },
};
// Customizable Area End
