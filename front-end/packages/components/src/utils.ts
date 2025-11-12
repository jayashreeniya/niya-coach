import { Dimensions } from "react-native";

type DimensionObject = {
  wh: number;
  ww: number;
  sh: number;
  sw: number;
  hp: (x: number) => number;
  wp: (x: number) => number;
}

const screenSize = Dimensions.get("screen");
const windowSize = Dimensions.get("window");

const dimensions: DimensionObject = {
  sh: screenSize.height,
  sw: screenSize.width,
  wh: windowSize.height,
  ww: windowSize.width,
  hp: (multiplier: number) => (screenSize.height / 100) * multiplier,
  wp: (multiplier: number) => (screenSize.width / 100) * multiplier
}

type Colors = {
  primary: string;
  white: string;
  black: string;
  transparent: string;
  greyText: string;
  red: string;
  borderColor: string;
  inputTextColor: string;
  modalTransparentColor: string;
  text: string;
  accent: string;
  green: string;
  coachAccent: string;
  bluemagenta: string;
  darkviolet:string;
  empAccent:string;
  lightLavender:string
}

const Colors: Colors = {
  primary: "#0080BE",
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
  greyText: "#a2a2a2",
  red: "#fc7480",
  borderColor: "#ebebeb",
  inputTextColor: "#919191",
  modalTransparentColor: "rgba(220, 220, 220, 0.6)",
  text: "#3f3f3f",
  accent: "#8E84DA",
  green: "#02CD11",
  coachAccent: "#9C6FB4",
  empAccent:'#8279BF',
  bluemagenta:'#8E84D9',
  darkviolet:'#9a6db2',
  lightLavender:'#dec0ee',
}

type ColorName = keyof Colors; 

type Fonts = {
  REG: "Roboto-Regular";
  MED: "Roboto-Medium";
  THN: "Roboto-Thin";
  LGT: "Roboto-Light";
  BLK: "Roboto-Black";
  BLD: "Roboto-Bold";
}

type FontName = keyof Fonts;

const fonts: Fonts = {
  REG: "Roboto-Regular",
  MED: "Roboto-Medium",
  THN: "Roboto-Thin",
  LGT: "Roboto-Light",
  BLK: "Roboto-Black",
  BLD: "Roboto-Bold"
}

const BASE_URL: string = "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe";

export {
  Colors,
  ColorName,
  dimensions,
  fonts,
  FontName,
  BASE_URL
}