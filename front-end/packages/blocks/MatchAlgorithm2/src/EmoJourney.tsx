// @ts-nocheck
import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import EmoJourneyController from "./EmoJourneyController";
import * as IMG_CONST from "../../user-profile-basic/src/assets";
import Scale from "../../dashboard/src/Scale";
import Typography from "../../../components/src/Typography";
import { dimensions } from "../../../components/src/utils";
import moment from "moment";
// Customizable Area End

export default class EmoJourney extends EmoJourneyController {
  // Customizable Area Start
  
  renderHeader = () => {
    return (
      <View>
        <LinearGradient
          colors={["#746DB2", "#746DB2"]}
          start={{ x: 0.5, y: 0.6 }}
          end={{ x: 0.9, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity testID="btnHome"
            onPress={() => this.props.navigation.navigate("HomePage")}
          >
            <Image style={styles.arrow} source={IMG_CONST.ARROW_ICON} />
          </TouchableOpacity>
          <Text style={styles.accountText}>Journey</Text>
        </LinearGradient>
      </View>
    );
  };

  renderLegend = () => {
    return (
      <View style={styles.legendContMain}>
        <View style={styles.legendSubCont}>
          <View style={styles.legendCont}>
            <View style={[styles.legendCir, { backgroundColor: "#0086F0" }]} />
            <Text style={[styles.legendText,{fontWeight:'bold', fontSize:Scale(13.5)}]}>
              Great
            </Text>
          </View>
          <View style={styles.legendCont}>
            <View style={[styles.legendCir, { backgroundColor: "#06C22B" }]} />
            <Text style={[styles.legendText,{fontWeight:'bold', fontSize:Scale(13.5)}]}>
              Good
            </Text>
          </View>
          <View style={styles.legendCont}>
            <View style={[styles.legendCir, { backgroundColor: "#FFD405" }]} />
            <Text style={[styles.legendText,{fontWeight:'bold', fontSize:Scale(13.5)}]}>
              Okayish
            </Text>
          </View>
          <View style={styles.legendCont}>
            <View style={[styles.legendCir, { backgroundColor: "#FF8343" }]} />
            <Text style={[styles.legendText,{fontWeight:'bold', fontSize:Scale(13.5)}]}>
              Bad
            </Text>
          </View>
          <View style={styles.legendCont}>
            <View style={[styles.legendCir, { backgroundColor: "#FF0305" }]} />
            <Text style={[styles.legendText,{fontWeight:'bold', fontSize:Scale(13.5)}]}>
              Terrible
            </Text>
          </View>
        </View>
      </View>
    );
  };

  getColor=(motion_id:any)=>{
    let color:string="";
    if(motion_id)
    {
      switch(motion_id)
        {
          case 1:
            color= "#0086F0";
            break;
          case 2:
            color= "#06C22B";
            break;
          case 3:
            color= "#FFD405";
            break;
          case 4:
            color= "#FF8343";
            break;
          case 5:
            color= "#FF0305";
            break;
          default:
            color= "#D9D9D9";
        }
    }
    else{
      color= "#D9D9D9";
    }
    return color;
  }


  formatM=(arr: any)=>{
    let newArr=[]
    let first5 = arr.slice(0,5)
    let second5= arr.slice(5,10)
    second5.reverse()
    let third5= arr.slice(10,15)
    let fourth5= arr.slice(15,20)
    fourth5.reverse()
    let fifth5= arr.slice(20,25)
    let sixth5= arr.slice(25,30)
    sixth5.reverse()
    newArr.push(...first5)
    newArr.push(...second5)
    newArr.push(...third5)
    newArr.push(...fourth5)
    newArr.push(...fifth5)
    newArr.push(...sixth5)
    console.log('new ARRAY ----------', newArr);
    return newArr
  }

  renderJournal = (item: any) => {
    console.log("items??",JSON.stringify(item));
   const fours:any[]=[4,14,24];
   const fives:any[]=[5,15,30];
   const onlyCircle:any[]=[9,19,29]
 
   const containInFours = fours.find(i=> i==item?.index);
    const containsInFives = fives.find(i=> i==item?.index);
    const containsOnlyCircles = onlyCircle.find(i=> i==item?.index);
    const isCorner = (containInFours || containsInFives) ? true : false;
    const isLast = item?.index==25 ? true : false;
    const { motion_select_date, motion_id } = item?.item?.date;

    const day = motion_select_date ? moment(motion_select_date).date() : 0;
    const color = this.getColor(motion_id);
    console.log("is Date>>",item?.index);

    if(isCorner && containsInFives)
    {
         return (
            <>
            <View style={styles.journeyCPCont} >
            <View style={styles.journeyCCont} >
         <View style={[styles.circleCCont,{backgroundColor:color}]}>
                <Typography color="white" font="BLD" size={14}>{day}</Typography>
        </View>
        <View style={styles.horizontalLine} />
        </View>
        <View style={styles.verticleLine} ></View> 
            </View> 
           </>
        )
    }
    else if(isLast)
    {
       return (
        <>
        <View style={styles.journeyLPCont} >
        <View style={{flexDirection: 'row'}} >
     <View style={[styles.journeyLCont,{backgroundColor:color}]}>
            <Typography color="white" font="BLD" size={14}>{day}</Typography>
    </View>
    <View style={styles.horizontalLine} />
    </View>
    
        </View> 
       </>
    )
    }
    else if(isCorner && containInFours)
    {
      console.log(" isCorner && containInFours>>",item?.index);
        return (
            <>
            <View style={styles.journeyCPCont} >
            
         <View style={[styles.journeyFourCircleCont,{backgroundColor:color}]}>
                <Typography color="white" font="BLD" size={14}>{day}</Typography>
        </View>
        
        <View style={{flexDirection:'row',margin:0}} >
        <View style={styles.fourCornerLine} ></View>
            </View>
            </View>
           </>
        )
    }
    else{
     return (
        <>
        <View style={styles.lstPCont} >
     <View style={[styles.journeyLCont,{backgroundColor:color}]}>
            <Typography color="white" font="BLD" size={14}>{day}</Typography>
    </View>
   {(containsOnlyCircles || this.state.data?.length-1==item?.index) ? null :
       <View style={styles.onlyCircle} />  }
        
        </View>
       </>
    )
        }
  };

  // Customizable Area End

  // Customizable Area Start
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderHeader()}
          <View style={styles.emoTitle}>
            <Typography font="BLD" size={16}>
              Emo Journey
            </Typography>
          </View>
          {this.renderLegend()}
          <View style={styles.listCont}>
            <FlatList
              contentContainerStyle={{ alignSelf: "center" }}
              numColumns={5}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
               data={this.formatM(this.state.data) || []}
              renderItem={this.renderJournal}
            />
          </View>
      </SafeAreaView>
    );
  }
  // Customizable Area End
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  header: {
    width: "100%",
    height: Scale(80),
    backgroundColor: "#8289d9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Scale(20),
  },
  arrow: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#fff",
  },
  accountText: {
    fontSize: Scale(15),
    color: "#fff",
    fontWeight: "bold",
    marginLeft: Scale(30),
  },
  legendContMain: {
    width: dimensions.wp(95),
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: Scale(8),
    height: Scale(40),
    padding: Scale(10),
    justifyContent:'center'
  },
  legendSubCont: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  legendCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  legendCir: {
    width: Scale(10),
    borderRadius: Scale(5),
    height: Scale(10),
  },
  legendText: {
    marginHorizontal: Scale(11),
  },
  horizontalLine: {
    borderBottomColor: "black",
    borderBottomWidth: Scale(2),
    width: Scale(45),
    marginBottom: Scale(18),
  },
  onlyCircle: {
    borderBottomColor: "black",
    borderBottomWidth: Scale(2),
    width: Scale(45),
  },
  onlyCircle2: {
    borderBottomColor: "blue",
    borderBottomWidth: Scale(2),
    width: Scale(45),
  },
  verticleLine: {
    flexDirection: "row",
    borderLeftColor: "black",
    borderLeftWidth: Scale(2),
    width: Scale(35),
    height: dimensions.hp(6),
    marginRight: Scale(10),
  },
  journeyCPCont: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: dimensions.hp(10),
  },
  journeyCCont: {
    flexDirection: "row",
    marginTop: Scale(10),
  },
  circleCCont: {
    width: Scale(36),
    height: Scale(36),
    borderRadius: Scale(18),
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Scale(35),
  },
  journeyLPCont: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: dimensions.hp(8.5),
    alignSelf: "center",
  },
  journeyLCont: {
    width: Scale(36),
    height: Scale(36),
    borderRadius: Scale(18),
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  journeyFourCircleCont: {
    width: Scale(36),
    height: Scale(36),
    borderRadius: Scale(18),
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Scale(38),
    marginRight: Scale(29),
  },
  fourCornerLine: {
    flexDirection: "row",
    borderLeftColor: "black",
    borderLeftWidth: Scale(2),
    width: Scale(45),
    height: dimensions.hp(6),
    marginLeft: Scale(20),
    marginBottom: Scale(0),
  },
  lstPCont: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: dimensions.hp(8.5),
    // backgroundColor:'black'
  },
  emoTitle: {
    alignSelf: "center",
    marginVertical: Scale(15),
  },
  listCont: {
    marginLeft: Scale(20),
    alignSelf: "center",
    marginBottom: Scale(160),
  },
});
// Customizable Area End
