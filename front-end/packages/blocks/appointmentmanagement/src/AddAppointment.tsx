import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  SafeAreaView,
} from "react-native";
import DatePicker from "react-native-datepicker";
// Customizable Area End

import AppointmentmanagementController, {
  Props,
  //configJSON,
} from "./AppointmentmanagementController";

export default class AddAppointment extends AppointmentmanagementController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    return (
      //Merge Engine DefaultContainer
      <SafeAreaView style={styles.defaultContainer}>
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableWithoutFeedback
            testID="hideKeyboard"
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            {/* Merge Engine UI Engine Code */}
            <View style={styles.innerContainer}>
              <View style={styles.buttonContent}>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  testID="btnNavigateToAppointments"
                  onPress={() => this.navigateToAppointments()}
                >
                  <Text style={styles.viewAllButtonText}>
                    View all Appointments
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formContent}>
                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>Available Date:</Text>
                  <DatePicker
                    style={styles.width100}
                    date={this.state.available_date}
                    mode="date"
                    testID="txtInputAvailableDate"
                    placeholder="selectDate"
                    //placeholderTextColor="red"
                    format="DD/MM/YY"
                    minDate="01/01/20"
                    maxDate="01/01/25"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      datePicker: {
                        backgroundColor: "#d1d3d8",
                        justifyContent: "center",
                      },
                      dateIcon: {
                        position: "absolute",
                        right: 5,
                        top: 4,
                      },
                      dateInput: {
                        borderColor: "#ccc",
                        borderWidth: 1,
                        borderRadius: 4,
                        //fontSize: 20,
                        width: "100%",
                        //color: "#ccc",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingHorizontal: 10,
                      },
                    }}
                    onDateChange={(availableDate: any) => {
                      this.setState({ available_date: availableDate });
                    }}
                  />
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>Available from:</Text>
                  <DatePicker
                    style={styles.width100}
                    date={this.state.start_time}
                    mode="time"
                    testID="txtInputAvaialblefrom"
                    placeholder="Select Time"
                    format="HH:mm A"
                    minuteInterval={10}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      datePicker: {
                        backgroundColor: "#d1d3d8",
                        justifyContent: "center",
                      },
                      dateIcon: {
                        position: "absolute",
                        right: 5,
                        top: 4,
                      },
                      dateInput: {
                        borderColor: "#ccc",
                        borderWidth: 1,
                        borderRadius: 4,
                        //fontSize: 20,
                        width: "100%",
                        //color: "#ccc",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingHorizontal: 10,
                      },
                    }}
                    onDateChange={(available_from: any) => {
                      this.setState({ start_time: available_from });
                    }}
                  />
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>Available to:</Text>
                  <DatePicker
                    style={styles.width100}
                    date={this.state.end_time}
                    mode="time"
                    placeholder="Select Time"
                    testID="txtInputAvailableTo"
                    //placeholderTextColor="red"
                    format="HH:mm A"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      datePicker: {
                        backgroundColor: "#d1d3d8",
                        justifyContent: "center",
                      },
                      dateIcon: {
                        position: "absolute",
                        right: 5,
                        top: 4,
                      },
                      dateInput: {
                        borderColor: "#ccc",
                        borderWidth: 1,
                        borderRadius: 4,
                        //fontSize: 20,
                        width: "100%",
                        //color: "#ccc",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingHorizontal: 10,
                      },
                    }}
                    onDateChange={(available_to: any) => {
                      this.setState({ end_time: available_to });
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.createButton}
                  testID="btnAddAppointment"
                  onPress={() => this.addAppointment()}
                >
                  <Text style={styles.createButtonText}>Add Appointment</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Merge Engine UI Engine Code */}
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  defaultContainer: {
    height: "99%",
    width: "100%",
  },
  createButton: {
    backgroundColor: "blue",
    borderRadius: 4,
    paddingVertical: 15,
    marginVertical: 12,
  },
  innerContainer: {
    marginBottom: 30,
  },
  createButtonText: {
    textAlign: "center",
    color: "#fff",
    lineHeight: 20,
    fontSize: 20,
    fontWeight: "600",
  },
  inputBox: {
    marginVertical: 10,
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  buttonContent: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  viewAllButton: {
    borderRadius: 4,
    marginVertical: 12,
  },
  viewAllButtonText: {
    textAlign: "center",
    color: "blue",
    lineHeight: 20,
    fontSize: 20,
    fontWeight: "600",
  },
  width100: {
    width: "100%",
  },
  formContent: {
    marginTop: 30,
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
});
// Customizable Area End
