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
  Platform
} from "react-native";
import SendNotificationController from "./SendNotificationController";
import LinearGradient from 'react-native-linear-gradient';
import * as IMG_CONST from './assets';
import styles from '../../user-profile-basic/src/ContactUsStyle';
import style1 from '../../user-profile-basic/src/UserProfileBasicBlockStyles';
import Loader from "../../../components/src/Loader";
import Scale from "../../dashboard/src/Scale";
import { dimensions } from "../../../components/src/utils";
import Typography from "../../../components/src/Typography";
// Customizable Area End

export default class SendPushnotification extends SendNotificationController {
  // Customizable Area Start

  renderHeader = () => {
    return (
      <SafeAreaView>
        <LinearGradient colors={["#9C6FB4", "#9C6FB4"]} start={{ x: 0.5, y: 0.6 }} end={{ x: 0.9, y: 0 }} style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image style={[styles.arrow, { marginLeft: 0 }]} source={IMG_CONST.ARROW_ICON} />
          </TouchableOpacity>
          <Typography size={16} color={'white'}>Notification</Typography>
        </LinearGradient>
        <View style={[styles.row, styles.mb, styles.pad, { backgroundColor: '#9ECCFF', height: dimensions.hp(0.9), }]} />

      </SafeAreaView>
    )
  }

  renderTextField = () => {
    return (
      <View style={[styles.backHeaderText,]}>
        <Text style={[styles.access, { color: 'gray' }]}>Description</Text>
        <TextInput
          placeholder="Please Enter "
          multiline={true}
          value={this.state.description}
          onChangeText={(text) => this.setState({ description: text })}
          style={{ ...styles.message, ...{ color: "#9b6db3", textAlign: 'left', textAlignVertical: 'top', paddingLeft: 10, borderWidth: 1 } }}
          testID="notificationTxt"
       />

      </View>
    )
  };


  renderEmail = () => {
    return (
      <View style={[style1.emailHeader, { marginTop: Scale(10), }]}>
        <Text style={[style1.name, { fontSize: Scale(15), color: "gray", }]}>Title</Text>
        <View style={[style1.emailBox, { borderColor: '#9A6DB2' }]}>
          <TextInput
            placeholder="Please Enter Title"
            autoCapitalize="none"
            placeholderTextColor="gray"
            style={[styles.nameTextInput, { color: "#9b6db3" }]}
            value={this.state.title}
            onChangeText={(text: any) => this.setState({ title: text })}
            testID="notificationTitle"
          />
        </View>


      </View>


    )
  };

  renderListCategory = () => {
    return (
      <View style={[style1.emailHeader, { marginTop: Scale(5), height: Scale(200) }]}>
        <Text style={[styles.access, { color: 'gray' }]}>Category</Text>
        <TouchableOpacity testID="userCat"  onPress={() => this.setState({ isData: !this.state.isData })}>

          <View style={[style1.backHeader, { borderColor: '#9A6DB2', }]}>

            <TextInput
              placeholder="Please Select Category"
              value={this.state.category}
              placeholderTextColor="gray"
              onChangeText={(text) => this.setState({ category: text })}
              style={[styles.nameTextInput, { color: '#9b6db3' }]}
              editable={false}
              testID="selectTxtInput"
            />
            <Image style={style1.back} source={IMG_CONST.BACKARROW_ICON} />
          </View>
        </TouchableOpacity>

        {this.state.isData && (

          <View style={[style1.VerifictionBoxInside, { marginBottom: Scale(40), height: Scale(100), }]}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={this.state.isdata}
              renderItem={({ item }) => this.renderFaltList(item)}
              testID="renderCatData"
            />
          </View>
        )
        }
      </View>
    )
  }
  renderFaltList = (item: any) => {
    return (
      <TouchableOpacity  testID="selectCategory" onPress={() => this.setState({ category: item.name, isData: false, selectedcat: item.val })}>
        <Text style={[style1.nameText, { color: '#9b6db3' }]}>{item.name}</Text>
      </TouchableOpacity>
    )
  };

  renderButton = () => {
    return (
      <TouchableOpacity  testID="btnSave" style={[styles.saveButton, { width: Scale(100), backgroundColor: "#9C6FB4", top:(Platform.OS=="ios"&&this.state.isData)?5:undefined }]} onPress={() => this.newFnsendNotifcation()} >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    )
  };
  // Customizable Area End

  // Customizable Area Start
  render() {
    return (
      <>
        {this.state.loading ? <Loader loading={this.state.loading} /> :

          <View style={styles.container}>
            {this.renderHeader()}
            <ScrollView>
              {this.renderEmail()}
              {this.renderTextField()}

              {this.renderListCategory()}
              <View style={[style1.emailHeader, { justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: Scale(45), }]}>

                {this.renderButton()}
              </View>

            </ScrollView>


          </View>
        }
      </>
    )
  }
  // Customizable Area End
}