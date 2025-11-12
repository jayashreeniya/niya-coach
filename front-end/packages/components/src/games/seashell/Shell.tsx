import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

import { dimensions } from "../../utils";
import { closedShell,shellBlast } from "../assets";

type Props = {
  disabled: boolean;
  open: boolean;
  onPress: (i: number) => void;
  index: number;
}

class Shell extends React.Component<Props> {

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
        {this.props.open?<Image
          source={ closedShell }
          style={styles.image}
        />: <Image
        source={ shellBlast }
        style={styles.shellBlastimage}
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
  shellBlastimage: {
    height: dimensions.wp(22),
    aspectRatio: 1
  }
});

export default Shell;