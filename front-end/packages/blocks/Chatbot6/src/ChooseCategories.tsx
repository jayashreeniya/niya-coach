import React from "react";

// Customizable Area Start
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import Button from "../../../components/src/Button";
import Typography from "../../../components/src/Typography";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import {niya1Img} from './assets';
import Scale from "../../../framework/src/Scale";
import { imgweareglad } from "../../QuestionBank/src/assets";
//@ts-ignore


// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import QuestionAnsController, {
    Props,
    configJSON,
} from "./QuestionAnsController";

import { deviceHeight } from "../../../framework/src/Utilities";
import { dimensions } from "../../../components/src/utils";
import { set_user_data } from "../../../components/src/context/actions";

export default class ChooseCategory extends QuestionAnsController {
    constructor(props: Props) {
        super(props);

        // Customizable Area Start
        
        // Customizable Area End
    }

    // Customizable Area Start
    renderQuestionsSeq2(item: any, question_id: any) {

        return (
            <>
                {item.sequence_number == 2 && <>
                    {item.answers.map((ansOpt: any,index:number) => {
                    
                        return (<View style={styles.innerContainer} key={index}> 
                            <TouchableOpacity  testID={"selectTypeOfTest"+index} style={[styles.inputsend, { backgroundColor: ansOpt.id == this.state.answer_id ? '#7887DB' : '#fff' }]} onPress={async( ) => {
                                this.setState({ sequence_number: item.sequence_number, question_id: question_id, answer_id: ansOpt.id })
                                const data = {
                                    sequence_number:item.sequence_number,
                                    question_id:question_id,   
                                    answer_id:ansOpt.id,
                                  };
                                await AsyncStorage.setItem(`answers${item.sequence_number}`, JSON.stringify(data));
                            
                            }

                                
                                }>

                                <Text style={[styles.title, { color: ansOpt.id == this.state.answer_id ? '#fff' : '#4E4E4E', fontSize: 17, marginLeft: 20   }]}>{ansOpt.answers}</Text>

                            </TouchableOpacity>

                        </View>)
                    })}

                </>
                }


            </>

        )
    }


    rendername=()=>{
        if(this.state.name!=""){
            if(this.state.name.length>15){
                return this.state.name.substring(0,10)+"..."
            }else{
               return this.state.name
            }
        }else if(this.context.state.name.length>15){
            return this.context.state.name.substring(0,10)+"..."
        }else{
           return this.context.state.name
        }
    }

    renderUpcomingQuestionsAnsforSeq2(item: any, question_id: any,index:number) {
       console.log("-----",Dimensions.get('window').width,"heug",Dimensions.get('window').height)
        return (
            <View key={index}>
                <Text style={[styles.title, { fontSize: 19, marginTop: 0, marginLeft: 0, marginRight: 10, marginBottom:20 }]}>{this.rendername()}{", "}{item?.upcoming_question.question_title}</Text>
                {item.upcoming_answers.map((ansOpt: any,ind:number) => {
                     return (
                     <View style={styles.innerContainer} key={ind}>
                        <TouchableOpacity testID={"chooseAns"+ind} style={[styles.checkIpSytle, { backgroundColor: '#7887DB', alignItems: "center",padding:Scale(5) }]} onPress={() => { this.btnMulOptionShowHideProps(ansOpt.id, item.upcoming_question.id) }}>
                            {this.state.checked.includes(ansOpt.id) ?
                                <Image style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 20 }}{...this.btnShowImageProps} /> :
                                <Image style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 20 }}

                                    {...this.btnHideImageProps} />}


                            <Text style={[styles.title, { color: '#fff', textAlign: 'left', fontSize: 18, marginLeft: 10, flexWrap: 'wrap',flex:1,marginRight:10 }]} numberOfLines={2}>{ansOpt.answers}</Text>

                        </TouchableOpacity>

                    </View>
                    )
                })}
            </View>
        )
    }

    renderModal = () => {
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
                <Typography size={16} mb={1.5} style={{alignSelf:'center',textAlign:'center'}}>Congratulations! You have successfully signed up.</Typography>
                <Typography size={16} mb={3.5} style={{alignSelf:'center',textAlign:'left',lineHeight:Scale(30)}}>We recommend you to complete the Well-Being Assessment first for the detailed report.</Typography>
                <View style={styles.row}>
                  <Button 
                    
                    onPress={()=> {
                        this.setState({showGConfirmModal:false});
                        this.props.navigation.navigate('WellbeingCategories');
                        AsyncStorage.removeItem("modalPart");
                        AsyncStorage.setItem("wellBeing","true");
                    }}
                        style={styles.callButton}>
                    Yes
                  </Button>
                  <Button
                    onPress={()=> 
                      {
                        this.setState({showGConfirmModal:false});
                        const newState = {
                            isNew: false,
                            isshowReass:false
                          }
                        this.context.dispatch({ type: set_user_data, payload: newState });
                        this.props.navigation.navigate('HomePage');
                        AsyncStorage.removeItem("nameEdited");
                        AsyncStorage.removeItem("modalPart");
                      }
                      }
                    style={styles.whiteButton}
                    textStyle={{ color: "#469BE5" }}
                  >
                    Explore
                  </Button>
                </View>
              </View>
            </ImageBackground>
          </Modal>
        );
      }
    // Customizable Area End


    render() {
        // Customizable Area Start
        // Merge Engine - render - Start
        return (
            <View style={styles.screenContainer}>

                <ImageBackground style={{ height: '103%', width: '100%', alignSelf: 'auto', justifyContent: 'center', alignContent: 'center', marginTop: 50 }}
                    {...this.bgImgChooseCatyProps}>

                    <TouchableOpacity style={styles.sendButton} {...this.backbtnPressProps}>
                        <Image
                            style={{ height: 15, width: 20, alignSelf: 'flex-start', marginLeft: 5 }}
                            {...this.backImageProps}
                        />

                    </TouchableOpacity>


                    <ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1, marginTop: 150 }}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.hideKeyboard();
                            }}
                            style={styles.container}
                        >



                            <View>
                                {this.state.loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator style={ styles.loaderStyle } size="large"  color={'#8E84D9'}/></View>
                                ) : <View>
                                    <View style={styles.container}>
                                        {this.state.options.map((itm,index:number) => 
                                        (<View key={index}>
                                            {itm.attributes.sequence_number == 2 && <Text style={[styles.title, { fontSize: 19, marginTop: 0, marginLeft: 0, marginRight: 10, marginBottom:20 }]}>{this.rendername()+","}{itm.attributes.title}</Text>}
                                        </View>
                                        ))}
                                        {this.state.options.map((itm,index:number) => (
                                            <View key={index}>
                                                {itm.type == "choose_answer" ? this.renderUpcomingQuestionsAnsforSeq2(itm.attributes, itm.id,index) : this.renderQuestionsSeq2(itm.attributes, itm.id)
                                                }
                                            </View>


                                        ))}


                                    </View>
                                  {this.state.options.length>0&&  <TouchableOpacity testID="btnNxt" style={{
                                        justifyContent: 'center',
                                        alignItems: 'center', margin: 30, borderRadius: 6, height: 50, maxHeight: 60,
                                        borderWidth: 1, backgroundColor: '#7887DB', marginRight: 100, borderColor: '#7887DB',
                                        marginLeft: 100, marginBottom: 100
                                    }}
                                        {...this.nxtPressProps}
                                    >
                                        <Text style={styles.headerText}>{this.state.isNxt ? configJSON.nxtBtn : configJSON.chatBtnnm}</Text>
                                    </TouchableOpacity>
                                    }
                                </View>
                                }
                            </View>




                        </TouchableWithoutFeedback>
                    </ScrollView>
                </ImageBackground>
                {this.context?.state?.isNew&&this.renderModal()}
            </View>
        );
        // Merge Engine - render - End
        // Customizable Area End
    }
}

// Customizable Area Start
const styles = StyleSheet.create({
    whiteButton: {
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
       width:dimensions.wp(38),
       backgroundColor:"#FFF",
       borderColor:"#469BE5",
       borderWidth:1
      },
    screenContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        width: '100%'
    },
    callButton: {
        backgroundColor: "#469BE5",
        width:dimensions.wp(38)
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      },
    modal: {
        flex: 1,
        backgroundColor: `#8E8488`,
        justifyContent: "center",
        alignItems: "center"
      },
      view: {
        backgroundColor: "#fff",
        width: "94%",
        paddingLeft: dimensions.wp(6),
        paddingRight: dimensions.wp(6),
        paddingTop: dimensions.hp(1),
        paddingBottom: dimensions.hp(2),
        borderRadius: dimensions.wp(3),
        elevation: 5
      },
    
      imageStyle: {
        height: dimensions.hp(100),
        width: dimensions.wp(100),
        resizeMode: "cover"
      },
     
   
    button: {
        padding: 25,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#006CE2',
        backgroundColor: '#6399DE',
        margin: 20,


    },
    btnContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },
  
    inputsend: {
        flexDirection: "row",
        backgroundColor: '#fff',
        borderColor: '#EAEAEA',
        borderWidth: 1,
        // flex: 1,
        height:50,
        width:320,
        paddingVertical: Platform.OS === "ios" ? 10 : 0,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "space-between",
    },
    innerContainer: {
        paddingHorizontal: 10,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 10,
       
    },
   
    checkIpSytle: {
        flexDirection: "row",
        backgroundColor: '#4793E0',
        borderColor: '#006CE2',
        borderWidth: 0,
        flex: 1,

        borderRadius: 34,
        alignItems: "center",
        elevation: 5
    },
   
    sendButton: {
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20
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
        marginLeft: 0,
        marginRight: 20,
        width: Platform.OS === "web" ? "75%" : "100%",
        maxWidth: 650,
        // backgroundColor: "#ffffff",
        // alignItems:'center'
    },
    title: {
        fontSize: 17,
        color: '#3E3E3E',
        textAlign: 'center',
        // margin: 20,
        opacity: 1,
        backgroundColor: 'transparent',
        fontStyle: 'normal',
        fontWeight: 'normal',
        borderRadius: 19,
        marginLeft: 40,
        textAlignVertical: 'top',

    },
    loaderStyle:{
        flex: 1, 
        opacity: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
  
   
  
   });
// Customizable Area End
