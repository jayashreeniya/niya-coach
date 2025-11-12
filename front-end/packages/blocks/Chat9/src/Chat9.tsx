// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Formik } from "formik";
import moment from "moment";
import * as yup from "yup";
import { clock } from "../../../components/src/images";
import { back } from "../../AudioLibrary/src/assets";
import { send } from "./assets";
import { Colors, dimensions } from "../../../components/src/utils";
import Typography from "../../../components/src/Typography";
import Button from "../../../components/src/Button";
import ModalWrapper from "../../../components/src/ModalWrapper";
import Input from "../../../components/src/Input";
import CalendarStrip from "../../../components/src/CalendarStrip";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import Chat9Controller, {
  Props,
  configJSON,
} from "./Chat9Controller";
import { pdfIcon } from "../../landingpage/src/assets";

export default class Chat9 extends Chat9Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start

    // Customizable Area End
  }

  // Customizable Area Start
  actionSchema = yup.object().shape({
    title: yup.string().min(5, "Please enter 5 characters").required("This field is mandatory")
  });

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
              source={back}
              style={{ height: dimensions.wp(5), width: dimensions.wp(5), resizeMode: "contain" }}
            />
          </TouchableOpacity>
          {/* {isPdf? (
            <WebView
              source={{ uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${this.state.previewUrl}` }}
              javaScriptEnabled={true}
              originWhitelist={['*']}
              scalesPageToFit={false}
              startInLoadingState={true}
              allowFileAccess={true}
              useWebKit={true}
              style={styles.fullFlex}
            />
          ):( */}
            <Image
              source={{ uri: this.state.previewUrl }}
              style={styles.previewImage}
            />
          {/* )}*/}
        </View>
      </Modal>
    );
  }

  renderModal = () => {
    return(
      <ModalWrapper
         visible={this.state.showActionModal}
         onClose={this.toggleActionModal}
         title="Suggest An Action Item"
       >
         <Formik
           initialValues={{
             title: "",
             date: moment()
           }}
           onSubmit={(data) => {
            if(data.date.isBefore(moment().startOf("day"))){
              Alert.alert("", "Please select a future date");
              return;
            }
             const body = {
               service_user_id: `${this.props.navigation.getParam("id")}`,
               action_item: data.title,
               date: data.date.format("DD/MM/YYYY")
             }
              this.setState({ load: true });
              this.recommendAction(body);
           }}
           validationSchema={this.actionSchema}
         >
           {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <>
                <Input
                  value={values.title}
                  onChange={handleChange("title")}
                  onBlur={handleBlur("title")}
                  blurOnSubmit={true}
                  errorText={errors.title}
                  touched={touched.title}
                  mb={2}
                  style={{height:Platform.OS=="ios"?50: 45}}
                />
                <CalendarStrip
                  initDate={values.date}
                  accent={Colors.coachAccent}
                  onSelect={m => {
                    if(m.isBefore(moment().startOf("day"))){
                      Alert.alert("", "Please select a future date");
                    }
                    setFieldValue("date", m);
                  }}
                />
                <Button
                  onPress={handleSubmit}
                  style={styles.modalButton}
                  loading={this.state.loading}
                  disabled={this.state.load}
                >
                  Send
                </Button>
              </>
           )}
         </Formik>
       </ModalWrapper>
    );
  }

  renderMessage = (message: any, idx: number) => {
    const fromMe = message.author === this.state.sender;
    if(!message.body) return null;

    const next = this.state.messages[idx + 1] || {};
    const showDate = new Date(message.date_created).toLocaleDateString() !== new Date(next.date_created).toLocaleDateString();

    return(
      <>
        <View
          style={[styles.chatBlock, {
            backgroundColor: fromMe? Colors.coachAccent: "#efefef",
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
          testID="flMessages"
          inverted
          data={this.state.messages}
          keyExtractor={item => item.sid}
          renderItem={({ item, index }) => this.renderMessage(item, index)}
          style={styles.fullFlex}
          onEndReachedThreshold={1}
          onEndReached={this.nextPage}
          ListEmptyComponent={((this.state.loading)? (
            <View>
              <ActivityIndicator color={Colors.coachAccent} size="large" />
            </View>
          ): null)}
        />
        <View style={[styles.row, styles.inputBlock]}>
          <Input
            testID="txtnewMessage"
            value={this.state.newMessage}
            onChange={(t: string) => this.setState({ newMessage: t })}
            containerStyle={styles.chatInput}
          />
          <TouchableOpacity
          testID="btnSendMsg"
            onPress={() => this.sendMessage()}
            style={styles.sendButton}
          >
            <Image source={send} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderFile = (file: any,index:number) => {
    return(
      <View key={index}>
        {
        file?.text !== "IMAGE" ? 
        <TouchableOpacity
        testID={`file${index}`}
          onPress={()=> this.getPreview(file?.url, file?.text)}
        >
          <ImageBackground
          style={styles.document}
          resizeMode="contain"
          source={pdfIcon}
        >
          <Typography color="white" size={20}>{""}</Typography>
          </ImageBackground>
        </TouchableOpacity>
        :
        <TouchableOpacity testID="touchableImg" onPress={()=> this.getPreview(file?.url, file?.text)}>
        <ImageBackground
          style={styles.document}
          source={{uri: file?.url}}
        >
          <Typography color="white" size={20}>{""}</Typography>
        </ImageBackground>
        </TouchableOpacity>
        }
        <Typography size={10}
          style={{ alignSelf: "flex-end", marginRight: dimensions.wp(4) }}
          color={"greyText"}>{file?.title?.substring(0,20)+"..."}</Typography>
        <Typography
          size={10}
          style={{ alignSelf: "flex-end", marginRight: dimensions.wp(4) }}
          color={"greyText"}
        >
          {moment(file?.date_created)?.calendar?.({ sameElse: "DD MMMM YYYY" })} {file?.fromMe? "(You)": ""}
        </Typography>
      </View>
    );
  }

  renderDocuments = () => {
    if(this.state.loading){
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
            return this.renderFile(d, i)
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

  renderPendingAppointments = () => {
    return(
      <FlatList
        data={this.state.appointments}
        keyExtractor={item => item?.item?.id}
        renderItem={( item ) => {
          const { booking_date, viewable_slots } = item?.item?.attributes?.appointments;
          const [start, end] = viewable_slots?.split?.(" - ");
          const bookingDate = moment(booking_date, "YYYY-MM-DD");
          const past = moment(start, ["DD/MM/YYYY HH:mm"]).isBefore(moment());
          return(
            <TouchableOpacity key={item?.item?.id} style={styles.appointment}>
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
        }}
      />
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
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex:1}} behavior={this.state.platfromValue == 'ios' ? "padding":null}>
        <LinearGradient
          colors={["#9C6FB4", "#D6A6EF"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={[styles.row, styles.mb, styles.pad]}>
            <TouchableOpacity testID="btnBack" onPress={() => this.props.navigation.goBack()}>
              <Image source={back} style={styles.backIcon} />
            </TouchableOpacity>
            <Typography
              style={styles.fullFlex}
              color="white"
              font="MED"
              size={18}
            >
              {this.props.navigation.getParam("name")}
            </Typography>
            <Button
              testID="btnActionItemAdd"
              onPress={this.toggleActionModal}
              style={styles.actionButton}
            >
              <Typography color="coachAccent" size={15} font="MED">Action Item +</Typography>
            </Button>
          </View>
          <View style={styles.row}>
            <TouchableOpacity testID="btnActiveTab1"
              onPress={() => this.setState({  activeTab: 1 }, ()=>{
                this.conversationEventLoop();
              })}
              style={[styles.halfRow, (this.state.activeTab === 1)? styles.activeRow: {}, { width: "30%" }]}
            >
              <Typography size={15} color="white" align="center">Chats</Typography>
            </TouchableOpacity>
            <TouchableOpacity testID="btnActiveTab2"
              onPress={() => this.setState({  activeTab: 2 },()=>{
                clearInterval(this.conversationEvent)
              })}
              style={[styles.halfRow, (this.state.activeTab === 2)? styles.activeRow: {}, { width: "30%" }]}
              disabled={this.state.loading}
            >
              <Typography size={15} color="white" align="center">Docs</Typography>
            </TouchableOpacity>
            <TouchableOpacity testID="btnActiveTab3"
              onPress={() => this.setState({  activeTab: 3 })}
              style={[styles.halfRow, (this.state.activeTab === 3)? styles.activeRow: {}, { width: "40%" }]}
            >
              <Typography size={15} color="white" align="center">Appointments</Typography> 
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {this.renderList()}
        {this.renderModal()}
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
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  header: {
    width: dimensions.wp(100),
    paddingTop: dimensions.hp(3),
    borderBottomColor: Colors.greyText,
    borderBottomWidth: 1
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  pad: {
    paddingHorizontal: dimensions.wp(5),
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(5)
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
  activeRow: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 3
  },
  actionButton: {
    backgroundColor: Colors.white,
    width: dimensions.wp(40),
    marginBottom: 0,
  },
  appointment: {
    marginHorizontal: dimensions.wp(4),
    marginVertical: dimensions.hp(1),
    backgroundColor: Colors.white,
    borderColor: "#D6A6EF",
    borderWidth: 1,
    borderRadius: dimensions.wp(2),
    padding: dimensions.wp(4),
    elevation: 4
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
    backgroundColor: Colors.coachAccent
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
  inputBlock: {
    padding: dimensions.wp(4),
    // paddingBottom: dimensions.hp(1),
    backgroundColor: "#eeeeee"
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
    backgroundColor: Colors.coachAccent
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
    backgroundColor: Colors.coachAccent,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center"
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
  previewImage: {
    height: dimensions.hp(100),
    width: dimensions.wp(100),
    resizeMode: "contain"
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
});
// Customizable Area End
