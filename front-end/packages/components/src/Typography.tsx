// @ts-nocheck
import React, { PureComponent } from "react";
import { StyleSheet, Text, StyleProp, TextStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import { Colors, dimensions, ColorName, fonts, FontName } from "./utils";

type TextAlignProps = "left" | "right" | "center";
type DefaultProps = Readonly<typeof defaultProps>;

type Props = {
  children: React.ReactNode;
  style: StyleProp<TextStyle>;
  color: ColorName;
  font: FontName;
  align: TextAlignProps;
} & Partial<DefaultProps>;

const defaultProps = {
  color: "text",
  size: 13,
  style: {},
  lines: 0,
  font: "REG",
  mb: 0,
  align: "left"
};

class Typography extends PureComponent<Props & DefaultProps> {
  
  render() {
    const { lines, style, children, size, color, font, mb, align } = this.props;

    return (
      <Text
        numberOfLines={lines ? lines : 0}
        style={[getStyles(color, font, size, mb, align).textStyle, style]}
      >
        {children}
      </Text>
    );
  }

  static defaultProps = defaultProps;
}

const getStyles = (
  color: ColorName,
  font: FontName,
  size: number,
  mb: number,
  align: TextAlignProps
) => {
  return StyleSheet.create({
    textStyle: {
      color: Colors[color],
      fontFamily: fonts[font],
      fontSize: RFValue(size),
      marginBottom: dimensions.hp(mb),
      textAlign: align
    },
  });
}

export default Typography;
