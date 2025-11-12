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
  SafeAreaView,
  Modal,
  
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import Button from "../../../components/src/Button";
import { qsBckgrnd, niya_smily_whale } from './assets';
import {niya1Img } from "../../Chatbot6/src/assets";
import { imgweareglad } from "../../QuestionBank/src/assets";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import WellbeingCategoriesController, {
  Props
} from "./WellbeingCategoriesController";
import { Colors, dimensions } from "../../../components/src/utils";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";

export default class WellbeingCategories extends WellbeingCategoriesController {
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
  renderAnswerOptions(item: any) {
    return (
      <>
        {item?.map((ansOpt: any, index:number) => {
          return (<View key={index} style={styles.innerContainer}>
            <TouchableOpacity testID={`ansChoice${index}`} style={[styles.inputsend, { backgroundColor: this.state.selectedCategoryId == ansOpt.id ? '#469BE5' : '#fff' }]} onPress={() => this.setState({ selectedCategoryId: ansOpt.id })}>

              <Typography size={14} style={[{ color: this.state.selectedCategoryId == ansOpt.id ? '#fff' : '#3F3F3F', textAlign: 'center', textAlignVertical: 'center' }]}>{ansOpt.category_name}</Typography>

            </TouchableOpacity>

          </View>)
        })}

      </>
    )
  }

  renderModal = () => {
    return(
      <Modal
        visible={this.state.showAlreadyTakenModal}
        animationType="slide"
        style={{flex: 1,backgroundColor: `${Colors.accent}88`,justifyContent: "center",
          alignItems: "center", width: dimensions.wp(98), height: dimensions.hp(98)}}
      >
        <View
          style={styles.modal}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.view}>
            {/* <View style={{width:dimensions.wp(80),height:Scale(100)}}> */}
              <Image source={niya1Img} style={{width:Scale(100), height:Scale(100)}} resizeMode="contain"></Image>
            {/* </View> */}
            <Typography size={16} mb={1.5} style={{alignSelf:'center',textAlign:'center'}}>{`You have taken the  ${this.state.selectedCatName} Assessment earlier on ${this.state.last_test_taken_on}, \n Do you wish to do it again?`}</Typography>
            
            <View style={styles.row}>
              <Button
                onPress={()=> { 
                  this.setState({showAlreadyTakenModal:false});
                  this.navToQuestions()}}
                style={styles.callButton}
              >
                Yes
              </Button>
              <Button
                onPress={()=> 
                  {
                    this.setState({showAlreadyTakenModal:false});
                  }
                  }
                style={styles.whiteButton}
                textStyle={{ color: "#469BE5" }}
              >
                No
              </Button>
            </View>
          </View>
          </View>
      </Modal>
    );
  }


  // Customizable Area End

  render() {
    // Customizable Area Start
    
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="always" >
        <TouchableWithoutFeedback testID="touchableKeyboard"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <View >
            <ImageBackground style={styles.imgBackgrnd} resizeMode="stretch"
              source={qsBckgrnd}
            >
              <View style={styles.headerContainer}>
                <View style={[styles.backButton,{flexDirection:'column'}]} >
                  <Image
                    style={styles.headerWhaleImg}
                    source={niya_smily_whale}
                  />

                </View>
                <View style={styles.headerTitleCont} >
                    <View style={styles.headerTitleSCont} >
                        <Typography font="REG" size={16} color={"white"} >Chat with</Typography>
                        <Typography font="BLD" size={22} color={"white"} > Niya</Typography>
                    </View>
                </View>

              </View>
              <View style={styles.helloUserCont} >
                <Typography font="REG" size={16} color={"white"} >Hello, </Typography>
                <Typography font="BLD" style={{width:Scale(140)}} size={16} color={"white"} lines={1}  >{this.state.name?this.state.name:'Steven' }</Typography>
            
              </View>
              <View style={styles.iwouldbebetterCont} >
                <Typography font="REG" size={Platform.OS=="android"?15:14} color={"white"} style={{lineHeight:Scale(25)}} >I would like to personalize your experience here, Please complete this assessment </Typography>
              </View>
             </ImageBackground>

            <View>
              {this.state.loading ? (<View style={styles.loadingCont}>
                <ActivityIndicator style={styles.loadingContent} size="large" /></View>
              ) : <>
                <View style={[styles.container, styles.cntr]}>
                
                <Typography font="REG" size={16} style={styles.chooseCatText} >{"Choose a category to start assessment"}</Typography> 
                   <>
                        {this.renderAnswerOptions(this.state.categories) }
                    </>
                
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
      </SafeAreaView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  innerContainer: {
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    width: dimensions.wp(80),
    flex: 1,
    
  },
  inputsend: {
    flexDirection: "row",
   borderColor: '#F2F2F2',
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: dimensions.hp(5),
    shadowOffset: {width: -2, height: 4},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,
    elevation:5
  },
  backButton: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginTop: 10,

  },
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    backgroundColor: '#F2F2F2'

  },
  imgBackgrnd:{
    width: '100%', 
    height: Scale(240)
  },
  headerContainer:{
    alignItems: 'center', 
    flexDirection:'row',
    justifyContent: 'center', 
    alignSelf: 'flex-start', 
    marginTop: 30, 
    marginRight: 0
  },
  headerWhaleImg:{
    height: 80, 
    width: 80, 
    alignSelf: 'flex-start', 
    alignItems: 'flex-end', 
    resizeMode: 'contain'
  },
  headerTitleCont:{
    flexDirection:'column',
    marginLeft:Scale(40),
    marginTop:Scale(18)
  },
  headerTitleSCont:{
    flexDirection:'row', 
    alignSelf:'center', 
    justifyContent:'center',
    alignContent:'center', 
    alignItems:'center'
  },
  helloUserCont:{
    flexDirection:'row',
    alignItems: 'flex-start',
    marginTop:Scale(30),
    marginLeft:Scale(20)
  },
  iwouldbebetterCont:{
    flexDirection:'row',
    alignItems: 'flex-start',
    marginTop:Scale(10),
    marginBottom:Scale(10),
    marginLeft:Scale(20)
  },
  loadingCont:{
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
  cntr:{
    justifyContent:'center',
    alignItems:'center'
  },
  chooseCatText:{
    marginTop:Scale(20),
    marginBottom:Scale(25), 
    marginHorizontal:Scale(20),
    color:"#3F3F3F"
  },
  btnCont:{
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
  btnText:{
    fontSize: 18, 
    color: '#fff', 
    textAlign: 'center', 
    // textAlignVertical: 'center', 
    // margin: 25
  },
  view: {
    backgroundColor: Colors.white,
    width: "94%",
    paddingLeft: dimensions.wp(6),
    paddingRight: dimensions.wp(6),
    paddingTop: dimensions.hp(1),
    paddingBottom: dimensions.hp(2),
    borderRadius: dimensions.wp(3),
    elevation: 5,
    
  },
  modal: {
    flex: 1,
    backgroundColor: `${Colors.modalTransparentColor}88`,
    justifyContent: "center",
    alignItems: "center"
  },
  imageStyle: {
    height: dimensions.hp(100),
    width: dimensions.wp(100),
    resizeMode: "cover"
  },
  callButton: {
    backgroundColor: "#469BE5",
    width:dimensions.wp(38)
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
});
// Customizable Area End
