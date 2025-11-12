import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
// @ts-ignore
import OTPTextInput from 'react-native-otp-textinput';
// Customizable Area End

import OTPInputAuthController, { Props } from "./OTPInputAuthController";

export default class OTPInputAuth extends OTPInputAuthController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
  
    return (
      //Merge Engine DefaultContainer
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
          <View>
            <View style={styles.headline}>
              <Image style={{
                alignSelf: 'center', justifyContent: 'center', alignItems: 'center', height: 100,
                width: 100, resizeMode: 'contain', marginTop: 100,
              }}
                {...this.mobileNumbOtpImgProps}>

              </Image>
              <Text
                style={[styles.titleWhySignUp, { fontSize: 22 }]} //UI Engine::From Sketch
              >
                {this.state.title} {/*UI Engine::From Sketch*/}
              </Text>
            </View>


            <Text
              style={styles.titleWhySignUp} //UI Engine::From Sketch
            >
              {this.state.labelInfo}{"\n"}{this.state.userAccountID} {/*UI Engine::From Sketch*/}
            </Text>

            <OTPTextInput   {...this.txtMobilePhoneOTPProps} tintColor="#5287CC" offTintColor="#F1F1F1" inputCount={6} containerStyle={{ flex: 1, margin: 15, borderWidth: 0 }} textInputStyle={{ flex: 1, borderWidth: 1, borderBottomWidth: 1, backgroundColor: '#F1F1F1', borderRadius: 6, color: '#5287CC' }} testID="otpip" />
           
            <View style={{ zIndex: -1, paddingTop: 10, padding: 15, }}>

              <TouchableOpacity testID="submitOTP" style={styles.styleButton}
                {...this.btnSubmitOTPProps}
              >

                <Text style={{ textAlign: 'center', margin: 5, fontSize: 16, color: '#fff', }}>{this.btnTxtSubmitOtp}</Text>

              </TouchableOpacity>
            </View>
            {this.state.loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator style={{ flex: 1, opacity: 1, justifyContent: 'center', alignItems: 'center' }} size="large" /></View>
            ) : null}
          </View>
          {/* Customizable Area End */}
          {/* Merge Engine UI Engine Code */}
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  styleButton: {
    backgroundColor: '#469BE5',
    borderRadius: 6,
    height: 50,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0


  },
  headline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 30
    // marginLeft:30,


  },
  container: {
    flex: 1,
    padding: 16,
    width: Platform.OS === "web" ? "75%" : "100%",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 650,
    backgroundColor: "#fff"
  },
  titleWhySignUp: {
    // marginBottom: 32,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8
  },
  titleOtpInfo: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8
  },

  phoneInputMobile: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginBottom: 64,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
    padding: 10,
    margin: 20
  },

  phoneInputWeb: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 64,
    fontSize: 18,
    padding: 10,
    borderBottomColor: "#767676",
    borderBottomWidth: 1
  },

  bgRectBorder: {
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    marginBottom: 10,
    padding: 10
  }
});
// Customizable Area End
