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
  TextInput,
  ScrollView,

} from "react-native";


import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { dummyPROFILE_ICON,LOGOUT_ICON,ACCOUNT_ICON, PRIVACY_ICON, FEED_BACK_ICON, BELL_ICON, MENU_ICON, iconSearch, } from "./assets";
import LinearGradient from "react-native-linear-gradient";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { Colors, dimensions } from "../../../components/src/utils";

//@ts-ignore
import Drawer from "react-native-drawer";
import ActionButton from "react-native-action-button";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start

// Merge Engine - Artboard Dimension  - End
import Loader from "../../../components/src/Loader";

// Customizable Area End

import AdminConsole3Controller, {
  Props,
  configJSON,
} from "./AdminConsole3Controller";

export default class CoachList extends AdminConsole3Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
   
   
    // Customizable Area End
  }
  
  // Customizable Area Start

  renderCoachDrawer = () => {
    return (
      <SafeAreaView style={styles.containerDrawer}>
        <View style={styles.drHomeContainer}>
          <View style={styles.headerImg}>
            <Image style={styles.ProfileImg} source={this.state.prifileimage?{uri: this.state.prifileimage}:dummyPROFILE_ICON} />
            <View style={styles.ProfileHeader}>
              <Typography font="MED" color={"white"} size={18}>{this.state.full_name}</Typography>
             </View>
          </View>
          <View style={styles.lineview}></View>
          <TouchableOpacity
            style={styles.accoutHeaderbtn}
            testID="profile_click"
            onPress={() => this.props.navigation.navigate("UserProfile", { role: "admin" })}
          >
            <Image style={styles.accountImg} source={ACCOUNT_ICON} />
            <Typography size={17} color={"white"} >Account Settings</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeaderbtn}
            onPress={() => this.props.navigation.navigate("SendPushnotification")} 
            testID="sendNotify_click"
            >
            <Image style={styles.accountImg} source={BELL_ICON} />
            <Typography size={17} color={"white"}>Push Notifications</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeaderbtn}
            onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
            testID="Privacy_click"
          >
            <Image style={styles.accountImg} source={PRIVACY_ICON} />
            <Typography size={17} color={"white"}>Privacy Policy</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeaderbtn}
            onPress={() => this.props.navigation.navigate("UserFeedback")}
            testID="feedback_click"
          >
            <Image style={styles.accountImg} source={FEED_BACK_ICON} />
            <Typography size={17} color={"white"}>Feedback</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeaderbtn}
            onPress={this.logOut}
            testID="logout_click"
          >
            <Image style={styles.accountImg} source={LOGOUT_ICON} />
            <Typography size={17} color={"white"}>Logout</Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  renderList = () => {
  return(
  <>  
  {this.state.ugList.map((item, index) => {
      const {code,enrolled,full_name}=item?.attributes?.employee_details;
     
      return(
        <View key={item.id}>
    
            <View style={[styles.appointment,{height:90,minHeight:85,maxHeight:95}]}
             >
            <View style={[styles.row, styles.mb,{justifyContent:'space-between',right:5}]}>
            <Text style={[styles.statusText, { width: '60%' ,color:'#9A6DB2'}]} numberOfLines={1}>{full_name}</Text>
            
              <Typography color="greyText" size={11} font="REG">{"Code: "}{code}</Typography>
           
            </View>
            
            <View style={[{flex:1,justifyContent:'flex-end',alignItems:'flex-end',marginTop:0,right:5}]}>
               <Typography color="greyText" size={11} font="REG">{"Enrolled on: "}{enrolled}</Typography>
            </View>
          </View>
      
    
        </View>
        )
    })}

   </>
   )
  }
  renderCoachList = () => {
    return(
    <>  
    {this.state.coachList.map((item, index) => {
        const {enrolled,full_name,id,image}=item?.attributes?.coach_details;
       
        return(
          <View key={item.id}>
      
              <TouchableOpacity testID={`coachid${index}`} style={[styles.appointment,{height:90,minHeight:85,maxHeight:95,alignItems:'center'}]} 
              onPress={()=>this.props.navigation.navigate('AddNewCoach',{ usertype:'EditCoaches',id:id})}
              >
              <View style={[styles.row, styles.mb,{justifyContent:'flex-start',alignItems:'flex-start'}]}>
                <Image source={image?{uri:image}:dummyPROFILE_ICON} style={{width:60,height:60,borderRadius:30}}></Image>
                <View style={{flex:1,width:dimensions.wp(50)}}>
                <Text style={[styles.statusText, { width: '80%' ,color:'#9A6DB2'}]} numberOfLines={1}>{full_name}</Text>
            
                <Typography
                  color="greyText"
                  size={12}
                  font="MED"
                  style={[styles.statusText,{marginTop:1}]}
                >
                  {full_name}
                </Typography>
                  </View>
                  <View style={{flex:1,alignItems:'flex-end',justifyContent:"flex-end",right:5}}>
                  <Typography color="greyText" size={11} font="REG">{"ID: "}{id}</Typography>
                  <View style={styles.fullFlexuser} />
                  <Typography color="greyText" size={11} font="REG" style={[{marginTop:5}]}>{"Enrolled on: "}{enrolled}</Typography>
           
                </View>
              </View>
             
             
            </TouchableOpacity>
        
      
          </View>
          )
      })}
  
     </>
     )
    }
    renderCompanyList = () => {
      return(
      <>  
      {this.state.companyList.map((item, index) => {
          const {address,name,id,hr_code,company_image,company_date}=item?.attributes;
         
          return(
            <View key={item.id}>
        
                <TouchableOpacity  style={[styles.appointment,{height:90,minHeight:85,maxHeight:100,alignItems:'center'}]} 
                onPress={this.props.navigation?.navigate?.bind(this,'DetailComView',{id:id})}>
                <View style={[styles.row, styles.mb,{justifyContent:'flex-start',alignItems:'flex-start'}]}>
                <Image source={company_image?{uri:company_image}:dummyPROFILE_ICON} style={{width:60,height:60,borderRadius:30}}></Image>
                 <View style={{flex:1,width:dimensions.wp(50)}}>
                <Text style={[styles.statusText, { width: '80%' ,color:'#9A6DB2'}]} numberOfLines={1}>{name}</Text>
            
                  <Typography
                    color="darkviolet"
                    size={12}
                    font="MED"
                    style={[styles.statusText,{marginTop:1}]}
                  >
                    {address}
                  </Typography>
                  </View>
                  
               <View style={{alignItems:'flex-end',justifyContent:"flex-end",right:5}}>
                  <Typography color="greyText" size={11} font="REG" style={[{marginTop:5}]}>{"Code: "}{hr_code}</Typography>
                  <View style={styles.fullFlexuser} />
                  <Typography color="greyText" size={11} font="REG" style={[{marginTop:5,}]}>{"Enrolled on: "}{company_date}</Typography>
           
                </View>
                </View>
                
                
              </TouchableOpacity>
          
        
            </View>
            )
        })}
    
       </>
       )
      }
  async componentDidMount() {
     this.setState({userType:this.props.navigation.getParam("usertype")},()=>{
  
      this.getAllDataList();
    })
   
    
  }


  // Customizable Area End

  render() {
    // Customizable Area Start
    const colordata=["#9C6FB4", "#9C6FB4"];
    // Merge Engine - render - Start
    return (
      <Drawer ref={(ref: any) => { this.drawerRef = ref; }}
      type="overlay"
      tapToClose={true}
      openDrawerOffset={0.35}
      content={this.renderCoachDrawer()}
      style={{ flex: 1, backgroundColor: "#9A6DB2", }}
      testID="btnOpenDrawer"
    >
        <SafeAreaView style={styles.containerview}>
             <LinearGradient
              colors={colordata}
             
              style={styles.coachheader}
            >
             
           <View style={[styles.row, styles.marbottom, styles.pad]}>
                <TouchableOpacity testID="btnDrawer" onPress={() => this.drawerRef?.open?.()}>
                  <Image source={MENU_ICON} style={styles.backbtnIcon} />
                </TouchableOpacity>
                <Typography
                  style={styles.fullFlexuser}
                  color="white"
                  font="MED"
                  size={18}
                >
                 {this.state.userType}
                </Typography>
              </View>
             
            </LinearGradient>
            <View style={[styles.row, styles.mb, styles.pad,{backgroundColor:'#9ECCFF',height:dimensions.hp(0.9),}]}/>
                
             <View style={{height: dimensions.hp(10),marginHorizontal:4,marginTop:0, }}>
            <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width:dimensions.wp(70),
                backgroundColor: "#F5F5F5",
                borderRadius: 10,
                height: 40,
                flexDirection: "row",
                elevation: 5,
                margin:10,
                borderColor:'#9A6DB2',
                borderWidth:0.5,
              }}
            >
             
              <TextInput
                style={{
                  textAlign: "left",
                  flex: 1,
                  paddingLeft: 10,
                  fontSize: 15
                }}
                testID="txtSearchstr"
                onChangeText={(val) => this.setState({searchString:val})}
                value={this.state.searchString}
                underlineColorAndroid="transparent"
                allowFontScaling={false}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
            style={{
              height: 40,
              borderWidth:0.5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              // flex: 0.2,
              width:dimensions.wp(15),
              backgroundColor: "#F5F5F5",
              margin:10,
              borderColor:'#9A6DB2'
            }}
            onPress={()=>this.onChangeTextClick()}
            testID="btnSearch"
          >
            <Image
                source={iconSearch}
                style={{ height: 20, width: 20,  }}
              />
              </TouchableOpacity>
            </View>
            </View>
            <View style={ {backgroundColor:'pink',flex: 1,marginHorizontal:4}}>
            <View style={[styles.containermain,]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
            
            >
             
            { this.state.userType=="User Groups"&& this.renderList()}
            { this.state.userType=="Companies"&& this.renderCompanyList()}
            { this.state.userType=="Coaches"&& this.renderCoachList()}
           
              <View style={{ flex: 1, height: 100 }}>
                {this.state.loading ? (
                  <Loader loading={this.state.loading} />
                ) : null}
              </View>
            </ScrollView>
          { this.state.userType!="User Groups"&& <ActionButton
          style={{
            marginRight: 2,
            alignItems: "flex-end",
            justifyContent:'flex-end'
            // bottom: -15
          }}
          buttonColor="#9A6DB2"
          {...this.NavigateBaseOnUserType}
          testID="btnNavigation"
        />
        }

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
  appointment: {
    marginHorizontal: dimensions.wp(4),
    marginVertical: dimensions.hp(1),
    backgroundColor: '#fff',
    borderColor: "#D6A6EF",
    borderWidth: 1,
    borderRadius: dimensions.wp(2),
    padding: dimensions.wp(2),
    elevation: 4,
    overflow:'hidden'
  },
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  fullFlexuser: {
    flex: 1,
    marginTop:5
  },
  pad: {
    paddingHorizontal: dimensions.wp(5),
  },
  marbottom:{
    marginBottom: dimensions.hp(2)
  },
  backbtnIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7)
  },
 
 
  mb: {
    marginBottom: dimensions.hp(4)
  },
  containerview: {
    flex: 1,
    backgroundColor: Colors.white
  },
  coachheader: {
    width: dimensions.wp(100),
    paddingTop: dimensions.hp(3),
    borderBottomColor: Colors.greyText,
    borderBottomWidth: 1
  },
  statusText: {
    paddingVertical: dimensions.hp(.5),
    paddingHorizontal: dimensions.wp(3),
    borderRadius: dimensions.wp(3)
  },


  accountImg: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#fff",
    marginRight: dimensions.wp(4)
  },
 
  containerDrawer: {
    flex: 1,
    backgroundColor: "#9A6DB2",
    elevation: 5
  },
  ProfileHeader: {
    marginVertical: dimensions.hp(1)
  },
  accoutHeaderbtn: {
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
 
  ProfileImg: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(40),
    resizeMode: "cover",
    borderColor: "#c2b2d8"
  },

  lineview: {
    width: Scale(210),
    height: Scale(1),
    borderWidth: Scale(0.3),
    borderColor: "#DDD",
    marginTop: Scale(30),
    alignSelf: "center"
  },

  headerImg: {
    alignItems: "center",
    justifyContent: "center"
  },

 });
// Customizable Area End