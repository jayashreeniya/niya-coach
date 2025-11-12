

import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
import Scale from "./Scale";

class ModalPage extends Component {
  state = {
    modalVisible: false,
    secondmodalVisible: false,
    thirdmodalVisible: false,

  };

  setModalVisible = () => {
    this.setState({ modalVisible: false });
    this.setState({ secondmodalVisible: true });
    this.setState({ thirddmodalVisible: true });
  }
  modal = () => {
    this.setState({ thirdmodalVisible: true })
    this.setState({ secondmodalVisible: false })
    this.setState({ modalVisible: false })
  }

  render() {
    const { modalVisible } = this.state;
    const { secondmodalVisible } = this.state;
    const { thirdmodalVisible } = this.state;

    return (
      <View style={styles.centeredView}>
        <Modal
          // animationType="slide"
          animationType={'fade'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>On Which focus area do you want to add goals? </Text>

              <View style={{ height: height / 4.5 }}>
                <View style={{ paddingVertical: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500' }}>Strategic Planning</Text>
                </View>
                <View style={{ paddingVertical: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500' }}>Work life balance</Text>
                </View>
                <View style={{ paddingVertical: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500' }}>Flexibility</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => this.setModalVisible()}
              >
                <Text style={styles.textStyle}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>

        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={secondmodalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible();
          }}
        >

          <View style={styles.centeredView}>
            <View style={styles.modalView2}>
              <Text style={styles.modalText2}>Add your goal</Text>
              <View style={{ height: height / 7 }}>
                <View style={styles.TextInput}>
                  <TextInput />
                </View>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.modal()}
              >
                <Text style={styles.textStyle}>Next</Text>
              </TouchableOpacity>

            </View>
          </View>

        </Modal>

        <Modal
          animationType={'fade'}
          transparent={true}
          visible={thirdmodalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible();
          }}
        >

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText3}> By when you wish to complete?</Text>


              <TouchableOpacity
                style={styles.button}
                onPress={() => this.setState({ thirdmodalVisible: false })}
              >
                <Text style={styles.textStyle}>Next</Text>
              </TouchableOpacity>

            </View>
          </View>

        </Modal>
        <TouchableOpacity
          style={{ height: Scale(35), width: Scale(115), borderRadius: 10, borderWidth: 2, borderColor: '#3682FF', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}
          onPress={() => this.setState({ modalVisible: true })}
        >
          <Text style={{ color: '#3682FF', fontWeight: '700', fontSize: 14, flexDirection: 'row' }}> Add goals +</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 35,
    borderColor: "#979797",
    height: '45%',
    borderWidth: 1,
    width: '90%',
  },

  button: {
    // backgroundColor: "#2196F3",
    width: '100%',
    backgroundColor: "#9683E0",
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',

  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    alignSelf: 'center',
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: '700',
    height: height / 16
  },
  modalView2: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 35,
    borderColor: "#979797",
    height: height / 3,
    borderWidth: 1,
    width: '90%',
  },
  TextInput: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderColor: '#979797',
    borderWidth: 1
  },
  modalText2: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: '700',
    height: height / 25,
    bottom: 15
  },
  modalText3: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: '700',
    height: height / 3.8,
    bottom: 15
  }

});

export default ModalPage;