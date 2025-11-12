import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { normalize } from "react-native-elements";

type Props = {
  width: number;
  height: number;
  variant?: "block" | "circle";
  style?: StyleProp<ViewStyle>;
}

const Skeleton: React.FC<Props> = ({ height, width, variant, style }) => {

  const opacityRef = useRef<Animated.Value>(new Animated.Value(.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityRef.current, {
          toValue: .8,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(opacityRef.current, {
          toValue: .3,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  return(
    <Animated.View
      style={[
        styles.skeleton, {
        height,
        width,
        borderRadius: (variant === "circle")? height / 2: normalize(8),
        opacity: opacityRef.current
      }, style]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#ddd"
  }
});

export default Skeleton;