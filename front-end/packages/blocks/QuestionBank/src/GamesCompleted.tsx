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
  SafeAreaView
 
} from "react-native";

//@ts-ignore
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { imgweareglad } from "./assets";
import { Colors, dimensions } from "../../../components/src/utils";
import Scale from "../../dashboard/src/Scale";
import Typography from "../../../components/src/Typography";

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

export default class GamesCompleted extends BlockComponent<Props, S, SS> {
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
    console.log("Games Compe eted screen %^%&%&%&7");
     // Merge Engine - render - Start
    return (
        <SafeAreaView  style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="always" >
        <ImageBackground style={{ flex:1, width: dimensions.wp(100),height: dimensions.hp(96),alignContent:"center",alignItems:"center",justifyContent:"center" }}
         //   {...this.headerbgImgProps}
         source={imgweareglad}
         >
        <TouchableWithoutFeedback testID="touchableKeyboard"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
            <View style={{alignContent:"center",alignItems:"center",justifyContent:"center" }}>
            
            <View style={[styles.modalContainer]}>
                  <View style={styles.modalInteractiveArea}>
                  <View style={{  width: '92%', justifyContent: 'center',alignItems:'center',alignContent:'center', alignSelf: 'center', height:Scale(60) }}>
                        <Typography size={18} style={{  color: '#454545',textAlign:'center', lineHeight:Scale(30) }}>Hey you did well ,{"\n"} that needs lots of focus!</Typography>
                      </View>
                    <View style={[{  width: '92%', alignSelf: 'center', height:Scale(50),marginTop:Scale(15) }]}>
                        <Typography size={16} font="BLD" style={{ justifyContent: 'center', color: '#454545', alignSelf: 'center' }}>How are you feeling now?</Typography>
                      </View>
                      <View style={[{ width: '92%', alignSelf: 'center', height:Scale(50) }]}>
                        <Typography size={16} font="BLD" style={{ justifyContent: 'center', color: '#454545', alignSelf: 'center' }}>Would you like to talk to someone?</Typography>
                      </View>
                     

                      <View style={{ flexDirection:'row', alignItems: 'center', justifyContent: 'space-between',marginTop:Scale(45),width:dimensions.wp(80) }}>
                      <TouchableOpacity style={{
                            justifyContent: 'center', 
                            alignItems: 'center', borderRadius: 6, height: 50, maxHeight: 60,
                            borderWidth: 1, backgroundColor: '#469BE5', borderColor: '#469BE5',
                            width:Scale(200)
                        }} testID="btnAppointment"
                           onPress={()=> this.props.navigation.navigate("Appointments")}
                        >
                            <Typography size={16} font="BLD" color="white" style={[{ textAlign: 'center' }]}>{"Schedule a call"}</Typography>

                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            justifyContent: 'center', 
                            alignItems: 'center', borderRadius: 6, height: 50, maxHeight: 60,
                            borderWidth: 1, backgroundColor: '#FFF', borderColor: '#469BE5',
                            width:Scale(100)
                        }} testID="btnHome"
                           onPress={()=> this.props.navigation.navigate("HomePage")}
                        >
                            <Typography size={16} font="BLD" style={[{ color:'#469BE5', textAlign: 'center' }]}>{"No"}</Typography>

                        </TouchableOpacity>
                        
                        
                      </View>

                      </View>
                    </View>

          </View>
         
        </TouchableWithoutFeedback>
        </ImageBackground>
        
      </ScrollView>
      </SafeAreaView>
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
  modalContainer: {
    flex: 1,
    padding: dimensions.wp(4),
    height: dimensions.hp(100),
    width: dimensions.wp(100),
    justifyContent: "center",
    alignItems: "center",
  },
  modalBlurWrapper: {
    justifyContent: "center",
    alignItems: "center",
   
  },
  modalOverlay: {
    height: dimensions.hp(100),
    width: dimensions.wp(100),
    resizeMode: "cover"
  },
  modalInteractiveArea: {
    padding: dimensions.wp(2),
    backgroundColor: Colors.white,
    borderRadius: dimensions.wp(3),
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    width: dimensions.wp(90),
    height: Scale(350),
  }
});
// Customizable Area End
