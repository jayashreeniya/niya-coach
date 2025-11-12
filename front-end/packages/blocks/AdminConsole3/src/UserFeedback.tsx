// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import {
  dummyPROFILE_ICON,
  LOGOUT_ICON,
  ACCOUNT_ICON,
  PRIVACY_ICON,
  FEED_BACK_ICON,
  BELL_ICON,
  MENU_ICON,
  starimg,
} from "./assets";
import LinearGradient from "react-native-linear-gradient";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { Colors, dimensions } from "../../../components/src/utils";

//@ts-ignore
import Drawer from "react-native-drawer";
// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
import Loader from "../../../components/src/Loader";

// Customizable Area End

import UserFeedbackController, { Props } from "./UserFeedbackController";

export default class UserFeedback extends UserFeedbackController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start

    Dimensions.addEventListener("change", (e) => {
      MergeEngineUtilities.init(
        artBoardHeightOrg,
        artBoardWidthOrg,
        Dimensions.get("window").height,
        Dimensions.get("window").width
      );
      this.forceUpdate();
    });
    // Customizable Area End
  }
  

  // Customizable Area Start

  renderDrawer = () => {
    return (
      <SafeAreaView style={styles.containerFilter}>
        <View style={styles.HomeContainer}>
          <View style={styles.headerImage}>
            <Image
              style={styles.ProfileImage}
              source={
                this.state.prifileimage
                  ? { uri: this.state.prifileimage }
                  : dummyPROFILE_ICON
              }
            />
            <View style={styles.ProfileTextHeader}>
              <Typography font="MED" color={"white"} size={18}>
                {this.state.full_name}
              </Typography>
            </View>
          </View>
          <View style={styles.line} />
          <TouchableOpacity testID="btnProfile"
            style={styles.accoutHeader}
            onPress={() =>
              this.props.navigation.navigate("UserProfile", {
                role: "admin",
              })
            }
          
          >
            <Image style={styles.account} source={ACCOUNT_ICON} />
            <Typography size={17} color={"white"}>
              Account Settings
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity testID="btnSndPushNoti"
            style={styles.accoutHeader}
            onPress={() =>
              this.props.navigation.navigate("SendPushnotification")
            }
          
          >
            <Image style={styles.account} source={BELL_ICON} />
            <Typography size={17} color={"white"}>
              Push Notifications
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity testID="btnPPl"
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
          
          >
            <Image style={styles.account} source={PRIVACY_ICON} />
            <Typography size={17} color={"white"}>
              Privacy Policy
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity testID="btnFeedback"
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("UserFeedback")}
         
          >
            <Image style={styles.account} source={FEED_BACK_ICON} />
            <Typography size={17} color={"white"}>
              Feedback
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity testID="btnLogOut_click" style={styles.accoutHeader} onPress={this.logOut} >
            <Image style={styles.account} source={LOGOUT_ICON} />
            <Typography size={17} color={"white"}>
              Logout
            </Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  renderCoachList = () => {
    return (
      <>
        {this.state.DataList.map((item, index) => {
          const { full_name, id, image, rating } = item;

          return (
            <View key={index}>
              <TouchableOpacity testID={`coach${index}`}
                onPress={() =>
                  this.props.navigation.navigate("UserFeedbackDet", {
                    user_id: id,
                  })
                }
                key={index}
                style={[styles.coachlistContainer]}
              >
                <View style={[styles.row, styles.mb, styles.coachItem]}>
                  <Image
                    source={image ? { uri: image } : dummyPROFILE_ICON}
                    style={styles.coachProfileImg}
                  />
                  <View style={styles.coachnameContainer}>
                    <Typography size={16} style={[styles.statusText]}>
                      {full_name}
                    </Typography>
                  </View>
                  <View style={styles.starimgContainer}>
                    <Image source={starimg} style={styles.starImage} />
                    <Typography size={13} font="REG" style={styles.ratingText}>
                      {" "}
                      {rating}
                    </Typography>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <Drawer
        ref={(ref: any) => {
          this.drawerRef = ref;
        }}
        type="overlay"
        tapToClose={true}
        openDrawerOffset={0.35}
        content={this.renderDrawer()}
        style={styles.drawerContainer}
      >
        <SafeAreaView style={styles.container}>
          <LinearGradient colors={["#9C6FB4", "#9C6FB4"]} style={styles.header}>
            <View style={[styles.row, styles.mb, styles.pad]}>
              <TouchableOpacity testID="btnHome" onPress={() => this.drawerRef?.open?.()}>
                  <Image source={MENU_ICON} style={styles.backIcon} />
                </TouchableOpacity>
              <Typography
                style={styles.fullFlex}
                color="white"
                font="MED"
                size={16}
              >
                {"User feedbacks"}
              </Typography>
            </View>
          </LinearGradient>
          <View style={[styles.row, styles.lineTop]} />
          <View style={styles.parentContainermain}>
            <View style={[styles.containermain]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {this.renderCoachList()}

                <View style={styles.loadingContainer}>
                  {this.state.loading ? (
                    <Loader loading={this.state.loading} />
                  ) : null}
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Drawer>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  coachlistContainer: {
    marginHorizontal: dimensions.wp(4),
    marginVertical: dimensions.hp(1),
    backgroundColor: "#fff",
    borderColor: "#D6A6EF",
    borderWidth: 1,
    borderRadius: dimensions.wp(2),
    padding: dimensions.wp(2),
    elevation: 4,
    height: 70,
    minHeight: 70,
    maxHeight: 95,
    alignItems: "center",
  },
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: "#9A6DB2",
  },
  lineTop: {
    backgroundColor: "#9ECCFF",
    marginBottom: Scale(10),
    height: Scale(7),
  },
  parentContainermain: {
    backgroundColor: "pink",
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    height: 100,
  },
  fullFlex: {
    flex: 1,
    
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7),
  },
  pad: {
    paddingHorizontal: dimensions.wp(5),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mb: {
    marginBottom: dimensions.hp(4),
  },

  header: {
    width: dimensions.wp(100),
    paddingTop: dimensions.hp(3),
    borderBottomColor: Colors.greyText,
    borderBottomWidth: 1,
  },
  statusText: {
    paddingVertical: dimensions.hp(0.5),
    paddingHorizontal: dimensions.wp(3),
    borderRadius: dimensions.wp(3),
    width: "80%",
    color: "#936FAE",
  },
  containerFilter: {
    flex: 1,
    backgroundColor: "#9A6DB2",
    elevation: 5,
  },
  ProfileTextHeader: {
    marginVertical: dimensions.hp(1),
  },
  accoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Scale(20),
  },
  HomeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#9A6DB2",
    
  },
  headerImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  ProfileImage: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(40),
    resizeMode: "cover",
    borderColor: "#c2b2d8",
  },
  line: {
    width: Scale(210),
    height: Scale(1),
    borderWidth: Scale(0.3),
    borderColor: "#DDD",
    marginTop: Scale(30),
    alignSelf: "center",
  },
  account: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#fff",
    marginRight: dimensions.wp(4),
  },
  coachItem: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  coachProfileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  coachnameContainer: {
    width: dimensions.wp(60),
    alignSelf: "center",
  },
  starimgContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: Scale(2),
    alignSelf: "center",
  },
  starImage: {
    width: 18,
    height: 18,
    alignSelf: "center",
  },
  ratingText: {
    color: "#936FAE",
    alignSelf: "center",
  },
});
// Customizable Area End
