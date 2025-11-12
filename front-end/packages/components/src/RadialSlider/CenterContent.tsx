//@ts-nocheck
import { View, Text, Image } from 'react-native';
import React from 'react';
import { styles } from './styles';
import type { CenterContentProps } from './types';

const CenterContent = (props: CenterContentProps) => {
  const {
    title,
    subTitle,
    unit,
    titleStyle,
    subTitleStyle,
    valueStyle,
    unitStyle,
    isHideTitle,
    isHideSubtitle,
    isHideValue,
    value,
    centerContentStyle,
    unitValueContentStyle,
    centerImgSrc,
    centerText
  } = props;

  return (
    <View style={[styles.hideCenterContent, centerContentStyle]}>
      {centerImgSrc != null && (
        <Image source={centerImgSrc} style={styles.centerimage} />
      )}
      {centerText != null && (
        <Text style={[styles.helperText, styles.subTitleWidth, subTitleStyle]}>
          {centerText}
        </Text>
      )}
    </View>
  );
};

export default CenterContent;
