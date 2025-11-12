import React from "react";
// Customizable Area Start
import {
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal
} from "react-native";
import ContactUsController from "./ContactUsController";
import * as IMG_CONST from './assets';
import styles from './ContactUsStyle'
import Loader from "../../../components/src/Loader";
// Customizable Area End

export default class ContactUsScreen extends ContactUsController {
  // Customizable Area Start
  renderHeader = () => {
    return (
      <SafeAreaView>
        <TouchableOpacity onPress={() => this.props.navigation.goBack("")}>
          <Image style={styles.arrow} source={IMG_CONST.ARROW_ICON} />
        </TouchableOpacity>
        <Image style={styles.smilee} source={IMG_CONST.SMILLE_ICON} />
        <Text style={styles.niya}>NIYA</Text>
        <Text style={styles.get}>Get in Touch</Text>
      </SafeAreaView>
    )
  };

  renderTextField = () => {
    return (
      <View style={styles.backHeaderText}>
        <Text style={styles.access}>Your Message</Text>
        <TextInput
          testID="msgDesc"
          placeholder="Please Enter "
          multiline={true}
          value={this.state.isMessage}
          onChangeText={(text) => this.setState({ isMessage: text })}
          style={{ ...styles.message, ...{ color: "#9b6db3", textAlign: 'left', textAlignVertical: 'top', paddingLeft: 10 } }}
        />
      </View>
    )
  };

  renderButton = () => {
    return (
      <TouchableOpacity testID="userDataSend" style={styles.saveButton} onPress={() => this.contactUs()} disabled={this.state.loading}>
        <Text style={styles.saveText}>Send Message</Text>
      </TouchableOpacity>
    )
  };




  // Customizable Area End

  // Customizable Area Start
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.renderHeader()}
          {this.renderTextField()}
        </ScrollView>
        {this.renderButton()}
        <Loader loading={this.state.loading} />
        <Modal
          animationType="slide"
          visible={this.state.isResModal}
          onRequestClose={() => {
            this.setState({ isResModal: false })
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ fontSize: 20, textAlign: 'center', color: '#1B1B1B' }}>{""} </Text>
              <Text style={{ fontSize: 15, textAlign: 'left', color: '#616161', margin: 10, lineHeight: 18 }}>{this.state.modalSubtitle}</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>


                <TouchableOpacity
                  style={[styles.modalButton,]}
                  onPress={() => {
                    this.setState({ isResModal: false });
                    this.props.navigation.goBack(null)
                  }
                  } >
                  <Text style={[styles.textStyle, { color: '#fff' }]}>OK</Text>
                </TouchableOpacity>

              </View>


            </View>
          </View>
        </Modal>
      </View>
    )
  }
  // Customizable Area End
}
