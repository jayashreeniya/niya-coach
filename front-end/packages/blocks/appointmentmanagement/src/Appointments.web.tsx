import React from "react";
// Customizable Area Start
import { Container, Box, Button, Typography } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0000ff",
      contrastText: "#fff",
    },
  },
});
// Customizable Area End

import AppointmentmanagementController, {
  Props,
  configJSON,
} from "./AppointmentmanagementController";

export default class Appointments extends AppointmentmanagementController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  getWebList(item: any) {
    return (
      <Box key={`web-item-${item.sno}`} sx={webStyle.tableBox}>
        <Typography variant="h6">
          {`Slot:  ${item.from} - ${item.to}`}
        </Typography>
      </Box>
    );
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    const { appointmentsList } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              m: "1rem",
            }}
          >
            <Typography variant="h6">Available Date: </Typography>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                data-test-id="txtInputAvailableDate"
                placeholder="DD/MM/YY"
                format={"DD/MM/YY"}
                fullWidth
                minDate={"01/01/20"}
                maxDate={"01/01/25"}
                value={this.state.available_date}
                onChange={(availableDate: any) => {
                  this.setState({ available_date: availableDate });
                }}
                animateYearScrolling
              />
            </MuiPickersUtilsProvider>
            <Button
              data-test-id="btnGetAppointment"
              variant="contained"
              color="primary"
              onClick={() => this.getAppointmentList(this.state.token)}
            >
              Get List
            </Button>
          </Box>
          <Box sx={webStyle.appointmentContainer}>
            {appointmentsList &&
              appointmentsList.map((item: any, _: any) =>
                this.getWebList(item)
              )}
          </Box>
        </Container>
      </ThemeProvider>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const webStyle = {
  appointmentContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    width: "100%",
    backgroundColor: "white",
    marginTop: "20px",
  },
  tableBox: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
  },
};
// Customizable Area End
