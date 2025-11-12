// @ts-nocheck

import React, { useEffect, useState } from 'react';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Color,
  NumberProp
} from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import type { RadialSliderProps } from './types';
import { styles } from './styles';
import { Colors } from './theme';
import { useSilderAnimation, useRadialSlider } from './hooks';
import { defaultProps } from './SliderDefaultProps';
import ButtonContent from './ButtonContent';
import CenterContent from './CenterContent';


const getCirclarpos =(isRadialCircleVariant:boolean,centerValue:number,value:number)=>{
  if(isRadialCircleVariant)
  {
    if(centerValue < value)
    {
      return -7
    }
    else{
      return 4
    }
  }
  else{
    return 0;
  }
  
   
}
const getMaxlengthval=(maxLength:number)=>{
  if(maxLength>2)
  {
    return 10
  }
  else {
    return 100
  }
  
}

const RadialSlider = (props: RadialSliderProps & typeof defaultProps) => {
  const [isStart, setIsStart] = useState<boolean>(false);
  const [iconPosition, setIconPosition] = useState<string>('');

  const {
    step,
    radius,
    sliderWidth,
    sliderTrackColor,
    linearGradient,
    thumbRadius,
    thumbBorderColor,
    thumbColor,
    thumbBorderWidth,
    style,
    markerLineSize,
    disabled,
    contentStyle,
    buttonContainerStyle,
    min,
    max,
    isHideSlider,
    isHideCenterContent,
   isHideButtons,
    leftIconStyle,
    rightIconStyle,
    stroke,
    centerImgSrc,
    centerText,
    onChange = () => {},
  } = props;

  const { panResponder, value, setValue, curPoint, currentRadian, prevValue } =
    useSilderAnimation(props);

  const {
    svgSize,
    containerRef,
    startPoint,
    endPoint,
    startRadian,
    radianValue,
    isRadialCircleVariant,
    centerValue,
  } = useRadialSlider(props);

  useEffect(() => {
    //check max value length
    const maxLength = max?.toString()?.length;

    const timerId = setTimeout(handleValue, getMaxlengthval(maxLength));
    return () => clearTimeout(timerId);
  });

  const handleValue = () => {
    if (iconPosition === 'up' && max > value) {
      isStart && onPressButtons('up');
    } else if (iconPosition === 'down' && min < value) {
      isStart && onPressButtons('down');
    }
  };

  const leftButtonStyle = StyleSheet.flatten([
    leftIconStyle,
    (disabled || min === value) && {
      opacity: 0.5,
    },
  ]);

  const rightButtonStyle = StyleSheet.flatten([
    rightIconStyle,
    (disabled || max === value) && {
      opacity: 0.5,
    },
  ]);

  const onLayout = () => {
    const ref = containerRef.current as any;
    if (ref) {
      ref.measure((_x: any, _y: any, _width: any, _height: any) => {});
    }
  };

  const onPressButtons = (type: string) => {
    if (type === 'up' && max > value) {
      setValue((prevState: number) => {
        prevValue.current = prevState + step;

        return prevState + step;
      });
      onChange(value);
    } else if (type === 'down' && min < value) {
      setValue((prevState: number) => {
        prevValue.current = prevState - step;

        return prevState - step;
      });
      onChange(value);
    }
  };

  const circleXPosition = getCirclarpos(isRadialCircleVariant,centerValue,value)

  const strokeLinecap = isRadialCircleVariant ? 'square' : 'round';

  return (
    <View
      onLayout={onLayout}
      ref={containerRef as any}
      style={[styles.container, style, { width: svgSize, height: svgSize }]}
      testID="slider-view">
       
      <Svg
        width={svgSize + markerLineSize / 2 - (0)}
        height={svgSize + markerLineSize / 2}
        viewBox={`-${markerLineSize / 2} -${markerLineSize / 2} ${
          svgSize + markerLineSize
        } ${svgSize + markerLineSize}`}
        preserveAspectRatio="none"
        >
        <Defs>
          <LinearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="gradient">
            {linearGradient.map(
              (
                item: {
                  offset: NumberProp | undefined;
                  color: Color | undefined;
                },
                index: React.Key | null | undefined
              ) => (
                <Stop key={index} offset={item.offset} stopColor={item.color} />
              )
            )}
          </LinearGradient>
        </Defs>
        {!isHideSlider && (
          <>
          {/* <G transform="rotate(150.0)"> */}
            <Path
              strokeWidth={sliderWidth}
              stroke={sliderTrackColor}
              fill="none"
              strokeLinecap={strokeLinecap}
              d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${
                startRadian - radianValue >= Math.PI ? '1' : '0'
              },1,${endPoint.x},${endPoint.y}`}
            />
            <Path
              strokeWidth={sliderWidth}
              stroke="url(#gradient)"
              fill="none"
              strokeLinecap={strokeLinecap}
              d={
                `M${startPoint.x},
                  ${startPoint.y} 
                 A ${radius},
                 ${radius},0
                 ,${
                startRadian - currentRadian >= Math.PI ? '1' : '0'  
              },
              1,
              ${curPoint.x},
              ${curPoint.y}`}
            />
            <Circle
              cx={curPoint.x + circleXPosition}
              cy={curPoint.y}
              r={thumbRadius}
              fill={thumbColor || thumbBorderColor}
              stroke={thumbBorderColor}
              strokeWidth={thumbBorderWidth}
              {...panResponder.panHandlers}
            />
            {/* </G> */}
          </>
        )}
      </Svg>
      
      <View style={[styles.content, contentStyle]} pointerEvents="box-none">
        {/* Center Content */}
        {!isHideCenterContent && <CenterContent {...props} value={value} />}
        {/* Button Content */}
        {!isRadialCircleVariant && !isHideButtons && (
          <View style={[styles.buttonsWrapper, buttonContainerStyle]}>
            <View style={styles.center}>
              <ButtonContent
                onPress={() => onPressButtons('down')}
                onLongPress={() => {
                  setIsStart(true);
                  setIconPosition('down');
                }}
                onPressOut={() => setIsStart(false)}
                buttonType="left-btn"
                style={leftButtonStyle}
                disabled={disabled || min === value}
                stroke={stroke ?? Colors.blue}
              />
              <ButtonContent
                disabled={disabled || max === value}
                onPress={() => onPressButtons('up')}
                onLongPress={() => {
                  setIsStart(true);
                  setIconPosition('up');
                }}
                onPressOut={() => setIsStart(false)}
                style={rightButtonStyle}
                buttonType="right-btn"
                stroke={stroke ?? Colors.blue}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

RadialSlider.defaultProps = defaultProps;
export default RadialSlider;
