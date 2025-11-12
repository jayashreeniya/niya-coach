import React from "react";

//Customizable Area Start
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import { Formik } from "formik";
import { Input } from "react-native-elements";
import * as Yup from "yup";
import EnterEmailController, { Props } from "./EnterEmailController";
import Svg, { G, Image as SVGImg, Path } from "react-native-svg";

//Customizable Area End


export default class EnterEmail extends EnterEmailController {
  constructor(props: Props) {
    super(props);
    //Customizable Area Start
    //Customizable Area End
  }

  render() {
    const { navigation } = this.props;

    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1,backgroundColor:'#fff' }}
      >
        <View style={styles.headline}>
          <ImageBackground style={{width:Dimensions.get('window').width,height:240,alignSelf:'center',alignItems:'center'}}
            {...this.bgImgProps}>
       
           </ImageBackground>
           </View>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={
            this.isPlatformWeb() ? styles.containerWeb : styles.containerMobile
          }
        >
          <TouchableWithoutFeedback onPress={() => this.hideKeyboard()}>
            {/* Customizable Area Start */}
            <View>
              <View style={styles.headline}>
                <Text style={styles.titleText}>
                  {this.LabelTxtEmailPass}
                </Text>
                <Text style={styles.stepText}>{this.LabelTxtSubEmailPass}</Text>

              </View>
          
              <View>
                <View
                  style={
                    this.isPlatformWeb()
                      ? styles.webInput
                      : [styles.mobileInput, { borderColor: this.state.isEmail ? '#006CE2' : '#F3F3F3' }]
                  }
                >
                  <Input
                    testID={"txtInputEmail"}
                    autoCompleteType={this.firstInputAutoCompleteType}
                    keyboardType={this.firstInputKeyboardStyle}
                    inputContainerStyle={
                      this.isPlatformWeb()
                        ? styles.webInput
                        : styles.noBorder
                    }
                    containerStyle={{ backgroundColor: '#F1F1F1', borderRadius: 6, flexDirection: "row", alignItems: "center", height: 64 }}
                    inputStyle={{ color: '#606060', backgroundColor: '#F1F1F1' }}
                    placeholderTextColor="#B6B6B6"
                    placeholder={this.firstInputPlaceholder}
                    {...this.txtInputEmailProps}
                    onBlur={() => this.setState({ isEmail: false })}
                    onFocus={() => this.setState({ isEmail: true })}
                  />

                </View>
               
                <View style={{ zIndex: -1, padding: 0, paddingTop: 25, margin: 10 }}>
                  <TouchableOpacity style={styles.styleButton}
                    {...this.btnEmailOtpProps}
                    testID="btnEMailOtpGet"
                  >


                    <Text style={{ textAlign: 'center', margin: 5, fontSize: 16, color: '#fff', }}>{this.buttonsendEmail}</Text>

                  </TouchableOpacity>
                  {this.state.loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator style={{ flex: 1, opacity: 1, justifyContent: 'center', alignItems: 'center' }} size="large" />
                    </View>
                  ) : null}
                
                </View>
              </View>
           

            </View>

            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
         </ScrollView>
      
          
      </KeyboardAvoidingView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    backgroundColor: '#5287CC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    marginLeft: 30,
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
  containerMobile: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#fff"
  },
  containerWeb: {
    padding: 16,
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 650
  },
  countryCodeSelector: {
    flex: 3,
    marginTop: 20,
    textAlign: "left",
    textAlignVertical: "center"
  },
  button: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    zIndex: -1
  },

  flexContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: "100%"
  },

  headline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginLeft:30,


  },
  mobileInput: {
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#5287CC", //"#767676",
    borderRadius: 2,
    includeFontPadding: true,
    margin: 10
  },
  webInput: {
    marginTop: 20,
    width: "100%",
    zIndex: -1
  },

  

  codeInput: {
    marginTop: 20,
    width: "30%"
  },

  phoneInput: {
    flex: 3,
    marginTop: 20
  },
  inputAfterCountryCode: {
    width: "100%",
    zIndex: -1
  },

  titleText: {
    fontSize: 20,
    // color: "#6200EE",
    textAlign: 'left',
    textAlignVertical: 'top',
    opacity: 1,
    color: '#3F3F3F',
    fontWeight: 'normal',
  },

  stepText: {
    marginBottom: 32,
    fontSize: 16,
    color: '#828282',
    marginVertical: 8,
    opacity: 1,
    fontStyle: 'normal',
    fontWeight: 'normal',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'top',
    

  },
  emailText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
    fontWeight: "bold"
  },

  noBorder: {
    borderBottomWidth: 0,


  },

 

 
  bgRectWeb: {
    marginTop: 40
  },

  styleButton: {
    backgroundColor: '#5287CC',
    borderRadius: 6,
    height: 50,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",

  },
  errorStyle: {
    color: "red",
    textAlign: "center"
  },
 
  bgRectBorder: {
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    marginTop: 20,
    minHeight: 40,
    fontSize: 18,
    textAlignVertical: "center",
    padding: 10
  },

});
// Customizable Area End
