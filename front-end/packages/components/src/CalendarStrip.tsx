// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Platform } from "react-native";
import moment, { Moment } from "moment";

import { chevronLeft, chevronRight } from "./images";
import Scale from "./Scale";
import { Colors, dimensions } from "./utils";
import Typography from "./Typography";
import DateTimePicker from "./DateTimePicker";
import DatePickerIOs from "react-native-datepicker";
import { coachCalendar } from "../../blocks/dashboard/src/assets";

const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const colors: string[] = ["#626262", "#828282", "#a2a2a2", "c2c2c2"]

type Props = {
  initDate: Moment;
  onSelect: (m: Moment) => void;
  accent?: string;
}

const CalendarStrip: React.FC<Props> = ({ initDate, onSelect, accent }) => {

  const [date, setDate] = useState<Moment>(initDate || moment());
  const [dates, setDates] = useState<number[]>([]);
  const FLref = useRef<FlatList<any>>(null);

  const updateLimit = (day: Moment) => {
    const lastDayOfMonth = day.clone().endOf("month").get("date");
    if(dates.length !== lastDayOfMonth){
      setDates(Array(lastDayOfMonth).fill(null).map((_, i: number) => i + 1));
    }
  }

  useEffect(() => {
    if(dates.length){
      const idx = date.get("date") - 1;
      FLref?.current?.scrollToIndex?.({ animated: true, index: idx, viewPosition: .5 });
    }
  }, [dates]);

  useEffect(() => {
    updateLimit(date);
  }, []);

  const increment = () => {
    const newDate = date.clone().add(1, "month");
    setDate(newDate);
    updateLimit(newDate);
    onSelect(newDate);
  }

  const decrement = () => {
    const newDate = date.clone().add(-1, "month");
    setDate(newDate);
    updateLimit(newDate);
    onSelect(newDate);
  }

  const onClick = (day: number, i: number) => {
    const newDate = date.clone().set({ date: day });
    setDate(newDate);
    FLref?.current?.scrollToIndex({ animated: true, index: i, viewPosition: .5 });
    onSelect(newDate);
  }

  const renderDate = ({ item, index }: { item: number, index: number }) => {
    const selectedDate = date.get("date");
    const isSelected = selectedDate === item;
    const diff = Math.abs(selectedDate - item);

    return(
      <TouchableOpacity
        onPress={() => onClick(item, index)}
        style={[styles.day, isSelected? { backgroundColor: accent }: {}]}
      >
        <Text
          style={[
            styles.dayText,
            isSelected? styles.selectedText: { color: (diff < 3)? colors[diff]: "#c2c2c2" }
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  }

  return(
    <View style={styles.container}>
      {Platform.OS=="android"?<DateTimePicker
        mode="date"
        value={date}
        renderBase={() => <Typography font="MED" style={styles.yearText}>{date.format("YYYY")}</Typography>}
        onSelect={(m) => {
          setDate(m);
          updateLimit(m);
          onSelect(m);
        }}
      />:
      <View>
      <TouchableOpacity activeOpacity={1}>
      <Typography font="MED" style={styles.yearText}>{moment(date).format("YYYY")}</Typography>
      </TouchableOpacity>
      <DatePickerIOs
          style={{ width: "100%", }}
          date={date}
          minDate={new Date()}
          mode="date"
          placeholder={"Select time"}
          testID="txtInputAvailableTime"
          is24Hour={false}
          confirmBtnText="Confirm"
          iconSource={coachCalendar}
          cancelBtnText="Cancel"
          customStyles={{
            datePicker: {
              justifyContent: "center"
            },
            dateIcon: {
              alignSelf:'center',
              justifyContent: 'center',
              alignItems: "center",
              tintColor: 'transparent',
              height: dimensions.wp(10),
              width: dimensions.wp(22),
              marginBottom: dimensions.hp(1),
              position:'absolute',
              top:-60,
              right:-65
            },
            dateText: {
              color: '#fff',
              fontSize: 16,
            },
            dateInput: {
              paddingHorizontal: 10,
              borderColor: "#ccc",
              borderWidth: 0,
              borderRadius: 4,
              width: '10%',
              justifyContent: 'center',
              alignItems: "center"
            }
          }}
          onDateChange={(m1: any) => {
            let m= new Date(m1);
            let num = new Date(m1).toISOString();
            let neww = new Date(num);
            setDate(moment(neww));
            updateLimit(moment(neww));
            onSelect(moment(neww));
          }}
        />
        </View>
      }
      <View style={styles.row}>
        <TouchableOpacity
          onPress={decrement}
          style={[styles.button, { backgroundColor: accent }]}
        >
          <Image source={chevronLeft} style={styles.arrow} />
        </TouchableOpacity>
        <Typography font="MED" color="text" size={15} style={styles.monthText}>
          {months[date.get("month")]}
        </Typography>
        <TouchableOpacity
          onPress={increment}
          style={[styles.button, { backgroundColor: accent }]}
        >
          <Image source={chevronRight} style={styles.arrow} />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        ref={FLref}
        data={dates}
        keyExtractor={item => `${item}`}
        renderItem={renderDate}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 700));
          wait.then(() => {
            FLref.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: .5 });
          });
        }}
      />
    </View>
  );
}

CalendarStrip.defaultProps = {
  onSelect: () => {},
  accent: Colors.accent
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: dimensions.hp(2)
  },
  yearText: {
    color: "#7D7D7D",
    backgroundColor: "#D4D4D4",
    paddingVertical: Scale(5),
    paddingHorizontal: Scale(20),
    borderRadius: Scale(15),
    fontSize: Scale(20),
    marginBottom: Scale(25)
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Scale(35)
  },
  arrow: {
    height: Scale(15),
    width: Scale(15),
    resizeMode: "contain",
    tintColor: "#ffffff"
  },
  monthText: {
    marginHorizontal: Scale(25),
    width: "30%",
    textAlign: "center"
  },
  button: {
    paddingVertical: dimensions.hp(1.5),
    paddingHorizontal: dimensions.wp(6),
    borderRadius: Scale(10)
  },
  day: {
    height: Scale(40),
    width: Scale(40),
    borderRadius: Scale(20),
    alignItems: "center",
    justifyContent: "center",
    marginRight: Scale(5)
  },
  selectedDay: {
    backgroundColor: "#8E84DA",
  },
  dayText: {
    fontSize: Scale(20),
    color: "#626262"
  },
  selectedText: {
    color: "#ffffff"
  }
});

export default CalendarStrip;