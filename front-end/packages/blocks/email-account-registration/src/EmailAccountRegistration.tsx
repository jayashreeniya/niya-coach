import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import Scale from "../../dashboard/src/Scale";
const windowHeight = Dimensions.get("screen").height; 
// Customizable Area End

import EmailAccountRegistrationController, {
  Props
} from "./EmailAccountRegistrationController";

export default class EmailAccountRegistration extends EmailAccountRegistrationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  

  render() {
    // Customizable Area Start 
    return (
      <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={styles.keyboardPadding}
      >
       <ScrollView keyboardShouldPersistTaps="always" style={{flex: 1}}>
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }}
            style={{flex:1}}
          >
           
            <ImageBackground
              source={require("../assets/backgroundimage.png")}
              resizeMode="cover"
              style={{
                flex: 1,
                justifyContent: "center",
                marginTop: 120,
                margin: -34,
                maxHeight:windowHeight,
                height:1000,
                minHeight:999,
               marginBottom:Scale(-60)
              }}
            >
               <View>
                <Image
                  style={{
                    height: 244,
                    width: 140,
                    alignSelf:'flex-end',
                    marginRight:Scale(60),
                    // marginLeft: 240,
                    marginTop: -250,
                    // paddingBottom: 150,
                     transform: [{ rotate: "-2deg" }],
                  }}
                  source={require("../assets/signupdoll.png")}
                />
              </View>
              <View
                style={{
                  width: "70%",
                  marginLeft: 70,
                  marginTop: 90,
                  // marginBottom: 120,
                }}
              >
                <View style={styles.headline}>
                  <Text style={styles.signUpText}>Sign up</Text>

                  <Text style={styles.titleWhySignUp}>
                    Create a Free Account
                    {/* {this.labelHeader} */}
                  </Text>
                </View>
                <View style={styles.bgPasswordContainer}>
                  <Image
                    testID={"firstNameIcon"}
                    style={{ marginRight: 10 }}
                    source={require("../assets/profilename.png")}
                  />
                  <TextInput
                    testID={"txtInputFirstName"}
                    style={
                      Platform.OS === "web"
                        ? styles.inputWeb
                        : styles.bgPasswordInput
                    }
                    placeholderTextColor="#7CBBFF"
                    placeholder={"Full name"}
                    {...this.txtInputFirstNamePrpos} //Merge Engine::From BDS - {...this.testIDProps}
                  />
                </View>

                <View style={styles.bgPasswordContainer}>
                  <Image
                    testID={"emailIcon"}
                    style={{ marginRight: 10 }}
                    source={require("../assets/emailicon.png")}
                  />

                  <TextInput
                    testID={"txtInputEmail"}
                    style={
                      Platform.OS === "web"
                        ? styles.inputWeb
                        : styles.bgPasswordInput
                    }
                    placeholderTextColor="#7CBBFF"
                    placeholder={this.labelEmail}
                    {...this.txtInputEmailPrpos} //Merge Engine::From BDS - {...this.testIDProps}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.bgPasswordContainer}>
                  <Image
                    testID={"phoneNumberIcon"}
                    style={{ marginRight: 10 }}
                    source={require("../assets/phoneicon.png")}
                  />

                  <TextInput
                    testID={"txtPhoneNumber"}
                    style={
                      Platform.OS === "web"
                        ? styles.inputWeb
                        : styles.bgPasswordInput
                    }
                    placeholderTextColor="#7CBBFF"
                    placeholder={"Mobile"}
                    {...this.txtPhoneNumberProps}
                    maxLength={10}
                    keyboardType={"numeric"}
                  />
                </View>

                <View style={styles.bgPasswordContainer}>
                  <Image
                    testID={"accessCodeIconIcon"}
                    style={{ marginRight: 10 }}
                    source={require("../assets/accesscodeicon.png")}
                  />

                  <TextInput
                    testID={"accessCode"}
                    style={
                      Platform.OS === "web"
                        ? styles.inputWeb
                        : styles.bgPasswordInput
                    }
                    placeholderTextColor="#7CBBFF"
                    placeholder={this.lebelAccessCode}
                    {...this.txtAccessCodePrpos} //Merge Engine::From BDS - {...this.testIDProps}
                  />
                
                </View>

                <View style={styles.bgPasswordContainer}>
                  <Image
                    testID={"passwordFieldIcon"}
                    style={{ marginRight: 10 }}
                    source={require("../assets/passwordfieldicon.png")}
                  />
                  <TextInput
                    testID={"txtInputPassword"}
                    style={styles.bgPasswordInput}
                    placeholderTextColor="#7CBBFF"
                    placeholder={this.labelPassword}
                    {...this.txtInputPasswordProps}
                  />

                  <TouchableOpacity
                    testID={"btnPasswordShowHide"}
                    style={styles.passwordShowHide}
                    {...this.btnPasswordShowHideProps}
                  >
                    <Image
                      testID={"imgEnablePasswordField"}
                      style={[styles.imgPasswordShowhide, { marginRight: 13 }]}
                      {...this.imgEnablePasswordFieldProps}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.bgPasswordContainer}>
                  <Image
                    testID={"passwordFieldIcon"}
                    style={{ marginRight: 10 }}
                    source={require("../assets/passwordfieldicon.png")}
                  />
                  <TextInput
                    testID={"txtInputConfirmPassword"}
                    style={styles.bgPasswordInput}
                    placeholderTextColor="#7CBBFF"
                    placeholder={this.labelRePassword}
                    {...this.txtInputConfirmPasswordProps}
                  />

                  <TouchableOpacity
                    testID={"btnConfirmPasswordShowHide"}
                    style={styles.passwordShowHide}
                    {...this.btnConfirmPasswordShowHideProps}
                  >
                    <Image
                      testID={"imgEnableRePasswordField"}
                      style={[
                        styles.imgPasswordShowhide,
                        ,
                        { marginRight: 13 },
                      ]}
                      {...this.imgEnableRePasswordFieldProps}
                    />
                  </TouchableOpacity>
                </View>
                { this.state?.errorRes ? <Text style={{color: 'red', fontSize: 12}}>* {this.state?.errorRes.substring(0,150)}</Text> : null }

            
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                    marginBottom: 30,
                    alignItems:'center',
                    marginRight:10,
                  }}
                >
                 <Text numberOfLines={2} style={{color:'#7A7A7A',fontSize:12,flex:1,flexWrap:'wrap',textAlign:'left',textAlignVertical:'center',includeFontPadding:false}} >
                 By signing up,you’re agree to our
                 <Text
                    testID={"btnLegalTermsAndCondition"}
                    style={styles.btnLegalTermsAndCondition}
                    {...this.btnLegalTermsAndConditionProps}
                  >
                   {" "}{this.labelLegalTermCondition}</Text>and{""}
                 
                 <Text  testID={"btnLegalPrivacyPolicy"} {...this.btnLegalPrivacyPolicyProps}  style={styles.btnLegalTermsAndCondition} >{this.labelLegalPrivacyPolicy}</Text>
                </Text>
                
                </View>
                <TouchableOpacity
                  testID={"btnSignUp"}
                  {...this.btnSignUpProps}
                  style={{
                    borderRadius: 5,
                   
                    height: 45,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#4793E0",
                  }}
                >
                  <Text style={{ color: "white",fontWeight:"bold" }}>Register</Text>
                </TouchableOpacity>
                {this.state.loading ? (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <ActivityIndicator style={{ flex: 1, opacity: 1, justifyContent: 'center', alignItems: 'center' }} size="large" /></View>
                    ) :null}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      marginTop: 20,
                      marginBottom: 20,
                      borderColor: "black",
                      borderWidth: 0.5,
                      width: "42%",
                    }}
                  />
                  <Text style={{ color: "black", width: "14%",textAlign:'center',textAlignVertical:'auto' }}> or </Text>
                  <View
                    style={{
                      marginTop: 20,
                      marginBottom: 20,
                      borderColor: "black",
                      borderWidth: 0.5,
                      width: "42%",
                    }}
                  />
                </View>
                <TouchableOpacity
                  testID={"btnLogin"}
                  {...this.btnLogInProps}
                  style={{
                    borderRadius: 5,
                  
                    height: 45,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                  disabled={this.state.loading?true:false}
                >
                  <Text style={{ color: "#006CE2", fontSize: 15,fontWeight:"bold" }}>Log In</Text>
                </TouchableOpacity>
              </View>
             
            </ImageBackground>

          
          </TouchableWithoutFeedback>
          </ScrollView>
      </KeyboardAvoidingView>
      </View>
    );
     // Customizable Area End 
  }
 

  async componentDidMount() {
    // Customizable Area Start
    this.getValidations();
    // Customizable Area End
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
     width: Platform.OS === "web" ? "75%" : "100%",
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
    marginBottom: 15,
    borderColor: "#767676",
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    opacity: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  imgPasswordShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
  keyboardPadding: { flex: 1 },
  btnLegalTermsAndCondition: { color: "#7CBBFF", fontWeight: "bold" },
  btnLegalPrivacyPolicy: { color: "#7CBBFF",  fontWeight: "bold", },
  leagalText: { marginTop: 10 },
  headline: {
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: "center",
    marginTop: -120,
    marginBottom: 30,
  },
  signUpText: {
    fontSize: 27,
    color: "#3F3F3F",
    marginTop:30,
    textAlign:'center',
    fontWeight: "bold",
  },
  // Customizable Area End
});
