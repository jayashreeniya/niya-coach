// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { headerbg, headerRightImg } from "../../AssessmentTest/src/assets";
import { header2bg,imgSmile,imgNegativewhale,imgweareglad } from "./assets";
import { imgBad1 } from "../../dashboard/src/assets";
import Button from "../../../components/src/Button";
import {niya1Img } from "../../Chatbot6/src/assets";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import EmoJourney1Controller, {
  Props
} from "./EmoJourney1Controller";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { Colors, dimensions } from "../../../components/src/utils";

export default class EmoJourney1 extends EmoJourney1Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
  
    // Customizable Area End
  }

  // Customizable Area Start
  renderAnswerOptions(item: any, question_id: any) {
    return (
      <>
        {item.map((ansOpt: any,index:number) => {
          return (<View style={styles.innerContainer} key={index}>
            <TouchableOpacity testID={'ansChoice'+index} style={[styles.inputsend, { backgroundColor: this.state.answer_id == ansOpt.id ? '#469BE5' : '#fff' }]} onPress={() => this.setState({ question_id: question_id, answer_id: ansOpt.id })}>

              <Text style={[{ fontSize: 18, color: this.state.answer_id == ansOpt.id ? '#fff' : '#6CACE3', textAlign: 'center', textAlignVertical: 'center', margin: 15 }]}>{ansOpt.emo_answer}</Text>

            </TouchableOpacity>

          </View>)
        })}

      </>
    )
  }

  renderModal = () => {
    return(
      <Modal
        visible={this.state.showTxtConfirmModal}
        animationType="slide"
      >
        <ImageBackground
          style={styles.modal}
          source={imgweareglad}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.view}>
            {/* <View style={{width:dimensions.wp(80),height:Scale(100)}}> */}
              <Image source={niya1Img} style={{width:Scale(100), height:Scale(100)}} resizeMode="contain"></Image>
            {/* </View> */}
            <Typography size={16} mb={1.5} style={{alignSelf:'center',textAlign:'center'}}>Please let us know what were you up to.</Typography>
            <TextInput
              testID="txtInputContent"
              placeholder="What were you upto"
              style={styles.nameTextInput}
              value={this.state.whatwereyouupto}
              multiline={true}
              onChangeText={(text: any) => this.setState({ whatwereyouupto: text })}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <View style={styles.row}>
              <Button
                onPress={()=> this.state.whatwereyouupto.trim() != '' ? this.postComment() : this.showAlert("Error","Please enter what were you upto") }
                style={styles.subButton}
              >
                Submit
              </Button>
            </View>
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  renderNVGamesModal = () => {
    return(
      <Modal
        visible={this.state.showGConfirmModal}
        animationType="slide"
      >
        <ImageBackground
          style={styles.modal}
          source={imgweareglad}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.view}>
              <Image source={niya1Img} style={{width:Scale(100), height:Scale(100)}} resizeMode="contain"></Image>
            <Typography size={16} mb={3.5} style={{alignSelf:'center',textAlign:'center',lineHeight:Scale(30)}}>Would you like to try some activities?</Typography>
            <View style={styles.row}>
              <Button
                onPress={()=> this.getStartGames()}
                style={styles.callButton}
              >
                Yes
              </Button>
              <Button
                onPress={()=> 
                  {
                    this.setState({showGConfirmModal:false});
                    this.props.navigation.navigate('GamesCompleted');
                  }
                  }
                style={styles.whiteButton}
                textStyle={{ color: "#469BE5" }}
              >
                No
              </Button>
            </View>
          </View>
        </ImageBackground>
      </Modal>
    );
  }
getImgbackground=()=>{
  return this.state.isFirstQuestionAnswered ? header2bg : headerbg;
}
getAlignSelf=()=>{
  if(this.state.isFirstQuestionAnswered)
  {
    return 'center';
  }
  else if(!this.state.isFirstQuestionAnswered && (this.state.motionId == "1" || this.state.motionId == "2"))
  {
    return 'flex-end';
  }
  else
  {
    return 'flex-start';
  }

}
getHeaderImage=()=>{
  if(this.state.isFirstQuestionAnswered && (this.state.motionId == "1" || this.state.motionId == "2"))
  {
    return imgSmile;
  }
  else if(this.state.isFirstQuestionAnswered && this.state.motionId != "1" && this.state.motionId != "2")
  {
    return imgBad1;
  }
  else if(!this.state.isFirstQuestionAnswered && (this.state.motionId == "1" || this.state.motionId == "2"))
  {
    return headerRightImg;
  }
  else
  {
    return imgNegativewhale;
  }
}
getRenderQtn=(item:any,index:number )=>{
  if(index === 0 && !this.state.isFirstQuestionAnswered && item.question_1)
  {
    return <><Text style={[{ fontSize: 18, color: '#F3F3F3', textAlign: 'left', textAlignVertical: 'bottom', margin: Scale(25),marginTop:Scale(30)  }]}>{item?.question_1?.emo_question}</Text></>
  }
  else if(index===1 && this.state.isFirstQuestionAnswered && item.question_2)
  {
    return <><Text style={[{ fontSize: 18, color: '#F3F3F3', textAlign: 'left', textAlignVertical: 'bottom', margin: Scale(25),marginTop:Scale(30) }]}>{item?.question_2?.emo_question}</Text></>
  }
  else{
    return <></>
  }
  
}
getAnsChoices=(itm:any,index:number)=>{
  if(itm.answers && !this.state.isFirstQuestionAnswered && index===0)
  {
    return <>{this.renderAnswerOptions(itm.answers, itm?.question_1?.id)}</>
  }
  else if(index === 1 && this.state.isFirstQuestionAnswered && itm.answers)
  {
    return <>{this.renderAnswerOptions(itm.answers, itm?.question_2?.id)}</>
  }
  else
  {
    return <></>
  }
  
}
  // Customizable Area End

  render() {
    // Customizable Area Start
    
    // Merge Engine - render - Start
    return (
      <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':undefined} style={{flex:1}}>
      <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback testID="touchableKeyboard"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <View>
            <ImageBackground style={styles.imgBackg} resizeMode="stretch"
              source={this.getImgbackground()}
            >
              <View style={{ 
                alignItems: 'center',
                justifyContent: 'center', alignSelf: this.getAlignSelf(), marginTop: 30, marginRight: this.state.isFirstQuestionAnswered ? 0 : 60
              }}>
                <TouchableOpacity style={styles.backButton} >
                  <Image
                    style={{ height: 80, width: 80, alignSelf:this.getAlignSelf(), alignItems: 'flex-end', resizeMode: 'contain' }}
                     source={this.getHeaderImage()}
                  />

                </TouchableOpacity>

              </View>
              
              {this.state.questionResponse?.map((itm:any,index:number) => (
                this.getRenderQtn(itm,index)
              ))} 
            </ImageBackground>
            <View>
              {this.state.loading ? (<View style={styles.loadingContainer}>
                <ActivityIndicator style={styles.loadingContent} size="large" /></View>
              ) : <>
                <View style={[styles.container, { marginTop: 20, padding: 10 }]}>

                  {this.state.questionResponse.map((itm: any,index: number) => (
                    this.getAnsChoices(itm,index)
                  ))}
                </View>
                <View style={styles.innerContainer}>
                  <TouchableOpacity testID="btnNext" style={styles.btnCont}
                    {...this.nxtPressProps}
                  >
                    <Text style={styles.btnText}>{"Next"}</Text>
                  </TouchableOpacity>
                </View>
              </>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {this.renderModal()}
      {this.renderNVGamesModal()}
      </SafeAreaView>
      </KeyboardAvoidingView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    backgroundColor: '#fff'

  },
  innerContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    flex: 1,
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
    marginLeft: 20
   
  },
 imgBackg:{
  width: '100%', 
  height: 210
 },
 loadingContainer:{
  flex: 1, 
  justifyContent: 'center', 
  alignItems: 'center'
 },
 loadingContent:{
  flex: 1, 
  opacity: 1, 
  justifyContent: 'center', 
  alignItems: 'center'
 },
 btnCont:{
  justifyContent: 'center', 
  flex: 1,
  alignItems: 'center', 
  margin: 30, 
  borderRadius: 6, 
  height: 50, 
  maxHeight: 60,
  borderWidth: 1, 
  backgroundColor: '#469BE5', 
  marginRight: 100, 
  borderColor: '#7887DB',
  marginLeft: 100
 },
 btnText:{
  fontSize: 18, 
  color: '#fff', 
  textAlign: 'center', 
  textAlignVertical: 'center', 
  margin: 0
 },
 modal: {
  flex: 1,
  backgroundColor: `${Colors.accent}88`,
  justifyContent: "center",
  alignItems: "center"
},
imageStyle: {
  height: dimensions.hp(100),
  width: dimensions.wp(100),
  resizeMode: "cover"
},
view: {
  backgroundColor: Colors.white,
  width: "94%",
  paddingLeft: dimensions.wp(6),
  paddingRight: dimensions.wp(6),
  paddingTop: dimensions.hp(1),
  paddingBottom: dimensions.hp(2),
  borderRadius: dimensions.wp(3),
  elevation: 5
},
row: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
},
callButton: {
  backgroundColor: "#469BE5",
  width:dimensions.wp(38)
},
subButton: {
  backgroundColor: "#469BE5",
  width:dimensions.wp(83),
  alignItems: "center",
  justifyContent: "center",
},
whiteButton: {
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 20,
 width:dimensions.wp(38),
 backgroundColor:"#FFF",
 borderColor:"#469BE5",
 borderWidth:1
},
nameTextInput: {
  marginLeft: Scale(5),
  textAlign: 'left', 
  textAlignVertical: 'top',
  height: Scale(100),
  borderWidth:.5,
  borderRadius: Scale(5),
  borderColor: "#CCC",
  padding: Scale(8),
  marginBottom: Scale(5)
},
});
// Customizable Area End
