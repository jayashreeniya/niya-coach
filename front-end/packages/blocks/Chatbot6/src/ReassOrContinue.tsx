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
    ScrollView,
    TouchableWithoutFeedback
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';
import Loader from "../../../components/src/Loader";
import { dimensions } from "../../../components/src/utils";

import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";

//@ts-ignore


// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End
import { deviceHeight } from "../../../framework/src/Utilities";
import ReassesorContinueController, {
    Props,
    configJSON,
} from "./ReassorContinueController";
import CustomCheckBox from "../../../components/src/CustomCheckBox";

export default class ReassorContinue extends ReassesorContinueController {

    constructor(props: Props) {
        super(props);

        // Customizable Area Start
       
        // Customizable Area End
    }

    // Customizable Area Start
    renderFocusAre = (itm: any,index:number) => {

        return (
        <View key={index}>
            {itm.assesment_test_type_answers.map((opt: any) => {
                return (
                    <View style={styles.innerContainer}>
                        <TouchableOpacity style={[styles.inputsend, { height: Platform.OS=="ios"?dimensions.hp(8):dimensions.hp(7) }]} >

                            <Image style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 20 }}{...this.btnShowImageProps} />

                            <Text style={[styles.title, { color: '#fff', textAlign: 'left', fontSize: 18, marginLeft: 10, flexWrap: 'wrap', marginRight: 10, flex: 1 }]}>{opt.answers}</Text>

                        </TouchableOpacity>

                    </View>
                )
            })}
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

                     <Image
                            style={{ height: 100, width: 120, alignSelf: 'flex-start', marginLeft:30, marginTop:50 }} 
                            {...this.backImageProps}
                        />
                   
                    <View style={{ height: '100%', width: '100%', alignSelf: 'auto', justifyContent: 'center', alignContent: 'center', marginTop: 10 }} >


                       {this.state.loading? <Loader loading={this.state.loading} />:
                       
                        <ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1,}}>
                            <TouchableWithoutFeedback
                                testID="Background"
                                onPress={() => {
                                    this.hideKeyboard();
                                }}
                                style={styles.container}
                            >



                                <View>

                                    <View style={[styles.container]}>
                                        {this.state.options.length > 0 && <Text style={[styles.title, { marginBottom: 20, color: '#000', textAlign: 'left', marginLeft: 10, }]}>{this.context.state.isNew ? "new user " : "Last time when you were here, we talked about"}
                                        </Text>
                                        }
                                        {this.state.options.map((itm,index) => {
                                             return(
                                            this.renderFocusAre(itm,index)
                                        )})}

                                    </View>

                                </View>




                            </TouchableWithoutFeedback>

                        </ScrollView>
                      }
               
                    </View>

                </LinearGradient>
               
            
               <>
                <View style={{ flexDirection: 'row', left: 0, right: 0, bottom: 120, position: 'absolute',justifyContent:'center',alignItems:'center', margin: 10 }}>
            
            
            <Text style={[styles.headerText, {color: '#000', }]}>{"Do you want to"}</Text>
                </View>
                 <View style={{ flexDirection: 'row', left: 0, right: 0, bottom:30, position: 'absolute', margin: 10 }}>
            

                    <TouchableOpacity testID="btnNxt" style={{
                        justifyContent: 'center',
                        alignItems: 'center', borderRadius: 6, width: '40%', height:60, maxHeight: 60,
                        borderWidth: 1, backgroundColor: '#fff', borderColor: '#7887DB', marginLeft: 10, marginRight: 1,

                    }}
                        {...this.newFncontinuenxtPressProps}
                    >
                        <Text style={[styles.headerText, { color: '#4793E0' }]}>{configJSON.continueBtn+"?"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  testID="reAssessPress"style={{
                        justifyContent: 'center',
                        alignItems: 'center', borderRadius: 6, width: '50%', height:60,
                        maxHeight: 60,
                        borderWidth: 1, backgroundColor: '#4793E0', borderColor: '#7887DB',
                        marginRight: 10, marginLeft: 10
                    }}
                        {...this.reAssessProps}
                    >
                        <Text style={styles.headerText}>{"Talk about something else"}</Text>
                    </TouchableOpacity>
                </View>
                </>
            

            </View>
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
        width: '100%'
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
        aspectRatio: 2.5,
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
        // justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 10,
        // marginTop:30
        // backgroundColor:'red'
    },
    inputsend: {
        flexDirection: "row",
        backgroundColor: '#4793E0',
        borderColor: '#006CE2',
        borderWidth: 1,
        flex: 1,

        // marginRight: 10,
        // paddingVertical: Platform.OS === "ios" ? 10 : 0,
        borderRadius: 34,
        alignItems: "center",
        // justifyContent:'center'
        // justifyContent: "space-between",
        elevation: 5
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
        marginLeft: "auto",
        marginRight: "auto",
        width: Platform.OS === "web" ? "75%" : "100%",
        maxWidth: 650,
        // backgroundColor: "#ffffff",
        // alignItems:'center'
    },
    title: {
        fontSize: 18,
        color: 'rgba(0, 0, 0, 1)',
        textAlign: 'left',
        opacity: 1,

        backgroundColor: 'transparent',
        fontStyle: 'normal',
        fontWeight: 'normal',
        borderRadius: 19,
        marginLeft: 40,
        // marginBottom:0,
        textAlignVertical: 'top',

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
