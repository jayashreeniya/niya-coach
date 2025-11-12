import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView
} from "react-native";

import SociaMediaAccountMobileController, {
  Props,
  configJSON,
  googleIcon,
  facebookIcon
} from "../../social-media-account/src/SocialMediaAccountMobileController";

//@ts-ignore
import ModalActivityIndicator from "react-native-modal-activityindicator";

class SocialMediaAccountRegistrationScreen extends SociaMediaAccountMobileController {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      isRegistration: true
    };
  }

  render() {
    const { loading } = this.state;
    return (
      //Merge Engine DefaultContainer
      <SafeAreaView style={styles.safeAreaContainer}>
        <ModalActivityIndicator visible={loading} size="large" color="white" />
        <View style={styles.mainContainer}>
          {/* Merge Engine UI Engine Code */}
          <Text
            style={styles.titleWhySignUp} //UI Engine::From Sketch
          >
            Value proposition: why users should sign up.
            {/*UI Engine::From Sketch*/}
          </Text>

          <TouchableOpacity
            testID={"btnFacebookLogIn"} //Merge Engine::From BDS
            style={styles.facebookButtonContainer} //UI Engine::From Sketch
            {...this.btnFacebookLogInProps} //Merge Engine::From BDS - {...this.testIDProps}
          >
            <Image
              style={styles.facebookButtonImageStyle} //UI Engine::From Sketch
              source={facebookIcon} //UI Engine::From Sketch
            />
            <Text
              style={styles.facebookButtonTextStyle} //UI Engine::From Sketch
            >
              {" "}
              {configJSON.facebookButtonText} {/*UI Engine::From Sketch*/}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID={"btnGoogleLogIn"} //Merge Engine::From BDS
            style={styles.googleButtonContainer} //UI Engine::From Sketch
            {...this.btnGoogleLogInProps} //Merge Engine::From BDS - {...this.testIDProps}
          >
            <Image
              style={styles.googleButtonImageStyle} //UI Engine::From Sketch
              source={googleIcon} //UI Engine::From Sketch
            />
            <Text
              style={styles.googleButtonTextStyle} //UI Engine::From Sketch
            >
              {configJSON.googleButtonText} {/*UI Engine::From Sketch*/}
            </Text>
          </TouchableOpacity>
          <Text
            style={styles.orTextStyle} //UI Engine::From Sketch
          >
            or {/*UI Engine::From Sketch*/}
          </Text>
          <TouchableOpacity
            testID={"btnNavigate"} //Merge Engine::From BDS
            style={styles.signUpButtonStyle} //UI Engine::From Sketch
            {...this.btnNavigateProps} //Merge Engine::From BDS - {...this.testIDProps}
          >
            <Text
              style={styles.signUpButtonTextStyle} //UI Engine::From Sketch
            >
              {" "}
              {configJSON.signUpButtonText} {/*UI Engine::From Sketch*/}
            </Text>
          </TouchableOpacity>
          {/* Merge Engine End UI Engine Code */}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    height: "100%",
    width: "100%"
  },
  mainContainer: {
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  facebookButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    width: "91%",
    height: "15%",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8
  },
  facebookButtonTextStyle: {
    paddingLeft: 10,
    fontSize: 20,
    textTransform: "uppercase"
  },
  facebookButtonImageStyle: {
    marginLeft: 48,
    width: 24,
    height: 24
  },
  googleButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    width: "91%",
    height: "15%",
    marginTop: 24,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8
  },
  googleButtonTextStyle: {
    paddingLeft: 10,
    fontSize: 20,
    textTransform: "uppercase"
  },
  googleButtonImageStyle: {
    marginLeft: 48,
    width: 24,
    height: 24
  },
  orTextStyle: {
    marginTop: 16
  },
  logInButtonContainer: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignContent: "flex-start",
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: "15%",
    width: "91%",
    marginTop: 16,
    marginLeft: 20,
    marginRight: 20,
    elevation: 6,
    backgroundColor: "#ffffff",
    borderRadius: 8
  },
  signUpButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: "91%",
    height: "15%",
    marginTop: 24,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8
  },
  signUpButtonTextStyle: {
    color: "#2553b4",
    fontSize: 21
  },
  titleWhySignUp: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8
  }
});

export default SocialMediaAccountRegistrationScreen;
