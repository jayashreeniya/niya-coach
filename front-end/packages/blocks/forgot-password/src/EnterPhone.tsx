import React from "react";

//Customizable Area Start
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import { Input } from "react-native-elements";
import * as Yup from "yup";
import CountryCodeSelector from "../../country-code-selector/src/CountryCodeSelector";
import EnterPhoneController, { Props } from "./EnterPhoneController";

//Customizable Area End

export default class EnterPhone extends EnterPhoneController {
  constructor(props: Props) {
    super(props);
    //Customizable Area Start
    //Customizable Area End
  }

  //Customizable Area Start
  render() {
    const { navigation } = this.props;

    return (
        <ScrollView
            keyboardShouldPersistTaps="always"
            style={
              this.isPlatformWeb() ? styles.containerWeb : styles.containerMobile
            }
          > 
        <ImageBackground style={{ width: '98%', height: 300 }}
          {...this.bgImgProps}>
          <View style={styles.headline}>
            <Image style={{
              alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: 200, marginLeft: 30, height: 100,
              width: 100, resizeMode: 'contain'
            }}
              {...this.mobileNumbOtpImgProps}>
        </Image>
         </View>
        </ImageBackground>
        <KeyboardAvoidingView
          behavior={this.isPlatformiOS() ? "padding" : 'height'}
          style={{ flex: 1, backgroundColor: '#fff' }}
          keyboardVerticalOffset={this.isPlatformiOS() ? 128 : 0}
        >
          <View style={styles.headline}>

            <Text style={[styles.titleText,]}>
              {this.title}
            </Text>
           <Text style={[styles.stepText, { marginTop: 20, }]}>{this.subLabelTxtResetPass}</Text>
                </View>
          <TouchableWithoutFeedback onPress={() => this.hideKeyboard()}>
            <View>


              {/* ---------------------------------------------------------ENTER PHONE #---------------------------------------------------------------------- */}

              <View>


                <View
                  style={
                    this.isPlatformWeb()
                      ? styles.webInput
                      : [styles.mobileInput, { borderColor: this.state.isPhone ? '#006CE2' : '#F3F3F3' }]
                  }
                >
                  <Input
                    testID={"txtInputPhoneNumber"}
                    autoCompleteType={this.secondInputAutoCompleteType}
                    keyboardType={this.secondInputKeyboardType}
                    inputContainerStyle={
                      this.isPlatformWeb()
                        ? styles.webInput
                        : styles.noBorder
                    }
                    containerStyle={{ backgroundColor: '#F1F1F1', borderRadius: 6, flexDirection: "row", alignItems: "center", height: 64 }}
                    inputStyle={{ color: '#606060', backgroundColor: '#F1F1F1' }}

                    placeholderTextColor="#B6B6B6"
                    placeholder={this.secondInputPlaceholder}
                    maxLength={10}
                    {...this.txtInputPhoneProps}

                    onBlur={() => this.setState({ isPhone: false })}
                    onFocus={() => this.setState({ isPhone: true })}

                   />
                </View>



                <View style={{ zIndex: -1, paddingTop: 25, padding: 15, }}>
                  <TouchableOpacity style={styles.styleButton}
                    {...this.btnOtpProps}
                    testID="btnOtpGet"
                  >

                    <Text style={{ textAlign: 'center', fontSize: 16, color: '#fff', }}>{this.btnLabelText}</Text>

                  </TouchableOpacity>

                </View>
                {this.state.loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator style={{ flex: 1, opacity: 1, justifyContent: 'center', alignItems: 'center' }} size="large" /></View>
                ) : null}

              </View>


            </View>
          </TouchableWithoutFeedback>
 </KeyboardAvoidingView>
    </ScrollView>
    );
  }
}
// Customizable Area End


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
  webInput: {
    marginTop: 20,
    width: "100%",
    zIndex: -1
  },

  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
  
  headline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // margin:30
    // marginLeft:30,


  },
  button: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    zIndex: -1
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
  flexContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: "100%"
  },
  inputAfterCountryCode: {
    width: "100%",
    zIndex: -1
  },

  containerWeb: {
    padding: 16,
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 650
  },

  

 
  
 

  codeInput: {
    marginTop: 20,
    width: "30%"
  },

  phoneInput: {
    flex: 3,
    marginTop: 20
  },

 
  mobileInput: {
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",

    borderWidth: 1,
    borderColor: "#5287CC",
    // borderColor: "red",
    borderRadius: 6,
    includeFontPadding: true,
    marginLeft: 15,
    marginRight: 15,



  },

  titleText: {
    fontSize: 19,
    // color: "#6200EE",
    textAlign: 'center',
    textAlignVertical: 'center',
   
    opacity: 1,
    color: '#606060',
    fontWeight: 'normal',
  },
  noBorder: {
    borderBottomWidth: 0,
    // backgroundColor:'#F1F1F1'

  },
  stepText: {
    marginBottom: 32,
    fontSize: 15,
    color: '#606060',
    marginVertical: 8,
    opacity: 1,
    fontStyle: 'normal',
    fontWeight: 'normal',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'top',
   

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

  bgRectWeb: {
    marginTop: 40
  },
  emailText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
    fontWeight: "bold"
  },
 
  styleButton: {
    backgroundColor: '#469BE5',
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
});
// Customizable Area End