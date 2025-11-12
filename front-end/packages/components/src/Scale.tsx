import { Dimensions, Platform } from "react-native";

//Screen Constatnts
const SCREEN_HEIGHT = 736;
const SCREEN_WIDTH = 414;

const { height, width } = Dimensions.get("window");
export default function(units = 1) {
  return (width / SCREEN_WIDTH) * units;
}

const verticalScale = (size: number) => (height / SCREEN_HEIGHT) * size;

export { verticalScale };
