import React from "react";
// Customizable Area Start
import {
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
  KeyboardAvoidingView
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,

} from "react-native-responsive-dimensions";
import Scale from "../../dashboard/src/Scale";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";

//@ts-ignore
import CustomCheckBox from "../../../components/src/CustomCheckBox";
import { verticalScale } from "../../../components/src/Scale";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import EmailAccountLoginController, {
  Props,
} from "./EmailAccountLoginController";

export default class EmailAccountLoginBlock extends EmailAccountLoginController {
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    Dimensions.addEventListener("change", (e) => {
      console.log(e,"e///")
      MergeEngineUtilities.init(
        artBoardHeightOrg,
        artBoardWidthOrg,
     Dimensions.get("window").height,
     Dimensions.get("window").width
      );
      this.setState({width:Dimensions.get("screen").width,height: Dimensions.get("screen").height})
      this.forceUpdate();
    });
    // Customizable Area End
  }

  render() {
    // Customizable Area Start
    
    // Merge Engine - render - Start
    return (
      // Required for all blocks
      <KeyboardAvoidingView behavior={Platform.OS=="ios"?"padding":undefined} style={{flex:1}}>
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.container} bounces={false}>
        {/* <TouchableWithoutFeedback
          testID={"Background"}
          onPress={() => {
            this.hideKeyboard();
          }}
        > */}
          <View>
          <View style={{ flex:1 }}>
         
          <Image
            style={{
              zIndex: 1,
              width: 190,
              height: 218,
              marginLeft: 190,
              marginTop: responsiveHeight(2)
              
            }}
            // source={require("../assets/doll.png")}
            source={require("../assets/signupdoll.png")}
          />
          <ImageBackground
            resizeMode="cover"
            style={{
              // width:dimensions.wp(100),
              // height:dimensions.hp(100),
              width:this.state.width<500?responsiveWidth(100):this.state.width,
              marginTop: responsiveHeight(-18),
              height:this.state.height<960?responsiveHeight(96):this.state.height, 
              marginBottom:Scale(-40) }}
            source={require("../assets/original.png")}
          >
            <View style={{ marginLeft:this.state.width<500?30: verticalScale(40), width: responsiveWidth(80), 
              // marginTop:verticalScale( 100) 
              marginTop:verticalScale(110) 
              }}>
              {/* {this.isPlatformWeb() ? ( */}
              <Text style={styles.labelTitle}>Log In</Text>
              {/* ) : null} */}

              <Text style={styles.titleWhySignUp}>
                Login with your credentials
              </Text>
              <View style={styles.bgEmailContainer}>
                <Image
                  testID={"emailicon"} //Merge Engine::From BDS - testIDImage
                  style={styles.imgPasswordShowhide} //UI Engine::From Sketch
                  source={require("../assets/emailicon.png")} //Merge Engine::From BDS - {...this.testIDProps}
                />
                <TextInput
                  testID="txtInputEmail" //Merge Engine::From BDS
                  placeholderTextColor="#7CBBFF"
                  style={styles.bgPasswordInput} //UI Engine::From Sketch
                  placeholder="Email" //UI Engine::From Sketch
                  {...this.txtInputEmailProps} //Merge Engine::From BDS - {...this.testIDProps}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.bgPasswordContainer}>
                <Image
                  testID={"passwordFieldIcon"} //Merge Engine::From BDS - testIDImage
                  style={styles.imgPasswordShowhide} //UI Engine::From Sketch
                  source={require("../assets/passwordfieldicon.png")} //Merge Engine::From BDS - {...this.testIDProps}
                />
                <TextInput
                  testID="txtInputPassword" //Merge Engine::From BDS
                  placeholderTextColor="#7CBBFF"
                  style={styles.bgPasswordInput} //UI Engine::From Sketch
                  placeholder={this.state.placeHolderPassword} //UI Engine::From Sketch
                  {...this.txtInputPasswordProps} //Merge Engine::From BDS - {...this.testIDProps}
                />

                <TouchableOpacity
                  testID={"btnPasswordShowHide"} //Merge Engine::From BDS
                  style={styles.passwordShowHide} //UI Engine::From Sketch
                  {...this.btnPasswordShowHideProps} //Merge Engine::From BDS - {...this.testIDProps}
                >
                  <Image
                    testID={"btnPasswordShowHideImage"} //Merge Engine::From BDS - testIDImage
                    style={[styles.imgPasswordShowhide,{marginRight:12}]} //UI Engine::From Sketch
                    {...this.btnPasswordShowHideImageProps} //Merge Engine::From BDS - {...this.testIDProps}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row-reverse",
                  marginTop: Scale(25),
                }}
              >
                  <View style={styles.checkBoxContainerView}>
                  <Text
                  testID={"btnForgotPassword"} //Merge Engine::From BDS
                  style={styles.forgotPassword} //UI Engine::From Sketch
                  {...this.btnForgotPasswordProps} //Merge Engine::From BDS - {...this.testIDProps}
                >
                  Forgot password?
                </Text>
                  </View>
              
                <View style={styles.checkBoxContainerView}>
                  {/* Refactor for custom CheckBox   */}
                  <CustomCheckBox
                    testID={"CustomCheckBox"} //Merge Engine::From BDS
                    {...this.CustomCheckBoxProps} //Merge Engine::From BDS - {...this.testIDProps}
                  />

                  <Text
                    testID={"btnRememberMe"} //Merge Engine::From BDS
                    style={styles.rememberMe} //UI Engine::From Sketch
                    {...this.btnRememberMeProps} //Merge Engine::From BDS - {...this.testIDProps}
                  >
                    {this.state.labelRememberMe} {/*UI Engine::From Sketch*/}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                disabled={this.state.loading}
                testID={"btnEmailLogIn"} //Merge Engine::From BDS
                {...this.btnEmailLogInProps} //Merge Engine::From BDS - {...this.testIDProps}
                style={{
                  borderRadius: 5,
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#4793E0",
                }}
              >
                <Text style={{ color: "white" }}>Log In</Text>
              </TouchableOpacity>
              {this.state.loading ? (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <ActivityIndicator style={{ flex: 1, opacity: 1, justifyContent: 'center', alignItems: 'center' }} size="large" color="rgb(97,177,230)" /></View>
                                    ) :null}
              <Text style={{ marginTop: 24,color:'#7A7A7A' }}>
              Don't have an account?{" "}
                <Text
                  testID={"txtsignUp"} //Merge Engine::From BDS
                  style={[styles.forgotPassword,{fontWeight:'bold',color:'#006CE2'}]} //UI Engine::From Sketch
                  {...this.btnSignUpProps} //Merge Engine::From BDS - {...this.testIDProps}
                >
                 SignUp
                </Text>
              </Text>
             
              {/* <Text style={styles.orLabel}>{this.state.labelOr}</Text> */}
              {/* <Text
                testID="btnSocialLogin" //Merge Engine::From BDS
                style={styles.bgOtherLoginButton} //UI Engine::From Sketch
                {...this.btnSocialLoginProps} //Merge Engine::From BDS - {...this.testIDProps}
              >
                {this.state.btnTxtSocialLogin}
              </Text> */}
            </View>
          </ImageBackground>
          </View>
          </View>
        {/* </TouchableWithoutFeedback> */}
      </ScrollView>
     </KeyboardAvoidingView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // marginLeft: "auto",
    // marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    // maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  titleWhySignUp: {
    // marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    // marginVertical: 8,
    color: "#8B8B8B",
    marginTop: 5,
  },
  titleOtpInfo: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },

  bgOtherLoginButton: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
    padding: 10,
    color: "#6200EE",
    fontWeight: "bold",
  },

  bgMobileInput: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    borderWidth: Platform.OS === "web" ? 0 : 1,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
    padding: 10,
  },

  bgPasswordInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    minHeight: 40,
    includeFontPadding: true,
    marginLeft:16,
    color:"black"
  },
  passwordShowHide: {
    alignSelf: "center",
    marginRight: 8,
  },
  
  bgEmailContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 16,
    // borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 5,
    paddingLeft: 15,
    // borderWidth: Platform.OS === "web" ? 0 : 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Scale(32),
    opacity:2,
    paddingVertical:Platform.OS=="ios"?7:0
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 16,
    // borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 5,
    paddingLeft: 15,
    // borderWidth: Platform.OS === "web" ? 0 : 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Scale(18),
    opacity:2,
    paddingVertical:Platform.OS=="ios"?7:0
  },

  bgRectBorder: {
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    marginBottom: 10,
    padding: 10,
  },

  labelTitle: {
    marginTop: 24,
    // marginBottom: 32,
    fontSize: 32,
    textAlign: "left",
    marginVertical: 8,
    color: "#3F3F3F",
    fontWeight: "bold",
  },
  imgPasswordShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
  forgotPassword: {
    color:'#689ED9',
    // color: "#6200EE",
    fontWeight: "bold",
    // marginBottom: 10,
    textDecorationLine:'underline'
    // zIndex: -1,
  },
  checkBoxContainerView: {
    flexDirection: "row",
    marginBottom: 10,
    marginLeft: -7,
    justifyContent: "center",
    alignItems: "center",
   
    // zIndex: -1,
  },
  rememberMe: {
    color: "#689ED9",
    fontWeight: "bold",
    alignSelf: "center",
    // zIndex: -1,
  },
  orLabel: {
    color: "#00000000",
    fontWeight: "bold",
    alignSelf: "center",
    margin: 20,
  },
});
// Customizable Area End
