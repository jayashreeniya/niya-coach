// @ts-nocheck
import React from 'react';
import { TextInput, StyleSheet, View, Image, KeyboardTypeOptions, StyleProp, ViewStyle, ImageProps, TouchableOpacity } from 'react-native';
import { normalize } from 'react-native-elements';

import { Colors, dimensions, fonts } from "./utils";
import Typography from "./Typography";

type Props = {
  placeholder?: string;
  label?: string;
  value: string;
  onChange: any;
  onBlur?: any;
  onFocus?: any;
  disabled?: boolean;
  autoCorrect?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: any;
  blurOnSubmit?:boolean;
  secureEntry?: boolean;
  errorText?: any;
  touched?: any;
  maxLength?: number;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: ImageProps["source"];
  backIcon?: ImageProps["source"];
  pressAction?: () => void;
  mb?: number;
  autoFocus?: boolean
}

const Input:React.FC<Props> = ({
  placeholder,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  autoCorrect,
  keyboardType,
  autoCapitalize,
  blurOnSubmit,
  secureEntry,
  errorText,
  touched,
  maxLength,
  multiline,
  style,
  icon,
  backIcon,
  pressAction,
  containerStyle,
  mb,
  autoFocus
}) => {

  const showError = (errorText && touched);

  const inputMargin = { marginBottom: showError? dimensions.hp(0.5): dimensions.hp(mb || 1) };

  return(
    <>
      {label && (
        <Typography
          color="text"
          style={styles.label}
        >{label}</Typography>
      )}
      <View style={[styles.inputContainer, inputMargin, containerStyle]}>
        { icon && (
          <TouchableOpacity onPress={pressAction}>
            <Image source={icon} style={styles.icon} />
          </TouchableOpacity>
        )}
        <TextInput
          returnKeyType="done"
          placeholder={placeholder}
          placeholderTextColor={Colors.greyText}
          value={value}
          onChangeText={(text) => onChange?.(text)}
          onBlur={e => onBlur?.(e)}
          blurOnSubmit={false} 
          blurOnSubmit={blurOnSubmit || false}
          autoFocus={autoFocus || false}
          autoCorrect={autoCorrect ?? true}
          secureTextEntry={!!secureEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
          textContentType="oneTimeCode"
          maxLength={maxLength}
          multiline={multiline || false}
          editable={disabled? false: true}
          style={[styles.input, style]}
          textAlignVertical="center"

        />
        {backIcon && (
          <Image source={backIcon} style={styles.backIcon} />
        )}
      </View>
      {showError && (
        <Typography mb={mb} color="red" size={11}>{errorText}</Typography>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    width: '100%',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: normalize(7),
    overflow: "hidden",
    paddingHorizontal: dimensions.wp(3),
    alignItems: "center"
  },
  input: {
    color: Colors.text,
    fontFamily: fonts.REG,
    fontSize: normalize(15),
    flex: 1,
    textAlignVertical: 'top',
    height: "100%"
  },
  label: {
    marginBottom: dimensions.hp(1.25)
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.hp(2),
  },
  errorLogo: {
    width: normalize(12),
    height: normalize(12),
    resizeMode: "contain",
    marginRight: normalize(5)
  },
  icon: {
    height: normalize(18),
    width: normalize(18),
    tintColor: Colors.greyText,
    marginRight: normalize(5),
    resizeMode: "contain"
  },
  backIcon: {
    height: normalize(12),
    width: normalize(12),
    tintColor: Colors.greyText,
    marginRight: normalize(5),
    resizeMode: "contain"
  }
});

export default Input;