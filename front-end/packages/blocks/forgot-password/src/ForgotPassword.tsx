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
  TouchableOpacity
} from "react-native";

import CountryCodeSelector from "../../country-code-selector/src/CountryCodeSelector";
import ForgotPasswordController, { Props } from "./ForgotPasswordController";

import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
//Customizable Area End

export default class ForgotPassword extends ForgotPasswordController {
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
        
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={
            this.isPlatformWeb() ? styles.containerWeb : styles.containerMobile
          }
        >
          <TouchableWithoutFeedback onPress={() => this.hideKeyboard()}>
            {/* Customizable Area Start */}
            <View>
            <ImageBackground style={{width:responsiveWidth(101),height:responsiveHeight(40)}}
            {...this.bgImgProps}>
         {/* headline */}
          <View style={styles.headline}>
                <Text style={[styles.titleText]}>
                  {this.labelTextIsAccountRecovery}
                  {/* ----------------------------------------------------CHOOSE ACCOUNT TEXT---------------------------------------------------------------------- */}
                </Text>
               
                  <Text style={[styles.stepText,{ marginTop:30,marginLeft:30}]}>{this.subLabelTxtResetPass}</Text>
                 </View>
              
            </ImageBackground>
                <View style={{  padding: 15,flex:1,marginTop:30}}>
   
                  <TouchableOpacity testID="smsbtn" style={styles.styleButton} 
              
                  onPress={()=>this.startForgotPassword("sms")}
                 >
                  <Image source={require('../assets/sms.png')}    style={{ alignSelf: 'auto',margin:20,marginLeft:30,
            }}  />
                <Text style={{textAlign:'center',margin:20,fontSize:18,color:'#2A2A2A',}}>{this.buttonTitleIsSMSPhoneAccount}</Text>
           
                  </TouchableOpacity>
                  <View style={{ zIndex: -1, padding: 15 }} />
                  <TouchableOpacity  testID="emailbtn" style={styles.styleButton}   onPress={() => this.startForgotPassword("email")}
                 >
                  <Image source={require('../assets/email.png')}    style={{ alignSelf: 'auto',margin:20,marginLeft:30,
            }}  />
                <Text style={{textAlign:'center',margin:20,fontSize:18,color:'#2A2A2A',}}>{this.buttonTitleIsEmailAccount}</Text>
           
                  </TouchableOpacity>
                 
                </View>
           
            </View>
          
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
         </ScrollView>
         <View style={styles.bottomView}>
              <Image source={require('../assets/bottom.png')}    />
        </View>
          
      </KeyboardAvoidingView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
 
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
  containerMobile: {
    flex: 1,
    // padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    // maxWidth: 650,
    backgroundColor: "#fff"
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
  containerWeb: {
    padding: 16,
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 650
  },
 
  headline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft:30,
  
 
  },
  bottomView: {
    width: '100%',
    backgroundColor: '#5287CC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom:0,
    marginLeft:30,
    opacity: 0,
  },
  flexContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: "100%"
  },

  webInput: {
    marginTop: 20,
    width: "100%",
    zIndex: -1
  },

  inputAfterCountryCode: {
    width: "100%",
    zIndex: -1
  },

  mobileInput: {
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
  
  },

  codeInput: {
    marginTop: 20,
    width: "30%"
  },

  phoneInput: {
    flex: 3,
    marginTop: 20
  },

  noBorder: {
    borderBottomWidth: 0
  },

  emailText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
    fontWeight: "bold"
  },
  titleText: {
    fontSize: 29,
    // color: "#6200EE",
    textAlign: 'left',
    textAlignVertical: 'top',
   
    opacity: 1,
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: 'normal',
  },

  
  

  stepText: {
    marginBottom: 32,
    fontSize: 16,
  	color: 'rgba(249, 249, 249, 1)',
    marginVertical: 8,
    opacity: 1,
    fontStyle: 'normal',
		fontWeight: 'normal',
    includeFontPadding: false,
    textAlign: 'center',
		textAlignVertical: 'top',
		
	
  },

  errorStyle: {
    color: "red",
    textAlign: "center"
  },
  bgRectWeb: {
    marginTop: 40
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

  styleButton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 6,
    height: 80,
    width: '100%',
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection:'row',
    // margin:10
  },
});
// Customizable Area End