import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

import { dimensions } from "../../utils";
import { bubble,bubbleBlast } from "../assets";

type Props = {
  disabled: boolean;
  open: boolean;
  onPress: (i: number) => void;
  index: number;
  
}

class Pop extends React.Component<Props> {
  handlePress = () => {
    
      this.props.onPress(this.props.index);      
    
    
  }

  render(): React.ReactNode {
    return(
      <TouchableOpacity
        onPress={this.handlePress}
        activeOpacity={.9}
        disabled={this.props.disabled}
        style={styles.block}
      >
        {this.props.open?(
          <Image
            source={bubble}
            style={styles.image}
          />
        ): <Image
        source={bubbleBlast}
        style={styles.bubbleBlastimage}
      />}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  block: {
    width: `${100/3}%`,
    height: `${100/3}%`,
    borderWidth: 1,
    borderColor: "#efefef",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    height: dimensions.wp(15),
    aspectRatio: 1
  },
  bubbleBlastimage: {
    height: dimensions.wp(26),
    aspectRatio: 1
  }
});

export default Pop;