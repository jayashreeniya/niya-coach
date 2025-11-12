import React from "react";

// Customizable Area Start
import {

  View,
  Text,
 
  StyleSheet,
 
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,

} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Typography from "../../../components/src/Typography";

import Loader from "../../../components/src/Loader";

import { dimensions,Colors } from "../../../components/src/utils";


// Customizable Area End

import TimeTrackingBillingController, {
  Props,
  configJSON,
} from "./TimeTrackingBillingController";

export default class TimeTrackingBilling extends TimeTrackingBillingController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
   
    // Customizable Area End
  }

  // Customizable Area Start
  renderUserTTList = (item:Record<string,string>) => {
      const {id,full_name}=item;
      
      return(
      <>  
   
          <TouchableOpacity onPress={this.props.navigation?.navigate.bind(this,'TimeTrackingDet',{userid:id})} key={id}>
      
              <View style={[styles.timestyle]}
               >
              <View style={[styles.rowtrac, styles.mbtm,{justifyContent:'space-between',right:5}]}>
              <Text style={[styles.statusTextcomp]} numberOfLines={1}>{"Name : "}{full_name}</Text>
              
          
              </View>
              
           <View style={[{flex:1,justifyContent:'flex-end',alignItems:'flex-end',marginTop:0,right:5}]}>
           </View>
            </View>
        
      
          </TouchableOpacity>
  
      </>
     )
 
    }

  // Customizable Area End

  render() {
    // Customizable Area Start
    const colordataTT=["#9C6FB4", "#9C6FB4"];
  
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.containerview}>
      <LinearGradient
       colors={colordataTT}
      
       style={styles.timetrackingheader}
     >
      
    <View style={[styles.rowtrac, styles.mbtm, styles.padtm]}>
    <TouchableOpacity testID="btnDrawer" onPress={this.props.navigation?.goBack?.bind(this,null)}>
                  <Image source={require('../../appointmentmanagement/assets/back.png')} style={styles.backbtnIcon} />
                </TouchableOpacity>
          <Typography
           style={{flex:1,marginTop:5}}
           color="white"
           font="MED"
           size={18}
         >
          {"Time Tracking and Billing"}
         </Typography>
       </View>
      
     </LinearGradient>
       
     <View style={ {flex: 1,marginHorizontal:4}}>
     <View style={[styles.containermain,{marginTop: dimensions.wp(3),marginBottom: dimensions.hp(3)}]}>
      <FlatList
        contentContainerStyle={{flexGrow:1}}
        data={this.state.TrackingDataList}
        renderItem={({ item }) => this.renderUserTTList(item)}
        keyExtractor={item => item}
        onEndReachedThreshold={0.1}
        onEndReached={this.fetchMoreData}
      />
        <View style={styles.loaderstyle}>
         {this.state.loading ? (
           <Loader loading={this.state.loading} />
         ) : null}
       </View>
    

   </View>

     </View>
 </SafeAreaView>

    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  loaderstyle:{ 
    flex: 1, 
    height: 100 
  },
  statusTextcomp:{
    paddingVertical: dimensions.hp(.9),
    paddingHorizontal: dimensions.wp(5),
    borderRadius: dimensions.wp(3),
    color:'#9A6DB2',
    fontSize:13
  },
  containermain: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "white"
  },

  containerview: {
    flex: 1,
    backgroundColor: "white"
  },
  timestyle: {
    marginHorizontal: dimensions.wp(4),
    marginVertical: dimensions.hp(1),
    backgroundColor: '#fff',
    borderColor: "#D6A6EF",
    borderWidth: 1,
    borderRadius: dimensions.wp(2),
    padding: dimensions.wp(2),
    elevation: 4,
    height:40,
    minHeight:45,
    maxHeight:50
  },
  rowtrac:{
    flexDirection: "row",
    alignItems: "center",
    // height: dimensions.wp(5),
    // width: dimensions.wp(5),

  },
  mbtm: {
    marginBottom: dimensions.hp(4)
  },
  backbtnIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7)
  },
  padtm: {
    paddingHorizontal: dimensions.wp(5),
  },
  container: {
    flex: 1,
   
  },
  timetrackingheader:{
    width: dimensions.wp(100),
    paddingTop: dimensions.hp(3),
    borderBottomColor: Colors.greyText,
    borderBottomWidth: 1
  }
});
// Customizable Area End
