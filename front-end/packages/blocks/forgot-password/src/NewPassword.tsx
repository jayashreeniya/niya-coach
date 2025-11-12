import React from "react";

// Customizable Area Start
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator

} from "react-native";
import { Formik } from "formik";
import NewPasswordController, { Props } from "./NewPassController";

import * as Yup from "yup";
// Customizable Area End


export default class NewPassword extends NewPasswordController  {
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.isChangePassword = true;
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
      // Customizable Area Start
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >

        <ScrollView
          keyboardShouldPersistTaps="always"
          style={
            Platform.OS === "web" ? styles.containerWeb : styles.containerMobile
          }
        >
          {/* ------------------- HEADER ---------------------- */}
          {/* Customizable Area Start */}

          <View>
            <View style={{ marginTop: '25%', alignItems: 'center', justifyContent: 'center' }} >
              <Image style={{ width: Dimensions.get('window').width, height: 200, resizeMode: 'contain', alignSelf: 'auto' }}
                {...this.setNewPassImgProps}>

              </Image>
            </View>
            <View style={styles.headline}>
              <Text style={styles.titleText}>
                {this.labelTxtNewPass}
              </Text>



            </View>
            <View style={styles.headline}>
              <Text style={[styles.titleText, { fontWeight: '100', fontSize: 16, marginTop: '5%', marginBottom: '20%' }]}>
                {this.labelTextIsPleaseEnterYourNewPassword}
              </Text>



            </View>
          </View>
          {/* -------------------- BODY ----------------------- */}
          <View>
            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={Yup.object().shape(this.state.passwordSchema)}
              validateOnMount={true}
              validateOnChange={true}
              onSubmit={(values, actions) => {
                this.goToConfirmationAfterPasswordChange(values);
                actions.setSubmitting(false);
              }}
            >
              {({
                handleChange,
                handleSubmit,
                errors,
                setFieldTouched,
                touched,

              }) => (
                <View>
                  <View
                    style={
                      Platform.OS === "web"
                        ? styles.passwordContainerWeb
                        : [styles.bgPasswordContainer, { borderColor: this.state.passwordFieldTouched ? '#006CE2' : '#F3F3F3' }]
                    }
                  >
                    <TextInput
                      testID={"txtInputPassword"}
                      style={
                        Platform.OS === "web"
                          ? styles.passwordInputWeb
                          : styles.bgPasswordInput
                      }

                      placeholder={this.placeholderIsPassword}
                      onChangeText={handleChange("password")}
                      onBlur={() => { this.setState({ passwordFieldTouched: false }); setFieldTouched("password"); console.log(touched, "$*$*$*$*$*$") }}
                      secureTextEntry={
                        this.state.enablePasswordField ? true : false
                      }
                      onFocus={() => this.setState({ passwordFieldTouched: true })}
                      placeholderTextColor="#6A6A6A"
                    />

                    <TouchableOpacity
                      style={styles.passwordShowHide}
                      onPress={() => {
                        this.setState({
                          enablePasswordField: !this.state.enablePasswordField
                        });
                      }}
                      testID="btnPasswordShowHide"
                    >
                      <Image
                        style={styles.imgPasswordShowhide}
                        source={
                          this.state.enablePasswordField
                            ? this.imgPasswordInVisible
                            : this.imgPasswordVisible
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <View>
                    {touched.password && errors.password ? (
                   <Text style={[styles.errorStyle,{textAlign:'left', marginLeft: 10,
                   marginRight: 10}]}>{this.state.passwordRules}</Text>  
                   ) : null}
                    <Text
                      style={
                        Platform.OS === "web" ? styles.passwordRulesStyle : {}
                      }
                    >
                      {/* {this.state.passwordRules} */}
                    </Text>
                  </View>

                  <View
                    style={
                      Platform.OS === "web"
                        ? styles.passwordContainerWeb
                        : [styles.bgPasswordContainer, { borderColor: this.state.confirmPasswordFieldTouched ? '#006CE2' : '#F3F3F3' }]
                    }
                  >
                    <TextInput
                      testID={"txtInputConfirmPassword"}
                      style={
                        Platform.OS === "web"
                          ? styles.passwordInputWeb
                          : styles.bgPasswordInput
                      }
                      placeholder={this.placeholderIsReTypePassword}
                      onChangeText={handleChange("confirmPassword")}
                      onFocus={() => { setFieldTouched('confirmPassword'); this.setState({ confirmPasswordFieldTouched: false }) }}
                      onBlur={() => { this.setState({ confirmPasswordFieldTouched: true }) }}
                      secureTextEntry={
                        this.state.btnConfirmPasswordShowHide ? true : false
                      }
                      placeholderTextColor="#6A6A6A"
                    />

                    <TouchableOpacity
                      style={styles.passwordShowHide}
                      onPress={() => {
                        this.setState({
                          btnConfirmPasswordShowHide: !this.state
                            .btnConfirmPasswordShowHide
                        });
                      }}
                      testID={"btnConfirmPasswordShowHide"}
                    >
                      <Image
                        style={styles.imgPasswordShowhide}
                        source={
                          this.state.btnConfirmPasswordShowHide
                            ? this.imgPasswordInVisible
                            : this.imgPasswordVisible
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <View>
                    {touched.confirmPassword && errors.confirmPassword ? (
                      <Text style={[styles.errorStyle,{textAlign:'left', marginLeft: 10,
                      marginRight: 10}]}>
                        {errors.confirmPassword}
                      </Text>
                    ) : null}
                  </View>

                  <View style={{ zIndex: -1, padding: 10, paddingTop: 25, }}>

                    <TouchableOpacity style={styles.styleButton}
                      //  onPress={() => this.props.navigation.navigate('PasswordCreatedSuccessfully')}
                      onPress={() => handleSubmit()}
                      testID="newPassCreate"

                    >

                      <Text style={{ textAlign: 'center', margin:0, fontSize: 16, color: '#fff', }}>{this.buttonTextIsNext}</Text>

                    </TouchableOpacity>
                  </View>
                  {this.state.loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator style={{ flex: 1, opacity: 1, justifyContent: 'center', alignItems: 'center' }} size="large" /></View>
                  ) : null}
                </View>
              )}
            </Formik>




          </View>
          {/* Customizable Area End */}
        </ScrollView>
      </KeyboardAvoidingView>
    );
      // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  styleButton: {
    backgroundColor: '#5287CC',
    borderRadius: 6,
    height: 50,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",

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
    flexDirection: "row",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true
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

  titleText: {
    fontSize: 20,
    color: "#3F3F3F",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20
  },

  stepText: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "center",
    color: '#828282',
    marginVertical: 8
  },

  emailText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
    fontWeight: "bold"
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

  errorStyle: {
    color: "red",
    textAlign: "center"
  },

  passwordShowHide: {
    alignSelf: "center"
  },

  passwordRulesStyle: {
    padding: 15
  },

  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F3F3",
    // marginTop: 20,
    borderWidth: 1,
    // borderColor: "#767676",
    borderRadius: 6,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 10,
    marginRight: 10
  },

  passwordContainerWeb: {
    flexDirection: "row",
    borderBottomWidth: 1,
    backgroundColor: "#00000000",
    borderColor: "#767676",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  bgPasswordInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    minHeight: 40,
    includeFontPadding: true,
    color: '#6A6A6A'

  },
  passwordInputWeb: {
    flex: 1,
    fontSize: 18,
    textAlign: "left",
    backgroundColor: "#00000000",
    minHeight: 40,
    includeFontPadding: true,
    borderColor: "#767676",
    borderRadius: 2
  },
  imgPasswordShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {}
});
// Customizable Area End
