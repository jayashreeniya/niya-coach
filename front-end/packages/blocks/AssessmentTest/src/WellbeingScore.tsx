// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  ImageBackground,
  TouchableWithoutFeedback,
  
  
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { bgAssessment,arrow_score } from './assets';
import * as IMG_CONST from '../../user-profile-basic/src/assets';



// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import WellbeingScoreController, {
  Props
} from "./WellbeingScoreController";
import { dimensions } from "../../../components/src/utils";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import moment from "moment";

export default class WellbeingScore extends WellbeingScoreController {
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
 getRotation=(category_name:string)=>{
  return this.state.selectedCat==category_name ? 90 : 0
 }
 getScoreBackgroundclr=(score_level:any)=>{
  if(score_level=="high")
  {
    return '#EAFFE1';
  }
  else if(score_level=="medium")
  {
    return '#FFFAC2';
  }
  else{
    return '#FFEDEE';
  }
  
 }
 getScoreTextclr=(score_level:any)=>{
  if(score_level=="high")
  {
    return '#11A528';
  }
  else if(score_level=="medium")
  {
    return '#C28818';
  }
  else{
    return '#D80F06';
  }
  
 }
 getSubCatContent=(subcat:any,index: number,category_name:string)=>{
  if(subcat?.sub_category==undefined||subcat?.sub_category==category_name)
    {
        return null;
    }
                
    return (
        <View style={styles.subCatMainCont}>
            <TouchableOpacity onPress={()=>{
              let selcSubcat = this.state.selectedSubCat;
              let parmSubcat = subcat?.sub_category_name ? subcat?.sub_category_name : subcat?.sub_category;
             
              if(selcSubcat==parmSubcat)
              {
                this.setState({selectedSubCat:''});
              }
              else{
                this.setState({selectedSubCat:subcat?.sub_category_name ? subcat?.sub_category_name : subcat?.sub_category});
              }
            }}>
            <View style={styles.subCatSubCont}>
                <View style={styles.arrowPCont}>
                <View style={styles.arrowCont}>
                    <Typography font="REG" size={14} >{subcat?.sub_category_name ? subcat?.sub_category_name : subcat?.sub_category}</Typography>
                    <Image style={[styles.arrow_expand_small,{rotation: this.state.selectedSubCat== subcat?.sub_category ? 90 : 0,tintColor:'black'}]} source={arrow_score}  />
                    </View>
                </View>
                <View style={{width:Scale(40),flexDirection:'column',backgroundColor: this.getScoreBackgroundclr(subcat?.score_level),padding:5,borderRadius:Scale(6),alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                <Typography font="BLD" size={18} style={{color: this.getScoreTextclr(subcat?.score_level)}} >{subcat?.score}</Typography>
                </View>
                </View>
                </TouchableOpacity>
                {(this.state.selectedSubCat== subcat?.sub_category &&subcat?.advice)&& <View style={styles.subCatAdviceCont}>
                    <Typography font="REG" size={12} >{subcat?.advice ? subcat?.advice : ""}</Typography>
                </View>
                }
            </View>
    );
 }

  getList(item: any) {
   
    if(item?.item?.category_result && item?.item?.category_result?.category_name==undefined)
    {
        return null
    }
    let { category_name, score, advice, submitted_at, score_level,profile_type } = item?.item?.category_result;
   
    let subDate = moment(submitted_at).format('Do MMMM YYYY');
    return (
     <View style={styles.tableBox }>
        <TouchableOpacity onPress={()=> {
          let selectCat = this.state.selectedCat;
          if(selectCat==category_name)
          {
            this.setState({selectedCat:''});
          }
          else{
            this.setState({selectedCat:category_name});
          }
        }}>
        <View style={styles.categoryCont}>
         <View style={[styles.flx_column, { width: "95%"}]}>
            <Typography font="BLD" size={16} >{category_name}</Typography>
         </View>
         <View style={styles.flx_column}>
         <Image style={[styles.arrow_expand,{rotation:this.getRotation(category_name),tintColor:'black'}]} source={arrow_score}  />
         </View>
        </View>
        </TouchableOpacity>
       {this.state.selectedCat==category_name && <View style={styles.resultCont}>
       <Typography font="REG" size={12} style={styles.txtDate} >{subDate}</Typography>
            <View style={styles.overallScoreCont}>
            
            <View style={styles.overallSScoreCont}>
                <View style={styles.overallScoreLblCont}>
                    <Typography font="BLD" size={20} style={styles.overallScoreLbl} >{"Overall Score:"}</Typography>
                </View>
                <View style={[styles.overallScoreTextCont, {backgroundColor:this.getScoreBackgroundclr(score_level) }]}>
                <Typography font="BLD" size={24} style={{color: this.getScoreTextclr(score_level) }} >{score}</Typography>
                </View>
                </View>
            </View>
           {advice && <View style={styles.adviceCont}>
                <Typography font="REG" size={12} >{advice}</Typography>
                {category_name=="Occupational Wellbeing"&&profile_type &&  <Typography font="REG" size={12} >{profile_type}</Typography>}
            
          
            </View>
            }
            {item?.item?.sub_category_result.length>0 && item?.item?.sub_category_result.map((subcat:any,index: number)=>{
                 return this.getSubCatContent(subcat,index,category_name)
            })}
        </View>
  }
      </View>

    );
  }

  // Customizable Area End

  render() {
    // Customizable Area Start
    
    // Merge Engine - render - Start
    return (
      <SafeAreaView  style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="always" >
        <TouchableWithoutFeedback testID="touchableKeyboard"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <View>
            <ImageBackground style={styles.imgBackgrnd} resizeMode="stretch"
              source={bgAssessment}
            >
              <View style={styles.imgBackgrndCont}>
                
                <View style={styles.imgBackgrndSCont} >
                <View style={styles.parentArrowCont}>
                <TouchableOpacity onPress={() => this.backWellbeingNavigation()}>
                    <Image style={styles.arrow} source={IMG_CONST.ARROW_ICON} />
                </TouchableOpacity>
                </View>
                    <View style={styles.pHeadertextCont} >
                        <Typography font="BLD" size={18} color={"white"} style={styles.wellbeingReportText} >Well-Being Assessment Result</Typography>
                    </View>
                </View>
               
              </View> 
             </ImageBackground>

            <View>
              {this.state.loading ? (<View style={styles.loadingCont}>
                <ActivityIndicator style={styles.loadingContent} size="large" /></View>
              ) : <>
                <View style={[styles.container, styles.mainContainer]}>

                {this.state.isFrom=="drawer" ? <></> : <View style={styles.subContainer}><Typography font="REG" size={16} style={styles.bravoText} >Bravo, you did it, {"\n"} Click on well-being to view the score.</Typography></View> }
                <View style={styles.resultMainContainer}>
                {this.state.questionResponse?.length > 0 &&
                        this.state.questionResponse.map((item) => {
                          return this.getList({ item });
                        })
                      }
                </View>
                
                </View>
               
              </>
              }
            </View>



          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      </SafeAreaView>
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
  arrow: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#fff",
  },
  arrow_expand: {
    width: Scale(18),
    height: Scale(18),
    resizeMode: "contain",
    tintColor: "#fff",
    marginTop:Scale(2)
  },
  arrow_expand_small: {
    width: Scale(14),
    height: Scale(14),
    resizeMode: "contain",
    tintColor: "#fff",
    marginLeft:Scale(5)
  },
  tableBox: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: "#888888",
    backgroundColor: "#fff",
    padding: 10,
    elevation: 5,
    marginBottom: 20
  },
  categoryCont:{
    flexDirection: 'row', 
    alignItems: 'flex-start',
    justifyContent:'space-between'
  },
  flx_column:{
    flexDirection:'column'
  },
  resultCont:{
    marginTop:Scale(10)
  },
  txtDate:{
    marginBottom:Scale(10)
  },
  overallScoreCont:{
    borderWidth:1,
    borderColor:'#B6B1D7',
    borderRadius:6,padding:5,
    marginBottom:Scale(10)
  },
  overallSScoreCont:{
    flexDirection: 'row', 
    alignItems: 'flex-start',
    justifyContent:'space-between'
  },
  overallScoreLblCont:{
    flexDirection:'column',
    alignSelf:'center'
  },
  overallScoreLbl:{
    marginLeft:Scale(15)
  },
  overallScoreTextCont:{
    minWidth:Scale(50), 
    flexDirection:'column',
    padding:5,borderRadius:Scale(6),
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center'
  },
  adviceCont:{
    width:dimensions.wp(85), 
    backgroundColor:'#F0F1FE',
    borderRadius:6,padding:10,
    marginBottom:Scale(10)
  },
  subCatMainCont:{
    borderWidth:1,
    borderColor:'#B6B1D7',
    borderRadius:8,padding:5,
    marginVertical:Scale(5)
  },
  subCatSubCont:{
    flexDirection: 'row', 
    alignItems: 'flex-start',
    justifyContent:'space-between'
  },
  arrowPCont:{
    flexDirection:'column',
    alignSelf:'center'
  },
  arrowCont:{
    flexDirection:'row',
    alignSelf:'center',
    marginLeft:Scale(5),
    alignItems:'center',
    justifyContent:'center'
  },
  subCatAdviceCont:{
    width:dimensions.wp(80), 
    backgroundColor:'#F4F4F4',
    borderRadius:6,
    padding:10,
    marginTop:Scale(10),
    marginBottom:Scale(10),
    alignSelf:'center'
  },
  imgBackgrnd:{
    width: '100%', 
    height: 90
  },
  imgBackgrndCont:{
    alignItems: 'center', 
    flexDirection:'row',
    justifyContent: 'center', 
    alignSelf: 'center', 
    marginTop: 30, 
    marginRight: 0
  },
  imgBackgrndSCont:{
    flexDirection:'row',
    justifyContent:'center',
    alignContent:'center', 
    alignItems:'center'
  },
  parentArrowCont:{
    alignSelf:'flex-start',
    marginLeft:Scale(15),
    flexDirection:'column'
  },
  pHeadertextCont:{
    flexDirection:'column', 
    width:dimensions.wp(90), 
    alignSelf:'center', 
    justifyContent:'center',
    alignContent:'center', 
    alignItems:'center',
    marginTop:Scale(-5)
  },
  wellbeingReportText:{
    textAlignVertical:'center'
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
  mainContainer:{
    marginTop: Scale(10),
    justifyContent:'center',
    alignItems:'center'
  },
  subContainer:{
    marginVertical:Scale(10), 
    width:dimensions.wp(90),
    marginHorizontal:Scale(15)
  },
  bravoText:{
    textAlign:'center', 
    textAlignVertical:'center',
    color:'green',
    flexWrap:'wrap',
    lineHeight:Scale(30)
  },
  resultMainContainer:{
    width:dimensions.wp(90),
    marginBottom:Scale(15)
  }
});
// Customizable Area End
