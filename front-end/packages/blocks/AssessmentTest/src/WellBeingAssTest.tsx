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
  StatusBar
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { bgAssessment,imagenav_tick, emptyCircle } from './assets';
// @ts-ignore
import Slider from 'react-native-slider';


// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import WellBeingAssTestController, {
  Props
} from "./WellBeingAssTestController";
import { dimensions } from "../../../components/src/utils";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { AnySoaRecord } from "dns";

export default class WellBeingAssTest extends WellBeingAssTestController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    Dimensions.addEventListener("change", (e) => {
      MergeEngineUtilities.init(
        artBoardHeightOrg,
        artBoardWidthOrg,
        Dimensions.get("window").height,
        Dimensions.get("window").width
      );
      this.forceUpdate();
    });
    // Customizable Area End
  }

  // Customizable Area Start
  renderAnswerOptions(item: any, question_id: any) {
   
    return (
      <>
        {item?.map((ansOpt: any,index:number) => {
          return (<View key={index} style={styles.innerContainer}>
            <TouchableOpacity testID={`ansChoice${index}`} style={[styles.inputsend]} onPress={() => this.setState({ question_id: question_id, answer_id: ansOpt.id })}>
                <View style={{flexDirection:'row'}} >
                    <Image source={this.state.answer_id==ansOpt.id? imagenav_tick : emptyCircle} style={styles.ansOptionsImg}></Image>
                    <Typography size={14} style={styles.ansText}>{ansOpt.answer}</Typography>
                </View>
              </TouchableOpacity>

          </View>)
        })}

      </>
    )
  }

  // Customizable Area End

  render() {
    // Customizable Area Start
    
    // Merge Engine - render - Start
    return (
      <>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaView  style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="always" bounces={false} >
        <TouchableWithoutFeedback testID="touchableKeyboard"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <View>
            <ImageBackground style={styles.imgBackground} resizeMode="stretch"
              source={bgAssessment}
            >
              <View style={styles.pageTitlePCont}>
                
                <View style={styles.pageTitlePSCont} >
                    <View style={styles.pageTitleCont} >
                        <Typography font="BLD" size={18} color={"white"} >Well-Being Assessment</Typography>
                    </View>
                </View>
               
              </View>
             </ImageBackground>

            <View>
              {this.state.loading ? (<View style={styles.loaderContainer }>
                <ActivityIndicator style={styles.loading} size="large" /></View>
              ) : this.state.questionResponse?.length === 0 ? (
                <View style={styles.noQuestionsContainer}>
                  <Typography font="REG" size={16} color={"#666"} style={styles.noQuestionsText}>
                    No questions available for this category at the moment.
                  </Typography>
                  <TouchableOpacity 
                    testID="btnGoBack" 
                    style={styles.nxtBtnCont}
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <Text style={styles.nxtBtnText}>{"Go Back"}</Text>
                  </TouchableOpacity>
                </View>
              ) : <>
                <View style={[styles.container, styles.contentContainer]}>
                <View style={styles.sliderPCont}>
                    <View style={styles.sliderCont}>
                    <Slider
                        testID="sldr"
                        maximumValue={this.state.questionResponse?.length || 1}
                        minimumValue={0}
                        maximumTrackTintColor="#000000"
                        trackStyle={styles.trackStyle}
                        thumbStyle={styles.thumbStyle}
                        minimumTrackTintColor='#7887DA'
                        step={1}
                        value={this.state.qtnIndex+1}
                         ></Slider>
                        
                    </View>
                    <View style={styles.sliderText}>
                    <Typography font="REG" size={14} color={"black"} >{this.state.qtnIndex+1+'/'+(this.state.questionResponse?.length || 0).toString()}</Typography> 
                    </View>
                </View>
                <View style={styles.qtnContainer}>
                <Typography font="REG" size={15} color={"black"} style={styles.qtnText} >{this.state.selectedQue?.attributes?.question_answers?.question?.question}</Typography> 
                   <>
                        {this.renderAnswerOptions(this.state.selectedQue?.attributes?.question_answers?.answers, this.state.selectedQue?.attributes?.question_answers?.question?.id) }
                    </>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                  <TouchableOpacity testID="btnNext" style={ styles.nxtBtnCont}
                    {...this.nxtPressProps}
                  >
                    <Text style={styles.nxtBtnText}>{"Next"}</Text>

                  </TouchableOpacity>

                </View>
              </>
              }
            </View>

          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      </SafeAreaView>
      </>
    );
    // Merge Engine - render - End
    // Customizable Area End
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
    flex: 1,
  },
  inputsend: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: dimensions.hp(5),
  },
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    backgroundColor: '#fff'

  },
  ansOptionsImg:{
    width:Scale(20),
    height:Scale(20)
  },
  ansText:{
    textAlign: 'left', 
    textAlignVertical: 'center',
    marginLeft:Scale(10)
  },
  imgBackground:{
    width: '100%', 
    height: 90
  },
  pageTitlePCont:{
    alignItems: 'center', 
    flexDirection:'row',
    justifyContent: 'center', 
    alignSelf: 'center', 
    marginTop: 30, 
    marginRight: 0
  },
  pageTitlePSCont:{
    flexDirection:'column',
    width:dimensions.wp(80), 
    justifyContent: 'center', 
    alignSelf: 'center'
  },
  pageTitleCont:{
    flexDirection:'row', 
    alignSelf:'center', 
    justifyContent:'center',
    alignContent:'center', 
    alignItems:'center'
  },
  loaderContainer:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  loading:{
    flex: 1, 
    opacity: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  contentContainer:{
    marginTop: Scale(10),
    justifyContent:'center',
    alignItems:'center'
  },
  sliderPCont:{
    width:dimensions.wp(90),
    flexDirection:'row',
    marginBottom:Scale(15)
  },
  sliderCont:{
    width:dimensions.wp(75),
    paddingHorizontal:Scale(15),
    flexDirection:'column'
  },
  trackStyle:{
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D8D8D8'
  },
  thumbStyle:{
    width: 20,
    borderRadius: 10,
    backgroundColor: 'transparent'
  },
  sliderText:{
    width:dimensions.wp(15),
    flexDirection:'column',
    alignSelf:'center'
  },
  qtnContainer:{
    backgroundColor:'#F4F4F4',
    width:dimensions.wp(90),
    borderRadius:Scale(20),
    paddingVertical:Scale(15)
  },
  qtnText:{
    marginBottom:dimensions.hp(5),
    marginHorizontal:Scale(20),
    textAlign: 'left'
  },
  nxtBtnCont:{
    justifyContent: 'center', 
    flex: 1,
    alignItems: 'center', 
    margin: 30, 
    borderRadius: 6, 
    height: 60, 
    maxHeight: 65,
    minHeight:60,
    borderWidth: 1, 
    backgroundColor: '#469BE5', 
    marginRight: 100, 
    borderColor: '#7887DB',
    marginLeft: 100
  },
  nxtBtnText:{
    fontSize: 18, 
    color: '#fff', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    // margin: 25
  },
  noQuestionsContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Scale(20),
    paddingVertical: Scale(40)
  },
  noQuestionsText:{
    textAlign: 'center',
    marginBottom: Scale(30)
  }
});
// Customizable Area End
