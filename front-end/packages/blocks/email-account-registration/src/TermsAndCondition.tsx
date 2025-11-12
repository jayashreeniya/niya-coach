import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
} from "react-native";
import RenderHtml from 'react-native-render-html';
import CountryCodeSelector from "../../country-code-selector/src/CountryCodeSelector";
const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
import Scale from "../../../framework/src/Scale";
import { backImg } from "../../Chatbot6/src/assets";
const tagsStyles1 = {
  article: {
    marginHorizontal: 15
  }
};
// Customizable Area End

import EmailAccountRegistrationController, {
  Props,
} from "./EmailAccountRegistrationController";

export default class TermsAndCondition extends EmailAccountRegistrationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    // Customizable Area Start
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={styles.keyboardPadding}
      >
          <View style={styles.subContainer} testID="header">
            <TouchableOpacity onPress={()=> this.props.navigation.goBack()} 
              testID="tncBackButton"
            >
              <Image source={backImg} /> 
            </TouchableOpacity>
            <Text style={styles.title}>Terms and Condition</Text>
            <View />
          </View>
          <ScrollView keyboardShouldPersistTaps="always" style={styles.container} testID="tncScrollView">
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            <RenderHtml
          contentWidth={Dimensions.get('window').width}
          source={{ html: `${this.state.termsAndConditionRes}` }}
          tagsStyles={tagsStyles1}
          />
          </TouchableWithoutFeedback>
        </ScrollView>
          
      </KeyboardAvoidingView>
    );
    // Customizable Area End
  }

  async componentDidMount() {
    // Customizable Area Start
    this.getTermsAndConditionData()
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
  keyboardPadding:{
    flex:1,
    backgroundColor:'white',
    paddingHorizontal:5
  },
  subContainer:{
    height:Scale(45), 
    justifyContent:'space-between', 
    alignItems:'center', 
    flexDirection:'row', 
    backgroundColor:'white',
    paddingLeft:Scale(10), 
    marginTop:Platform.OS=="ios"?40:undefined
  },
  title:{
    color:'black', 
    fontWeight:'bold', 
    fontSize:Scale(16)
  }
  
  // Customizable Area End
});
