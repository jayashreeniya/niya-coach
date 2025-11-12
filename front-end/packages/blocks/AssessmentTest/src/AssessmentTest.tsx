// @ts-nocheck
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
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  Modal
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";

//@ts-ignore
import RNSpeedometer from 'react-native-speedometer'
// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import AssessmentTestController, {
  Props,
} from "./AssessmentTestController";
import { dimensions } from "../../../components/src/utils";

export default class AssessmentTest extends AssessmentTestController {
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
     /*user can select the type of test like anixety */
    return (
      <>

        {item.answers.map((ansOpt: any,index:any) => {
          return (
          <View style={styles.innerContainer} key={index}>
            <TouchableOpacity testID={"selectTypeOfTest"+index} style={[styles.inputsend, { backgroundColor: this.state.answer_id == ansOpt.id ? '#469BE5' : '#fff', height: dimensions.hp(7)}]} onPress={() => this.setState({ sequence_number: item.sequence_number ? item.sequence_number : 0, question_id: question_id, answer_id: ansOpt.id })}>

              <Text style={[{ fontSize: 18, color: this.state.answer_id == ansOpt.id ? '#fff' : '#6CACE3', textAlign: 'center', textAlignVertical: 'center',  }]}>{ansOpt.answer_title}</Text>

            </TouchableOpacity>

          </View>
          )
        })}

      </>
    )
  }

  // nextquestion base on privious selection
  renderNxtQuesAnsOptions(item: any, question_id: any) {

    return (
      <View key={question_id}>
        {item.upcoming_questions_and_answers.map((ques: any,index:any) => {
      
           return (
            <View key={index}>

              {ques.queston.sequence_number === this.state.sequence_number && <>
                {ques.answer.map((ansOpt: any,index:number) =>{ 
                  return (
                    <View style={styles.innerContainer} key={index}>
                      <TouchableOpacity testID={"selectNxtQueAns"+index} style={[styles.inputsend, {  paddingHorizontal:10, paddingVertical:15, backgroundColor: this.state.answer_id == ansOpt.id ? '#469BE5' : '#fff'}]} onPress={() => this.setState({ question_id: ques.queston.id, answer_id: ansOpt.id })}>

                        <Text style={[{textAlign:"center", fontSize: 18, color: this.state.answer_id == ansOpt.id ? '#fff' : '#6CACE3', }]}  >{ansOpt.answer}</Text>

                      </TouchableOpacity>

                    </View>
                  )
                }
                )}
              </>
              }

            </View>
          )
        })

        }
      </View>

    )
  }
  renderHeightbasedonAnswerLenght=(answer:string)=>{
    let anslen=answer.length;
    if(anslen<=32){
      return dimensions.hp(7)
    }
    else if(anslen>32&&anslen<39){
      return dimensions.hp(8)
    }
    else if(anslen>=39&&anslen<50){
      return dimensions.hp(9)
    }
   
    else if(anslen>=50&&anslen<62){
      return dimensions.hp(10)
    }
    else if(anslen>150){
      return dimensions.hp(10)
    }
  }

  renderNxtQues(item: any, question_id: any) {

    return (
      <View key={question_id}>
        {item.upcoming_questions_and_answers.map((ques: any,index:number) => {
         
          return (
            <View key={index}>

              {ques.queston.sequence_number === this.state.sequence_number && <>
                 <Text style={[{ fontSize: 18, color: '#F3F3F3', textAlign: 'justify', textAlignVertical: 'bottom', margin: 25, marginTop: 40 }]}>{ques.queston.question_title}</Text>
              </>
              }

            </View>
          )
        })

        }
      </View>

    )
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <View>
            <ImageBackground style={{ width: '100%', height: 250, }}
              {...this.headerbgImgProps}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center', alignSelf: 'flex-end', marginTop: 30, marginRight: 60
              }}>
                <TouchableOpacity style={styles.backButton} >
                  <Image
                    style={{ height: 80, width: 80, alignSelf: 'flex-end', alignItems: 'flex-end', resizeMode: 'contain' }}
                    {...this.cornerImgProps}
                  />

                </TouchableOpacity>

              </View>
                {/* only for displaying questions  */}
              {this.state.options.map((itm,index) => (
                <View key={index}>
                  {itm.type === "assess_yourself_question" ? <Text style={[{ fontSize: 18, color: '#F3F3F3', textAlign: 'left', textAlignVertical: 'bottom', margin: 25, marginTop: 50 }]}>{itm.attributes.question_title}</Text> : 
                  <>
                   {this.renderNxtQues(itm.attributes,itm.id)}
                  </>
                  }
                  </View>
              ))}

            </ImageBackground>

            <View>
              {this.state.loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator style={{ flex: 1, opacity: 1, justifyContent: 'center', alignItems: 'center' }} size="large" /></View>
              ) : <>
                <View style={[styles.container, { marginTop: 20, padding: 10 }]}>

                  {this.state.options.map((itm: any,index:number) => (
                    <View key={index}>
                      {itm.type === "assess_yourself_question" ? this.renderAnswerOptions(itm.attributes, itm.id) : this.renderNxtQuesAnsOptions(itm.attributes, itm.id)}
                    </View>

                  ))}


                </View>
                <Modal
                animationType="slide"
                visible={this.state.isModal}
                onRequestClose={() => {
                  this.setState({ isModal: false })
                }}
              >
                <View style={styles.centeredView}>
              
                  <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end',alignItems:'flex-end' ,alignSelf: 'flex-end', }}>
                  <TouchableOpacity testID="closeModal" onPress={()=>{
                    this.setState({isModal:false},()=>{
                    this.closeModalOrBackToHome();
                    })}
                    }>
               
                  <Image  source={require('../assets/cancel.png')} style={{width:20,height:20,resizeMode:'contain'}}/>
                  </TouchableOpacity>
                   </View>
                   <ScrollView bounces={false}>
                   <RNSpeedometer value={this.state.last_score} size={150} labelWrapperStyle={{height:0,width:0}}
                   
                      labels={[
                        {
                          name: 'Unbelievably Fast',
                          labelColor: '#00ff6b',
                          activeBarColor: '#00ff6b',
                        },
                        {
                          name: 'Fast',
                          labelColor: '#14eb6e',
                          activeBarColor: '#14eb6e',
                        },
                        {
                          name: 'Normal',
                          labelColor: '#f2cf1f',
                          activeBarColor: '#f2cf1f',
                        },
                        {
                          name: 'Slow',
                          labelColor: '#f4ab44',
                          activeBarColor: '#f4ab44',
                        },
                       
                        {
                          name: 'Too Slow',
                          labelColor: '#ff2900',
                          activeBarColor: '#ff2900',
                        },
                       
                     ]}
                   />
                
                     <Text style={{ fontSize: 15, textAlign: 'center', color: '#616161', margin: 10, marginTop: 30, lineHeight: 18 }}>{this.state.modalSubtitle}
                     <Text style={{fontWeight:'bold'}}> {this.state.show_value} </Text> {this.state.u_Are} 
                     <Text style={{fontWeight:'bold'}}> {this.state.result} </Text> 
                      </Text>
                   {this.state.isFirst&& <Text style={{ fontSize: 15, textAlign: 'center', color: '#616161', margin: 10,  lineHeight: 18 }}>{" Do you want to start test again?"}</Text>
                   }
                      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                       
                        <View style={{ paddingLeft: 15, }} />

                       {this.state.isFirst? <TouchableOpacity testID="startNewTest"
                         style={{
                          justifyContent: 'center',
                          alignItems: 'center',  borderRadius: 6, height: 52, maxHeight: 60,
                          borderWidth: 1, backgroundColor: '#469BE5', borderColor: '#7887DB',
                          width:'40%'
                        }}  
                        onPress={() => this.setState({ isModal: !this.state.isModal},()=>{
                        })}
                        >
                          <Text style={[styles.textStyle,]}>Start New Test</Text>
                        </TouchableOpacity>
                       :<View style={{justifyContent:'center', alignItems:'center',}}>
                         {this.state.test_Res?
                          <TouchableOpacity
                         style={{
                          justifyContent: 'center', flex: 1,
                          alignItems: 'center', borderRadius: 6, height: 52, maxHeight: 60,
                          borderWidth: 1, backgroundColor: '#469BE5', borderColor: '#7887DB',
                          width:'120%'
                        }}  
                        onPress={() => this.setState({ isModal: !this.state.isModal},()=>{
                          this.props.navigation.navigate('HomePage');
                        })}
                        >
                          <Text style={[styles.textStyle,]}>Back To Home</Text>
                        </TouchableOpacity>:<TouchableOpacity
                         style={{
                          justifyContent: 'center', flex: 1,
                          alignItems: 'center', borderRadius: 6, height: 54, maxHeight: 60,
                          borderWidth: 1, backgroundColor: '#469BE5', borderColor: '#7887DB',
                          width:'120%'
                        }}  
                        onPress={() => this.setState({ isModal: !this.state.isModal},()=>{
                          this.props.navigation.navigate('Appointments');
                            })}
                        >
                          <Text style={[styles.textStyle,]}> Schedule A Call  </Text>
                        </TouchableOpacity>
                    
                        }
                        </View>
                       }
                      </View>
                      </ScrollView>
                  

                  </View>
                </View>
                </Modal>
               {this.state.options.length>0&& <View style={styles.innerContainer}>
                  <TouchableOpacity style={{
                    justifyContent: 'center', flex: 1,
                    alignItems: 'center', margin: 30, borderRadius: 6,   height: 60, 
                    maxHeight: 65,
                    minHeight:60,
                    borderWidth: 1, backgroundColor: '#469BE5', marginRight: 100, borderColor: '#7887DB',
                    marginLeft: 100
                  }}
                    testID={"nxtPress"}
                    {...this.nxtPressProps}
                  >
                    <Text style={[{ fontSize: 18, color: '#fff', textAlign: 'center', textAlignVertical: 'center' }]}>{"Next"}</Text>

                  </TouchableOpacity>

                </View>
                }
              </>
              }
            </View>



          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
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
    // backgroundColor:'red'
  },
  inputsend: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderColor: '#6CACE3',
    borderWidth: 1,
    // flex: 1,
    // marginRight: 10,
    // paddingVertical: Platform.OS === "ios" ? 10 : 0,
    padding:5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 300
  },
  
  backButton: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    alignSelf: 'stretch',
    marginTop: 10,

  },
  container: {
    flex: 1,
    // padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    backgroundColor: '#fff'

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: dimensions.hp(88),
    backgroundColor: '#BFBFBF'
  },
  modalView: {
    marginVertical:30,
    marginHorizontal:10,
    backgroundColor: "white",
    borderRadius: 20,
    padding:20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButton: {
    backgroundColor: '#8E84D9',
    borderRadius: 6,
    height: 50,
    // width: '100%',
    alignItems: "center",
    justifyContent: "center",
    // borderBottomWidth:0,
    // margin:10,
    width: '50%',
    borderWidth: 1,
    // marginLeft:10

  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14
  },
});
// Customizable Area End
