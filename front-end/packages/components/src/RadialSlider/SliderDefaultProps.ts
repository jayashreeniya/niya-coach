import { Colors } from './theme';
export interface RadialProps {
  centerImgSrc?: any;
  centerText?: any;
  disabled: boolean;
  fixedMarker: boolean;
  isHideButtons: boolean;
  isHideCenterContent: boolean;
  isHideLines: boolean;
  isHideMarkerLine: boolean;
  isHideSlider: boolean;
  isHideSubtitle: boolean;
  isHideTailText: boolean;
  isHideTitle: boolean;
  isHideValue: boolean;
  lineColor: string;
  lineSpace: number;
  linearGradient: { color: string; offset: string }[];
  markerLineSize: number;
  markerValue: number;
  markerValueInterval: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
  onComplete?: (value:number) => void;
  openingRadian: number;
  radius: number;
  sliderTrackColor: string;
  sliderWidth: number;
  step: number;
  style?: any;
  subTitle: string;
  thumbBorderColor: string;
  thumbBorderWidth: number;
  thumbColor: string;
  thumbRadius: number;
  title: string;
  unit: string;
  value: number;
  variant: string;
}
export const defaultProps:RadialProps = {
  radius: 100,
  min: 0,
  max: 100,
  step: 1,
  value: 0,
  title: '',
  subTitle: 'Goal',
  unit: 'kCal',
  thumbRadius: 18,
  thumbColor: Colors.blue,
  thumbBorderWidth: 5,
  thumbBorderColor: Colors.white,
  markerLineSize: 50,
  sliderWidth: 18,
  sliderTrackColor: Colors.grey,
  lineColor: Colors.grey,
  lineSpace: 3,
  linearGradient: [
    { offset: '0%', color: Colors.skyBlue },
    { offset: '100%', color: Colors.darkBlue },
  ],
  onChange: (_v: number) => { },
  onComplete: (_v: number) => { },
  openingRadian: Math.PI / 3,
  disabled: false,
  isHideSlider: false,
  isHideTitle: false,
  isHideSubtitle: false,
  isHideValue: false,
  isHideTailText: false,
  isHideButtons: false,
  isHideLines: false,
  isHideMarkerLine: false,
  isHideCenterContent: false,
  fixedMarker: false,
  variant: 'default',
  markerValueInterval: 10,
  markerValue: 0
};
