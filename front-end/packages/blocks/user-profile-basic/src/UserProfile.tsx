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
  StatusBar,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import UserProfileController  from "./UserProfileController";
import * as IMG_CONST from './assets';
import styles from './UserProfileBasicBlockStyles'
import Loader from '../../../components/src/Loader'
import Scale from "../../dashboard/src/Scale";
// Customizable Area End

export default class UserProfile extends UserProfileController {
  // Customizable Area Start
  role: string = this.props.navigation.getParam("role");

  renderHeader = () => {
    const hrOrCoach = ["hr", "coach","admin"].includes(this.role);
    return (
      <SafeAreaView>
        <LinearGradient colors={hrOrCoach? ["#9C6FB4", "#9C6FB4"]: ['#555ab6', '#7e85d5']} start={{ x: 0.5, y: 0.6 }} end={{ x: 0.9, y: 0 }} style={styles.header}>
          <TouchableOpacity testID="btnHeaderPress" onPress={() => this.props.navigation.goBack()}>
            <Image style={styles.arrow} source={IMG_CONST.ARROW_ICON} />
          </TouchableOpacity>
          <Text style={styles.accountText}>Account Settings</Text>
        </LinearGradient>
      </SafeAreaView>
    )
  }

  renderProfile = () => {
    return (
      <View style={styles.profileHeader}>
        <View style={styles.profile}>
          <Image style={styles.profileIcon} source={this.state.prifileimage ? { uri: this.state.prifileimage } : IMG_CONST.PROFILE_ICON} />
          <TouchableOpacity style={styles.editHeader} onPress={() => this.profilePicImage()} >
            <Image style={styles.edit} source={IMG_CONST.EDIT_ICON} />
          </TouchableOpacity>
        </View>
        <View style={styles.nameHeader}>
          <Text style={styles.name}>Full Name</Text>
          <View style={styles.namefield}>
            <TextInput
              testID="txtInputFullName"
              placeholder="Full Name"
              maxLength={30}
              style={styles.nameTextInput}
              value={this.state.full_name}
              onChangeText={(text: any) => this.setState({ full_name: text })}
            />
          </View>
        </View>
      </View>
    )
  };

  renderEmail = () => {
    const hrOrCoach = ["hr", "coach","admin"].includes(this.role);
    return (
      <View style={styles.emailHeader}>
        <Text style={styles.name}>Email</Text>
        <View style={styles.emailBox}>
          <TextInput
            testID="txtInputEmail"
            placeholder="Please Enter Email"
            autoCapitalize="none"
            style={styles.nameTextInput}
            value={this.state.email}
            onChangeText={(text: any) => this.setState({ email: text })}
          />
        </View>

        {hrOrCoach? null: (<>
        <Text style={styles.access}>Access Code</Text>
        <View style={styles.emailBox}>
          <TextInput
            testID="txtInputaccess_code"
            placeholder="Please Enter Access code"
            style={styles.nameTextInput}
            value={this.state.access_code}
            editable={false}
            onChangeText={(text: any) => this.setState({ access_code: text })}
          />
        </View>
        </>)}
       {this.role=="admin"?null: (<View>
          <Text style={styles.access}>Gender</Text>
          <TouchableOpacity  onPress={() => this.setState({ isData: !this.state.isData })}>
         
          <View style={styles.backHeader}>
         
            <TextInput
              testID="selectTxtInput"
              placeholder="Please Select Gender"
              value={this.state.gender}
              placeholderTextColor="#000"
              onChangeText={(text) => this.setState({ gender: text })}
              style={[styles.nameTextInput,{color:'#000'}]}
              editable={false}
              />
                <Image style={styles.back} source={IMG_CONST.BACKARROW_ICON} />
                </View>
            </TouchableOpacity>
         
          {this.state.isData &&

            <View style={styles.VerifictionBoxInside}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={this.state.isdata}
                renderItem={({ item }) => this.renderFaltList(item)}
              />
            </View>
          }
        </View>)
        }
      {this.role=="admin"?null:(<><Text style={[styles.access,{marginTop:(Platform.OS=="ios"&&this.state.isData)?100:Scale(30)}]}>Mobile Number</Text>
        <View style={styles.mobile}>
          <View style={styles.smallBox}>
            <TextInput
              placeholder="+91"
              placeholderTextColor="#000"
              style={styles.nameTextInput}
              value={this.state.country_code}
              onChangeText={(text: any) => this.setState({ country_code: text })}
              editable={false}
            />
          </View>
          <View style={styles.bigBox}>
            <TextInput
              placeholder="Please Enter mobile number "
              style={styles.nameTextInput}
              maxLength={10}
              value={this.state.phone_number}
              onChangeText={(text: any) => this.setState({ phone_number: text })}
              keyboardType={"numeric"}
           />
          </View>
        </View>
        </>)
        }
      </View>
    )
  };

  renderFaltList = (item: any) => {
    return (
      <TouchableOpacity onPress={() => this.setState({ gender: item.name, isData: false })}>
        <Text style={styles.nameText}>{item.name}</Text>
      </TouchableOpacity>
    )
  };

  renderButton = () => {
    const hrOrCoach = ["hr", "coach","admin"].includes(this.role);
    return (
     <TouchableOpacity testID="userDataSave" style={[styles.saveButton, { backgroundColor: hrOrCoach? "#9C6FB4": "#8289d9",marginTop:Scale(80) }]} onPress={() => this.onPressNewDetails()} >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    )
  };
  // Customizable Area End

  // Customizable Area Start
  render() {
    console.log(this.role!="admin","@@@@@@@checking treue")
    return (
      <>
      <StatusBar translucent backgroundColor="transparent"/>
      {this.state.isLoading? <Loader loading={this.state.isLoading} />:

      <View style={styles.container}>
        {this.renderHeader()}
        <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <ScrollView>
          {this.renderProfile()}
          {this.renderEmail()}
          {this.renderButton()}
     
        </ScrollView>
    </KeyboardAvoidingView>
       
       
       </View>
      }
     </>
    )
  }
  // Customizable Area End
}
