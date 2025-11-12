import React from "react";
// Customizable Area Start
import { Container, Box, Button, Typography } from "@material-ui/core";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
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

export default class AddAppointment extends AppointmentmanagementController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    // Customizable Area Start
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              data-test-id="btnNavigateToAppointments"
              variant="contained"
              color="primary"
              onClick={() => this.navigateToAppointments()}
            >
              View all Appointments
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
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
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Available from: </Typography>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <TimePicker
                  data-test-id="txtInputAvaialblefrom"
                  placeholder="hh:mm A"
                  format={"hh:mm A"}
                  fullWidth
                  value={this.state.start_time}
                  onChange={(available_from: any) => {
                    this.setState({ start_time: available_from });
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Available to: </Typography>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <TimePicker
                  data-test-id="txtInputAvailableTo"
                  placeholder="hh:mm A"
                  format={"hh:mm A"}
                  fullWidth
                  value={this.state.end_time}
                  onChange={(available_to: any) => {
                    this.setState({ end_time: available_to });
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
            <Button
              data-test-id="btnAddAppointment"
              variant="contained"
              color="primary"
              onClick={() => this.addAppointment()}
            >
              Add Appointment
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
    // Customizable Area Start
  }
}
