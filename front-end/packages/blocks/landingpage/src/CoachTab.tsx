import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import moment from "moment";
import * as yup from "yup";

import { backImg,clock,headerPastCoachImgBg, send,currentcoachProfile, pdfIcon} from "./assets";
import { Colors, dimensions } from "../../../components/src/utils";
import Typography from "../../../components/src/Typography";
import Input from "../../../components/src/Input";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start

// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import LandingPageController,{Props} from "./LandingPageController";

export default class CoachTab extends LandingPageController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start

    // Customizable Area End
  }
  days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Customizable Area Start
  actionSchema = yup.object().shape({
    title: yup.string().min(5, "Please enter 5 characters").required("This field is mandatory")
  });


  renderPendingAppointments = () => {
  return(
    <>
      {this.state.upcomingAppointment.map((item)=>{
        return(
        <ScrollView>
        {item?.attributes?.upcoming_appointments?.upcoming_appointments?.map((itm:any)=>{
          console.log(itm,"itm:::")
          const { booking_date, viewable_slots } = itm;
          const [start, end] = viewable_slots?.split?.(" - ");
          const bookingDate = moment(booking_date, "YYYY-MM-DD");
          const past = moment(start, ["DD/MM/YYYY HH:mm"]).isBefore(moment());
          return(
            <TouchableOpacity style={styles.appointment}>
              <View style={[styles.row, styles.mb]}>
                <Typography
                  color="white"
                  size={13}
                  font="MED"
                  style={[styles.statusText, { backgroundColor: (past)? "#e5c041": Colors.green }]}
                >
                  {past? "Completed": "Upcoming"}
                </Typography>
              </View>
              <View style={styles.row}>
                <Image source={clock} style={[styles.clock, { tintColor: past? Colors.red: Colors.green }]} />
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
  renderMessage = (message: any,idx: number) => {
    const fromMe = message.author === this.state.sender;
    // console.log(message.author, this.state.sender)
    if(!message.body) return null;

    const next = this.state.messages[idx + 1] || {};
    const showDate = new Date(message.date_created).toLocaleDateString() !== new Date(next.date_created).toLocaleDateString();

    return(
      <>
      <View
        style={[styles.chatBlock, {
          backgroundColor: fromMe? Colors.empAccent: "#efefef",
          alignSelf: fromMe? "flex-end": "flex-start"
      }]}>
        <Typography size={15} color={fromMe? "white": "black"}>{message.body}</Typography>
        <Typography
          size={10}
          style={{ alignSelf: "flex-end" }}
          color={fromMe? "white": "black"}
        >
          {moment(message.date_created)?.format?.("hh:mm A")}
        </Typography>
      </View>
      {showDate?
        <View style={{ padding: dimensions.hp(2) }}>
          <Typography color="greyText" align="center" size={14}>
            {moment(message.date_created)?.isSame?.(moment(), "day")? "Today": moment(message.date_created)?.format?.("DD MMMM yyyy")}
          </Typography>
        </View>:
        null}
      </>
    );
  }
  renderChat = () => {
    return(
      <View style={styles.fullFlex}>
        <FlatList
          inverted
          data={this.state.messages}
          keyExtractor={item => item.sid}
          renderItem={({ item, index }) => this.renderMessage(item, index)}
          style={styles.fullFlex}
          ListEmptyComponent={((this.state.loading)? <View>
            <ActivityIndicator color={Colors.empAccent} size="large" />
          </View>:   <View style={{margin:10, padding: dimensions.hp(2),backgroundColor:'#eeeeee' ,borderRadius:10,}}>
         <Typography
                        size={13}
                        font="MED"
                        style={[styles.statusText,{textAlign:'center'} ]}
                      >
                        { "No past conversations to show. You may start a new conversation here."}
                      </Typography></View>
                      )}
        />
        <View style={[styles.row, styles.inputBlock]}>
          <Input
            value={this.state.newMessage}
            onChange={(t: string) => this.setState({ newMessage: t })}
            containerStyle={styles.chatInput}
            testID="txtnewMessage"
          />
           <TouchableOpacity
            onPress={() => this.sendMessage()}
            style={styles.sendButton}
            testID="btnSendMsg"
          >
            <Image source={send} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  renderDocuments = () => {
    if(this.state.docLoading){
      return(
        <View style={[styles.fullFlex, { alignItems: "center", justifyContent: "center" }]}>
          <ActivityIndicator size={"large"} color={Colors.coachAccent} />
        </View>
      );
    }
    return(
      <View style={styles.fullFlex}>
        <ScrollView>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {this.state.result.map((d: any, i: number)=>{
            return this.renderFile(d, i);
          })}
        </View>
        </ScrollView>
        <TouchableOpacity
          onPress={this.selectFile}
          style={styles.upload}
        >
          <Typography color="white" size={30} mb={.5}>+</Typography>
        </TouchableOpacity>
      </View>
    );
  }  
  renderFile = (file: any, index: number) => {

    return (
     
      <View style={{overflow:'hidden'}}>
         {
        file?.text !== "IMAGE" ? 
        <TouchableOpacity testID="touchableImg" onPress={()=> this.getPreview(file?.url, file?.text)}>
        <ImageBackground
          style={styles.pdfBg}
          source={pdfIcon}
          resizeMode="contain"
        >
          <Typography color="white" size={20}>{""}</Typography>
        </ImageBackground>
        </TouchableOpacity>
        :
        <TouchableOpacity testID="touchableImg" onPress={()=> this.getPreview(file?.url, file?.text)}>
        <ImageBackground
          source={{uri: file?.url}}
          style={styles.document}
        >
          <Typography color="white" size={20}>{""}</Typography>
        </ImageBackground>
        </TouchableOpacity>
        }
        <View style={{ width:'95%', alignSelf:'center'}}>
        <Typography size={10}
          color={"greyText"}
          align="right"
          style={{ alignSelf: "flex-end", marginRight: dimensions.wp(0) }}>{file?.title.substring(0,25)+"..."}</Typography>
        <Typography
          size={10}
          style={{overflow:'hidden', alignSelf: "flex-end", marginRight: dimensions.wp(0) }}
          color={"greyText"}
        >
          {moment(file?.date_created)?.calendar?.({ sameElse: "DD MMMM YYYY" })} {file?.fromMe ? "(You)" : ""}
        </Typography>
        </View>
      </View>
    );
  }
  renderList = () => {
    switch(this.state.activeTab){
      case 3:
        return this.renderPendingAppointments();
      case 2:
        return this.renderDocuments();
      default:
        return this.renderChat();
    }
  }
  async componentDidMount() {
      this.setState({token:this.context?.state?.token,upcomingAppointment:[].concat(this.props.navigation.state.params?.coachAppointmentData),currentCoachName:this.props.navigation.state.params?.name,currentCoachId:this.props.navigation.state.params?.id,coachprifileimage:this.props.navigation.state.params?.coachprifileimage},()=>{
        this.getChatDetails(this.props.navigation.state.params.id);  
    
      });
      if(this.state.conversationId!=""){
        this.conversationEventLoop();
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
            style={styles.backButton}
          >
            <Image
              source={backImg}
              style={{ height: dimensions.wp(5), width: dimensions.wp(5),resizeMode:'contain' }}
            />
          </TouchableOpacity>
       
            <Image
              source={{ uri: this.state.previewUrl }}
              style={styles.previewImage}
            />
         
        </View>
      </Modal>
    );
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
   // Merge Engine - render - Start
    return (
 <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS=="ios"?"padding":undefined}>
    
               <ImageBackground resizeMethod="scale" resizeMode="cover" style={{
        width: dimensions.wp(100), height: dimensions.hp(15)
      }}
        source={headerPastCoachImgBg}

      >
        
          <View style={[styles.row, styles.mb, styles.pad,{alignItems:'center',justifyContent:'center',marginTop:dimensions.hp(2),}]}>
            <TouchableOpacity onPress={() =>{ 
               this.setState({ isShowcureentCoachDetails:true})
              let callbackvar=this.props.navigation.getParam("callback");
              
               this.props.navigation.goBack();
               setTimeout(() => {
                // console.log("setTimeout")
                callbackvar?.();
               }, );
              }}
              testID="btnBack"
              >
              <Image source={backImg} style={styles.backIcon} />
            </TouchableOpacity>
           
            <TouchableOpacity >
              <Image style={{ height: 40, width: 40, borderRadius: 20, marginRight: 10, }} source={this.state.coachprifileimage ? { uri: this.state.coachprifileimage } : currentcoachProfile} />

            </TouchableOpacity>
                 
               <Typography
                style={styles.fullFlex}
                color="white"
                font="MED"
                size={18}
                >
                  {this.state.currentCoachName}
               </Typography>
           
               
           
        
          </View>
          <View style={[styles.row,{}]}>
            <TouchableOpacity
              onPress={() => {
                if(this.state.activeTab==1){
                  return
                }
                this.switchTab(1);
                this.conversationEventLoop()
              }}
              style={[styles.halfRow, (this.state.activeTab === 1)? styles.activeRow: {}, { width: "30%" }]}
              testID="btnMessTab"
            >
              <Typography size={15} color="white" align="center">Chats</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({activeTab: 2}, ()=>{
                  console.log("active TAB =", this.state.activeTab );
                  clearInterval(this.conversationEvent)
                })
              }}
              style={[styles.halfRow, (this.state.activeTab === 2)? styles.activeRow: {}, { width: "30%" }]}
              testID="btnDocsTab"
              disabled={this.state.loading}
            >
              <Typography size={15} color="white" align="center">Docs</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({activeTab: 3}, ()=>clearInterval(this.conversationEvent)) 
              }}
              style={[styles.halfRow, (this.state.activeTab === 3)? styles.activeRow: {}, { width: "40%" }]}
              testID="btnAppointmentsTab"
            >
              <Typography size={15} color="white" align="center">Appointments</Typography>
            </TouchableOpacity>
          </View>
           </ImageBackground>
       
        {this.renderList()}
        {this.renderPreview()}
        
</KeyboardAvoidingView>
            </SafeAreaView>
     
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  inputBlock: {
    padding: dimensions.wp(4),
    // paddingBottom: dimensions.hp(1),
    backgroundColor: "#eeeeee"
  },
  container: {
    height: "100%",
    backgroundColor: Colors.white
  },
  chatInput: {
    borderRadius: dimensions.hp(10),
    borderColor: Colors.greyText,
    marginRight: dimensions.wp(4),
    flex: 1,
    marginBottom: 0,
    height: dimensions.hp(5)
  },
  sendButton: {
    height: dimensions.hp(5),
    width: dimensions.hp(5),
    borderRadius: dimensions.hp(2.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.empAccent
  },
  sendIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    tintColor: Colors.white
  },
  upload: {
    position: "absolute",
    bottom: dimensions.hp(3),
    right: dimensions.wp(4),
    height: dimensions.wp(15),
    width: dimensions.wp(15),
    borderRadius: dimensions.wp(7.5),
    backgroundColor: Colors.empAccent,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    width: dimensions.wp(100),
    paddingTop: dimensions.hp(3),
    borderBottomColor: Colors.greyText,
    borderBottomWidth: 1
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7)
  },
  pad: {
    paddingHorizontal: dimensions.wp(5),
  },
  fullFlex: {
    flex: 1
  },
  mb: {
    marginBottom: dimensions.hp(2)
  },
  halfRow: {
    paddingVertical: dimensions.hp(1.5)
  },
  actionButton: {
    backgroundColor: Colors.white,
    width: dimensions.wp(40),
    height: dimensions.hp(4),
    marginBottom: 0
  },
  activeRow: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 3
  },
  appointment: {
    marginHorizontal: dimensions.wp(4),
    marginVertical: dimensions.hp(1),
    backgroundColor:Colors.white,
    borderColor: "#C1B9FF",
    borderWidth: 1,
    borderRadius: dimensions.wp(2),
    padding: dimensions.wp(4),
    elevation: 4,

  },
  calendar: {
    height: dimensions.hp(2),
    width: dimensions.hp(2),
    resizeMode: "contain",
    padding: dimensions.wp(1),
    // backgroundColor: "#eeeeee"
  },
  clock: {
    height: dimensions.hp(2),
    width: dimensions.hp(2),
    resizeMode: "contain",
    marginRight: dimensions.wp(2),
    tintColor: Colors.green
  },
  statusText: {
    paddingVertical: dimensions.hp(.5),
    paddingHorizontal: dimensions.wp(3),
    borderRadius: dimensions.wp(3)
  },
  modalButton: {
    backgroundColor: Colors.empAccent
  },
  appointmentsubTxt:{
    color:'#6E6E6E' ,
    fontSize:12,
    marginRight:15,
    // marginLeft:3,
    textAlign:'left'
  },
  button: {
    backgroundColor: Colors.green,
    marginBottom: 0,
    marginTop: dimensions.hp(2)
  },
  greenClock: {
    tintColor: Colors.green
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
  pdfBg:{
    alignItems: "center",
    justifyContent: "center",
    margin: dimensions.wp(4),
    width: dimensions.wp(42),
    height: dimensions.wp(42),
    borderColor: "#eeeeee",
    borderWidth: 3,
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: Colors.black,
    width: dimensions.wp(10),
    height: dimensions.wp(10),
    position: "absolute",
    top: dimensions.wp(4),
    left: dimensions.wp(4),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    borderRadius: dimensions.wp(5)
  },
  previewImage: {
    height: dimensions.hp(100),
    width: dimensions.wp(100),
    resizeMode: "contain"
  }
});
// Customizable Area End
