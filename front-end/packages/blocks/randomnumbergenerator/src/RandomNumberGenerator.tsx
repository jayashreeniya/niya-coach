import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  Dimensions,
  PixelRatio,
  View,
  Text,
  FlatList,
  SectionList,
  StyleSheet,
  Button,
  TouchableOpacity,
  Switch,
  Platform,
  Image,
  TextInput,
  Picker,
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from "react-native-simple-radio-button";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";

//@ts-ignore
import CustomCheckBox from "../../../components/src/CustomCheckBox";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import RandomNumberGeneratorController, {
  Props,
  configJSON,
} from "./RandomNumberGeneratorController";

export default class RandomNumberGenerator extends RandomNumberGeneratorController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          testID="background"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <View>
            {this.isPlatformWeb() ? (
              <Text testID="labelTitle" style={styles.title}>
                {configJSON.labelTitleText}
              </Text>
            ) : null}
            <Text testID="labelBody" style={styles.body}>
              {" "}
              {configJSON.labelBodyText}
            </Text>
            <TextInput
              testID="lowerbound"
              style={styles.bgMobileInput}
              placeholder={"Lower bound"}
              //@ts-ignore
              onChangeText={(text) => this.setLowerBound(text)}
              keyboardType="numeric"
            />
            <TextInput
              testID="upperbound"
              style={styles.bgMobileInput}
              placeholder={"Upper bound"}
              //@ts-ignore
              onChangeText={(text) => this.setUpperBound(text)}
              keyboardType="numeric"
            />
            <Button
              testID="btnGenerateRandomNumber"
              title="Generate Random Number"
              color="white"
              onPress={this.generateRandomNumber}
            />
            <Text style={styles.outputStyle}>{this.state.numberholder}</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
    // Customizable Area End
    // Merge Engine - render - End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#65b0ba",
    color: "white",
  },
  title: {
    marginBottom: 32,
    fontSize: 17,
    marginVertical: 8,
    color: "white",
  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
    color: "white",
  },
  buttonStyle: {
    backgroundColor: "white",
    color: "#144766",
  },
  outputStyle: {
    color: "#ffbde4",
    fontSize: 25,
    textAlign: "center",
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    padding: 10,
    borderWidth: Platform.OS === "web" ? 0 : 1,
    color: "white",
  },
  bgMobileInput: {
    flex: 1,
    padding: 2,
    color: "#ffbde4",
    fontSize: 17,
  },
  showHide: {
    alignSelf: "center",
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
});
// Customizable Area End
