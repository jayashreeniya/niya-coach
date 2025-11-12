import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { imgRattingbg, imgStar, imgFullStar, imgHalfStar } from "./assets";
import * as IMG_CONST from "../../user-profile-basic/src/assets";
import StarRating from "react-native-star-rating";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import RattingController, { Props } from "./RattingController";
import { dimensions } from "../../../components/src/utils";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";

export default class Ratting extends RattingController {
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

  ratingCompleted(rating: any) {
    this.setState({ coachRating: rating });
    console.log("Rating is: " + rating);
  }
  // Customizable Area End

  render() {
    // Customizable Area Start

    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always">
          <TouchableWithoutFeedback
            onPress={() => {
              this.hideKeyboard();
            }}
            testID="keyboardhide"
          >
            <View>
              <ImageBackground
                style={styles.imgBackground}
                resizeMode="stretch"
                source={imgRattingbg}
              >
                <View
                  style={styles.imgBackgroundCont}
                >
                  <View
                    style={styles.imgBackgroundSCont}
                  >
                    <View
                      style={styles.headerCont}
                    >
                      <TouchableOpacity
                       testID="HomePagePress"
                        onPress={() =>
                          this.props.navigation.navigate("HomePage")
                        }
                      >
                        <Image
                          style={styles.arrow}
                          source={IMG_CONST.ARROW_ICON}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View
                  style={styles.rateUrExperieceCont}
                >
                  <Typography
                    font="BLD"
                    size={20}
                    color={"black"}
                    style={styles.rateUrText}
                  >
                    RATE YOUR EXPERIENCE
                  </Typography>
                </View>
              </ImageBackground>

              <View>
                {this.state.loading ? (
                  <View
                    style={styles.loadingCont}
                  >
                    <ActivityIndicator
                      style={styles.loadingContent}
                      size="large"
                    />
                  </View>
                ) : (
                  <>
                    <View
                      style={[styles.container,styles.containerMain]}
                    >
                      <View
                        style={styles.containerSub}
                      >
                        <Typography
                          font="BLD"
                          size={16}
                          color={"black"}
                          style={styles.howDidurSession}
                        >
                          {
                            "How did your session go? Your feedback will help us, help you more!"
                          }
                        </Typography>
                      </View>
                      <View
                        style={styles.howWasSessionCont}
                      >
                        <Typography
                          font="REG"
                          size={14}
                          color={"black"}
                          style={styles.howWasSessionText}
                        >
                          How was the session overall?
                        </Typography>
                      </View>
                      <View
                        style={styles.starRatingCont}
                      >
                        <StarRating
                          disabled={false}
                          emptyStar={imgStar}
                          fullStar={imgFullStar}
                          halfStar={imgHalfStar}
                          iconSet={"Ionicons"}
                          maxStars={5}
                          rating={this.state.coachRating}
                          selectedStar={(rating: any) =>
                            this.setState({ coachRating: rating })
                          }
                          fullStarColor={"#FDEF09"}
                          halfStarEnabled
                          starStyle={styles.starSty}
                        />
                      </View>
                      <View
                        style={styles.basedCont}
                      >
                        <Typography
                          font="REG"
                          size={14}
                          color={"black"}
                          style={styles.basedText}
                        >
                          Based on your last session, how is Niya helping you
                          achieve your goal?
                        </Typography>
                      </View>
                      <View
                        style={styles.starRatingCont}
                      >
                        <StarRating
                          disabled={false}
                          emptyStar={imgStar}
                          fullStar={imgFullStar}
                          halfStar={imgHalfStar}
                          iconSet={"Ionicons"}
                          maxStars={5}
                          rating={this.state.appRating}
                          selectedStar={(rating: any) =>
                            this.setState({ appRating: rating })
                          }
                          fullStarColor={"#FDEF09"}
                          halfStarEnabled
                          starStyle={styles.starSty}
                        />
                      </View>

                      <View
                        style={styles.basedCont}
                      >
                        <Typography
                          font="REG"
                          size={14}
                          color={"black"}
                          style={styles.basedText}
                        >
                          What was your biggest take away?
                        </Typography>
                      </View>
                      <View
                        style={styles.feedbackCont}
                      >
                        <TextInput
                          value={this.state.feedBack}
                          onChangeText={(text) =>
                            this.setState({ feedBack: text })
                          }
                          multiline={true}
                          maxLength={150}
                          style={styles.feedbacktextbox}
                        />
                      </View>
                    </View>
                    <View style={styles.innerContainer}>
                      <TouchableOpacity
                        style={styles.btnSubmitCont}
                        {...this.submitPressProps}
                        testID="submitbtn"
                      >
                        <Text
                          style={styles.btnSubmitText}
                        >
                          {"Submit"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnNotSatisfiedCont}
                        {...this.bookacallPressProps}
                        testID="Bookacallsubmitbtn"
                      >
                        <Text
                          style={styles.btnNotSatisfiedText}
                        >
                          {"Not satisfied (Book a call)"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    backgroundColor: "#fff",
  },
  innerContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    flex: 1,
  },
  arrow: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#000",
  },
  star: {
    borderColor: "black",
    backgroundColor: "transparent",
  },
  imgBackground:{
    width: "100%", 
    height: 252
  },
  imgBackgroundCont:{
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 30,
    marginRight: 0
  },
  imgBackgroundSCont:{
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  headerCont:{
    alignSelf: "flex-start",
    marginLeft: Scale(15),
    flexDirection: "column"
  },
  rateUrExperieceCont:{
    flexDirection: "column",
    width: dimensions.wp(90),
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: Scale(150)
  },
  rateUrText:{
    textAlignVertical: "center"
  },
  loadingCont:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingContent:{
    flex: 1,
    opacity: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  containerMain:{
    marginTop: Scale(10),
    justifyContent: "center",
    alignItems: "center"
  },
  containerSub:{
    backgroundColor: "#EEEBFF",
    width: dimensions.wp(90),
    borderRadius: Scale(10),
    padding: Scale(20)
  },
  howDidurSession:{
    width: dimensions.wp(60),
    marginLeft: Scale(30),
    textAlign: "center",
    lineHeight: Scale(25)
  },
  howWasSessionCont:{
    flexDirection: "row",
    alignSelf: "flex-start",
    marginHorizontal: Scale(20),
    marginTop: Scale(20)
  },
  howWasSessionText:{
    alignSelf: "flex-start", 
    textAlign: "left"
  },
  starRatingCont:{
    marginVertical: Scale(15),
    alignSelf: "flex-start",
    marginLeft: Scale(10)
  },
  starSty:{
    marginHorizontal: Scale(15),
    width: Scale(30),
    height: Scale(30)
  },
  basedCont:{
    flexDirection: "row",
    alignSelf: "flex-start",
    marginHorizontal: Scale(20),
    marginTop: Scale(20)
  },
  basedText:{
    alignSelf: "flex-start", 
    textAlign: "left" 
  },
  feedbackCont:{
    marginVertical: Scale(15),
    alignSelf: "flex-start",
    marginLeft: Scale(10)
  },
  feedbacktextbox:{
    backgroundColor: "#F0F0F0",
    fontSize: 16,
    width: dimensions.wp(89),
    borderRadius: Scale(10),
    height: Scale(150),
    marginLeft: Scale(10),
    textAlign: "left",
    textAlignVertical: "top",
    padding: Scale(10),
    flexWrap: "wrap"
  },
  btnSubmitCont:{
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    height: 50,
    maxHeight: 60,
    borderWidth: 1,
    backgroundColor: "#8E84D9",
    borderColor: "#8E84D9",
    flexDirection: "column",
    paddingHorizontal: dimensions.wp(6.5)
  },
  btnSubmitText:{
    fontWeight: "bold",
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
  },
  btnNotSatisfiedCont:{
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    height: 50,
    maxHeight: 60,
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderColor: "#8E84D9",
    flexDirection: "column"
  },
  btnNotSatisfiedText:{
    fontWeight: "bold",
    fontSize: 15,
    color: "#8E84D9",
    textAlign: "center",
    textAlignVertical: "center",
    margin: 14
  }
});
// Customizable Area End
