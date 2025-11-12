// @ts-nocheck
import React from "react";

import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  Image
} from "react-native";

//@ts-ignore
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { imgweareglad, imgnavClose } from "./assets";
import Typography from "../../../components/src/Typography";
import { dimensions } from "../../../components/src/utils";
import Scale from "../../dashboard/src/Scale";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

interface Props {
    navigation: any;
    id: string;
  }
  
  interface S {
    message: string;
    title: string;
    buttonText: string;
    buttonMessage: Message;
  }
  
  interface SS {
    id: any;
  }

export default class Weareglad extends BlockComponent<Props, S, SS> {
    constructor(props: Props) {
        super(props);

        Dimensions.addEventListener("change", (e) => {
            MergeEngineUtilities.init(
              artBoardHeightOrg,
              artBoardWidthOrg,
              Dimensions.get("window").height,
              Dimensions.get("window").width
            );
            this.forceUpdate();
          });
    
        this.state = {
          message: "An error has occured.",
          buttonText: "Ok",
          buttonMessage: new Message(""),
          title: "ERROR"
        };
    
        this.subScribedMessages = [
          getName(MessageEnum.RestAPIResponceMessage),
          getName(MessageEnum.NavigationPayLoadMessage)
        ];
    
        this.receive = this.receive.bind(this);
        runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
      }
  

  // Customizable Area Start
  

  // Customizable Area End

  render() {
    // Customizable Area Start
     // Merge Engine - render - Start
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <ImageBackground style={{ flex:1, width: dimensions.wp(100),height: dimensions.hp(96) }}
         //   {...this.headerbgImgProps}
         source={imgweareglad}
         >
        <TouchableWithoutFeedback testID="touchableKeyboard"
          onPress={this.hideKeyboard()}
        >
            <View style={{alignContent:"center",alignItems:"center",justifyContent:"center" }}>
            <TouchableOpacity testID="btnBack" onPress={()=> this.props.navigation.navigate("HomePage")} style={{alignSelf:'flex-end',marginTop: Scale(20),marginRight: Scale(20)}}>
                <Image source={imgnavClose} style={{width:Scale(18),height:Scale(18),tintColor:"#FFF", marginTop:Scale(20)}} />

            </TouchableOpacity>
          
           <View style={styles.backButton} >
                  <Typography size={18} style={{alignSelf:"flex-start", marginHorizontal:Scale(80)}} >We are glad</Typography>
                  <View style={{flexDirection:"row", alignSelf:"flex-start", marginHorizontal:Scale(80)}}>
                  <Typography size={18}>you are </Typography><Typography size={18} font="BLD">feeling</Typography><Typography size={18}> this way!</Typography>
                  </View>
                </View>

          </View>
         
        </TouchableWithoutFeedback>
        </ImageBackground>
      </ScrollView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const title = message.getData(getName(MessageEnum.InfoPageTitleMessage));
      let content = message.getData(getName(MessageEnum.InfoPageBodyMessage));

      let buttonText = message.getData(
        getName(MessageEnum.InfoPageButtonTextMessage)
      );

      let buttonMessage = message.getData(
        getName(MessageEnum.InfoPageNavigationScreenMessage)
      );

      this.setState({
        message: content,
        title: title,
        buttonMessage: buttonMessage,
        buttonText: buttonText
      });
    }
  }
}


// Customizable Area Start
const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    flex: 1
  },
  inputsend: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderColor: '#6CACE3',
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
   width:dimensions.wp(98),
   height: dimensions.hp(80)
  },
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%"

  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    padding: 10,
    borderWidth: Platform.OS === "web" ? 0 : 1,
  },
  bgMobileInput: {
    flex: 1,
  },
  showHide: {
    alignSelf: "center",
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
});
// Customizable Area End
