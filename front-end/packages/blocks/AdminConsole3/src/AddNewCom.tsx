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
import AddNewComController from "./AddNewComController";
import * as IMG_CONST from './assets';
import styles from '../../user-profile-basic/src/UserProfileBasicBlockStyles';
import Loader from '../../../components/src/Loader'
import Scale from "../../../components/src/Scale";
import Drawer from "react-native-drawer";
import Typography from "../../../components/src/Typography";

// Customizable Area End

export default class AddNewCom extends AddNewComController {
  // Customizable Area Start
  renderDrawer = () => {
    return (
      <SafeAreaView style={styles.containerFilter}>
        <View style={styles.HomeContainer}>
          <View style={styles.headerImage}>
            <Image style={styles.ProfileImage} source={this.state.prifileimage?{uri: this.state.prifileimage}:IMG_CONST.dummyPROFILE_ICON} />
            <View style={styles.ProfileTextHeader}>
              <Typography font="MED" color={"white"} size={18}>{this.state.user_name}</Typography>
             </View>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity
            testID="profile_click"
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("UserProfile", { role: "admin" })}
          >
            <Image style={styles.account} source={IMG_CONST.ACCOUNT_ICON} />
            <Typography size={17} color={"white"} >Account Settings</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            testID="sendNotify_click"
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("SendPushnotification")}
            >
            <Image style={styles.account} source={IMG_CONST.BELL_ICON} />
            <Typography size={17} color={"white"}>Push Notifications</Typography>
          </TouchableOpacity>
          <TouchableOpacity
           testID="Privacy_click"
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
          >
            <Image style={styles.account} source={IMG_CONST.PRIVACY_ICON} />
            <Typography size={17} color={"white"}>Privacy Policy</Typography>
          </TouchableOpacity>
          <TouchableOpacity
             testID="feedback_click"
            style={styles.accoutHeader}
            onPress={() => this.props.navigation.navigate("UserFeedback")}
          >
            <Image style={styles.account} source={IMG_CONST.FEED_BACK_ICON} />
            <Typography size={17} color={"white"}>Feedback</Typography>
          </TouchableOpacity>
          <TouchableOpacity
             testID="logout_click"
            style={styles.accoutHeader}
            onPress={this.logOut}
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
          <TouchableOpacity testID="btnOpenDrawer" onPress={() =>this.drawerRef?.open?.()}>
            <Image style={styles.arrow} source={IMG_CONST.MENU_ICON} />
          </TouchableOpacity>
          <Text style={styles.accountText}>{this.state.role=="Companies"?"Add New Company":"Edit Company Profile"}</Text>
        </LinearGradient>
      </SafeAreaView>
     
    )
  }

  renderProfile = () => {
      return (
      <View style={styles.profileHeader}>
        <View style={styles.nameHeader}>
          <Text style={styles.name}>Company Name</Text>
          <View style={[styles.namefield,{borderColor:'#9C6FB4'}]}>
            <TextInput
              testID="txtCompanyName"
              placeholder="Company Name"
              style={[styles.nameTextInput,{}]}
              value={this.state.full_name}
              onChangeText={(text: any) => this.setState({ full_name: text })}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    )
  };

  renderEmail = () => {
    console.log(this.state.categoriesArray.length,";en")
    const editComp = ["Companies"].includes(this.state.role);
    return (
      <View style={styles.emailHeader}>
        <Text style={styles.name}>Email</Text>
        <View style={[styles.emailBox,{borderColor:'#9C6FB4'}]}>
          <TextInput
            testID="txtEmail"
            placeholder="Please Enter Email"
            autoCapitalize="none"
            style={styles.nameTextInput}
            value={this.state.email}
            onChangeText={(text: any) => this.setState({ email: text })}
            autoCorrect={false}
           
          />
        </View>
        <Text style={styles.access}>Address</Text>
         <View style={[styles.emailBox,{borderColor:'#9C6FB4'}]}>
          <TextInput
            testID="txtAddress"
            placeholder="Please Enter Address"
            autoCapitalize="none"
            style={styles.nameTextInput}
            value={this.state.address}
            onChangeText={(text: any) => this.setState({ address: text })}
            autoCorrect={false}
           
          />
          </View>
   
        {editComp? null: (<>
        <Text style={styles.access}>Employee Access code</Text>
        <View style={[styles.emailBox,{borderColor:'#9C6FB4',backgroundColor:'#DEDEDE'}]}>
          <TextInput
            placeholder="Please Enter Access code"
            style={styles.nameTextInput}
            value={this.state.emp_access_code}
            editable={false}
           />
        </View>

        <Text style={styles.access}>HR Access code</Text>
        <View style={[styles.emailBox,{borderColor:'#9C6FB4',backgroundColor:'#DEDEDE'}]}>
          <TextInput
            placeholder="Please Enter Access code"
            style={styles.nameTextInput}
            value={this.state.access_code}
            editable={false}
           />
        </View>
       
        <View 
        style={[{ marginTop: Scale(25)}]}
        >
     <TouchableOpacity testID="btnHrList"
     style={[styles.emailBox,{borderColor:'#9A6DB2',alignItems:'center',justifyContent:'center',backgroundColor:'#FAF1FF'}]}
      onPress={() => {
        console.log("Pressed the HRLS",this.props.navigation)
        this.props.navigation.navigate("HRListsScreen",{id:this.state.compid});
      }} 
     >
        <Text style={[styles.saveText,{color:'#9C6FB4'}]}>HR List</Text>
      </TouchableOpacity>
        </View>
        </>)}
      
       
   
    
      </View>
    )
  };



  renderButton = () => {
     return (
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
     <TouchableOpacity testID="btnCreateCompany" style={[styles.saveButton, { backgroundColor:  "#9C6FB4" ,flexDirection:'row'}]} 
      onPress={() => this.creteNewCompDetails()} 
     >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="btnDiscard" style={[styles.saveButton, { backgroundColor:  "#fff" ,flexDirection:'row',borderColor:'#9C6FB4',borderWidth:1}]} 
      onPress={() => this.setState({full_name:"",email:"",address:""})} 
     >
        <Text style={[styles.saveText,{color:'#9C6FB4'}]}>Discard</Text>
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
      testID="btnOpenDrawer"
    >
      {this.state.loading? <Loader loading={this.state.loading} />:

      <View style={styles.container}>
        {this.renderHeader()}
        <ScrollView bounces={false}>
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
