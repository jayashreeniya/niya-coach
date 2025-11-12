// @ts-nocheck
import React from "react";
// Customizable Area Start
import {
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import HRProfileController from "./HRProfileController";
import * as IMG_CONST from './assets';
import styles from '../../user-profile-basic/src/UserProfileBasicBlockStyles';
import Loader from '../../../components/src/Loader'
import Drawer from "react-native-drawer";
import Typography from "../../../components/src/Typography";

// Customizable Area End

export default class HRProfile extends HRProfileController {
  // Customizable Area Start
  renderDrawer = () => {
    return (
      <SafeAreaView style={styles.containerFilter}>
        <View style={styles.HomeContainer}>
          <View style={styles.headerImage}>
            <Image style={styles.ProfileImage} source={this.state.prifileimage?{uri: this.state.prifileimage}:IMG_CONST.dummyPROFILE_ICON} />
            <View style={styles.ProfileTextHeader}>
              <Typography font="MED" color={"white"} size={18}>{this.state.full_name}</Typography>
             </View>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("UserProfile", { role: "admin" })}
            testID="profile_click"
          >
            <Image style={styles.account} source={IMG_CONST.ACCOUNT_ICON} />
            <Typography size={17} color={"white"} >Account Settings</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("SendPushnotification")}
            testID="sendNotify_click"
            >
            <Image style={styles.account} source={IMG_CONST.BELL_ICON} />
            <Typography size={17} color={"white"}>Push Notifications</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
            testID="Privacy_click"
          >
            <Image style={styles.account} source={IMG_CONST.PRIVACY_ICON} />
            <Typography size={17} color={"white"}>Privacy Policy</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("UserFeedback")}
            testID="feedback_click"
          >
            <Image style={styles.account} source={IMG_CONST.FEED_BACK_ICON} />
            <Typography size={17} color={"white"}>Feedback</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accoutHeader}
            onPress={this.logOut}
            testID="logout_click"
          >
            <Image style={styles.account} source={IMG_CONST.LOGOUT_ICON} />
            <Typography size={17} color={"white"}>Logout</Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  renderHeader = () => {
    return (
   
      <SafeAreaView>
        <LinearGradient colors={ ["#9C6FB4", "#9C6FB4"]} start={{ x: 0.5, y: 0.6 }} end={{ x: 0.9, y: 0 }} style={styles.header}>
          <TouchableOpacity testID="btnOpenDrawer" onPress={() => this.drawerRef?.open?.()}>
            <Image style={styles.arrow} source={IMG_CONST.MENU_ICON} />
          </TouchableOpacity>
          <Text style={styles.accountText}>{"HR Profile"}</Text>
        </LinearGradient>
      </SafeAreaView>
     
    )
  }

  renderProfile = () => {
      return (
      <View style={styles.profileHeader}>
     
        <View style={styles.nameHeader}>
          <Text style={styles.name}> Name</Text>
          <View style={[styles.namefield,{borderColor:'#9C6FB4'}]}>
            <TextInput
              testID="txtName"
              placeholder="Name"
              style={[styles.nameTextInput,{}]}
              value={this.state.hr_name}
              onChangeText={(text: any) => this.setState({ hr_name: text ,is_hr_name:true})}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    )
  };

  renderEmail = () => {
     return (
      <View style={styles.emailHeader}>
        <Text style={styles.name}>Email</Text>
        <View style={[styles.emailBox,{borderColor:'#9C6FB4'}]}>
          <TextInput
            testID="txtEmail"
            placeholder="Please Enter Email"
            autoCapitalize="none"
            style={styles.nameTextInput}
            value={this.state.hr_email}
            onChangeText={(text: any) => this.setState({ hr_email: text,is_hr_email:true })}
            autoCorrect={false}
           
          />
        </View>
        <Text style={styles.access}>Mobile Number</Text>
        <View style={styles.mobile}>
      
        <View style={[styles.smallBox, { borderColor: '#9C6FB4' }]}>
            <TextInput
              placeholder="+91"
              placeholderTextColor="#000"
              style={styles.nameTextInput}
              value={"91"}
              editable={false}
            />
          </View>
         <View style={[styles.bigBox,{borderColor:'#9C6FB4'}]}>
          <TextInput
            testID="txtMobile"
            placeholder="Please Enter Mobile Number"
            autoCapitalize="none"
            style={styles.nameTextInput}
            value={this.state.phone_number}
            onChangeText={(text: any) => this.setState({ phone_number: text,is_phone_number:true })}
            maxLength={10} 
            keyboardType={"numeric"}
          />
          </View>
          </View>
   
     
       
   
    
      </View>
    )
  };



  renderButton = () => {
     return (
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
     <TouchableOpacity testID="btnSave" style={[styles.saveButton, { backgroundColor:  "#9C6FB4" ,flexDirection:'row'}]} 
      onPress={() =>
         this.updateCompHRDetails()
        } 
     >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="btnDelete" style={[styles.saveButton, { backgroundColor:  "#fff" ,flexDirection:'row',borderColor:'#9C6FB4',borderWidth:1}]} 
      onPress={() => this.delCompHRDetails()} 
     >
        <Text style={[styles.saveText,{color:'#9C6FB4'}]}>Delete</Text>
      </TouchableOpacity>
      </View>
    )
  };

  // Customizable Area End


  // Customizable Area Start
  render() {
     return (
      <Drawer ref={(ref: any) => { this.drawerRef = ref; }}
      type="overlay"
      tapToClose={true}
      openDrawerOffset={0.35}
      content={this.renderDrawer()}
      style={{ flex: 1, backgroundColor: "#9A6DB2", }}
    >
      {this.state.loading? <Loader loading={this.state.loading} />:

      <View style={styles.container}>
        {this.renderHeader()}
        <ScrollView>
          {this.renderProfile()}
          {this.renderEmail()}
        </ScrollView>
    
        {this.renderButton()}
     
       
       </View>
      }
     </Drawer>
    )
  }
  // Customizable Area End
}
