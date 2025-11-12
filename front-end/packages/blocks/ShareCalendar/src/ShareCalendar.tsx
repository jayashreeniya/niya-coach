// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  Dimensions,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,

} from "react-native";

import { responsiveHeight } from "react-native-responsive-dimensions";

import { dimensions } from "../../../components/src/utils";
import CalendarStrip from 'react-native-calendar-strip';

import * as IMG_CONST from '../../appointmentmanagement/src/assets';
// Customizable Area End

import ShareCalendarController, {
  Props,
  configJSON,
  TimeSlotType
} from "./ShareCalendarController";

export default class ShareCalendar extends ShareCalendarController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start

    // Customizable Area End
  }

  // Customizable Area Start
  renderTimeslotData=(item: Record<string,TimeSlotType>) => {	
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          margin: 5
        }}>

        <TouchableOpacity style={[styles.styleButton, { backgroundColor: item.item.booked_status ? '#CCCCCC' : '#8E84D9', }]}>

          <Text style={{ textAlign: 'center', margin: 20, fontSize: 16, color: '#fff', }}>{item.item.from}</Text>

        </TouchableOpacity>
      </View>
      )
  }	

  // Customizable Area End

  render() {
    // Customizable Area Start
    let height = Dimensions.get('screen').height;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground resizeMethod="auto" style={{
          width: Dimensions.get('screen').width, height: height < 890 ? responsiveHeight(40) : responsiveHeight(45)
        }}
          {...this.headerbgImg}
        >
          <View style={styles.header} >
            <TouchableOpacity testID="btnExample"
              {...this.backBtnPress}>
              <Image
                style={styles.backIcon}
                {...this.backbtnImgProps}
              />

            </TouchableOpacity>

            <Text style={{ flex: 1, color: '#fff', textAlign: 'left', fontSize: 14, flexWrap: 'wrap' }}>Share Calendar</Text>

          </View>



          <CalendarStrip
            calendarHeaderStyle={{ color: 'white', fontSize: 14 }}
            minDate={new Date(this.state.date)}
            startingDate={new Date(this.state.date)}
            dateNumberStyle={{ color: 'white', marginTop: 2, fontSize: 12 }}
            dateNameStyle={{ color: '#fff', fontSize: 12, }}
            disabledDateNameStyle={{ color: 'grey', fontSize: 12, }}
            disabledDateNumberStyle={{ color: 'grey', fontSize: 12, }}
            showMonth={false}
            highlightDateContainerStyle={{ backgroundColor: '#fff' }}
            highlightDateNumberStyle={{ color: '#0F0F0F', fontSize: 12, }}
            highlightDateNameStyle={{ color: '#0F0F0F', fontSize: 12, }}
            iconRight={IMG_CONST.backwardImg}
            iconLeft={IMG_CONST.left_chevron}
            
            iconLeftStyle={{ height: 16, width: 16, margin: 5 }}
            iconRightStyle={{ height: 16, width: 16, margin: 5 }}
            shouldAllowFontScaling={false}
            selectedDate={new Date(this.state.date)}
          
            useIsoWeekday={false}
            updateWeek={false}
            style={{ height: 100, flex: 1, marginLeft: 10, marginBottom: 10 }}
          
            onDateSelected={(selecte_ddate) => this.calDateChange(selecte_ddate)}
          />

        </ImageBackground>
        <ScrollView scrollEnabled={true} nestedScrollEnabled={false}>
          <View style={[{ padding: 16, }]}>


            {this.state.appointmentsList && this.state.timeslots.length > 0 && (
              <FlatList
                data={this.state.timeslots}
                renderItem={(item:Record<string,TimeSlotType>) => {
                   return (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        margin: 5
                      }}>

                      <TouchableOpacity style={[styles.styleButton, { backgroundColor: item.item.booked_status ? '#CCCCCC' : '#8E84D9', }]}>

                        <Text style={{ textAlign: 'center', margin: 20, fontSize: 16, color: '#fff', }}>{item.item.from}</Text>

                      </TouchableOpacity>
                    </View>
                  );
                }}
                keyExtractor={item => item.sno}
                numColumns={3}
              />
            )}
          </View>
      </ScrollView>
      </SafeAreaView>
    );
  
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  header: {
    width: dimensions.wp(100),
    paddingHorizontal: dimensions.wp(4),
    paddingTop: dimensions.hp(3),
    paddingBottom: dimensions.hp(6),
    flexDirection: "row",
    alignItems: "flex-start"
  },
 

  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7)
  },

  styleButton: {
    backgroundColor: '#8E84D9',
    borderRadius: 6,
    height: 50,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0
  },

});
// Customizable Area End
