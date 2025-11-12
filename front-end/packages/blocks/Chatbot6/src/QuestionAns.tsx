// @ts-nocheck
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
    ScrollView,
    TouchableWithoutFeedback} from "react-native";
import LinearGradient from 'react-native-linear-gradient';

import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";

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
import { dimensions } from "../../../components/src/utils";

export default class QuestionAns extends QuestionAnsController {
    constructor(props: Props) {
        super(props);

        // Customizable Area Start
     
        // Customizable Area End
    }

    // Customizable Area Start
    renderQuestions(item: any, question_id: any) {
       return (
            <View key={question_id}>
                {item.sequence_number == 1 && (<>
                    {item.answers.map((ansOpt: any,index:number) => {
                         return (
                        <View style={styles.innerContainer} key={index}>
                            <TouchableOpacity 
                                testID={"selectTypeOfTest"+index} style={[styles.inputsend, { backgroundColor: ansOpt.id == this.state.answer_id ? '#7887DB' : '#fff',height:dimensions.hp(7) }]} 
                                onPress={async () => {
                                    this.setState({ sequence_number: item.sequence_number, question_id: question_id, answer_id: ansOpt.id });
                                    const data = {
                                        sequence_number:item.sequence_number,
                                        question_id:question_id,   
                                        answer_id:ansOpt.id,
                                      };
                                    await AsyncStorage.setItem(`answers${item.sequence_number}`, JSON.stringify(data));
                                    }}>

                                <Text style={[styles.title, { color:ansOpt.id == this.state.answer_id ? "#fff":'#4E4E4E', textAlign: 'center', fontSize: 18,margin:0 }]}>{ansOpt.answers}</Text>

                            </TouchableOpacity>

                        </View>
                        )
                    })}

                </>)
                }


            </View>

        )
    }

    // Customizable Area End


    render() {

        // Customizable Area Start
        // Merge Engine - render - Start
        return (
            <View style={styles.screenContainer}>
                <LinearGradient colors={['#E6FFFD', '#C0D7EE',]} style={styles.screenContainer}>
                
                    <View style={{ height: '100%', width: '100%', alignSelf: 'auto', justifyContent: 'center',marginTop:0, alignContent: 'center',marginBottom:dimensions.hp(2) }}>
                        <Image
                            style={{ height: 100, width:120, alignSelf: 'flex-start', marginTop:50,marginLeft:30, }}
                           source={require('../assets/niyawhale.png')}
                        />
                        <ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1,}}>
                            <TouchableWithoutFeedback 
                                testID="Background"
                                onPress={() => {
                                    this.hideKeyboard();
                                }}
                                style={styles.container}
                            >



                                <View>
                                    {this.state.loading ? (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    <ActivityIndicator style={styles.loaderStyle} size="large" color='#8E84D9' /></View>
                                    ) : <View style={[styles.container]}>
                                      {this.state.options.length>0&&  <Text style={[styles.title, { marginBottom: 0,fontSize: 19,  }]} numberOfLines={1}>Hey! {this.state.name!=""?this.state.name:this.context.state.name}</Text>}
                                        {this.state.options.map((itm,index) => {
                                          return(
                                        <View key={index}>
                                           
                                            {itm.attributes.sequence_number == 1 && <Text style={[styles.title, { fontSize: 19, marginTop: 0 }]}>{itm.attributes.title}</Text>}
                                        </View>
                                        )})}

                                        {this.state.options.map((itm) => (
                                            this.renderQuestions(itm.attributes, itm.id)

                                        ))}

                                       {this.state.options.length>0&& <TouchableOpacity testID="btnNxt"  style={{
                                            justifyContent: 'center',
                                            alignItems: 'center', margin: 30, borderRadius: 6, height: 50, maxHeight: 60,
                                            borderWidth: 1, backgroundColor: '#7887DB', marginRight: 100, borderColor: '#7887DB',
                                            marginLeft: 100, marginBottom: 100
                                        }}
                                            {...this.nxtPressProps}
                                        >
                                            {this.state.questionAnsButtonLoading ?  <ActivityIndicator animating={this.state.questionAnsButtonLoading} size={'small'} color={'white'}/>:
                                            (<Text style={styles.headerText}>{configJSON.nxtBtn}</Text>)}
                                        </TouchableOpacity>
                                        }
                                    </View>
                                    }

                                </View>




                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </View>
                </LinearGradient>
            </View>
        );
        // Merge Engine - render - End
        // Customizable Area End
    }
}

// Customizable Area Start
const styles = StyleSheet.create({
    
    btnContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },
    innerContainer: {
        paddingHorizontal: 10,
        marginHorizontal: 10,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 10,
        // backgroundColor:'red'
    },
    button: {
        padding: 25,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#006CE2',
        backgroundColor: '#6399DE',
        margin: 20,


    },
    screenContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        width: '100%'
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
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginTop: 50,
        backgroundColor: '#6399DE',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#006CE2',
        aspectRatio: 2.5,
        marginRight: 20,
        marginLeft: 20


    },
   
   
    input: {
        backgroundColor: "transparent",
        paddingLeft: 20,
        color: '#ACACAC',
        flex: 1,
        fontSize: 15,
        height: 50,
        alignSelf: "center",
    },
    inputsend: {
        flexDirection: "row",
        backgroundColor: '#fff',
        borderColor: '#EAEAEA',
        borderWidth: 1,
        // flex: 1,
        marginRight: 10,
        paddingVertical: Platform.OS === "ios" ? 10 : 0,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "space-between",
        width:'100%'
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
    sendButton: {
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20
    },
    
    title: {
        fontSize: 23,
        color: '#3097DC',
        textAlign: 'left',
        // margin: 20,
        opacity: 1,
        backgroundColor: 'transparent',
        fontStyle: 'normal',
        fontWeight: 'normal',
        borderRadius: 19,
        marginLeft: 40,
        // marginBottom:0,
        textAlignVertical: 'top',

    },
    container: {
        flex: 1,
        padding: 16,
        marginLeft: "auto",
        marginRight: "auto",
        width: Platform.OS === "web" ? "75%" : "100%",
        maxWidth: 650,
        // backgroundColor: "#ffffff",
        // alignItems:'center'
    },
    body: {
        marginBottom: 32,
        fontSize: 16,
        textAlign: "left",
        marginVertical: 8,
    },
  
    bgMobileInput: {
        flex: 1,
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
    showHide: {
        alignSelf: "center",
    },
    loaderStyle:{
        flex: 1, 
        opacity: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
    
   });
// Customizable Area End
