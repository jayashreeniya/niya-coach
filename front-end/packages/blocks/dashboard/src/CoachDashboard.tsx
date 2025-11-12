import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
//@ts-ignore
import Drawer from "react-native-drawer";

import { ACCOUNT_ICON, PRIVACY_ICON, CONTACT_US_ICON, LOGOUT_ICON,coachCalendar, coachClock, tick } from "./assets";
import { Colors, dimensions } from "../../../components/src/utils";
import Typography from "../../../components/src/Typography";
import Button from "../../../components/src/Button";
import Meeting from "../../../components/src/Meeting";
import Scale from "./Scale";
import * as IMG_CONST from './assets';
// Customizable Area End
import CoachDashboardController, { Props } from "./CoachDashboardController";
import moment from "moment";
export default class Dashboard extends CoachDashboardController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  // Customizable Area Start
  child: any;
  days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  renderDrawer = () => {
    return (
      <SafeAreaView style={styles.containerFilter}>
        <View style={styles.HomeContainer}>
          <View style={styles.headerImage}>
            <Image style={styles.ProfileImage} source={ this.state.profile.image?{uri: this.state.profile.image}:IMG_CONST.dummyPROFILE_ICON } />
            <View style={styles.ProfileTextHeader}>
              <Typography font="MED" size={18}>{this.state.profile.full_name}</Typography>
             </View>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("UserProfile", { role: "coach" })}
            testID="profile_click"
          >
            <Image style={styles.account} source={ACCOUNT_ICON} />
            <Typography size={17}>Account Settings</Typography>
          </TouchableOpacity>
        
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
            testID="Privacy_click"
         >
            <Image style={styles.account} source={PRIVACY_ICON} />
            <Typography size={17}>Privacy Policy</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("ContactUsScreen")}
            testID="contactus_click"
          >
            <Image style={styles.account} source={CONTACT_US_ICON} />
            <Typography size={17}>Contact Us</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={this.logOut}
            testID="logout_click"
          >
            <Image style={styles.account} source={LOGOUT_ICON} />
            <Typography size={17}>Logout</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={this.showDelAlert}
            testID="logout_click1"
          >
            <Image style={styles.account} source={LOGOUT_ICON} />
            <Typography size={17} color={"red"}>Delete Account</Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  renderPastAppointments = () => {
    if(this.state.loading){
      return(
        <View>
          <ActivityIndicator color={Colors.coachAccent} size="large" />
        </View>
      );
    }
    return(
      <FlatList
        data={this.state.pastAppointments}
        keyExtractor={item => item.id}
        ListEmptyComponent={this.state.loading? <></>: <Typography style={{marginTop: 15}} color="greyText" size={15} align="center">No appointments found</Typography>}
        renderItem={({ item ,index}) => {
          const { name, booking_date, viewable_slots } = item?.attributes?.appointments;
          const [start, end] = viewable_slots?.split?.(" - ");
          const bookingDate = moment(booking_date, "YYYY-MM-DD");
          return(
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Chat9", { name: name, id: item.attributes.appointments.id })}
              style={styles.appointment}
              testID={`coach${index}`}
            >
              <View style={[styles.row, styles.mb, styles.flexBetween]}>
                <Typography color="accent" size={18} font="MED">{name}</Typography>
                <Image source={tick} style={styles.calendar} />
              </View>
              <View style={styles.row}>
                <Image source={coachClock} style={styles.clock} />
                <Typography color="inputTextColor" size={13}>{moment(start, ["DD/MM/YYYY HH:mm"]).format("hh:mm A")} - {moment(end, ["DD/MM/YYYY HH:mm"]).format("hh:mm A")}</Typography>
                <View style={styles.fullFlex} />
                <Typography color="inputTextColor" size={13}>{this.days?.[bookingDate.get("day")]}, {bookingDate.format("DD-MM-YYYY")}</Typography>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  renderPendingAppointments = () => {
    if(this.state.loading){
      return(
        <View>
          <ActivityIndicator color={Colors.coachAccent} size="large" />
        </View>
      );
    }
    return(
      <FlatList
        data={this.state.appointments}
        keyExtractor={item => item.id}
        ListEmptyComponent={this.state.loading? <></>: <Typography style={{marginTop: 15}} color="greyText" size={15} align="center">No appointments found</Typography>}
        renderItem={({ item }) => {
          const { name, booking_date, viewable_slots, id, meeting_code } = item?.attributes?.appointments;
          const [start, end] = viewable_slots?.split?.(" - ");
          const now = moment();
          const startMoment = moment(start, ["DD/MM/YYYY HH:mm"]);
          const endMoment = moment(end, ["DD/MM/YYYY HH:mm"]);
          const disabled = !now.isBetween(startMoment, endMoment);
          const bookingDate = moment(booking_date, "YYYY-MM-DD");
          // console.log(moment().format("DD-MM-YY hh:mm"), moment(start, ["DD/MM/YYYY HH:mm"]).subtract(5, "minutes").format("DD-MM-YYYY hh:mm"))
          return(
            <TouchableOpacity
              testID="chatbtnpress"
              onPress={() => this.props.navigation.navigate("Chat9", { name: name, id: id })}
              style={styles.appointment}
            >
              <View style={[styles.row, styles.mb, styles.flexBetween]}>
                <Typography color="coachAccent" size={18} font="MED">{name}</Typography>
                <Image source={coachCalendar} style={styles.calendar} />
              </View>
              <View style={styles.row}>
                <Image source={coachClock} style={[styles.clock, styles.greenClock]} />
                <Typography color="inputTextColor" size={13}>{moment(start, ["DD/MM/YYYY HH:mm"]).format("hh:mm A")} - {moment(end, ["DD/MM/YYYY HH:mm"]).format("hh:mm A")}</Typography>
                <View style={styles.fullFlex} />
                <Typography color="inputTextColor" size={13}>{this.days?.[bookingDate.get("day")]}, {bookingDate.format("DD-MM-YYYY")}</Typography>
              </View>
              <View style={{ width: dimensions.wp(30), alignSelf: "flex-end" }}>
                <Button
                  mode="contained"
                  onPress={() => {
                    if(disabled) return;
                    this.startMeeting(meeting_code, item?.attributes?.id)
                  }}
                  style={[styles.button, { backgroundColor: disabled? `${Colors.green}44`: Colors.green }]}
                >
                  <Typography font="MED" color="white" size={14}>Make a call</Typography>
                </Button>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  renderAppointments = () => {
    if(this.state.activeTab === 1){
      return this.renderPendingAppointments();
    }
    return this.renderPastAppointments();
  }
  // Customizable Area End
    
  render() {
    // Customizable Area Start
    return (
      //Merge Engine DefaultContainer
      <Drawer
        ref={(r: any) => this.drawerRef = r}
        type="overlay"
        tapToClose={true}
        openDrawerOffset={.35}
        content={this.renderDrawer()}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
            {/* Customizable Area Start */}
            {/* Merge Engine UI Engine Code */}
            <LinearGradient
              colors={["#9C6FB4", "#9C6FB4"]}
              // start={{ x: 0, y: 1 }}
              // end={{ x: 1, y: 1 }}
              style={styles.header}
            >
              <View style={[styles.row, styles.mb, styles.pad]}>
                <TouchableOpacity testID="menu_open" onPress={() => this.drawerRef?.open?.()}>
                  <Image source={require('../assets/imagenav_menu.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <Typography
                  style={styles.fullFlex}
                  color="white"
                  font="MED"
                  size={18}
                >
                  Coach Dashboard
                </Typography>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => this.switchTab(1)}
                  style={[styles.halfRow, (this.state.activeTab === 1)? styles.activeRow: {}, { width: "40%" }]}
                  testID="tabone"
                >
                  <Typography size={15} color="white" align="center">Appointments</Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.switchTab(2)}
                  style={[styles.halfRow, (this.state.activeTab === 2)? styles.activeRow: {}, { width: "60%" }]}
                  testID="tabtwo"
                >
                  <Typography size={15} color="white" align="center">Completed Appointments</Typography>
                </TouchableOpacity>
              </View>
            </LinearGradient>
            {this.renderAppointments()}
            {this.state.showMeetingModal && (
              <Meeting
                meetingId={this.state.meetingId}
                token={this.state.meetingToken}
                visible={this.state.showMeetingModal}
                onClose={this.endMeeting}
              />
            )}
            {/* Merge Engine UI Engine Code */}
            {/* Customizable Area End */}
        </SafeAreaView>
      </Drawer>
      //Merge Engine End DefaultContainer
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  header: {
    width: dimensions.wp(100),
    paddingTop: dimensions.hp(3),
    borderBottomColor: Colors.greyText,
    borderBottomWidth: 1
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  pad: {
    paddingHorizontal: dimensions.wp(5),
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7)
  },
  fullFlex: {
    flex: 1
  },
  mb: {
    marginBottom: dimensions.hp(2)
  },
  halfRow: {
    paddingVertical: dimensions.hp(1.5)
  },
  activeRow: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 3
  },
  appointment: {
    marginHorizontal: dimensions.wp(4),
    marginVertical: dimensions.hp(1),
    backgroundColor: Colors.white,
    borderColor: "#D6A6EF",
    borderWidth: 1,
    borderRadius: dimensions.wp(2),
    padding: dimensions.wp(4),
    elevation: 4
  },
  flexBetween: {
    justifyContent: "space-between",
    alignItems: "center"
  },
  calendar: {
    height: dimensions.hp(2),
    width: dimensions.hp(2),
    resizeMode: "contain",
    padding: dimensions.wp(1),
    // backgroundColor: "#eeeeee"
  },
  clock: {
    height: dimensions.hp(2),
    width: dimensions.hp(2),
    resizeMode: "contain",
    marginRight: dimensions.wp(2),
  },
  greenClock: {
    tintColor: Colors.green
  },
  button: {
    backgroundColor: Colors.green,
    marginBottom: 0,
    marginTop: dimensions.hp(2)
  },
  containerFilter: {
    flex: 1,
    backgroundColor: "#ffffff",
    elevation: 5
  },
  HomeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  headerImage: {
    alignItems: "center",
    justifyContent: "center"
  },
  ProfileImage: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(40),
    resizeMode: "cover",
    borderColor: "#c2b2d8"
  },
  profileText: {
    fontSize: Scale(15),
    color: "#000",
    marginTop: Scale(10)
  },
  AccountText: {
    fontSize: Scale(15),
    color: "#000",
    marginLeft: Scale(20),
  },
  profileFirstText: {
    color: "gray",
    fontSize: Scale(15)
  },
  ProfileTextHeader: {
    marginVertical: dimensions.hp(1)
  },
  line: {
    width: Scale(210),
    height: Scale(1),
    borderWidth: Scale(0.3),
    borderColor: "#DDD",
    marginTop: Scale(30),
    alignSelf: "center"
  },
  account: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#8c69c6",
    marginRight: dimensions.wp(4)
  },
  accoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Scale(20)
  },
});
// Customizable Area End
