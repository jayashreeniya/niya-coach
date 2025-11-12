import React from "react";

// Customizable Area Start
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
//@ts-ignore


// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
import Scale,{ verticalScale } from "../../../components/src/Scale";

// Customizable Area End

import Chatbot6Controller, {
  Props,
  configJSON,
} from "./Chatbot6Controller";
import ChatHeader from "../../../components/src/ChatHeader";
import ChatInput from "../../../components/src/ChatInput";
import { deviceHeight } from "../../../framework/src/Utilities";

export default class Chatbot6 extends Chatbot6Controller {
  constructor(props: Props) {
    super(props);

    // Customizable Area Start
   
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  renderSend(props: any) {

    return (
      <Send {...props}>
        <View style={{
          justifyContent: "flex-end", flex: 1,
          alignItems: "flex-end",
          paddingRight: 5,
          paddingLeft: 10,

          borderLeftWidth: 1,
          borderLeftColor: "#fff",
        }}>
          <TouchableOpacity style={styles.sendButton}>
            <Image source={require('../assets/sendbtn.png')} style={{
              height: 20,
              width: 20, alignSelf: 'auto'
            }} />
          </TouchableOpacity>
        </View>
      </Send>
    );
  }
  renderInputToolbar(props: any) {
    return (
      <InputToolbar {...props} containerStyle={{
        backgroundColor: "transparent",
        paddingLeft: 20,
        color: '#ACACAC',
        flex: 1,
        fontSize: 15,
        margin: 5,
        justifyContent: "flex-end",
        alignSelf: "center",
      }} />
    )
  }
  renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  render() {
    // console.log(this.state.keyboardStatus, "repl")
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined }
        keyboardVerticalOffset={Scale(-30)}
        style={{ flex: 1 }}
  >
      <View style={styles.screenContainer}>

      
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#5287CC"
          translucent={true}
        />
        <ImageBackground 
         resizeMode="contain"
         style={{
           width: Dimensions.get('screen').width,
           height:Dimensions.get('screen').height/2,
           marginTop:-Dimensions.get('screen').height/10,
          flexDirection:"column"
         }}
         source={require('../assets/niyaheaderchat.png')}
        >
          

          <View style={{marginLeft:Platform.OS === "ios" ? -Dimensions.get('screen').height/3 :-Dimensions.get('screen').height/4 , right:Scale(30),flex:1,justifyContent:'center',alignItems:'center',marginTop:-Dimensions.get('screen').height/65,}}>
        
          <Image
         resizeMode="contain"
         style={{
           width: '10%',
           height:Dimensions.get('screen').height/2,
           marginTop: Platform.OS === "ios" ? Dimensions.get('screen').height/15 : Dimensions.get('screen').height/8
         }}
         source={require('../assets/niya.png')}
        />
       </View>
       <View style={{marginLeft:'30%',justifyContent:'center',flex:1,alignItems:'flex-start',marginTop:verticalScale(-260)
        }}
       >
            <Text style={[{ color: '#EAEAEA',fontSize:19}]}>Chat with NIYA</Text>
            </View>
            <View style={{marginLeft:'10%',justifyContent:'center',flex:1,alignItems:'flex-start',marginTop:Platform.OS === "ios" ? -220: -300, }}>
           
            <Text style={[{ color: '#EAEAEA',fontSize:16,marginLeft:0}]}>Hey! You are welcome here.I am NIYA
            </Text>
           </View>
        </ImageBackground>
    
        <View style={[styles.sendingContainer,{marginTop:'-5%',marginRight:'45%'}]} >

          <Text style={styles.headerText}>What should I call you?</Text>

        </View>
        {this.state.isSend && <View style={{
          alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', aspectRatio: 2.5, margin: 10, borderRadius: 16,
          borderWidth: 1, borderColor: '#006CE2', marginLeft: '60%', marginRight: '-2%'
        }}>
          <Text style={styles.title}>{this.state.reply.length>10?this.state.reply.substring(0,10)+"...":this.state.reply}</Text>
        </View>
        }

       

        <ScrollView style={{ left: 0, right: 0, bottom: 10, position: 'absolute' }} keyboardShouldPersistTaps="never" >


            <View >
          

              {this.state.isSend == false ? <View style={[styles.container]}>

                <View style={styles.innerContainer}>
                  <View style={styles.inputsend}>

                    <TextInput
                      testID="txtInput"
                      returnKeyType="done"
                      blurOnSubmit={true}
                      multiline
                      placeholder={"Message"}
                      style={styles.input}
                      onChangeText={(text) => this.setState({ reply: text })}
                      maxLength={30}
                      autoCorrect={false}
                      autoCapitalize="none"
                    />

                  </View>
                  <TouchableOpacity testID="send_iconBtn" style={styles.sendButton} {...this.sendbtnPressProps}>
                    <Image
                      style={{ height: 20, width: 20, alignSelf: 'auto' }}
                      {...this.sendbtnImageProps}
                    />
                  </TouchableOpacity>
                </View>

              </View> :
                <TouchableOpacity testID="btnSend" style={{
                  justifyContent: 'center',
                  alignItems: 'center', margin: 30, borderRadius: 6, height: 50, maxHeight: 60,
                  borderWidth: 1, backgroundColor: '#6399DE', marginRight: 100, borderColor: '#006CE2',
                  marginLeft: 100
                }}
                  {...this.newfnPfofilenmletsBeginPressProps}
                >
                  <Text style={styles.headerText}>{configJSON.chatBtnnm}</Text>
                </TouchableOpacity>

              }
            </View>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
  button: {
    padding: 25,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#006CE2',
    backgroundColor: '#6399DE',
    margin: 20,


  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 50,
    backgroundColor: '#6399DE',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#006CE2',
    aspectRatio: 3,
    marginRight: 20,
    marginLeft: 20


  },
  rplyContainer: {
    // alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 10,
    marginTop: 50,
    backgroundColor: '#6399DE',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#006CE2',

    aspectRatio: 3,


  },
  innerContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    marginTop: 10

  },
  inputsend: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderColor: '#EAEAEA',
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "transparent",
    paddingLeft: 20,
    color: '#ACACAC',
    flex: 1,
    fontSize: 15,
    height: Platform.OS === "ios" ? 30 : 50,
    alignSelf: "center",
  },
  sendButton: {
    backgroundColor: '#BF3017',
    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    marginTop: 100,
    marginHorizontal: 10
  },
  headerText: {
    fontSize: 17,
    color: 'rgba(239, 239, 239, 1)',
    textAlign: 'left',
    borderRadius: 16,
    margin: 20,
    opacity: 1,
    backgroundColor: 'transparent',
    fontStyle: 'normal',
    fontWeight: 'normal',
    position: 'absolute',
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 17,
    color: '#6399DE',
    textAlign: 'center',
    opacity: 1,
    backgroundColor: 'transparent',
    fontStyle: 'normal',
    fontWeight: 'normal',
    borderRadius: 16,
    textAlignVertical:'center'

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
