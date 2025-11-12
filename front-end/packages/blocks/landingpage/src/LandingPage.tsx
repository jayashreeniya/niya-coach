import React from "react";
// Customizable Area Start
// @ts-nocheck
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Colors, dimensions } from "../../../components/src/utils";
import Scale from "../../../components/src/Scale";
import { blueLoc, bluemsgimg, clock, currentcoachProfile, headerPastCoachImgBg, location, msgimg, plyVideo, bordered_emptyStar, bordered_twoStar, bordered_threStar, bordered_fourStar, bordered_fiveStar, emptyStar, twoStar, threStar, fiveStar, fourStar,chatIcon, backImg, pdfIcon } from "./assets";
import Loader from "../../../components/src/Loader";
import moment from "moment";
import Typography from "../../../components/src/Typography";
import { deviceWidth } from "../../../framework/src/Utilities";
// Customizable Area End

import LandingPageController, {
  Props,
  configJSON
} from "./LandingPageController";

export default class LandingPage extends LandingPageController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
  
    // Customizable Area End
  }

  // Customizable Area Start
  renderImgBasedOnRating = (rating: number) => {
    if (rating == null || rating == 0) {
      return emptyStar;
    }
    else if (rating >= 1 && rating < 3) {
      return twoStar;
    }
    else if (rating >= 3 && rating < 4) {
      return threStar;
    }
    else if (rating >= 4 && rating < 5) {
      return fourStar
    }
    else {
      return fiveStar;
    }

  }
  renderBorderImgBasedOnRating = (rating: number) => {
    if (rating == null || rating == 0) {
      return bordered_emptyStar;
    }
    else if (rating >= 1 && rating < 3) {
      return bordered_twoStar;
    }
    else if (rating >= 3 && rating < 4) {
      return bordered_threStar;
    }
    else if (rating >= 4 && rating < 5) {
      return bordered_fourStar
    }
    else {
      return bordered_fiveStar;
    }

  }
  renderImgorURL = (image: any) => {
    if (image) {
      return <Image resizeMode="stretch" style={{ height: 110, width: 110, borderRadius: 10, borderColor: '#979797', }} source={{ uri: image }} ></Image>
    } else {
      return <Image resizeMode="stretch" style={{ height: 110, width: 110, borderRadius: 10, borderColor: '#979797', }} source={currentcoachProfile} ></Image>
    }
  }
  renderCurrentCoachExpOtherDetials = (rating: any, id:any,city: string, languages: any,) => {
    const languageList= languages.split(' ');
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: this.state.showId == id ? Scale(7) : Scale(5) }}>
        <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={this.renderImgBasedOnRating(rating)} ></Image>
        <Text style={[styles.appointmentsubTxt, { color: '#fff' }]}> {rating == null ? 0 : rating.toFixed(1)}</Text>

        <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} resizeMethod="resize" source={location} ></Image>
        <Text style={[styles.appointmentsubTxt, { color: '#fff', }]}> {city}</Text>
        <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={msgimg} ></Image>
        <View>
          {
            languageList.map((lang:string,index:number)=>{
              if(index%2==0){
                return(
                  <Text style={[styles.appointmentsubTxt1, { color: '#fff', }]} key={lang}>{lang}</Text>
                )
              }
              return null;
            })
          }
        </View>
        


      </View>
    )
  }
  renderCurrentCoachExpandList = (expertise: any, id: any, rating: any, city: string, languages: any, full_name: string, image: any) => {
    return (
      <View style={[{ backgroundColor: 'transparent', alignItems: 'flex-start', justifyContent: 'center', marginTop: dimensions.hp(4) }]}>
        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
          {this.renderImgorURL(image)}

          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: '#fff', fontSize: 15, fontStyle: 'normal', fontWeight: "bold", margin: 5, }}> {full_name}</Text>

            {expertise.length == 1 && <Text style={[{ color: '#fff', margin: 5, marginTop: 2 }]} numberOfLines={2}> {expertise[0].specialization}</Text>}

          <ScrollView nestedScrollEnabled={true}
              style={{ height: Scale(30), marginBottom: Scale(5), width:230 }}>

              {expertise.length > 1 && expertise.map((itm: any, index: any) => {
                return (
                  
                    <View style={{ margin: 0, padding: 0, height:38,}}>
                          <Text numberOfLines={2} style={[styles.TextHeader, { height:'100%',color: '#fff', marginBottom: 0, marginLeft: 5, marginRight: 5, marginTop: 3,}]}> {itm?.specialization}</Text>
                    </View>
                  
                )

              })}
            </ScrollView>

            {this.renderCurrentCoachExpOtherDetials(rating,id, city, languages)}
          </View>

        </View>


      </View>
    )
  }
  renderHeaderBtns = () => {
    return (
      <View style={[{
        borderRadius: 50, width: '70%',
        borderWidth: 1, height: Scale(50), borderColor: '#979797', backgroundColor: "#fff", alignItems: 'center', justifyContent: 'center', marginRight: Scale(50), marginTop: Scale(10)
      }]}>

        <View
          style={{
            height: 40,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 50,
            borderWidth: 0,
            margin: Scale(2),
          }}
        >
          {this.state.activebtn == "Current Coach" ? (

            <LinearGradient style={{
              height: 40,
              width: "49%",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.7, 0.9]}

              colors={['#5448AC', '#877DD3',]}>

              <TouchableOpacity
                onPress={() => this.setState({ activebtn: "Current Coach", isShowcureentCoachDetails: false, showId: "" })}
                testID="btnCurCoach"
             >

                <Text style={{ fontSize: 14, color: "white", marginLeft: 2 }}>
                  {" "}
                  Current Coach
                </Text>

              </TouchableOpacity>
            </LinearGradient>

          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                height: 40,
                width: "49%",
                borderWidth: 0,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
              onPress={() => {
                this.setState({ activebtn: "Current Coach", isShowcureentCoachDetails: false, showId: "" });

              }}
              testID="btnCurCoach"
            >

              <Text
                style={{ fontSize: 14, color: "#1d303f", marginLeft: 2 }}
              >
                {" "}
                Current Coach
              </Text>
            </TouchableOpacity>
          )}

          {this.state.activebtn == "Past Coach" ? (
            <LinearGradient style={{
              height: 40,
              width: "49%",

              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.7, 0.9]}

              colors={['#5448AC', '#877DD3',]}>
              <TouchableOpacity

                onPress={() => {
                  this.setState({ activebtn: "Past Coach", isShowcureentCoachDetails: false, showId: "" });
                }}
                testID="btnPastCoach"
              >

                <Text style={{ fontSize: 14, color: "white", marginLeft: 2 }}>
                  {" "}
                  Past Coach
                </Text>

              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                height: "100%",
                width: "49%",
                borderWidth: 0,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
              onPress={() => {
                this.setState({ activebtn: "Past Coach", isShowcureentCoachDetails: false, showId: "" });


              }}
              testID="btnPastCoach1"
            >

              <Text
                style={{ fontSize: 14, color: "#1d303f", marginLeft: 2 }}
              >
                {" "}
                Past Coach
              </Text>
            </TouchableOpacity>
          )}

        </View>

      </View>
    )
  }

  renerCurretnCoachHeader = () => {
    let { full_name, image, rating, city, languages, expertise, id } = this.state.cureentCoachDetails?.attributes?.coach_details;
    return (
      <ImageBackground resizeMethod="scale" resizeMode="cover" imageStyle={{ borderBottomLeftRadius: 35 }} style={{
        width: Dimensions.get('screen').width, height: dimensions.hp(45)
      }}
        {...this.headerbgImgProps}
      >
        <View style={{ justifyContent: 'flex-start', flex: 1, alignItems: 'center' }} >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Scale(10), width: '95%' }}>
            <TouchableOpacity style={styles.backButton} {...this.backbtnPressProps}>
              <Image
                style={{ height: 15, width: 20, alignSelf: 'flex-start', }}
                {...this.backImgProps}
              />

            </TouchableOpacity>

            {this.renderHeaderBtns()}

          </View>

          {this.renderCurrentCoachExpandList(expertise, id, rating, city, languages, full_name, image)}
          <Text style={{ color: '#FFF', fontSize: 15, fontStyle: 'normal', fontWeight: 'normal', margin: 5, textAlign: 'left', marginTop: dimensions.hp(2), }}> {this.state.activebtn == "Current Coach" ? "Upcoming Appointments" : "Past Appointments"}</Text>

          {this.renderUpcomingAppforCurrentCoach()}

        </View>


      </ImageBackground>

    )
  }
  renderUpcomingAppforCurrentCoach = () => {
    return (
      <ScrollView horizontal={true}>

        {this.state.upcomingAppointment?.map((item) => {
          return (
            <>
              {item?.attributes?.upcoming_appointments?.upcoming_appointments?.map((appointment: { start_time: string | number | boolean | {} | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactNodeArray | React.ReactPortal | null | undefined; }) => {
                return (

                  <View style={{
                    borderWidth: 0.1, width: dimensions.wp(60), height: dimensions.hp(8), alignItems: 'center', justifyContent: 'center',
                    borderRadius: 8, marginHorizontal: 20, backgroundColor: "#fff", marginTop: dimensions.hp(2) 
                  }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10, }}>
                      <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={clock} ></Image>
                      <Text style={[styles.appointmentsubTxt, { color: '#f797979', }]}> {moment(appointment.start_time, 'DD/MM/YYYY HH:mm').format('hh:mm A DD MMM YYYY')}</Text>
                      <Image style={{ height: 40, width: 40, resizeMode: 'contain' }} source={plyVideo} ></Image>

                    </View>
                  </View>

                )
              })}
            </>

          )
        })}
      </ScrollView>
    )
  }

  renerPastCoachHeader = () => {
    return (
      <ImageBackground resizeMethod="scale" resizeMode="cover" style={{
        width: Dimensions.get('screen').width, height: dimensions.hp(12)
      }}
        source={headerPastCoachImgBg}

      >
        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }} >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack(null)}
            testID="btnCCBack"
            >
              <Image
                style={{ height: 15, width: 20, alignSelf: 'flex-start', }}
                {...this.backImgProps}
              />

            </TouchableOpacity>

            {this.renderHeaderBtns()}

          </View>

        </View>
      </ImageBackground>
    )
  }

  renderExpandableList = (expertise: any, id: any, full_name: string, education: any = "",) => {
        return (
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: '#2F2F2F', fontSize: 15, fontStyle: 'normal', fontWeight: 'normal', margin: 5, marginTop: -1 }}> {full_name}</Text>

        {expertise.length == 1 && <View style={{ height: Scale(6) }}><Text style={[styles.TextHeader, { color: '#6B5AED', marginBottom: 2, marginLeft: 5, marginRight: 5, marginTop: 3 }]}> {expertise[0].specialization}</Text></View>}

      <ScrollView nestedScrollEnabled={true} style={{ height: Scale(50),width:'70%',}}>

          {expertise.length > 1 && expertise.map((itm: any, index: any) => {
            return (
              <>
                <View style={{ margin: 0, padding: 0, height: Scale(35), width:'100%',}}>
                  <Text numberOfLines={2} style={[styles.TextHeader, { color: '#6B5AED', marginBottom: 0, marginLeft: 5, marginRight: 5, marginTop: 3,
                width:'90%',height:'100%',}]}> {itm?.specialization}</Text>
                </View>
              </>
            )

          })}
        </ScrollView>
      
        {education != "" && <Text numberOfLines={1} style={[{ color: '#6D6D6D', margin: 5, marginTop: 4, fontSize: 12, width: '75%' }]}> {education}</Text>
        }
      </View>
    )
  }
  getList(item: any) {
    let { full_name, email, phone_number, id, image, rating, city, languages, expertise, education } = item?.attributes?.coach_details;
    let seletedId = item?.attributes?.id
    console.log(email, phone_number, seletedId, education);
    
    const langDetail= languages.split(' ');
    return (

      <View style={styles.tableBox}>
        <TouchableOpacity style={{ marginLeft: Scale(10), alignItems: 'flex-end' }} onPress={() => this.onPressCoachDeatails(item, id, full_name, image)}>
          <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 5, marginLeft: 10 }} source={require('../assets/next.png')} ></Image>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', margin: 10, marginTop: 1 }}>
          <TouchableOpacity onPress={() => this.onPressCoachDeatails(item, id, full_name, image)}>
            {image ? <Image
              style={{ height: 100, width: 100, alignSelf: 'flex-start', marginLeft: 5, borderRadius: 50, resizeMode: 'cover' }}
              source={{ uri: image }}
            /> : <Image
              style={{ height: 100, width: 100, alignSelf: 'flex-start', marginLeft: 5, borderRadius: 50, resizeMode: 'cover' }}
              source={currentcoachProfile}
            />}
          </TouchableOpacity>
          {this.renderExpandableList(expertise, id, full_name, education,)}

        </View>

        <View style={{ marginLeft: dimensions.wp(10), flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', maxWidth: deviceWidth/1.2,  }}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={this.renderBorderImgBasedOnRating(rating)} ></Image>
          <Text style={styles.appointmentsubTxt}> {rating == null ? 0 : rating.toFixed(1)}</Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center'}}>
          <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} resizeMethod="resize" source={blueLoc} ></Image>
          <Text style={styles.appointmentsubTxt}> {city}</Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', maxWidth:deviceWidth/3, overflow:'hidden'}}>
          <Image style={{ height: 20, width: 20, resizeMode: 'contain',marginRight:2 }} source={bluemsgimg} ></Image>
          <View>
          {
            langDetail.map((item:string,index:number)=>{
              if(index%2==0){
                return(<Text key={item} style={styles.appointmentsubTxt} ellipsizeMode="tail"> {item}</Text>)
              }
              return null;
            })
          }
          
          </View>
          </View>


        </View>
        </View>
    );
  }

  renderPastCoachData = () => {
    return (
      <FlatList
        data={this.state.pastCoachData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => this.getList(item)}
        nestedScrollEnabled
      />
    );
  }

  renderCurrentCoachData = () => {
    return (
      <FlatList
        data={this.state.currentCoachData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => this.getList(item)}
        nestedScrollEnabled
      />
    );
  }

  renderFile = (file: any, index: number) => {

    return (
     
      <View>
         {
        file?.text !== "IMAGE" ? 
        <TouchableOpacity
        testID={`file${index}`}
          key={file.sid}
          onPress={()=> this.getPreview(file?.url, file?.text)}
        >
          <ImageBackground
          style={{
            width: dimensions.wp(42),
            height: dimensions.wp(42),
            alignItems: "center",
            justifyContent: "center",
            margin: dimensions.wp(4),
            borderColor: "#eeeeee",
            borderWidth: 3,
            borderRadius: 10
          }}
          source={pdfIcon}
          resizeMode="contain">
          <Typography color="white" size={20}>{""}</Typography>
          </ImageBackground>
        </TouchableOpacity>
        :
        <TouchableOpacity testID="touchableImg" onPress={()=> this.getPreview(file?.url, file?.text)}>
        <ImageBackground
          source={{ uri: file?.url }}
          style={styles.document}
        >
          <Typography size={20} color="white">{""}</Typography>
        </ImageBackground>
        </TouchableOpacity>
        }
         <Typography size={10}
          style={{alignSelf: "flex-end", marginRight: dimensions.wp(4)}}
          color={"greyText"} >{file?.title.substring(0,25)+"..."}</Typography>
        <Typography
          size={10}
          style={{ alignSelf: "flex-end", marginRight: dimensions.wp(4) }}
          color={"greyText"}
        >
          { moment(file?.date_created)?.calendar?.({ sameElse: "DD MMMM YYYY" })} {file?.fromMe ? "(You)" : "" }
        </Typography>
      </View>
    
    );
  }
  renderDocuments = () =>{
    if(this.state.documents.length==0){
      return (
      <TouchableOpacity  style={{  marginHorizontal: dimensions.wp(4),
        marginVertical: dimensions.hp(1)}}>
                    <View style={[styles.row, styles.mb]}>
                      <Typography
                        size={13}
                        font="MED"
                        style={[styles.statusText, ]}
                      >
                        { "No past documents to show."}
                      </Typography>
                    </View>
                    </TouchableOpacity>
     );
    }
    else{
    if (this.state.loading) {
      return (
        <View style={[styles.fullFlex, { alignItems: "center", justifyContent: "center" }]}>
          <ActivityIndicator size={"large"} color={Colors.coachAccent} />
        </View>
      );
    }
    return (
      <ScrollView >
      <View style={styles.fullFlex}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {this.state.result.map((d: any, i: number)=>{
            return this.renderFile(d, i);
          })}
        </View>

      </View>
      </ScrollView>
    );
  }
  }
  renderMessage = (message: any, idx: number) => {
    const fromMe = message.author === this.state.sender;
    console.log(message.author, this.state.sender)
    if (!message.body) return null;

    const next = this.state.messages[idx + 1] || {};
    const showDate = new Date(message.date_created).toLocaleDateString() !== new Date(next.date_created).toLocaleDateString();

    return (
      <>
        <View
          style={[styles.chatBlock, {
            backgroundColor: fromMe ? Colors.empAccent : "#efefef",
            alignSelf: fromMe ? "flex-end" : "flex-start"
          }]}>
          <Typography size={15} color={fromMe ? "white" : "black"}>{message.body}</Typography>
          <Typography
            size={10}
            style={{ alignSelf: "flex-end" }}
            color={fromMe ? "white" : "black"}
          >
            { moment(message.date_created)?.format?.("hh:mm A") }
          </Typography>
        </View>
        {showDate ?
          <View style={{ padding: dimensions.hp(2) }}>
            <Typography color="greyText" align="center" size={14}>
              {moment(message.date_created)?.isSame?.(moment(), "day") ? "Today" : moment(message.date_created)?.format?.("DD MMMM yyyy")}
            </Typography>
          </View> :
          null}
      </>
    );
  }
  renderChat = () => {
    if(this.state.messages.length>0)
    {

    return (
      <View style={[styles.fullFlex, { width: dimensions.wp(85) }]}>
        <FlatList
          inverted
          data={this.state.messages}
          keyExtractor={item => item.sid}
          renderItem={({ item, index }) => this.renderMessage(item, index)}
          style={styles.fullFlex}
          ListEmptyComponent={((this.state.loading) ? <View>
            <ActivityIndicator color={Colors.empAccent} size="large" />
          </View> : null)}
        />

      </View>
    );
  }
  else{
    return (
      <TouchableOpacity 
       onPress={()=>this.toggleLike()} 
       style={{  marginHorizontal: dimensions.wp(4),marginVertical: dimensions.hp(1)}}
        >
                    <View style={[styles.row, styles.mb]}>
                      <Typography
                        size={13}
                        font="MED"
                        style={[styles.statusText, ]}
                      >
                        { "No past conversations to show. You may start a new conversation here."}
                      </Typography>
                    </View>
                    </TouchableOpacity>
    );
  }
  }
  renderPendingAppointments = () => {
    if(this.state.upcomingAppointment.length>0)
    {
    return (
      <>
        {this.state.upcomingAppointment.map((item) => {
          return (
            <ScrollView >
              {item?.attributes?.upcoming_appointments?.upcoming_appointments?.map((itm: any) => {
                const { booking_date, viewable_slots } = itm;
                const [start, end] = viewable_slots?.split?.(" - ");
                const bookingDate = moment(booking_date, "YYYY-MM-DD");
                const now = moment();
                const startMoment = moment(start, ["DD/MM/YYYY HH:mm"]);
                const endMoment = moment(end, ["DD/MM/YYYY HH:mm"])
                const onGoing = now.isBetween(startMoment, endMoment);
                const past = now.isAfter(endMoment);
                return (

                  <TouchableOpacity style={styles.appointment}>
                    <View style={[styles.row, styles.mb]}>
                      <Typography
                        font="MED"
                        size={13}
                        color="white"
                        style={[styles.statusText, {backgroundColor: (past) ? "#e5c041" : Colors.green}]}
                      >
                        {onGoing ? "Ongoing" : past ? "Completed" : "Upcoming"}
                      </Typography>
                    </View>
                    <View style={styles.row}>
                      <Image source={clock} style={[styles.clock, { tintColor: past ? Colors.red : Colors.green }]} />
                      <Typography color="inputTextColor" size={13}>{moment(start, ["DD/MM/YYYY HH:mm"]).format("hh:mm A")} - {moment(end, ["DD/MM/YYYY HH:mm"]).format("hh:mm A")}</Typography>
                      <View style={styles.fullFlex} />
                      <Typography color="inputTextColor" size={13}>{bookingDate.format("dddd")}, {bookingDate.format("DD-MM-YYYY")}</Typography>
                    </View>
                  </TouchableOpacity>

                );
              })
              }
            </ScrollView>

          );
        })
        }
      </>
    )
   }
    else{
      return (
      <TouchableOpacity  style={{  marginHorizontal: dimensions.wp(4),
        marginVertical: dimensions.hp(1)}}>
                    <View style={[styles.row, styles.mb]}>
                      <Typography
                        size={13}
                        font="MED"
                        style={[styles.statusText, ]}
                      >
                        { "No appointment to show."}
                      </Typography>
                    </View>
                    </TouchableOpacity>
    );
    }
  }
  renderList = () => {
    switch (this.state.activeTab) {
      case 3:
        return this.renderPendingAppointments();
      case 2:
        return this.renderDocuments();
      default:
        return this.renderChat();
    }
  }

  rendertabsBasedOnActiveBtn=()=>{
    if(this.state.activebtn == "Past Coach"&& !this.state.isShowcureentCoachDetails){
      return this.renderPastCoachData();
    }else  if(!this.state.isShowcureentCoachDetails){
      return this.renderCurrentCoachData();
    }
   
  }
  checkIfAlreadyActive(){
    if(this.state.activeTab==1){
      return
    }
    this.switchTab(1);
    this.conversationEventLoop()
  }
  renderisShowcureentCoachDetailsData=()=>{
    if(this.state.isShowcureentCoachDetails){
      return (
        <View style={styles.row}>
        <TouchableOpacity
          onPress={() => {
            this.checkIfAlreadyActive()
          }}
          style={[styles.halfRow, styles.activeRow, { width: "30%", backgroundColor: this.state.activeTab === 1 ? "#BFBBE4" : '#F9F9F9' }]}
          testID="btnMessages"
        >
          <Text style={{ color: this.state.activeTab === 1 ? '#fff' : "#404040", textAlign: 'center', fontSize: 15 }} >Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({activeTab: 2}, ()=>{
              console.log("active TAB =", this.state.activeTab );
              clearInterval(this.conversationEvent)
            })
          }}
          style={[styles.halfRow, styles.activeRow, { width: "30%", backgroundColor: this.state.activeTab === 2 ? "#BFBBE4" : '#F9F9F9' }]}
          testID="btnDocs"
        >
          <Text style={{ color: this.state.activeTab === 2 ? '#fff' : "#404040", textAlign: 'center', fontSize: 15 }} >Docs Shared</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({activeTab: 3}, ()=>clearInterval(this.conversationEvent)) 
          }}
          style={[styles.halfRow, styles.activeRow, { width: "30%", backgroundColor: this.state.activeTab === 3 ? "#BFBBE4" : '#F9F9F9' }]}
          testID="btnAppointments"
        >
          <Text style={{ color: this.state.activeTab === 3 ? '#fff' : "#404040", textAlign: 'center', fontSize: 15 }} >Appointments</Text>
        </TouchableOpacity>
      </View>
      )
    }
  }
  renderGestureHandlerView=()=>{
    if(this.state.isShowcureentCoachDetails){
      return(
       <>
      <View style={[styles.fullFlex]}>
      {this.renderList()}
   <TouchableOpacity
    onPress={() =>{this.toggleLike()}}
    style={styles.sendButton}
    testID="btnSendMsg"
  >
    <Image source={chatIcon} style={styles.sendIcon} />
  </TouchableOpacity>

</View>
    </>
  )
    }
  }
  renderHeaderBasedSelection=()=>{
    if(this.state.isShowcureentCoachDetails ) 
     { 
      return this.renerCurretnCoachHeader();
     }
     else 
      {
        return this.renerPastCoachHeader();
      }
       
  }
  renderPreview = () => {

    return(
      <Modal
        visible={this.state.showPreview}
        transparent
      >
        <View style={[styles.fullFlex, { backgroundColor: Colors.black }]}>
          <TouchableOpacity
            onPress={this.togglePreview}
            style={styles.previewbackButton}
          >
            <Image
              source={backImg}
              style={{ height: dimensions.wp(5), width: dimensions.wp(5),resizeMode:'contain' }}
            />
          </TouchableOpacity>
       
            <Image
              source={{ uri: this.state.previewUrl }}
              style={styles.previewImage1}
            />
         
        </View>
      </Modal>
    );
  }
  // Customizable Area End

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        {/* Customizable Area Start */}
        {this.state.loading ? <Loader loading={this.state.loading} /> : <>
          {this.renderHeaderBasedSelection()}
          <View style={styles.mainContainer}>
            {this.rendertabsBasedOnActiveBtn()}
            {this.renderisShowcureentCoachDetailsData()}
            {this.renderGestureHandlerView()}
            {this.renderPreview()}
          </View>
        </>
        }
        {/* Customizable Area End */}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  fullFlex: {
    flex: 1
  },
  mb: {
    marginBottom: dimensions.hp(2)
  },
  chatBlock: {
    padding: dimensions.wp(3.5),
    borderRadius: dimensions.wp(3),
    backgroundColor: "#efefef",
    marginTop: dimensions.hp(1),
    marginHorizontal: dimensions.wp(4),
    alignSelf: "flex-start",
    marginBottom: dimensions.hp(.5)
  },
  appointment: {
    marginHorizontal: dimensions.wp(4),
    marginVertical: dimensions.hp(1),
    backgroundColor: Colors.white,
    borderColor: "#C1B9FF",
    borderWidth: 1,
    borderRadius: dimensions.wp(2),
    padding: dimensions.wp(4),
    elevation: 4,

  },
  document: {
    width: dimensions.wp(42),
    height: dimensions.wp(42),
    borderColor: "#eeeeee",
    borderWidth: 3,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: dimensions.wp(4)
  },
  statusText: {
    paddingVertical: dimensions.hp(.5),
    paddingHorizontal: dimensions.wp(3),
    borderRadius: dimensions.wp(3)
  },
  clock: {
    height: dimensions.hp(2),
    width: dimensions.hp(2),
    resizeMode: "contain",
    marginRight: dimensions.wp(2),
    tintColor: Colors.green
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: '100%'
  },
  previewImage1: {
    height: dimensions.hp(100),
    width: dimensions.wp(100),
    resizeMode: "contain"
  },
  TextHeader: {
    fontWeight: "bold",
    color: '#6B5AED',
    margin: 5,
    marginTop: 2
  },
  landingPageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  landingPageText: {
    fontSize: 42,
    letterSpacing: 2,
    fontWeight: "bold",
    color: "#323441",
    marginTop: 15
  },
  header: {
    width: "100%",
    height: Scale(40),

  },
  mainContainer: {
    flex: 1,
 },
  appointmentsubTxt: {
    color: '#6E6E6E',
    fontSize: 12,
    marginRight: 15,
          textAlign: 'left'
  },
  appointmentsubTxt1: {
    color: '#6E6E6E',
    fontSize: 12,
    marginRight:4,
    textAlign: 'left'
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
  tableBox: {
    borderWidth: 0.1,
    borderRadius: 18,
    borderColor: "#838383",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    elevation: 10,


  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  halfRow: {
    paddingVertical: dimensions.hp(1.5)
  },
  activeRow: {
    backgroundColor: '#BFBBE4',
    borderBottomWidth: 0,
    borderRadius: 12,
    margin: 5
  },
  sendButton: {
     position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 10,
  },
  sendIcon: {
    height: dimensions.wp(15),
    width: dimensions.wp(15),
    resizeMode: 'contain',
     },

  inputBlock: {
    padding: dimensions.wp(4),
    paddingBottom: dimensions.hp(3),
    backgroundColor: "#eeeeee",
    justifyContent:'flex-end',
    alignItems:'flex-end',
    marginBottom:dimensions.hp(5)
    
  },
  previewbackButton: {
    backgroundColor: Colors.black,
    width: dimensions.wp(10),
    height: dimensions.wp(10),
    position: "absolute",
    top:Platform.OS=='android'? dimensions.wp(4):dimensions.wp(10),
    left: dimensions.wp(4),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    borderRadius: dimensions.wp(5)
  },
});
// Customizable Area End
