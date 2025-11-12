import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  FlatList,
  Image,
  Modal,
  ImageBackground,

  Dimensions,
  ActivityIndicator
} from "react-native";
import moment from "moment";
import DatePicker from "react-native-datepicker";
import DateTimePicker from "../../../components/src/DateTimePicker";
// Customizable Area End

// Customizable Area Start
import { dimensions } from "../../../components/src/utils";

import * as IMG_CONST from './assets'
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CalendarStrip from 'react-native-calendar-strip';
import { verticalScale } from "../../../components/src/Scale";

let minTime = new Date();
minTime.setHours(10);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

let maxTime = new Date();
maxTime.setHours(22);
maxTime.setMinutes(0);
maxTime.setMilliseconds(0);
import Scale from "../../dashboard/src/Scale";
// Customizable Area End

import AppointmentmanagementController, {
  Props,
  configJSON,
} from "./AppointmentmanagementController";

export default class Appointments extends AppointmentmanagementController {
  constructor(props: Props) {
    super(props);

    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderShowExpListIds = (expertise: any, id: any) => {
    return (
      <ScrollView nestedScrollEnabled={true} style={{ height: Scale(60), }}>

        {expertise.length > 1 && expertise.map((itm: any, index: any) => {
          return (
            <>
              <View style={{ margin: 0, padding: 0, height: 38,width:210 }}>
                {index == 0 ? <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.setState({ showId: this.state.showId == id ? "" : id, })}>
                  <Text
                    numberOfLines={2}
                    style={[styles.TextHeader, { color: '#6B5AED', marginBottom: 2, marginLeft: 5, marginRight: 5, marginTop: 3,width:150,height:38 }]}
                  > {itm?.specialization}</Text >
                </TouchableOpacity> :


                  <View style={{ margin: 0, padding: 0, height: 38}}>
                    <Text numberOfLines={2} style={styles.renderShowExpListText}>{itm?.specialization.substring(0, 50)}</Text>
                  </View>

                }
              </View>

            </>
          )

        })}
      </ScrollView>
    )
  }
  renderHideExpList = (expertise: any, id: any) => {
    return (
      <View style={{ height: Scale(20), }}>
        {expertise.length > 1 && expertise.map((itm: any, index: any) => {

          return (
            <>
              {index == 0 && <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.setState({ showId: this.state.showId == id ? "" : id, })}
              >
                <Text numberOfLines={2} style={[styles.labelText, { fontWeight: '500', color: '#6B5AED', marginBottom: 2, marginLeft: 5, marginRight: 5, marginTop: 3,width:180}]}> {itm?.specialization}</Text>
              </TouchableOpacity>
              }
            </>
          )
        })}
      </View>
    )

  }
  renderExpandableList = (expertise: any, id: any, full_name: string, education: any) => {
    return (
      <View style={{ marginLeft: 10, marginTop: Scale(5)}}>
        <Text style={{ color: '#2F2F2F', fontSize: 15, fontStyle: 'normal', fontWeight: 'normal', margin: 5, marginTop: 0 }}> {full_name}</Text>

        {expertise.length == 1 && <View style={{ height: Scale(6), }}>
          <Text style={[styles.TextHeader, { color: '#6B5AED', marginBottom: 2, marginLeft: 5, marginRight: 5, marginTop: 3 }]}> {expertise[0].specialization}</Text>
        </View>
        }


        {this.state.showId != id && this.renderHideExpList(expertise, id)}
        {/* scrolling  */}
        {this.state.showId == id && this.renderShowExpListIds(expertise, id)}

        <Text style={[{ color: '#6D6D6D', marginLeft: 5, marginBottom: 5, marginTop: this.state.showId == id ? 10 : 0, fontSize: 11, width: '80%' }]} numberOfLines={1}> {education}</Text>


      </View>
    )
  }
  renderImgBasedOnRating = (rating: number) => {
    if (rating == null || rating == 0) {
      return IMG_CONST.bordered_emptyStar;
    }
    else if (rating >= 1 && rating < 3) {
      return IMG_CONST.bordered_twoStar;
    }
    else if (rating >= 3 && rating < 4) {
      return IMG_CONST.bordered_threStar;
    }
    else if (rating >= 4 && rating < 5) {
      return IMG_CONST.bordered_fourStar
    }
    else {
      return IMG_CONST.bordered_fiveStar;
    }

  }
  showDataonLeng(data:any){
    
    if(data.length>10){
     return data.substring(0,10)+ '...'
    }else{
      return data;
    }
  
 

  }
  getList(item: any) {
    let { full_name, image, rating, city, education, expertise, languages } = item.item.attributes.coach_details;
    let { id } = item?.item?.attributes;
    const langList = languages.split(' ');
    return (
      <>
        {item?.item?.attributes?.timeslots?.length !=undefined&&item?.item?.attributes?.timeslots?.length >= 1  && <View style={[styles.tableBox, { marginBottom: 20, }]}>
          <View style={{ flexDirection: 'row', margin: 10,}}>
            <Image style={{ height: 70, width: 70, borderRadius: 11, resizeMode: 'stretch' }} source={image ? { uri: image } : IMG_CONST.dummyPROFILE_ICON} ></Image>

            {this.renderExpandableList(expertise, id, full_name, education)}

          </View>
          <View style={{ marginLeft: responsiveWidth(10), flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={this.renderImgBasedOnRating(rating)} ></Image>
              <Text style={styles.appointmentsubTxt}> {rating == null ? 0 : rating.toFixed(1)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../assets/loc.png')} ></Image>
              <Text style={styles.appointmentsubTxt}> {city ? this.showDataonLeng(city): "Mumbai"}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../assets/lan.png')} ></Image>
              <View>
              {
                langList.map((lang:string,index:number)=>{
                  
                    return(<Text style={styles.appointmentsubTxt} key={lang}> {lang}</Text>)
                })
              }
              </View>
            </View>

          </View>
          <View style={{ zIndex: -1, paddingTop: 25, padding: 15, }}>

            <TouchableOpacity style={styles.styleButton}
              onPress={() => {
                if (this.state.checked == "") {
                  this.showAlert("Oops! ", "Please choose the duration", "");
                  return false;

                }
                else {
                  this.setState({ seleCoachData: item.item.attributes.coach_details, isconfirmModal: true, modalSubtitle: `Do you want to confirm this appointment with ${full_name}?`, })
                }
              }
              }
            >


              <Text style={{ textAlign: 'center', margin: 5, fontSize: 16, color: '#fff', }}>{"Schedule a call now"}</Text>

            </TouchableOpacity>
          </View>
        </View>}
      </>
    );
  }


  renderSlots() {
    return (
      <View style={{ flexDirection: 'row', marginTop: 0 }}>
        <>
          {this.state.options.map((ansOpt: any, index: number) => {
            return (
              <View style={styles.innerContainer} key={index}>
                <TouchableOpacity
                  testID={"selectTypeOfTest" + index} style={[styles.inputsend, { backgroundColor: '#7887DB', paddingVertical: Scale(13), justifyContent: 'flex-start', alignItems: 'center', width:'90%', marginRight:0 }]}
                  onPress={() => this.setState({ checked: ansOpt.id, })}>
                  {this.state.checked == ansOpt.id ?
                    <Image style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 10 }}{...this.btnShowImageProps} /> :
                    <Image style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 10 }}

                      {...this.btnHideImageProps} />}

                  <Text style={[styles.titletime, { color: "#fff", textAlign: 'center', fontSize: 14, marginRight: 10, }]}>{ansOpt.min}{" mins"}</Text>

                </TouchableOpacity>

              </View>
            )
          })}

        </>



      </View>

    )
  }
  returnDate(){
    return this.state.date ? new Date(this.state.date): new Date()
  }
  renderAppoinmentListContainer(){
    const { appointmentsList } = this.state;
      return(
        appointmentsList && appointmentsList.length > 0 ? (
          appointmentsList.map((item: any) => {
            return this.getList({ item });
          })
        ): <Text  style={styles.noCoachErroText} >{configJSON.coachesNotavailableText}</Text>
      )
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    const { appointmentsList } = this.state;
    let height = Dimensions.get('screen').height;
    return (
      <SafeAreaView style={{ flex: 1 }}>

        <ImageBackground resizeMethod="auto" style={{
          width: Dimensions.get('screen').width, height: height < 890 ? responsiveHeight(44) : responsiveHeight(50)
        }}
          {...this.headerbgImgProps}
        >
          <View style={styles.header} >
            <TouchableOpacity
              {...this.backbtnPressProps}>
              <Image
                style={styles.backIcon}
                {...this.backImgProps}
              />

            </TouchableOpacity>

            <Text style={{ flex: 1, color: '#fff', textAlign: 'left', fontSize: 14, flexWrap: 'wrap' }}>Book An Appointment</Text>

          </View>

          <View onLayout={this.onLayout} style={{  flex: 1, margin: verticalScale(20), alignItems: 'center' }}>
           
            <DateTimePicker 
            isBookAppointment={true} 
            value={this.state.selecteDateValue} 
            mode="time" 
            isSlider={this.state.isSliderTime}
            sliderTime={this.state.selecteTime24Hr}
            onSelect={(time) => this.onSelectedTimeFunction(time)}/>
            <MultiSlider
              min={6}
              max={23}
              values={this.state.selected}
              sliderLength={this.state.width}
              step={0.25}
              onValuesChangeFinish={this.onValuesChangeFinish}
              allowOverlap
              trackStyle={{
                height: 2.1,
                margin: 2
              }}
              markerOffsetY={3}
              selectedStyle={{
                backgroundColor: "#D8D8D8",
              }}
              unselectedStyle={{
                backgroundColor: "#D8D8D8",
              }}
              markerStyle={{ backgroundColor: '#5F54B3', borderWidth: 1, borderColor: '#fff', borderRadius: 9, height: 18, width: 18, alignItems: 'center', justifyContent: 'center' }}
            />


          </View>
          <DatePicker
            style={styles.width100}
            date={this.state.available_date}
            mode="date"
            testID="txtInputAvailableDate"
            placeholder="Select Date"
            format="DD/MM/YYYY"
            minDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconSource={require('../assets/date.png')}
            customStyles={{
              datePicker: {
                justifyContent: "center",
              },
              dateIcon: {
                right: responsiveWidth(35),
                width: 16,
                height: 18,
                justifyContent: 'center',
                alignItems: "center",
              },
              dateInput: {
                borderColor: "#ccc",
                borderWidth: 0,
                borderRadius: 4,
                width: '10%',
                justifyContent: 'center',
                alignItems: "center",
                paddingHorizontal: 10,
              },
              dateText: {
                color: '#fff',
                fontSize: 14
              }

            }}

            onDateChange={(availableDate: any) => {
              let formdate = moment(availableDate, 'DD/MM/YYYY').format('MM-DD-YYYY')
              let split = formdate.split('-');
              let y = split[0], m = split[1];
              console.log("y", y);
              let lasttDay = new Date(parseInt(y), parseInt(m), 0);
              this.setState({ appointmentsList:[], pageNo:1, available_date: availableDate, date: moment(availableDate, 'DD/MM/YYYY').format('YYYY-MM-DD'), totaldaysInMonth: moment(lasttDay).format('YYYY-MM-DD'), selected_date: availableDate }, () => {
                this.getAppointmentList(this.state.token)

              });

            }}
          />

          <CalendarStrip
            style={{ height: 100, flex: 1, marginLeft: 10, marginBottom: 10 }}
            calendarHeaderStyle={{ color: 'white', fontSize: 14 }}
            dateNumberStyle={{ color: 'white', marginTop: 2, fontSize: 12 }}
            dateNameStyle={{ color: '#fff', fontSize: 12, }}
            highlightDateContainerStyle={{ backgroundColor: '#fff' }}
            highlightDateNumberStyle={{ color: '#0F0F0F', fontSize: 12, }}
            highlightDateNameStyle={{ color: '#0F0F0F', fontSize: 12, }}
            disabledDateNameStyle={{ color: 'grey', fontSize: 12, }}
            disabledDateNumberStyle={{ color: 'grey', fontSize: 12, }}
            showMonth={false}
            iconLeft={require('../assets/left-chevron.png')}
            iconRight={require('../assets/backward.png')}
            iconLeftStyle={{ height: 16, width: 16, margin: 5 }}
            iconRightStyle={{ height: 16, width: 16, margin: 5 }}
            shouldAllowFontScaling={false}
            // selectedDate={new Date(this.state.date)}
            selectedDate={this.returnDate()}
            minDate={new Date(this.state.date)}
            startingDate={new Date(this.state.date)}
            useIsoWeekday={false}
            updateWeek={false}

            onDateSelected={(selecte_ddate) => this.DateChange(selecte_ddate)}
          />

        </ImageBackground>
        <ScrollView scrollEnabled={true} nestedScrollEnabled={false} onScroll={this.handleScroll}>

         

          <View style={[{ padding: 16, }]}>
            <Text style={{
              opacity: 1,
              backgroundColor: 'transparent',
              fontStyle: 'normal',
              fontWeight: 'normal',
              includeFontPadding: false,
              padding: 15,
              color: 'rgba(91, 91, 91, 1)',
              textAlign: 'left',
              textAlignVertical: 'top',
              fontSize: 16,
            }}>Booking a video call might be very helpful{"\n"}in elaborating solution</Text>
            <Modal
              animationType="fade"
              visible={this.state.isSlotModal}
              transparent={true}
              onRequestClose={()=> {
                this.setState({isSlotModal:false})
                this.props.navigation.goBack()
              }}
            >
              <View style={{flex:1, justifyContent:'center', alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
                <View style={[styles.modalView,{marginHorizontal:50, padding:15}]}>
                   <Text style={{ fontSize: 16, textAlign: 'center', color: '#616161',marginVertical:10, lineHeight: 18, fontWeight:'bold' }}>{"Please choose meeting duration time slot "}</Text>
                  <View style={{ marginTop: 10 }} >
                    {this.renderSlots()}
                    
                    <View style={{alignItems: 'center',justifyContent:'center',  paddingHorizontal: 10,
                    marginHorizontal: 10,}}>
                    <TouchableOpacity testID="bookAppointment1" style={[styles.inputsend, { borderWidth: 0, backgroundColor:'#7887DB',width:'55%',paddingVertical:20,marginVertical:10,alignItems: "center",
    justifyContent: "center"  }]}
                        onPress={()=> {
                          if(this.state.checked==""){
                            this.showAlert("","Please choose time slot")


                            return
                        }
                       
                        this.setState({isSlotModal:false})
                      }
                        } >

                        <Text style={[styles.textStyle, {fontSize:16}]}>Proceed</Text>

                      </TouchableOpacity>
                    </View>
                    
                  
                  </View>
                  
                 
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              visible={this.state.isconfirmModal}
              onRequestClose={() => {
                this.setState({ isconfirmModal: false })
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={{ fontSize: 20, textAlign: 'center', color: '#1B1B1B' }}>{this.state.modalTitle} </Text>
                  <Text style={{ fontSize: 15, textAlign: 'left', color: '#616161', margin: 10, lineHeight: 18 }}>{this.state.modalSubtitle}</Text>
                  {this.state.shownisconfirmmsg ? <View style={{ marginTop: 30 }} >
                    <View style={styles.circleButton}>

                      <Image style={{ height: Scale(30), width: Scale(30), alignSelf: 'center', resizeMode: "contain" }}
                        {...this.confirmAppointment} />

                    </View>

                  </View> :
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                      <TouchableOpacity testID="bookAppointment" style={[styles.modalButton, { borderWidth: 0, backgroundColor: this.state.is_bking_pressed ? '#a2a2a2' : '#8E84D9' }]}
                        {...this.showConfirmModalMsg}
                        disabled={this.state.is_bking_pressed}
                      >

                        <Text style={styles.textStyle}>Confirm</Text>

                      </TouchableOpacity>

                      <View style={{ paddingLeft: 15, }} />

                      <TouchableOpacity
                        disabled={this.state.is_bking_pressed}
                        style={[styles.modalButton, { borderColor: '#7B71CA', backgroundColor: '#fff' }]}
                        onPress={() => {
                          if(this.state.is_bking_pressed){
                            this.showAlert("Inavlid ","Already clicked on confirm")
                            return 
                          }
                          
                          this.setState({ isconfirmModal: !this.state.isconfirmModal, isconfirmPress: false,is_bking_pressed:false })
                        }
                      }
                      >
                        <Text style={[styles.textStyle, { color: '#7A6FC9' }]}>Cancel</Text>
                      </TouchableOpacity>
                     
                   
                 </View>
         
                  }
   <ActivityIndicator animating={this.state.loading} size="large" style={{alignSelf:'center'}} color={"#8E84D9"} />
             
                </View>
              </View>
            </Modal>
            {this.renderAppoinmentListContainer()}
            {this.state.loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator style={styles.loaderStyle} size="large" color={'#8E84D9'}/></View>
            ) : null}
          </View>



        </ScrollView>

      </SafeAreaView>

    );
    // Customizable Area End
  }
 }

// Customizable Area Start
const styles = StyleSheet.create({
  header: {
    width: dimensions.wp(100),
    paddingHorizontal: dimensions.wp(4),
    paddingTop: dimensions.hp(3),
    paddingBottom: dimensions.hp(6),
    flexDirection: "row",
    alignItems: "flex-start"
  },
  TextHeader: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#484848',
    // height: Scale(40)
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7)
  },
  renderShowExpListText:{
    fontSize: 14,
    fontWeight: '500',
    color: '#6B5AED',
    marginLeft: 5, 
    marginRight: 5,
    width: '100%'
  },
  appointmentsubTxt: {
    color: '#6E6E6E',
    fontSize: 12,
    marginRight: 15,
    textAlign: 'left'
  },
  circleButton: {
    backgroundColor: '#16B509',
    borderRadius: 40,
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  inputsend: {
    flexDirection: "row",

    borderColor: '#EAEAEA',
    borderWidth: 1,
    // flex: 1,
    marginRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "space-between",
    width: '50%',

  },
  backButton: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    alignSelf: 'stretch',
    marginTop: 10,

  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  innerContainer: {
    paddingVertical: 10,
    width:'50%',
    marginLeft:'2%',
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: '#BFBFBF'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButton: {
    backgroundColor: '#8E84D9',
    borderRadius: 6,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: '50%',
    borderWidth: 1,
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
  inputBox: {
    marginVertical: 10,
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 16,
  },
  width100: {
    width: "100%",
  },
  viewAppointmentsButton: {
    backgroundColor: "blue",
    borderRadius: 4,
    paddingVertical: 15,
    marginVertical: 12,
  },
  viewAppointmentsButtonText: {
    textAlign: "center",
    color: "#fff",
    lineHeight: 20,
    fontSize: 20,
    fontWeight: "600",
  },
  titletime: {
    fontSize: 17,
    color: '#3E3E3E',
    textAlign: 'left',
    // margin: 20,
    opacity: 1,
    backgroundColor: 'transparent',
    fontStyle: 'normal',
    fontWeight: 'normal',
    borderRadius: 19,
    marginLeft: 10,
    textAlignVertical: 'top',

  },
  addMore: {
    backgroundColor: "blue",
    marginBottom: 10,
    width: 80,
    height: 40,
    display: "flex",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttonTop: {
    display: "flex",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  add: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  viewBtnWidth: {
    width: "48%",
  },
  closeBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  buttonBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBox: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  modal: {
    width: "80%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 80,
    marginLeft: 40,
    padding: 15,
  },
  defaultContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: '#F0F0F0'
  },
  viewBtn: {
    backgroundColor: "blue",
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "blue",
  },
  viewBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  closeBtnText: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
  },
  tableBox: {
    borderWidth: 0.1,
    borderRadius: 18,
    borderColor: "#838383",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    margin: 10,
    elevation: 10,


  },
  infoText: {
    fontSize: 16,
    marginVertical: 4,
  },
  labelText: {
    fontWeight: "bold",

  },
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    padding: 10,
    borderWidth: Platform.OS === "web" ? 0 : 1,
  },
  bgMobileInput: {
    flex: 1,
  },
  showHide: {
    alignSelf: "center",
  },
  noCoachErroText:{
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 15,
    color: 'rgba(91, 91, 91, 1)',
    textAlign: 'left',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  loaderStyle:{
    flex: 1, 
    opacity: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
});
// Customizable Area End