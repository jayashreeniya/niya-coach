import React from "react";
import { View, Modal, TouchableOpacity, StyleSheet, Text, Platform } from "react-native";
// Temporarily disabled BlurView to fix crash
// import { BlurView } from "@react-native-community/blur";

import { dimensions, Colors } from "./utils";
import { transparentImage } from "./images";
import Typography from "./Typography";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  font?:any;
  fontsize?:number;
  titlecolor?:string;
  marginleft?:any
  testID?:string;
}

const GoalModal: React.FC<Props> = ({ visible, onClose, title, font, fontsize, titlecolor, marginleft, children }) => {
  return(
    <Modal
      visible={visible}
      transparent
      animated
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={1}
        style={styles.container}
      >
        <View
          style={[styles.blurWrapper, { backgroundColor: Colors.modalTransparentColor }]}
        >
          <View style={styles.interactiveArea}>
            {title? <Text style={{fontSize:fontsize,color:titlecolor,marginLeft:marginleft,textAlign:font}} >{title}</Text>
            // <Typography mb={4} align="center" size={fontsize?fontsize:20} font="BLD" color="greyText" >{title}</Typography>
            :
             null}
            {children}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

GoalModal.defaultProps = {
  visible: false,
  onClose: () => {},
  children: <></>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dimensions.wp(4),
    backgroundColor: Colors.modalTransparentColor
  },
  blurWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: dimensions.wp(4),
  },
  interactiveArea: {
    width: "100%",
    padding: dimensions.wp(5),
    backgroundColor: Colors.white,
    borderRadius: dimensions.wp(3),
    elevation: 5
  }
});

export default GoalModal;