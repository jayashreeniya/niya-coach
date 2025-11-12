// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image

} from "react-native";

import { dummyPROFILE_ICON,LOGOUT_ICON,ACCOUNT_ICON, PRIVACY_ICON, FEED_BACK_ICON, BELL_ICON, MENU_ICON,iconCOMPANIES,iconCOACHES,iconUserGrp } from "./assets";
import LinearGradient from "react-native-linear-gradient";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { Colors, dimensions } from "../../../components/src/utils";

//@ts-ignore
import Drawer from "react-native-drawer";



// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start

// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import AdminConsole3Controller, {
  Props,
  configJSON,
} from "./AdminConsole3Controller";

export default class AdminConsole3 extends AdminConsole3Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
   
    // Customizable Area End
  }

  // Customizable Area Start

  renderAdminDrawer = () => {
    return (
      <SafeAreaView style={styles.drawercontainerFilter}>
        <View style={styles.drHomeContainer}>
          <View style={styles.headerImagestyle}>
            <Image style={styles.drProfileImage} source={this.state.prifileimage?{uri: this.state.prifileimage}:dummyPROFILE_ICON} />
            <View style={styles.drProfileTextHeader}>
              <Typography font="MED" color={"white"} size={18}>{this.state.full_name}</Typography>
             </View>
          </View>
          <View style={styles.drline}></View>
          <TouchableOpacity
            style={styles.draccoutHeader}
            onPress={() => this.props.navigation.navigate("UserProfile", { role: "admin" })}
            testID="profile_click"
          >
            <Image style={styles.draccountImg} source={ACCOUNT_ICON} />
            <Typography size={17} color={"white"} >Account Settings</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.draccoutHeader}
            onPress={() => {console.log("this press",this.props.navigation);this.props.navigation.navigate("SendPushnotification")}}
            testID="sendNotify_click"
          >
            <Image style={styles.draccountImg} source={BELL_ICON} />
            <Typography size={17} color={"white"}>Push Notifications</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.draccoutHeader}
            onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
            testID="Privacy_click"
          >
            <Image style={styles.draccountImg} source={PRIVACY_ICON} />
            <Typography size={17} color={"white"}>Privacy Policy</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.draccoutHeader}
            onPress={() => this.props.navigation.navigate("UserFeedback")}
            testID="feedback_click"
          >
            <Image style={styles.draccountImg} source={FEED_BACK_ICON} />
            <Typography size={17} color={"white"}>Feedback</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.draccoutHeader}
            onPress={this.logOut}
            testID="logout_click"
          >
            <Image style={styles.draccountImg} source={LOGOUT_ICON} />
            <Typography size={17} color={"white"}>Logout</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.draccoutHeader}
            onPress={this.showDelAlert}
            testID="logout_click1"
          >
            <Image style={styles.draccountImg} source={LOGOUT_ICON} />
            <Typography size={17} color={"red"}>Delete Account</Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <Drawer ref={(ref: any) => { this.drawerRef = ref; }}
      type="overlay"
      tapToClose={true}
      openDrawerOffset={0.35}
      content={this.renderAdminDrawer()}
      style={{ flex: 1, backgroundColor: "#9A6DB2", }}
    >
        <SafeAreaView style={styles.container}>
             <LinearGradient
              colors={["#9C6FB4", "#9C6FB4"]}
              // start={{ x: 0, y: 1 }}
              // end={{ x: 1, y: 1 }}
              style={styles.header}
            >
             
           <View style={[styles.row, styles.mb, styles.pad]}>
                <TouchableOpacity testID="btnOpenDrawer" onPress={() => this.drawerRef?.open?.()}>
                  <Image source={MENU_ICON} style={styles.backIcon} />
                </TouchableOpacity>
                <Typography
                  style={styles.fullFlex}
                  color="white"
                  font="MED"
                  size={18}
                >
                  Admin Panel
                </Typography>
              </View>
            
            </LinearGradient>
            <View style={{flex:1,marginBottom:dimensions.hp(3)}}>
            <View style={{height:dimensions.hp(11),marginBottom:dimensions.hp(3), flexDirection:'row',backgroundColor:'#F5F5F5',alignItems:'center',justifyContent:'space-evenly',marginHorizontal:24,marginTop:dimensions.hp(-5),borderRadius:12,borderWidth:0.19}}>
            <View style={{margin:12,}}>
            <Typography
                  style={styles.fullFlex}
                  color="black"
                  font="REG"
                  size={16}
                  
                  align="center"
                >
                 {this.state.coachCount}
                </Typography>
                <Typography
                  style={styles.fullFlex}
                  color="greyText"
                  font="REG"
                  size={12}
                >
                  Coaches
                </Typography>
                </View>
              
                <View style={{margin:12,}}>
                <Typography
                  style={styles.fullFlex}
                  color="black"
                  font="REG"
                  size={16}
                  align="center"
                >
                  {this.state.empCount}
                </Typography>
                <Typography
                  style={styles.fullFlex}
                  color="greyText"
                  font="REG"
                  size={12}
                >
                  Employees
                </Typography>
                </View>
                <View style={{margin:12,marginRight:2}}>
                <Typography
                  style={styles.fullFlex}
                  color="black"
                  font="REG"
                  size={16}
                  align="center"
                >
                {this.state.compnyCount}
                </Typography>
                <Typography
                  style={styles.fullFlex}
                  color="greyText"
                  font="REG"
                  size={12}
                >
                  Companies
                </Typography>
                </View>


           </View>
          {/* main content start here */}
          <View style={{flex:1}}>
          <View style={{ flexDirection:'row',marginBottom:dimensions.hp(3)}}>
           <TouchableOpacity testID="btnCoachList" style={[styles.userOptionRecView,]}
            onPress={()=>this.props.navigation.navigate('CoachList',{usertype:"Coaches"})}
           >

          
           <View style={{alignItems:'center',margin:20,marginBottom:5,justifyContent:'center'}}>
        <Image style={styles.usermgmtIcon} source={iconCOACHES} />
        </View> 
                <Typography
                  style={styles.fullFlex}
                  color="darkviolet"
                  font="REG"
                  size={16}
                >
                 Coaches
                </Typography>
             

               

           </TouchableOpacity>
           <TouchableOpacity testID="btnComList" onPress={()=>this.props.navigation.navigate('CoachList',{usertype:"Companies"})} style={[styles.userOptionRecView,{ marginHorizontal:0,}]}>
        
          
        <View style={{alignItems:'center',margin:20,marginBottom:5,justifyContent:'center'}}>
        <Image style={styles.usermgmtIcon} source={iconCOMPANIES} />
        </View>   
        <Typography
          style={styles.fullFlex}
          color="darkviolet"
          font="REG"
          size={16}
        >
          Companies
        </Typography>
       

       </TouchableOpacity>
   
        </View>
         {/*  */}
           <TouchableOpacity testID="btnUGList" style={[styles.userOptionRecView,]} onPress={()=>this.props.navigation.navigate('CoachList',{usertype:"User Groups"})}>

           <View style={{alignItems:'center',justifyContent:'center',margin:20,marginBottom:5}}>
         
                <Image style={styles.usermgmtIcon} source={iconUserGrp} />
                </View>
              

                <Typography
                  style={styles.fullFlex}
                  color="darkviolet"
                  font="REG"
                  size={16}
                  align="center"
                >
                 User Groups
                </Typography>

           </TouchableOpacity>
       
       
           </View>
           
           </View>
        </SafeAreaView>
     
      </Drawer>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 16,
  //   marginLeft: "auto",
  //   marginRight: "auto",
  //   width: Platform.OS === "web" ? "75%" : "100%",
  //   maxWidth: 650,
  //   backgroundColor: "#ffffffff",
  // },
  fullFlex: {
    flex: 1,
    marginTop:5
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7)
  },
  pad: {
    paddingHorizontal: dimensions.wp(5),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mb: {
    marginBottom: dimensions.hp(8)
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  header: {
    width: dimensions.wp(100),
    paddingTop: dimensions.hp(3),
    borderBottomColor: Colors.greyText,
    borderBottomWidth: 1
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
  drawercontainerFilter: {
    flex: 1,
    backgroundColor: "#9A6DB2",
    elevation: 5
  },
  drProfileTextHeader: {
    marginVertical: dimensions.hp(1)
  },
  draccoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Scale(20)
  },
  drHomeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#9A6DB2",
    // backgroundColor: "#ffffff",
  },
  headerImagestyle: {
    alignItems: "center",
    justifyContent: "center"
  },
  drProfileImage: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(40),
    resizeMode: "cover",
    borderColor: "#c2b2d8"
  },
  profileText: {
    fontSize: Scale(15),
    color: "#000",
    marginTop: Scale(10)
  },
  drline: {
    width: Scale(210),
    height: Scale(1),
    borderWidth: Scale(0.3),
    borderColor: "#DDD",
    marginTop: Scale(30),
    alignSelf: "center"
  },
  draccountImg: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#fff",
    marginRight: dimensions.wp(4)
  },

  usermgmtIcon:{
    width: Scale(40),
    height: Scale(40),
  
  },
  userOptionRecView:{
    height:dimensions.hp(15),
    width:dimensions.wp(40),
    backgroundColor:'#F5F5F5',
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:24,
    borderRadius:12,
    borderWidth:1,
    borderColor:'#8AC6F6'
  },
  
});
// Customizable Area End
