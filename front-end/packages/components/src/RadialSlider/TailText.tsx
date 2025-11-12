import React from 'react';
import { G, Text, TSpan } from 'react-native-svg';
import type { GProps, TextProps, TSpanProps } from 'react-native-svg';
import { Colors } from './theme';

interface TailTextProps {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}

const TailText: React.FC<TailTextProps> = ({ startPoint, endPoint }) => {
  return (
    <>
      <G transform={`translate(${-20}, ${40})`}>
        <Text fill={Colors.darkCharcoal} fontSize={12}>
          <TSpan x={startPoint.x} y={startPoint.y}>
            Start
          </TSpan>
        </Text>
      </G>
      <G transform={`translate(${-10}, ${40})`}>
        <Text fill={Colors.darkCharcoal} fontSize={12}>
          <TSpan x={endPoint.x} y={endPoint.y}>
            End
          </TSpan>
        </Text>
      </G>
    </>
  );
};

export default TailText;
