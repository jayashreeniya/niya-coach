import React from "react";

// Customizable Area Start
import {
  SafeAreaView,

  View,
  FlatList,

  StyleSheet,
  TouchableOpacity,

  Platform,
  Image,

  ImageBackground,
  KeyboardAvoidingView
} from "react-native";
import Input from "../../../components/src/Input";
import { send, backImg, headerPastCoachImgBg, currentcoachProfile } from '../../landingpage/src/assets'
import { Colors, dimensions } from "../../../components/src/utils";
import Typography from "../../../components/src/Typography";
import moment from "moment";


// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start

// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import ChatBackuprestoreController, {
  Props,
  configJSON,
} from "./ChatBackuprestoreController";

export default class ChatBackuprestore extends ChatBackuprestoreController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start

    // Customizable Area End
  }

  // Customizable Area Start

  renderUserChat = () => {
    return (


      <View style={styles.bgMobileInput}>
        <FlatList
          inverted
          data={this.state.messages}
          keyExtractor={item => item}
          renderItem={({ item, index }) => this.renderchatMessage(item, index)}
          style={styles.bgMobileInput}
          refreshing={this.state.loading}
          onRefresh={() => this.getMessages()}

        />

        <View style={[styles.rowstyle, styles.ipBlock,]}>
          <Input
            value={this.state.newMessage}
            onChange={(textmsg: string) => this.onMsgChange(textmsg)}
            containerStyle={styles.chatIN}

          />
          <TouchableOpacity
            onPress={() => this.chatMessagesend()}
            style={styles.sendBtn}
            testID="btnExample"
          >
            <Image source={send} style={styles.sendbtnIcon} />
          </TouchableOpacity>
        </View>
      </View>

    );



  }



  renderchatMessage = (message: Record<string, string>, msgidx: number) => {
    const fromMe = message.account === this.state.sender;
    if (!message.message) { return null }


    type MsgobjectType = TypeObjmsg

    interface TypeObjmsg {
      message: string
      created_at: string,

    }
    const nextdata: MsgobjectType = this.state.messages[msgidx + 1] || {};
    const showDate = new Date(message.created_at).toLocaleDateString() !== new Date(nextdata.created_at).toLocaleDateString();

    return (
      <>
        <View
          style={[styles.chatmsgBlock, {
            backgroundColor: fromMe ? Colors.empAccent : "#efefef",
            alignSelf: fromMe ? "flex-end" : "flex-start"
          }]}>
          <Typography size={15} color={fromMe ? "white" : "black"}>{message.message}</Typography>
          <Typography
            size={10}
            style={{ alignSelf: "flex-end" }}
            color={fromMe ? "white" : "black"}
          >
            {moment(message.created_at)?.format?.("hh:mm A")}
          </Typography>
        </View>
        {showDate ?
          <View style={{ padding: dimensions.hp(2) }}>
            <Typography color="greyText" align="center" size={14}>
              {moment(message.created_at)?.isSame?.(moment(), "day") ? "Today" : moment(message.created_at)?.format?.("DD MMMM yyyy")}
            </Typography>
          </View> :
          null}
      </>
    );
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    let chatname = this.props.navigation.getParam('name')

    // Merge Engine - render - Start
    return (

      <KeyboardAvoidingView
        style={styles.container}
        behavior="height"
      >
        <ImageBackground resizeMethod="scale" resizeMode="cover" style={{
          width: dimensions.wp(100), height: dimensions.hp(10)
        }}
          source={headerPastCoachImgBg}

        >
          <View style={[styles.rowstyle, styles.marginb, {
            paddingHorizontal: dimensions.wp(5),
            alignItems: 'center', justifyContent: 'center', marginTop: dimensions.hp(2),
          }]}>
            <TouchableOpacity onPress={

              this.props.navigation.goBack.bind(this, null)

            }
              testID="btnBack"
            >
              <Image source={backImg} style={styles.backbtnIcon} />
            </TouchableOpacity>

            <TouchableOpacity >
              <Image style={{ height: 40, width: 40, borderRadius: 20, marginRight: 10, }} source={currentcoachProfile} />

            </TouchableOpacity>

            <Typography
              style={styles.bgMobileInput}
              color="white"
              font="MED"
              size={18}
            >
              {chatname}
            </Typography>




          </View>
        </ImageBackground>

        <View style={[styles.bgMobileInput,]}>
          {this.renderUserChat()}
          {/* <View style={[styles.rowstyle, styles.ipBlock]}>
            <Input
              value={this.state.newMessage}
              onChange={(textmsg: string) =>this.onMsgChange(textmsg) }
              containerStyle={styles.chatIN}
              
            />
            <TouchableOpacity
              onPress={() => this.chatMessagesend()}
              style={styles.sendBtn}
              testID="btnExample"
            >
              <Image source={send} style={styles.sendbtnIcon} />
            </TouchableOpacity>
          </View> */}
        </View>
      </KeyboardAvoidingView>

    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",

  },
  marginb: {
    marginBottom: dimensions.hp(2)
  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  rowstyle: {
    flexDirection: "row",

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
  Txtstyle: {
    paddingVertical: dimensions.hp(.5),
    paddingHorizontal: dimensions.wp(3),
    borderRadius: dimensions.wp(3)
  },
  bgMobileInput: {
    flex: 1,

  },
  showHide: {
    alignSelf: "center",
  },
  chatmsgBlock: {
    padding: dimensions.wp(3.5),
    borderRadius: dimensions.wp(3),
    backgroundColor: "#efefef",
    marginTop: dimensions.hp(1),
    marginHorizontal: dimensions.wp(4),
    alignSelf: "flex-start",
    marginBottom: dimensions.hp(.5)
  },
  ipBlock: {
    padding: dimensions.wp(4),
    paddingBottom: dimensions.hp(1),
    backgroundColor: "#eeeeee"
  },
  sendbtnIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    tintColor: Colors.white
  },
  chatIN: {
    borderRadius: dimensions.hp(10),
    borderColor: Colors.greyText,
    marginRight: dimensions.wp(4),
    flex: 1,
    marginBottom: 0,
    height: dimensions.hp(5)
  },
  sendBtn: {
    height: dimensions.hp(5),
    width: dimensions.hp(5),
    borderRadius: dimensions.hp(2.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.empAccent
  },
  backbtnIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7)
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
});

// Customizable Area End
