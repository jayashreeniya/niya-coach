// @ts-nocheck
import React from "react";
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from "react-native";
import { normalize } from "react-native-elements";
import { dimensions, Colors, ColorName, fonts } from "./utils";
import Typography from "./Typography";

type ButtonMode = "contained" | "outlined";

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textColor?: ColorName;
  mode?: ButtonMode;
  disabled?: boolean;
  loading?: boolean;
  testID?:string;
  children?: React.ReactNode;
}

const Button:React.FC<Props> = ({
  children,
  onPress,
  style,
  textStyle,
  textColor,
  mode,
  disabled,
  loading
}) => {

  const getOutline = () => {
    return {
      ...styles.outlined,
      borderColor: textColor? Colors[textColor]: Colors.accent
    }
  }

  return(
    <TouchableOpacity
      onPress={onPress}
      disabled={!!disabled}
      style={[
        styles.container,
        (mode == "outlined")? getOutline(): styles.contained,
        style
      ]}
    >
      {(!loading)? (
        <Typography
          style={[styles.text, textStyle]}
          color={textColor || "white"}
        >
          {children}
        </Typography>
      ):(
        <ActivityIndicator color={Colors[textColor || "white"]} size="small" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: normalize(7),
    paddingVertical: normalize(11),
    paddingHorizontal: normalize(15),
    marginBottom: dimensions.hp(1.5),
    justifyContent: "center",
    alignItems: "center",
  },
  contained: {
    backgroundColor: Colors.accent,
  },
  outlined: {
    backgroundColor: Colors.white,
    borderWidth: 2
  },
  text: {
    textAlign: "center",
    fontSize: normalize(15),
    fontFamily: fonts.MED
  }
});

export default Button;