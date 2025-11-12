// @ts-nocheck
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import moment, { Moment } from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { clock } from "./images";
import { dimensions, Colors } from "./utils";
import Typography from "./Typography";

type Props = {
  testID?:string
  mode?: "date" | "time";
  value?: Moment;
  onSelect: (m: Moment) => void;
  renderBase?: () => React.ReactNode;
  isBookAppointment?:boolean,
  isSlider?:boolean,
  sliderTime?:string;
}

const DateTimePicker: React.FC<Props> = ({ mode, value,
   onSelect, 
  renderBase,isBookAppointment, isSlider,sliderTime }) => {
  const [date, setDate] = useState<Moment | null>(value || null);
  const [isPickerVisible, setPickerVisibility] = useState(false);

  const showPicker = () => {
    setPickerVisibility(true);
  };

  const hidePicker = () => {
    setPickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const newDate = moment(date);
    if(mode === "time"){
      onSelect(newDate);
    }else{
      onSelect(date);
    }
    if(hidePicker){
      hidePicker();
    }
  };

  const renderDate = () => {
    if(value){
      if(mode === "time"){
        
        return value.format("hh:mm A");
      }
      return value.format("DD/MM/YYYY");
    }
    return `Select ${mode || "date"}`;
  };
  if(renderBase){
    return(
      <TouchableOpacity onPress={showPicker}>
        {renderBase()}
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode={mode || "datetime"}
          onConfirm={handleConfirm}
          onCancel={hidePicker}
        />
      </TouchableOpacity>
    );
  }
 
  return(
    
    <View style={ isBookAppointment ? styles.container2 :styles.container}>
      <TouchableOpacity onPress={showPicker}>
        <Image source={clock} style={ isBookAppointment? styles.clocImg :styles.image} />
      </TouchableOpacity>
      {isBookAppointment ? 
      <Text style={styles.timeText}>
        {isSlider ? sliderTime : renderDate() }
      </Text>
      :
      isSlider ?
      <Text style={[styles.timeText, isSlider && styles.textColr]}>
      {sliderTime}
        </Text>
        :
            <Typography font="MED" color="text" size={16}>{renderDate()}</Typography> 
      }
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={mode || "datetime"}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: dimensions.hp(2),
    justifyContent: "center",
    alignItems: "center"
  },
  container2: {
    width: "100%",
    flexDirection:'row-reverse',
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    height: dimensions.wp(10),
    width: dimensions.wp(10),
    resizeMode: "contain",
    tintColor: Colors.accent,
    marginBottom: dimensions.hp(1)
  },
  clocImg:{
    height: dimensions.wp(4),
    width: dimensions.wp(4),
    resizeMode: "contain",
    tintColor: '#fff',
    marginLeft: dimensions.hp(1)
  },
  timeText:{
    color:'#fff',
    fontSize:20,
  },
  textColr:{color:'#000', textTransform:'uppercase'}
});

export default DateTimePicker;