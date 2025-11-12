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
  imgPurple_full_star,
  imgPurple_half_star,
  ARROW_ICON,
  imgPurple_empty_star,
} from "./assets";
import LinearGradient from "react-native-linear-gradient";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { Colors, dimensions } from "../../../components/src/utils";
import StarRating from "react-native-star-rating";
//@ts-ignore

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
import Loader from "../../../components/src/Loader";

// Customizable Area End

import UserFeedbackDetController, { Props } from "./UserFeedbackDetController";
import moment from "moment";

export default class UserFeedbackDet extends UserFeedbackDetController {
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
  renderCoachList = () => {
    const {
      full_name,
      company_name,
      rating,
      feedback,
      code,
      image,
      rated_at,
    } = this.state.DataList;
    let datestr = moment(rated_at).format("DD-MM-yy");
    return (
      <>
        <View
          style={[
            styles.coachContainer
          ]}
        >
          <View
            style={[
              styles.row,
              styles.mb,
              styles.coachImgContainer,
            ]}
          >
            <Image
              source={image ? { uri: image } : dummyPROFILE_ICON}
              style={styles.coachProfileImg}
            />
            <View style={styles.coachNameContainer}>
              <Typography
                size={14}
                style={[styles.statusText, styles.coachNameText]}
              >
                {full_name}
              </Typography>
              <Typography
                color="black"
                size={12}
                font="MED"
                style={[styles.statusText, styles.companyNameText]}
              >
                {company_name}
              </Typography>
            </View>
            <View
              style={styles.codeContainer}
            >
              <Typography
                size={13}
                font="REG"
                style={styles.codeLabel}
              >
                {"Code: "}
              </Typography>
              <Typography
                size={13}
                font="BLD"
                style={styles.codeText}
              >
                {code}
              </Typography>
            </View>
          </View>
        </View>
        <View
          style={ styles.dateContainer}
        >
          <View
            style={styles.dateTextContainer}
          >
            <Typography size={14} font="BLD" style={styles.dateText}>
              {datestr}
            </Typography>
          </View>
          <View>
            <Typography size={14} font="BLD" style={styles.ratingLbelText}>
              {"Ratings"}
            </Typography>
          </View>
          <View
            style={ styles.rattingContainer}
          >
            <StarRating
              disabled={true}
              emptyStar={imgPurple_empty_star}
              fullStar={imgPurple_full_star}
              halfStar={imgPurple_half_star}
              iconSet={"Ionicons"}
              maxStars={5}
              rating={rating}
              fullStarColor={"#9F6CB3"}
              halfStarEnabled
              starStyle={styles.rattingStarimg}
            />
            <Typography
              size={16}
              font="REG"
              style={styles.rattingNumText}
            >
              {rating}
            </Typography>
          </View>

          <View style={styles.feedbackTextContainer}>
            <Typography size={14} font="BLD" style={styles.feedbackText}>
              {"Feedback"}
            </Typography>
          </View>
          <View
            style={ styles.feedbackTextBoxContainer}
          >
            <Typography
              size={14}
              font="REG"
              style={styles.feedbackLbel}
            >
              {feedback}
            </Typography>
          </View>
        </View>
      </>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#9C6FB4", "#9C6FB4"]} style={styles.header}>
          <View style={[styles.row, styles.mb, styles.pad]}>
            <TouchableOpacity testID="btnHome" onPress={() => this.props.navigation.goBack()}>
              <Image source={ARROW_ICON} style={styles.backIcon} />
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
        <View
          style={[styles.row,styles.lineContainer]}
        />
        <View style={styles.parentContainermain}>
          <View style={[styles.containermain]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {this.renderCoachList()}

              <View style={styles.loaderContainer}>
                {this.state.loading ? (
                  <Loader loading={this.state.loading} />
                ) : null}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
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
  coachContainer: {
    marginHorizontal: Scale(15),
    marginVertical: Scale(15),
    backgroundColor: "#fff",
    height: Scale(80),
    width: dimensions.wp(90),
    paddingHorizontal: Scale(15),
    alignItems: "center",
  },
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
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
  },
 coachImgContainer:{
  justifyContent: "flex-start", 
  alignItems: "flex-start"
 },
 coachProfileImg:{
  width: 50, 
  height: 50, 
  borderRadius: 25 
 },
 coachNameContainer:{
  width: dimensions.wp(50)
 },
 coachNameText:{
  width: "70%",
  color: "#936FAE" 
 },
 companyNameText:{
  marginTop: 1
 },
 codeContainer:{
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  marginRight: Scale(2),
  marginTop: Scale(36),
 },
 codeLabel:{
  color: "#898989", 
  flexDirection: "column" 
 },
 codeText:{
  color: "#737373", 
  flexDirection: "column"
 },
 dateContainer:{
  width: dimensions.wp(94),
  height: dimensions.hp(35),
  marginHorizontal: Scale(7),
  padding: Scale(10),
  borderColor: "#DFDFDF",
  borderWidth: 1,
  borderRadius: Scale(10),
 },
 dateTextContainer:{
  backgroundColor: "#F3F3F3",
  borderRadius: Scale(5),
  width: Scale(100),
  height: Scale(30),
  alignItems: "center",
  alignContent: "center",
  justifyContent: "center",
  alignSelf: "flex-end",
 },
 dateText:{
  color: "#AFAFAF"
 },
 ratingLbelText:{
  color: "#9F65B3"
 },
 rattingContainer:{
  flexDirection: "row",
  backgroundColor: "#F3F3F3",
  borderRadius: Scale(10),
  width: dimensions.wp(88),
  height: Scale(60),
  marginTop: Scale(5),
  alignSelf: "center",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
 },
 rattingStarimg:{
  width: Scale(30),
  height: Scale(30),
  marginHorizontal: Scale(2),
 },
 rattingNumText:{
  color: "#9F65B3", 
  alignSelf: "center"
 },
 feedbackTextContainer:{
  marginTop: Scale(10)
 },
 feedbackText:{
  color: "#9F65B3" 
 },
 feedbackTextBoxContainer:{
  flexDirection: "row",
  backgroundColor: "#F3F3F3",
  borderRadius: Scale(10),
  width: dimensions.wp(88),
  height: Scale(100),
  marginTop: Scale(5),
  alignSelf: "flex-start",
  alignContent: "flex-start",
  alignItems: "baseline",
  justifyContent: "flex-start",
  padding: Scale(10),
 },
 feedbackLbel:{
  color: "#000", alignSelf: "center"
 },
 lineContainer:{
  backgroundColor: "#9ECCFF",
  marginBottom: Scale(10),
  height: Scale(7),
 },
 parentContainermain:{
  backgroundColor: "pink", 
  flex: 1, 
  marginHorizontal: 4
 },
 loaderContainer:{
  flex: 1, 
  height: 100
 }
});
// Customizable Area End
