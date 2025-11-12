import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
//@ts-ignore
import { Avatar } from "react-native-elements";
import GenericCalendarList from "../../../components/src/GenericCalendarList";
import GenericCard from "../../../components/src/GenericCard";
import { COLORS, CommonStyle } from "./Helpers";
// Customizable Area End

import SchedulingController, {
  Props
  // Customizable Area Start
  // Customizable Area End
} from "./SchedulingController";

export default class Scheduling extends SchedulingController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  // Customizable Area Start
  // Customizable Area End
  render() {
    // Customizable Area Start
    const { serviceProviderSchedule } = this.state;
    // Customizable Area End
    return (
      //Merge Engine DefaultContainer
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
          <View>
            <View style={styles.topSection}>
              <View style={styles.userNameText}>
                  <Avatar
                    size={86}
                    rounded
                    icon={{ name: 'user', type: 'font-awesome' }}
                    title=""
                    overlayContainerStyle={{ backgroundColor: COLORS.inputLabel }}
                    activeOpacity={0.7}
                  />
              </View>
              <Text style={styles.userNameText}>
                User Profilie ID: {this.state.serviceProviderId}
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.container]}>
                  <GenericCard>
                    <View style={styles.calendarContainer}>
                      <GenericCalendarList
                        {...this.calendarProps}
                        testID={`CALENDAR`}
                      />
                    </View>
                  </GenericCard>

                  <GenericCard title={"Availability"}>
                    <View
                      testID="testAvailability"
                      style={styles.timeSlotsWrapper}
                    >
                      {serviceProviderSchedule != '' && serviceProviderSchedule.length > 0 ?
                        <>
                          <View style={[CommonStyle.rowStyle, CommonStyle.spaceAround]}>
                            <Text>StartTime</Text>
                            <Text>EndTime</Text>
                          </View>
                          <View style={[CommonStyle.rowStyle, CommonStyle.spaceAround]}>
                            <Text>{serviceProviderSchedule[0].attributes.start_time}</Text>
                            <Text>{serviceProviderSchedule[0].attributes.end_time}</Text>
                          </View>
                        </> :
                        <View style={CommonStyle.rowStyle}><Text>Availability Not Set</Text></View>
                      }
                    </View>
                  </GenericCard>
                </View>
              </ScrollView>
            </View>
          </View>
          {/* Merge Engine UI Engine Code */}
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650
  },
  contentContainer: {
    flex: 1,
    padding: 15
  },
  textBoxWidth: {
    width: "45%"
  },
  textBoxSpace: {
    width: "10%"
  },
  timerHeight: { height: 40 },
  termsWrap:{ marginLeft:0, marginRight: 0, marginTop: 20 },
  modalIOS: {
    width: "80%",
    height: Platform.OS === "ios" ? "90%" : "95%",
    backgroundColor: "white",
    paddingBottom: 20
  },
  textCenter:{ textAlign: "center" },
  topSection: {
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 20
  },
  userNameText: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.inputValue,
    textTransform: "capitalize"
  },
  userEmailText: {
    fontSize: 15,
    textAlign: "center",
    color: COLORS.inputLabel
  },
  scrollWrapper: {
    flex: 1
  },
  calendarContainer: {
    minHeight: 120
  },
  timeSlotsWrapper: {
    flex: 1,
    minHeight: 50
  },
  timeSlot: {
    marginBottom: 10,
    width: "48%"
  },
  emptyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  bottomSubmit: {
    backgroundColor: COLORS.yellow,
    bottom: 0,
    borderRadius: 10,
    padding: 15,
    width: "100%"
  }
});
// Customizable Area End
