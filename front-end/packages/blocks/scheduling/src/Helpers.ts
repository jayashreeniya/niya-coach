/* App/Lib/GeneralHelpers.js */
import { Platform, StyleSheet } from 'react-native';
import { heightFromPercentage } from '../../../framework/src/Utilities';

// Colors Constants
export const COLORS = {
  TRANSPARENT: 'transparent',
  white: 'rgb(255,255,255)',
  black: 'rgb(0,0,0)',
  black10: 'rgb(10,10,10)',
  green: 'rgb(76,217,100)',
  red: 'red',
  yellow: 'rgba(255, 212, 40, 1)',
  darkGray: 'rgba(105,105,105,0.9)',
  lightGray: '#a7b6b9',
  skipGray: 'rgb(91,91,92)',
  borderColor: 'rgb(240, 240, 240)',
  inactiveIndicator: 'rgb(228, 233, 242)',
  inputLabel: 'rgb(143,155,179)',
  inputIcon: 'rgb(197,206,224)',
  inputValue: 'rgb(46,58,89)',
  discountRed: 'rgb(199,5,28)',
  orange: 'rgb(255,157,43)',
  infoGray: 'rgb(163,164,165)',
  ReviewBlack: 'rgb(34,43,69)',
  blue: 'blue',
  blueGrey: 'rgb(143,155,179)',
  darkBlueGrey: 'rgb(46,58,89)',
  lightBlueGrey: 'rgb(197, 206, 224)'
};

export const CommonStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  wrapper: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  headerContainer:{
    backgroundColor:COLORS.yellow,
    height: '10%',
  },
  authHeader:{
    height: heightFromPercentage(10),
    backgroundColor: COLORS.yellow
  },
  authHeaderWhite:{
    height: heightFromPercentage(10),
    backgroundColor: COLORS.white
  },
  formContainer: {
    width: "80%"
  },
  textAlignCenter:{
    textAlign: 'center'
  },
  labelTextStyle: {
    color: COLORS.inputLabel
  },
  inputContainerStyle:{
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inactiveIndicator
  },
  error: {
    color: COLORS.red,
    fontSize: 14
  },
  scrollStyle: {
    width: "100%"
  },
  btnTitleStyle:{
    fontSize: 17,
    color: COLORS.black
  },
  closeButtonStyle: {
    backgroundColor: COLORS.inputIcon,
    height: 40,
    width: 100,
    borderRadius: 8
  },
  yellowButtonStyle: {
    backgroundColor: COLORS.yellow,
    height: 40,
    width: 100,
    borderRadius: 8
  },
  closeBtnTitleStyle:{
    color: COLORS.black
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center"
  },
  shadowStyle: {
    shadowOffset:
      Platform.OS === "ios"
        ? { width: 0, height: 1 }
        : { width: 0, height: 2 },
    shadowColor: COLORS.inputLabel,
    shadowOpacity: 0.9,
    shadowRadius: Platform.OS === "ios" ? 3 : 5,
    elevation: 5
  },
  boxShadowStyle: {
    backgroundColor: COLORS.white,
    marginHorizontal:2,
    marginVertical:1,
    shadowOffset:
    Platform.OS === "ios"
      ? { width: 0, height: 1 }
      : { width: 0, height: 2 },
    shadowColor: COLORS.inputLabel,
    shadowOpacity: 0.9,
    shadowRadius: Platform.OS === "ios" ? 1 : 5,
    elevation: 2,    
    borderRadius:8,
  },
  toastModal: {
    borderRadius: 20,
    marginHorizontal: 15,
    paddingHorizontal: '12%',
    paddingVertical: 100,
    alignContent: "center",
    justifyContent: "center",
  },
  clearModal: {
    borderRadius: 5,
    marginHorizontal: 50,
    height: 220,
    backgroundColor: COLORS.red
  },
  imageThumbContain: {
    resizeMode: "contain",
    width: "100%",
    height: "100%"
  },
  imageThumbCover: {
    resizeMode: "cover",
    width: "100%",
    height: "100%"
  },
  flexContainer: {
    flex: 1,
    width: "100%"
  },
  rowStyle: {
    flexDirection: "row"
  },
  flexStart: {
    justifyContent: "flex-start"
  },
  flexEnd: {
    justifyContent: "flex-end"
  },
  jCCenter: {
    justifyContent: "center"
  },
  spaceBetween: {
    justifyContent: "space-between",    
  },
  spaceAround: {
    justifyContent: 'space-around'
  },
  alignItemsCenter:{
    alignItems: "center"
  },
  styleCenter: {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  centerStyle: {
    justifyContent: "center",
    alignItems: "center"
  },
  width100P:{
    width: '100%'
  },
  subView: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  emptyList: {
    alignItems: "center",
    marginTop: 100
  },
  emptyListFilter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100
  },
  backIconView: {
    marginVertical: 10,
    marginHorizontal: 5,
    width: 30,
    height: 30,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  crossImage: {
    tintColor: COLORS.red,
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  searchTextInput: {
    width: "80%"
  },
  errorReport: {
    width: "70%",
    color: COLORS.red,
    fontSize: 15,
    marginLeft: "28.8%"
  }
});