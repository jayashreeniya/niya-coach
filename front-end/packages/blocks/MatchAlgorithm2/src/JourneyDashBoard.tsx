// @ts-nocheck
import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Platform
} from "react-native";
import JourneyDashBoardController from "./JourneyDashBoardController";
import * as IMG_CONST from '../../user-profile-basic/src/assets';
import { imgBottomMsg, journeyDashboardbg } from './assets'
import Scale from "../../dashboard/src/Scale";
import Typography from "../../../components/src/Typography";
import { dimensions } from "../../../components/src/utils";
import Slider from 'react-native-slider';
// Customizable Area End

export default class JourneyDashBoard extends JourneyDashBoardController {
  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={{ width: "100%", height: Scale(50), flexDirection: "row", alignSelf: 'center', marginLeft: Scale(40), marginTop: Scale(20) }}>
        <TouchableOpacity testID="btnBack" onPress={() => this.props.navigation.goBack("")}>
          <Image style={styles.arrow} source={IMG_CONST.ARROW_ICON} />
        </TouchableOpacity>
        <Typography size={16} style={styles.accountText}>My Progress  </Typography>
      </View>

    )
  }
  getSliderColor = (color: string) => {
    console.log(color, "color ##")
    if (color == "yellow") {
      return '#FFD405';
    }
    else if (color == "red") {
      return "#FF0305";
    }
    else if (color == "blue") {
      return "#0086F0";
    }
    else if (color == "green") {
      return "#06C22B";
    }
    else if (color == "orange") {
      return "#FF8343";
    }
    else{
      return "#d0d0d0";
    }
   

  }

  renderBars = () => {

    return (
      <View style={{ width: dimensions.wp(90), marginHorizontal: Scale(20), marginTop: Scale(-160), marginBottom: Scale(20) }}>

        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{  flexGrow:1, alignSelf: 'center', alignItems: 'center' }} style={{
          zIndex: 1000, width: dimensions.wp(90), height: dimensions.hp(30), backgroundColor: "white", borderRadius: Scale(10), borderWidth:Platform.OS=="ios"?Scale(0.2): undefined,
          shadowOffset: { width: 2, height: 4 },
          shadowColor: '#000',
          shadowOpacity: 0.2,
          overflow:'hidden',
          shadowRadius: 3, elevation: 3
        }}>
          {this.state.myProgressData.length > 0 && this.state.myProgressData.map((item: any, index: number) => {
            return (
              <View key={index} style={{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column', width: dimensions.wp(40) }}>
                  <Typography font="REG" size={12} >{item?.focus_area}</Typography></View>
                <View style={{ flexDirection: 'column', width: dimensions.wp(40) }}>
                 
                  <Slider
                    maximumValue={100}
                    minimumValue={0}
                    maximunTrackTintColor={this.getSliderColor(item.color)}
                    trackStyle={{ height: 16, borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: '#d0d0d0' }}
                    thumbStyle={{ width: 10, borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: 'transparent' }}
                    minimumTrackTintColor={this.getSliderColor(item.color)}
                    step={1}
                    disabled
                    value={item.percentage > 100 ? 100 : item.percentage}
                  ></Slider>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    );
  }

  // Customizable Area End

  // Customizable Area Start
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView bounces={false}>
          <ImageBackground source={journeyDashboardbg} resizeMode={'cover'} style={[styles.header, { flex: 1, overflow: 'visible' }]}>
            <>
              {this.renderHeader()}


            </>
          </ImageBackground>
          {this.renderBars()}
          <View style={{
            flexDirection: 'row', width: dimensions.wp(90), height: dimensions.hp(20), backgroundColor: "#E1E9ED", borderRadius: Scale(10), justifyContent: 'center', alignSelf: 'center', alignItems: 'center',
            shadowOffset: { width: 2, height: 4 },
            shadowColor: '#E1E9ED',
            shadowOpacity: 0.2,
            shadowRadius: 3, elevation: 4
          }}>
            <View style={{ width: dimensions.wp(30) }}>
              <Image source={imgBottomMsg} style={{ width: Scale(100), height: Scale(100) }} resizeMode={'contain'} ></Image>
            </View>
            <View style={{ width: dimensions.wp(50), marginVertical: Scale(1) }}>
              <View style={{ flexDirection: 'row' }}>
                <Typography font="REG" size={14}>Awesome </Typography>
                <Typography font="BLD" size={14}>{this.state.full_name.length > 10 ? this.state.full_name.substring(0, 10) + '.. !' : this.state.full_name + '!'}</Typography>
              </View>
              <Typography font="REG" size={14}>You have been working consistently towards your goals. Let's celebrate the progress you have made!</Typography>
            </View>
          </View>
          <View style={{ height: Scale(100) }} ></View>
        </ScrollView>
      </SafeAreaView>
    )
  }
  // Customizable Area End
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },

  header: {
    width: "100%",
    height: dimensions.hp(30),
    backgroundColor: "#8289d9",
    alignItems: 'center',
    overflow: 'visible'
  },

  arrow: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#fff",
    alignSelf: 'center',
    marginTop: Scale(4)
  },

  ineerbarview: {
    borderWidth: 0,
    borderLeftWidth: 0,
    padding: 10,
    paddingLeft: 0,
    flexDirection: 'row'
  },


  profileIcon: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(40),
  },
 
  horbartex: {
    width: dimensions.wp(8), height: dimensions.hp(3), textAlign: 'left', marginLeft: 12
  },
  accountText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: Scale(30),

  },

 
  bottom: {
    width: dimensions.wp(55), borderWidth: 0.2, borderColor: 'gray'

  },
  profileHeader: {
    marginHorizontal: Scale(20)
  },

 

  nameHeader: {
    marginTop: Scale(20),
  },

  name: {
    color: "gray",
    fontSize: Scale(12),
    marginLeft: Scale(10)
  },

  access: {
    color: "gray",
    fontSize: Scale(12),
    marginLeft: Scale(10),
    marginTop: Scale(30)
  },

  namefield: {
    width: Scale(375),
    height: Scale(45),
    borderWidth: Scale(0.3),
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    justifyContent: "center",
    marginTop: Scale(10)
  },

  nameTextInput: {
    marginLeft: Scale(15)
  },

  emailHeader: {
    marginHorizontal: Scale(20),
    marginTop: Scale(30),
    flex: 1
  },

  emailBox: {
    height: Scale(45),
    borderWidth: Scale(0.3),
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    marginTop: Scale(10),
    backgroundColor: "#fff",
    justifyContent: "center"
  },

  backHeader: {
    height: Scale(45),
    borderWidth: Scale(0.3),
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    marginTop: Scale(10),
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },

  back: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    marginRight: Scale(10),
  },

  smallBox: {
    width: Scale(55),
    height: Scale(45),
    borderWidth: Scale(0.3),
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    justifyContent: "center"
  },

  bigBox: {
    width: Scale(300),
    height: Scale(45),
    borderWidth: Scale(0.3),
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    justifyContent: "center"
  },

  mobile: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Scale(10),
  },

  saveButton: {
    width: Scale(100),
    height: Scale(45),
    borderWidth: Scale(0.3),
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    justifyContent: "center",
    backgroundColor: "#8289d9",
    marginHorizontal: Scale(20),
    alignItems: "center",
    bottom: Scale(50),
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  VerifictionBoxInside: {
    borderRadius: Scale(10),
    borderColor: "#9b6db3",
    borderWidth: Scale(1),
    position: 'absolute',
    backgroundColor: "#ffffff",
    alignSelf: 'flex-end',
    top: Scale(100),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    elevation: 3,
    shadowRadius: 5,
    zIndex: 9,
    justifyContent: 'center',
    width: Scale(375),
    padding: Scale(5)

  },

  nameText: {
    marginLeft: Scale(5),
    marginTop: Scale(5)
  },

  linearGradient: {
    width: '100%',
    height: Scale(90),
    borderRadius: Scale(15)
  },
})
  // Customizable Area End
