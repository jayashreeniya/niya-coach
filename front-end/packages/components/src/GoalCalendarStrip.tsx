import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import moment, { Moment } from "moment";

import Typography from "./Typography";
import { chevronLeft, chevronRight } from "./images";
import Scale from "./Scale";
import DateTimePicker from "./DateTimePicker";

const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const colors: string[] = ["#626262", "#828282", "#a2a2a2", "c2c2c2"]

type Props = {
  initDate?: Moment;
  onSelect: (m: Moment) => void;
}

const GoalCalendarStrip: React.FC<Props> = ({ initDate, onSelect }) => {

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
        style={[styles.day, isSelected? styles.selectedDay: {}]}
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
      <DateTimePicker
        mode="date"
        value={date}
        renderBase={() => <Typography font="MED" style={styles.yearText}>{date.format("YYYY")}</Typography>}
        onSelect={(m) => {
          updateLimit(m);
          setDate(m);
          onSelect(m);
        }}
      />  
      <View style={styles.row}>
        <TouchableOpacity
          onPress={decrement}
          style={styles.button}
        >
          <Image source={chevronLeft} style={styles.arrow} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{months[date.get("month")]}</Text>
        <TouchableOpacity
          onPress={increment}
          style={styles.button}
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
      />
    </View>
  );
}

GoalCalendarStrip.defaultProps = {
  onSelect: () => {}
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    padding: Scale(20),
    justifyContent:'center'
  },
  yearText: {
    color: "#7D7D7D",
    backgroundColor: "#D4D4D4",
    paddingVertical: Scale(5),
    paddingHorizontal: Scale(20),
    borderRadius: Scale(15),
    fontSize: Scale(20),
    fontWeight: "700",
    marginBottom: Scale(25)
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Scale(35),
    margin:Scale(10)
  },
  arrow: {
    height: Scale(15),
    width: Scale(15),
    resizeMode: "contain",
    tintColor: "#ffffff"
  },
  monthText: {
    color: "#626262",
    fontSize: Scale(17),
    marginHorizontal: Scale(25),
    width: "35%",
    textAlign: "center",
    // flex:1,
    flexWrap:'wrap'
  },
  button: {
    paddingVertical: Scale(16),
    paddingHorizontal: Scale(30),
    backgroundColor: "#8E84DA",
    borderRadius: Scale(10),

   
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

export default GoalCalendarStrip;