import React from 'react';
import { G, Line, Text } from 'react-native-svg';
import type { GProps, TextProps } from 'react-native-svg';

interface LineContentProps {
  marks: Array<{ value: number }>;
  markerInnerValue: number;
}

const LineContent: React.FC<LineContentProps> = ({ marks, markerInnerValue }) => {
  const arr: number[] = [];
  for (let i = 0; i < marks.length; i = i + markerInnerValue) {
    arr.push(marks[i].value);
  }

  return (
    <G>
      {arr.map((value, index) => (
        <G key={index.toString()}>
          <Line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            stroke="#E3E3E3"
            strokeWidth="1"
          />
          <Text
            x="0"
            y="20"
            textAnchor="middle"
            fill="#999999"
            fontSize="12"
          >
            {value}
          </Text>
        </G>
      ))}
    </G>
  );
};

export default LineContent;
