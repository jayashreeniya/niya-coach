import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity
} from "react-native";

import RenderHtml from 'react-native-render-html';
const tagsStyles = {
  article: {
    marginHorizontal: 15
  }
};
import Scale from "../../../framework/src/Scale";
import { backImg } from "../../Chatbot6/src/assets";
// Customizable Area End

import EmailAccountRegistrationController, {
  Props,
} from "./EmailAccountRegistrationController";

export default class PrivacyPolicy extends EmailAccountRegistrationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start

    // Customizable Area End
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={styles.keyboardPadding}
      >
        {/* Customizable Area Start */}
        <View style={{height:Scale(45), justifyContent:'space-between', alignItems:'center', flexDirection:'row', backgroundColor:'white', width:'65%',paddingLeft:Scale(10), marginTop:Platform.OS=="ios"?40:undefined}}>
            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
              <Image source={backImg} /> 
            </TouchableOpacity>
          <Text style={{color:'black', fontWeight:'bold', fontSize:Scale(16)}}>Privacy Policy</Text>
            </View>
        {/* Customizable Area End */}
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            <View style={{paddingHorizontal: 16, paddingBottom: 32}}>
            <RenderHtml
          contentWidth={Dimensions.get('window').width}
          source={{ html: `${this.state.privacyPolicy}` }}
          tagsStyles={tagsStyles}
          />
          </View>
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  async componentDidMount() {
    // Customizable Area Start
  
    this.getPrivacyPolicyContent();
    // Customizable Area End
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    // padding: 16,
    // marginLeft: "auto",
    // marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    // maxWidth: 650,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    width: "100%",
    height: "80%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  titleWhySignUp: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  titleOtpInfo: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  bgInput: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
    padding: 10,
  },

  inputWeb: {
    flex: 1,
    flexDirection: "row",
    marginTop: 24,
    fontSize: 18,
    padding: 10,
    borderBottomColor: "#767676",
    includeFontPadding: true,
    borderBottomWidth: 1,
  },

  bgRectBorder: {
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    marginBottom: 10,
  },
  bgPasswordInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    minHeight: 40,
    includeFontPadding: true,
    marginTop: 5,
    paddingLeft: 0,
    color:"black"
  },
  passwordShowHide: {
    alignSelf: "center",
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 24,
    // borderWidth: Platform.OS === "web" ? 0 : 1,
    // borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    opacity: 2,
    // zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imgPasswordShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
  keyboardPadding: { flex: 1, backgroundColor:'white' },
  btnLegalTermsAndCondition: { color: "#7CBBFF", fontWeight: "bold" },
  btnLegalPrivacyPolicy: { color: "#7CBBFF",  fontWeight: "bold", },
  leagalText: { marginTop: 10 },
  headline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: "center",
    marginTop: -120,
    marginBottom: 50,
  },
  signUpText: {
    fontSize: 27,
    color: "#3F3F3F",
    marginTop:30,
    textAlign:'center'
    // fontWeight: "bold",
  },
  // Customizable Area End
});
