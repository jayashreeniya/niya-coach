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
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import AddNewCoachController from "./AddNewCoachController";

import Drawer from "react-native-drawer";

import * as IMG_CONST from './assets';
import styles from '../../user-profile-basic/src/UserProfileBasicBlockStyles';
import Loader from '../../../components/src/Loader'
import Scale from "../../../components/src/Scale";
import Typography from "../../../components/src/Typography";
// Customizable Area End

export default class AddNewCoach extends AddNewCoachController {
  // Customizable Area Start
  renderHeader = () => {
    return (
      <SafeAreaView>
        <LinearGradient colors={["#9C6FB4", "#9C6FB4"]} start={{ x: 0.5, y: 0.6 }} end={{ x: 0.9, y: 0 }} style={styles.header}>
          <TouchableOpacity  onPress={() => this.drawerRef?.open?.()}>
            <Image style={styles.arrow} source={IMG_CONST.MENU_ICON} />
          </TouchableOpacity>
          <Text style={styles.accountText}>{this.state.usertype == "Coaches" ? "Add Coach" : "Coach Details"}</Text>
        </LinearGradient>
      </SafeAreaView>
    )
  }

  renderProfile = () => {
    return (
      <View style={styles.profileHeader}>
        <View style={styles.profile}>
          <Image style={styles.profileIcon} source={this.state.prifileimage ? { uri: this.state.prifileimage } : IMG_CONST.dummyPROFILE_ICON} />

          <TouchableOpacity testID="btnProfileImg" style={styles.editHeader}
            onPress={() => this.profilePicImage()}
          >
            <Image style={styles.edit} source={IMG_CONST.EDIT_ICON} />
          </TouchableOpacity>
        </View>
        <View style={styles.nameHeader}>
          <Text style={styles.name}>Full Name</Text>
          <View style={[styles.namefield, { borderColor: '#9C6FB4' }]}>
            <TextInput
              testID="txtFullName"
              placeholder="Full Name"
              style={[styles.nameTextInput, {}]}
              value={this.state.coach_full_name}
              onChangeText={(text: any) => this.setState({ coach_full_name: text })}
              autoCorrect={false}
              autoCapitalize="none"
           />
          </View>
        </View>
      </View>
    )
  };


  renderExperticecategoriesArray=()=>{
    if(this.state.categoriesArray.length <= 0 ){
      return(
        <TextInput
        placeholder="Please Select Expertise"
        style={[styles.nameTextInput, { color: '#000' }]}
        editable={false}
      />
      )
    }
    else if(this.state.categoriesArray.length < 2){
      return(
        <View style={[{ alignItems: 'flex-start', flexDirection: 'row' }]}>

          {this.state.categoriesArray.map(
            (item: any, index: number) => {
              console.log(index, "index");
              return (
                <Text key={item?.id} style={[{ textAlign: 'left', fontSize: 13, marginLeft: index == 0 ? 15 : 4, marginRight: 10 }]}>
                  {item?.specialization}
                </Text>

              );
            }
          )}
        </View>
      )
    }
    else{
      return(
        <Text style={[{ textAlign: 'left', fontSize: 13, marginLeft: 15, marginRight: 10 }]}>
          Multiple Options Selected
        </Text>
        )
   
    }
  }
  renderExpertise=()=>{
   return( 
   <View>
    <Text style={styles.access}>Expertise</Text>
    <TouchableOpacity testID="btnExpertises" onPress={() => this.setState({ isData: !this.state.isData })}>

      <View style={[styles.backHeader, { borderColor: '#9C6FB4' }]}>
        {this.renderExperticecategoriesArray()}
        <Image style={styles.back} source={IMG_CONST.BACKARROW_ICON} />
      </View>
    </TouchableOpacity>

    {this.state.isData &&

      <View style={[styles.VerifictionBoxInside, { marginBottom: Scale(40), height: Scale(200) }]}>
        <FlatList
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item }) => this.renderFaltList(item)}
        />
      </View>
    }
  </View>
  )
  }
  renderEmail = () => {
    return (
      <View style={styles.emailHeader}>
        <Text style={styles.name}>Email</Text>
        <View style={[styles.emailBox, { borderColor: '#9C6FB4' }]}>
          <TextInput
            testID="txtEmail"
            placeholder="Please Enter Email"
            autoCapitalize="none"
            style={styles.nameTextInput}
            value={this.state.coach_email}
            onChangeText={(text: any) => this.setState({ coach_email: text })}
            editable={this.state.coach_id ? false : true}
            autoCorrect={false}
           
          />
        </View>

        {this.renderExpertise()}
        
        <Text style={styles.access}>Mobile Number</Text>
        <View style={styles.mobile}>
          <View style={[styles.smallBox, { borderColor: '#9C6FB4' }]}>
            <TextInput
              testID="txtCountryCode"
              placeholder="+91"
              placeholderTextColor="#000"
              style={styles.nameTextInput}
              value={this.state.country_code}
              onChangeText={(text: any) => this.setState({ country_code: text })}
              editable={false}
            />
          </View>
          <View style={[styles.bigBox, { borderColor: '#9C6FB4' }]}>
            <TextInput
              testID="txtMobileNo"
              placeholder="Please Enter mobile number "
              style={styles.nameTextInput}
              maxLength={10}
              value={this.state.phone_number}
              onChangeText={(text: any) => this.setState({ phone_number: text })}
              keyboardType={"numeric"}
            />
          </View>
        </View>
        {/* password */}
       {this.state.usertype=="Coaches"?(
       <> 
       <Text style={styles.access}>Password</Text>

        <View style={[styles.backHeader, { borderColor: '#9C6FB4' }]}>
          <TextInput
            testID={"txtInputPassword"}
            style={[styles.bgPasswordInput]}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={"Password"}
            {...this.txtInputPasswordProps}
          />

          <TouchableOpacity
            testID={"btnPasswordShowHide"}
            style={styles.passwordShowHide}
            {...this.btnPasswordShowHideProps}
          >
            <Image
              testID={"imgEnablePasswordField"}
              style={[styles.imgPasswordShowhide, { marginRight: 13 }]}
              {...this.imgEnablePasswordFieldProps}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.access}>Confirm Password</Text>

        <View style={[styles.backHeader, { borderColor: '#9C6FB4' }]}>


          <TextInput
            testID={"txtInputConfirmPassword"}
            style={styles.bgPasswordInput}

            placeholder={"Confirm Password"}
            {...this.txtInputConfirmPasswordProps}
            autoCorrect={false}
            autoCapitalize="none"
          />

          <TouchableOpacity
            testID={"btnConfirmPasswordShowHide"}
            style={{ alignSelf: "center", }}
            {...this.btnConfirmPasswordShowHideProps}
          >
            <Image
              testID={"imgEnableRePasswordField"}
              style={[styles.imgPasswordShowhide, { marginRight: 13 }]}
              {...this.imgEnableRePasswordFieldProps}
            />
          </TouchableOpacity>
        </View>
        </>
        )
        :null}
      </View>
    )
  };

  renderFaltList = (item: any) => {
    return (
      <TouchableOpacity
        testID={`category${item.id}`}
        key={item.id}
        style={{ flexDirection: 'row', alignItems: 'center', margin: Scale(10), flex: 1 }}
        onPress={() => this.clickCategory(item, item.id)}
      >
        <Image
          style={{
            height: 20,
            width: 20,
            resizeMode: "contain"
          }}
          source={this.state.selectedCategoryID.includes(item.id) ?
            IMG_CONST.Check_ICON : IMG_CONST.Unchek_ICON}
        />
        <Text style={{ textAlign: 'center', color: "gray", marginHorizontal: Scale(10) }}>{item.specialization}</Text>
      </TouchableOpacity>

    )
  };

  renderButton = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center', marginTop: Scale(80) }}>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: "#9C6FB4",}]}
          onPress={() => this.onPressNewDetails()}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: "#fff", flexDirection: 'row', borderColor: '#9C6FB4', borderWidth: 1 }]}
          onPress={() => {
            {this.state.usertype=="Coaches"?( this.setState({ coach_full_name: "", coach_email: "", phone_number: "", password: "", reTypePassword: "", categoriesArray: [], selectedCategoryID: [], }))
             :this.getCoachDetails();}
           

          }
          }>
          <Text style={[styles.saveText, { color: '#9C6FB4' }]}>Discard</Text>
        </TouchableOpacity>
      </View>
    )
  };

  renderDrawer = () => {
    console.log(this.state.full_name);
    return (
      <SafeAreaView style={styles.containerFilter}>
        <View style={styles.HomeContainer}>
          <View style={styles.headerImage}>
            <Image style={styles.ProfileImage} source={this.state.user_image ? { uri: this.state.user_image } : IMG_CONST.dummyPROFILE_ICON} />
            <View style={styles.ProfileTextHeader}>
              <Typography font="MED" color={"white"} size={18}>{this.state.full_name}</Typography>
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
        {this.state.loading ? <Loader loading={this.state.loading} /> :

<KeyboardAvoidingView behavior={Platform.OS=="ios"?"padding":undefined} style={styles.container}>
            {this.renderHeader()}
            <ScrollView style={{ flex: 1, marginBottom: Scale(20) }} bounces={false}>
              {this.renderProfile()}
              {this.renderEmail()}
              {this.renderButton()}

            </ScrollView>



          </KeyboardAvoidingView>
        }
      </Drawer>
    )
  }
  // Customizable Area End
}
