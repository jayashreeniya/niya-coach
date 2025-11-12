import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  // Customizable Area Start
  TextInput,
  RefreshControl,
  Platform,
  StatusBar
  // Customizable Area End
} from "react-native";
// Customizable Area Start
import moment from "moment";
import { Formik } from "formik";
import * as yup from "yup";
import { articlesBlog, pause, audioIcon } from "./assets";
import ModalWrapper from "../../../components/src/ModalWrapper";
import Typography from "../../../components/src/Typography";
import Input from "../../../components/src/Input";
import Button from "../../../components/src/Button";
import CalendarStrip from "../../../components/src/CalendarStrip";
import DateTimePicker from "../../../components/src/DateTimePicker";
import { Colors, dimensions } from "../../../components/src/utils";
import GoalModal from "../../../components/src/GoalModal";
// @ts-ignore
import RadialSlider from '../../../components/src/RadialSlider/RadialSlider';
import { bordered_emptyStar, bordered_fiveStar, bordered_fourStar, bordered_threStar, bordered_twoStar } from '../../appointmentmanagement/src/assets';
import Meeting from "../../../components/src/Meeting";
import Skeleton from "../../../components/src/Skeleton";
import VideoPlayer from "../../../components/src/VideoPlayer";
import Toast from "react-native-easy-toast";
//@ts-ignore
import Drawer from "react-native-drawer";
import * as IMG_CONST from './assets'
import { clock } from '../../../components/src/images';
import { responsiveWidth } from "react-native-responsive-dimensions";
import DatePickerIOs from "react-native-datepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configJSON } from "./HomePageController";
// Customizable Area End

import Scale from "../../../framework/src/Scale";
const { height, width } = Dimensions.get('window');
import HomePageController, { Props } from "./HomePageController";

export default class HomePage extends HomePageController{

  constructor(props: Props) {
    super(props);

  }
  // Customizable Area Start
  actionSchema = yup.object().shape({
    title: yup
      .string()
      .test('not-only-spaces', 'The title cannot be empty', (value) => value && value.trim().length !== 0)
      .strict(true)
      .min(3, 'The title needs to be at least 3 char')
      .max(50, 'The title name cannot exceed 50 char')
      .required('The title is required') ,
  });




  renderDashboardFocuseAreaItems = (itm: any) => {
    if (this.state.insightsLoader) {
      itm = [1, 2, 3];
    }
    return (

      <>
        <View style={[styles.boxHeader, { backgroundColor: '#FFF5F4', borderColor: '#FFB8B0', }]} >
          <View style={{ alignSelf: 'center' }}>
            <View style={[styles.exportText, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[styles.TextHeader, { color: '#000', fontSize: 14, textAlign: 'center' }]}>Top Focus Areas</Text>
            </View>
            <View style={{ width: Scale(140), minHeight: Scale(50), maxHeight: Scale(110), alignSelf: 'center' }}>

              <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true} style={{ marginEnd: 2, }}>

                {itm.map((opt: any) => {
                  return (
                    <View style={[styles.exportText3, { marginVertical: Scale(1) }]}>
                      <Image source={require('../assets/view_circle.png')} style={styles.exportImage} />
                      {(this.state.insightsLoader) ?
                        <Skeleton style={{ width: "70%", height: dimensions.hp(1.5), marginTop: dimensions.hp(.5) }} width={0} height={0} /> :
                        <Text numberOfLines={2} style={[styles.TextPoints, { color: '#DF2A2A', flexWrap: 'wrap', flex: 1 }]} >{opt.answers}</Text>
                      }
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
          <TouchableOpacity style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
            <Image style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} source={require('../assets/imagenav_down.png')} />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  renderTopStrenght = (itm: any) => {
    if (this.state.insightsLoader) {
      itm = [1, 2, 3];
    }
    return (
      <>
        <View style={styles.boxHeader} >
          <View style={{ alignSelf: 'center', }}>
            <View style={[styles.exportText, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[styles.TextHeader, { color: '#000', fontSize: 14, textAlign: 'center', }]}>Top Strengths</Text>
            </View>
            <View style={{ width: Scale(140), minHeight: Scale(50), maxHeight: Scale(110), alignSelf: 'center' }}>
              <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true} style={{ marginEnd: 2 }}>
                {itm.map((opt: any) => {
                  return (
                    <View style={[styles.exportText2, { marginVertical: Scale(1)}]}>
                      <Image source={require('../assets/view_circle2.png')} style={styles.exportImage} />
                      {(this.state.insightsLoader) ?
                        <Skeleton style={{ width: "70%", height: dimensions.hp(1.5), marginTop: dimensions.hp(.5) }} width={0} height={0} /> :
                        <Text ellipsizeMode="tail" style={[styles.TextPoints, { flexWrap: 'wrap', flex:1 }]}>{opt.title}</Text>}
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
          <TouchableOpacity style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
            <Image style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} source={require('../assets/imagenav_up.png')} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderHidExpListIds = (exp: any, id_1: any) => {
    return (
      <View style={{ height: Scale(20), }}>
        {exp.length > 1 && exp.map((itm: any, index: any) => {

          return (
            <>
              {index == 0 && <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.setState({ showId: this.state.showId == id_1 ? "" : id_1 })} >
                <Text style={[styles.TextHeader, { color: '#6B5AED', marginBottom: 2, marginLeft: 5, marginRight: 5, marginTop: 3 }]}> {itm?.specialization?.length > 20 ? itm?.specialization.substring(0, 25) : itm?.specialization}</Text>
              </TouchableOpacity>
              }
            </>
          )
        })}

      </View>
    )
  }
  renderShowExpListIds = (expertise: any, id: any) => {
    return (
      <ScrollView nestedScrollEnabled={true} style={{ height: Scale(50), }}>

        {expertise.length > 1 && expertise.map((itm: any, index: any) => {
          return (
            <>
              <View style={{ margin: 0, padding: 0, height:38,width:200}}>
                {index == 0 ? <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.setState({ showId: this.state.showId == id ? "" : id, })}>
                  <Text
                    numberOfLines={2}
                    style={[styles.TextHeader, { color: '#6B5AED', marginBottom: 1, marginLeft: 5, marginRight: 5, marginTop: 2,height:38,width:200,lineHeight:16}]}
                  > {itm?.specialization.substring(0, 50)}</Text >
                </TouchableOpacity>
                  : <Text style={[styles.TextHeader, { color: '#6B5AED', marginBottom: 0, marginLeft: 5, marginRight: 5, marginTop: 2,height:38,width:200,lineHeight:16}]}> {itm?.specialization.substring(0, 50)}</Text>

                }
              </View>
            </>
          )

        })}
      </ScrollView>

    )
  }
  renderExpandableList = (expertise: any, id: any, full_name: string, disabled: boolean, item: any, isAfterEndtime: boolean) => {
    
    return (
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: '#2F2F2F', fontSize: 15, fontStyle: 'normal', fontWeight: 'normal', margin: 5, marginTop: -1 }}> {full_name}</Text>

        {expertise.length == 1 && <View style={{ height: Scale(7), }}><Text style={[styles.TextHeader, { color: '#6B5AED', marginBottom: 0, marginLeft: 5, marginRight: 5, marginTop: 3, }]}> {expertise[0].specialization}</Text></View>}

        {this.state.showId != id && this.renderHidExpListIds(expertise, id)}
        {this.state.showId == id && this.renderShowExpListIds(expertise, id)}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>


          <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../assets/clock.png')} ></Image>

          <Text style={[{ color: '#6D6D6D', margin: 5, marginTop: 3, fontSize: width <= 360 ? 9 : 10, fontWeight: 'bold' }]}>{moment(item.item.attributes.start_time, 'DD/MM/YYYY HH:mm').format("hh:mm A ")}</Text>
          <Text style={[{ color: '#6D6D6D', margin: 5, marginTop: 3, fontSize: width <= 360 ? 9 : 10, marginLeft: 0 }]}>{moment(item.item.attributes.start_time, 'DD/MM/YYYY HH:mm').format("DD MMM YYYY")}</Text>



        </View>
        {this.renderExpandableBottomView(disabled, item, isAfterEndtime)}
      </View>
    )
  }


  renderExpandableBottomView = ( disabled: boolean, item: any, isAfterEndtime: boolean) => {
    return(
      <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'flex-end', right: 5, justifyContent: 'flex-end' }}>
      <View style={{ height: Scale(35), marginTop: 0, width: width > 360 ? Scale(90) : Scale(85), marginLeft: width < 500 ? 5 : Scale(60), marginRight: 10, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: !disabled  || disabled  && isAfterEndtime ? '#a2a2a2':'red' , alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 10 }}>
        <TouchableOpacity disabled={!disabled  || disabled  && isAfterEndtime} onPress={() => this.onCancelPressbtn(item, disabled)}
        >
          <Text 
          style={{ color: !disabled  || disabled  && isAfterEndtime ?  '#a2a2a2': 'red', fontSize: 10, fontWeight: '500', alignSelf: 'center' }}>{"Cancel booking"}</Text>
        </TouchableOpacity>
      </View>
      <View 
      style={{ height: Scale(35), marginTop: 0, width: width > 360 ? Scale(90) : Scale(85), marginLeft: Scale(15), marginRight: 5, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: disabled ? '#a2a2a2' : '#3682FF', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 10 }}>
        <TouchableOpacity
          disabled={disabled}
          onPress={() => this.onMeetingPress(disabled, item)}
        >
          <Text style={{ color: disabled ? '#a2a2a2' : '#3682FF', fontSize: 10, fontWeight: '500', alignSelf: 'center' }}>{"Connect now"}</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }

  renderImgBasedOnRating = (rating: number) => {
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
  getList = (item: any) => {
    if (this.state.appointmentsLoader) {
      return [1, 2].map((_, i) => (
        <Skeleton
          key={`${i}`}
          width={dimensions.wp(92)}
          height={dimensions.wp(20)}
          style={{ marginLeft: dimensions.wp(4), marginBottom: dimensions.hp(2) }}
        />
      ));
    }

    let { full_name, image, rating, expertise } = item?.item?.attributes?.coach_details;
    let { id, viewable_slot } = item?.item?.attributes;
    const [start, end] = viewable_slot?.split?.(" - ");
    const now = moment();
    const startMoment = moment(start, ["DD/MM/YYYY HH:mm"]);
    const endMoment = moment(end, ["DD/MM/YYYY HH:mm"]);
    const disabled = !now.isBetween(startMoment, endMoment);
    const isAfterEndtime = now.isAfter(startMoment)

 return (
      <View style={[styles.tableBox, { marginBottom: 20, }]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 5, marginRight: 5 }}>
          {image != null ? <Image style={{ height: 70, width: 70, borderRadius: 35 }} source={{ uri: image }} ></Image>
            : <Image style={{ height: 70, width: 70, borderRadius: 35 }} source={require('../../landingpage/assets/curcoachprofile.png')} ></Image>
          }
          {this.renderExpandableList(expertise, id, full_name, disabled, item, isAfterEndtime)}
          <View style={{ flexDirection: 'row', right:Scale(30) }}>
            <Image style={{ height: 20, width: 20, marginLeft: 10, resizeMode: 'contain' }} source={this.renderImgBasedOnRating(rating)} ></Image>

            <Text style={{ color: '#000', fontSize: 11, fontWeight: '500', alignSelf: 'center', marginLeft: 5 }}>{rating == null ? 0 : rating}</Text>

          </View>
        </View>
      </View>
    );
  }

  renderActions = () => {
    if (this.state.actionLoader) {
      return [1, 2, 3].map((_, i) => (
        <Skeleton
          key={`${i}`}
          width={dimensions.wp(90)}
          height={dimensions.hp(6)}
          style={{ marginLeft: dimensions.wp(5), marginBottom: dimensions.hp(2) }}
        />
      ));
    }
    return this.state.actionData.map((item, index) => {
      let completed = item?.attributes?.is_complete;
      return (
        <TouchableOpacity   testID={`currenActionBtn${index}`} disabled={completed} style={[styles.actionRow, completed ? styles.activeActionRow : styles.inActiveActionRow]} onPress={()=>this.onPressIosRenderAction(item)}>

          <TouchableOpacity
            disabled={completed}
            onPress={() => { this.setState({ editActionItmId: item.id, editActionItm: item?.attributes?.action_item }, this.toggleEditActionModal) }}
            style={[styles.actionCheckbox, completed ? styles.activeActionCheckbox : styles.inactiveActionCheckbox]}
          />
          <View>
            <Typography font="MED" size={14} style={styles.actionText}>{item?.attributes?.action_item}</Typography>
          </View>
        </TouchableOpacity>
      );
    });
  }

  returnDynamicHeight(item: any){
    return (item?.thumbnail ? dimensions.wp(40) :dimensions.wp(45))
  }

  renderArticles = () => {
    if (this.state.suggestionsLoader) {
      return [1, 2, 3].map((_, i) => (
        <Skeleton
          key={`${i}`}
          width={dimensions.wp(25)}
          height={dimensions.wp(40)}
          style={{ marginRight: dimensions.wp(5), marginBottom: dimensions.hp(2) }}
        />
      ));
    }

    return this.state.articleData.map((item: any) => {
      const imgUrl = this.getUrl(item);
      const openDoc = () => {
        this.stopeAudioplay();
        this.props.navigation.navigate("DocumentViewer", {
          url: item?.url,
          title: item?.title,
          fileContent: item?.file_content
        });
      }
            return (
        <View style={{flexDirection:'column'}}>
          <TouchableOpacity
            key={item.id}
            onPress={openDoc}
            style={[styles.article, { height: this.returnDynamicHeight(item)}]}
          >
            <Image
              defaultSource={articlesBlog}
              source={imgUrl}
              style={[styles.articleImage,
              {
                width:item?.thumbnail ?'100%':'115%',
                height:item?.thumbnail ?'100%':'120%',
                top: item?.thumbnail ?"0%":"-10%",
                left: item?.thumbnail ?"0%":"-10%",
                resizeMode: item?.thumbnail ?'cover':'center',
                backgroundColor: "light-blue",
                
              }]}
            />

          </TouchableOpacity>
          <Typography
            size={13}
            color="black"
            style={[styles.docTitle, {marginTop:item?.thumbnail ?25:5}]}
          >
            {item?.title.slice(0,12) || "No Title"}
          </Typography>
          <Typography
            size={13}
            color="black"
            style={[styles.docTitle, {marginTop:5}]}
          >
            {item?.title.slice(12,24) || ""}
          </Typography>
                  </View>
      );
    });
  }

  renderAudio = () => {
    if (this.state.suggestionsLoader) {
      return [1, 2, 3].map((_, i) => (
        <Skeleton
          key={`${i}`}
          width={dimensions.wp(25)}
          height={dimensions.wp(25)}
          style={{ marginRight: dimensions.wp(5), marginBottom: dimensions.hp(2) }}
        />
      ));
    }

    return this.state.audioData.map((item: any) => {
      const pic= item?.thumbnail;
      return (
        <View
          key={item.id}
          style={styles.audioWrapper}
        >
          {
            !pic ? <View style={styles.audio}>
              <TouchableOpacity onPress={() => this.toggleAudio(item,!this.state.paused)} style={[styles.audioPlay,styles.audioPlayBtn]}>
                <Image
                  source={(!this.state.paused && (this.state.nowPlaying == item.id)) ? pause : audioIcon}
                  style={styles.audioIconImg}
                />
              </TouchableOpacity>
            </View>:
              <ImageBackground source={{uri: pic}} style={{
                width: dimensions.wp(28),
                height: dimensions.wp(28),
                borderRadius: dimensions.wp(3),
                borderWidth: 3,
                borderColor: "#c9c2f2",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: dimensions.hp(1),
                overflow:'hidden'
              }}>
                <TouchableOpacity onPress={() => this.toggleAudio(item,!this.state.paused)} style={styles.audioPlay}>
                  <Image
                    source={(!this.state.paused && (this.state.nowPlaying == item.id)) ? pause : audioIcon}
                    style={styles.audioIcon}
                  />
                </TouchableOpacity>
              </ImageBackground>
          }
          <View>
          <Typography
            size={13}
            color="black"
            style={[styles.docTitle, {marginTop:item?.thumbnail ?25:5}]}
          >
            {item?.title.slice(0,16) || "No Title"}
          </Typography>
          <Typography
            size={13}
            color="black"
            style={[styles.docTitle, {marginTop:5}]}
          >
            {item?.title.slice(16,24) || ""}
          </Typography>
          </View>
        </View>
      );
    });
  }

  renderVideo = () => {
    if (this.state.suggestionsLoader) {
      return [1].map((_, i) => (
        <Skeleton
          key={`${i}`}
          width={dimensions.wp(70)}
          height={dimensions.wp(40)}
          style={{ marginRight: dimensions.wp(5), marginBottom: dimensions.hp(2) }}
        />
      ));
    }

    return this.state.videoData.map((item: any) => {
      const thumb = item?.thumbnail
      const title= item?.title
      const openVideo = () => {
        this.stopeAudioplay()
        this.setState({
          videoModal: true,
          videoUrl: item?.url,

        });
      }
      return (
        <View style={{flexDirection:'column'}}>
          <View
            key={item.id}
            style={styles.videoBlock}
        >
            <ImageBackground
              source={{ uri: (thumb?thumb:"https://cdn.pixabay.com/photo/2016/10/26/19/00/domain-names-1772242_1280.jpg") }}
              style={styles.thumbnail}
            >
            <TouchableOpacity onPress={openVideo} style={styles.videoPlay}>
              <Image source={audioIcon} style={styles.audioIcon} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
          <Typography align="center" lines={1}>{item.title.length > 25
           ? item.title.substring(0, 15) + "..." : item.title}</Typography>
        </View>

      );
    });
  }

  renderGaolBoardFocuseAreas(item: any) {
    return (
      <ScrollView nestedScrollEnabled={true} style={{ marginBottom: 10, height: dimensions.hp(30) }} >
        {item.map((ansOpt: any) => {
          return (<View style={styles.innerContainer}>
            <TouchableOpacity style={[styles.checkIpSytle, { backgroundColor: '#fff', alignItems: "center", }]} onPress={() => { this.setState({ checked: ansOpt.id }) }}>
              {this.state.checked == ansOpt.id ?
                <Image style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 20 }}{...this.btnShowImageProps} /> :
                <Image style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 20 }}
                  {...this.btnHideImageProps} />}
              <Text style={[styles.title, { color: '#4D4D4D', textAlign: 'left', fontSize: 18, marginLeft: 10, flexWrap: 'wrap', flex: 1, marginRight: 10 }]}>{ansOpt.answers}</Text>
            </TouchableOpacity>
          </View>)
        })}
      </ScrollView>
    )
  }


  renderGoalCureentItm = () => {
    return (
      <View style={[styles.boxHeader, { borderWidth: 0, marginLeft: 9, }]} >
        <ImageBackground source={require('../assets/imagenav_image2.png')} style={{ height: Scale(185), width: '101%', borderRadius: 10, }} imageStyle={{ borderRadius: 10 }}>
          <View style={[styles.exportText, { justifyContent: 'space-between' }]}>
            <Text testID="currenGoalTextID" style={[styles.TextHeader, styles.currentGoalText]}>{configJSON.currentGoals}</Text>
            <Image style={{ marginLeft: 10, marginRight: 20 }} source={require('../assets/imagenav_image3.png')} />
          </View>  
          <ScrollView 
          testID="currentGoalComponent"
          nestedScrollEnabled={true} style={styles.correnGoalScrol} >
            {this.state.goalData.map((goal,index) => {
              return (
                <View key={goal.id} testID={`goalIDView${index}`} style={styles.goalViewCard}>
                  <TouchableOpacity testID={`currentGoalBtnId${index}`} style={styles.currentGoalBtn}
                    onPress={() => {
                      this.onPressRenderGoleItem(goal)
                    }}
                  >
                    <View style={{ width: '90%', backgroundColor: '#FFFFFF', left: 2, flexDirection: 'row', alignItems: 'flex-start', borderRadius: 10, right: 10, }}>
                      <Image style={{ top: 2, left: 5 }} source={require('../assets/view_circle1.png')} />
                      <Text style={{ color: '#3F3F3F', flexWrap: 'wrap', textAlign: 'left', fontSize: 11, marginLeft: 10, width: '80%', marginTop: 2, marginBottom: 2 }} >{goal.goal}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        </ImageBackground>

      </View>
    )
  }

  renderCompetedGoal = () => {
    return (
      <View style={[styles.boxHeader, { borderWidth: 0, marginRight: 11 }]} >
        <ImageBackground source={require('../assets/imagenav_image.png')} style={{ height: Scale(185), width: '101%', borderRadius: 10, }} imageStyle={{ borderRadius: 10 }}>
          <View style={[styles.exportText, { justifyContent: 'space-between' }]}>
            <Text style={[styles.TextHeader, { color: '#fff', fontSize: 14, textAlign: 'center', marginLeft: 15 }]}>Completed Goals</Text>
            <Image style={{ marginLeft: 5, marginRight: 20 }} source={require('../assets/imagenav_image4.png')} />
          </View>
          <ScrollView nestedScrollEnabled={true} style={{ marginBottom: 20, marginRight: 10 }}>
            {this.state.completedGoalData.map((item: any) => {

              return (
                <View style={{ width: '90%', marginTop: 10, backgroundColor: '#FFFFFF', left: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 10, right: 10, alignSelf: 'center', marginEnd: 10 }}>
                  <Image style={{ top: 2, left: 5 }} source={require('../assets/view_circle3.png')} />
                  <Text style={{ marginLeft: 10, color: '#3F3F3F', fontSize: 11, fontWeight: '500', flexWrap: 'wrap', textAlign: 'left', width: '80%', marginTop: 2, marginBottom: 2 }}>{item.goal}</Text>
                </View>
              )
            })}
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }

  renderDrawer() {
    return (
      <SafeAreaView style={styles.containerFilter}>
        <View style={styles.HomeContainer}>
          <View style={styles.headerImage}>
            <Image style={styles.ProfileImage} source={this.state.prifileimage ? { uri: this.state.prifileimage } : IMG_CONST.dummyPROFILE_ICON} />

            <View style={styles.ProfileTextHeader}>
              <Text style={[styles.profileText, { marginLeft: Scale(20), right: Scale(30), flex: 1, flexWrap: 'wrap' }]} numberOfLines={1}>{this.state.full_name}</Text>
            </View>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.accoutHeader} onPress={this.props.navigation?.navigate?.bind(this, "UserProfile", { role: "employee" })}>
            <Image style={styles.account} source={IMG_CONST.ACCOUNT_ICON} />
            <Text style={styles.AccountText}>Account Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accoutHeader} onPress={
            this.props.navigation?.navigate?.bind(this, "WellbeingScore", { isFrom: "drawer" })
          }>
            <Image style={styles.account} source={require("../assets/edit.png")} />
            <Text style={styles.AccountText}>Well-Being Assessment Result</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accoutHeader} onPress={this.props.navigation?.navigate?.bind(this, "PrivacyPolicy")}>
            <Image style={styles.account} source={IMG_CONST.PRIVACY_ICON} />
            <Text style={styles.AccountText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accoutHeader} onPress={this.props.navigation?.navigate?.bind(this, "ContactUsScreen")}>
            <Image style={styles.account} source={IMG_CONST.CONTACT_US_ICON} />
            <Text style={styles.AccountText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accoutHeader} onPress={() => this.logOut()}>
            <Image style={styles.account} source={IMG_CONST.LOGOUT_ICON} />
            <Text style={styles.AccountText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accoutHeader} onPress={() => this.showDelAlert()}>
            <Image style={styles.account} source={IMG_CONST.LOGOUT_ICON} />
            <Text style={[styles.AccountText,{color:'darkred'}]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  renderHeight = () => {
    if (width < 500) return 400
    else return 420
  }
  renderWidth = () => {
    if (width < 500) return dimensions.wp(25)
    else return dimensions.wp(28)

  }
  renderRadialSlider = () => {
    return (
      <View>
        <View style={{ height: dimensions.hp(2), width: '92%', alignSelf: 'center', marginBottom: dimensions.hp(1) }}>
          <Text style={{ justifyContent: 'center', color: '#454545', fontSize: 16, fontWeight: Platform.OS == "android" ? '400' : 'bold', alignSelf: 'center', marginTop: Platform.OS == "android" ? Scale(25) : -Scale(5), fontFamily: 'Roboto-Medium' }}>How are you feeling today?</Text>
        </View>
        <View style={[styles.container, { alignSelf: 'center', justifyContent:"center" , alignItems:'center'}]}>
          <RadialSlider isHideTitle={true}
            isHideCenterContent={false}
            centerImgSrc={this.state.whaleImgSrc}
            centerText={this.state.selectedMood?.attributes?.motion_title}
            isHideTailText={true}
            isHideSubtitle={true}
            isHideValue={true}
            isHideMarkerLine={true}
            fixedMarker={true}
            isHideLines={true}
            markerValue={this.state.percentage}
            style={{ width: dimensions.wp(98), alignSelf: 'center', justifyContent: 'center', }}
            value={this.state.percentage}
            radius={130}
            thumbBorderWidth={3}
            isHideButtons={true}
            thumbColor={"#38366B"}
            thumbBorderColor={"#B2ABE4"}
            linearGradient={[{ offset: '0%', color: '#F74500' }, { offset: '50%', color: '#FFB800' }, { offset: '80%', color: '#00C849' }, { offset: '100%', color: '#0082FF' }]}
            max={100}
            onChange={(speed) => {
              this.setState({ scrollOn: false })
              this.adjustWhaleSlider(speed);

            }} />
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: Scale(5) }}>
          <Button
            onPress={() => this.props.navigation.navigate("EmoJourney1", { motionId: this.state.selectedMoodId })}
            textColor="primary"
            mode="outlined"
            textStyle={styles.actionButtonText}
            style={styles.actionButton}
          >
            Submit
          </Button>
        </View>
      </View>
    )
  }

  renderTimePickerIOs = (time: any, onSelect: any) => {
    return (
      <>
        <DatePickerIOs
          style={{ width: "100%", }}
          date={time}
          mode="time"
          testID="txtInputAvailableTime"
          placeholder={"Select time"}

          is24Hour={false}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          iconSource={clock}
          customStyles={{
            datePicker: {
              justifyContent: "center",

            },
            dateIcon: {
              right: responsiveWidth(35),

              justifyContent: 'center',
              alignItems: "center",
              tintColor: Colors.accent,
              height: dimensions.wp(10),
              width: dimensions.wp(10),
              marginBottom: dimensions.hp(1)

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
              fontSize: 16,

            }

          }}

          onDateChange={(availableDate: any) => {
            const dt = moment(availableDate, ["h:mm A"]).format("hh:mm a");
            this.setState({ action_time: dt });
            onSelect(availableDate);


          }}

        />
        <View style={{ marginBottom: dimensions.hp(3), width: '100%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            lineHeight: 21,
            color: '#484848',
            height: Scale(40)
          }}>{this.state.action_time == "" ? moment("10:00", "hh:mm").format("hh:mm a") : this.state.action_time}</Text>


        </View>
      </>
    )
  }

  renderAddGoal = () => {
    return (
      <>
        <View style={[styles.actionItemContainer, { marginLeft: 10, marginTop: width < 500 ? dimensions.hp(8) : dimensions.hp(20) }]}>
          <View style={styles.row}>
            <View style={[styles.rowItem, {width:'52%', height:20}]}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#3F3F3F', fontFamily: 'Roboto-Medium', textAlign: 'left', }}>Goal Board</Text>
              <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ fontSize: 11, textAlign: 'left', fontWeight: '400', lineHeight: 24, color: '#878787' }}>Tap to view the listed goals status</Text>
            </View>
            <Button
              testID="addGoalBtnID"
              mode="outlined"
              onPress={this.toggleAddGoalModal}
              style={[styles.actionButton, {width:'45%'}]}
              textColor="primary"
              textStyle={styles.actionButtonText}
            >
              Add Goals +
            </Button>
          </View>
        </View>
        <View>
          {this.state.isGoalModal && (
            <GoalModal
              testID="goalModalID"
              visible={this.state.isGoalModal}
              onClose={() => {

                this.setState(prev => ({
                  isGoalModal: !prev.isGoalModal,

                }));

              }}
              title={this.state.isAddGoal ? `Add your goal` : this.state.iscompeteGaol ? `When do you wish to complete it?` : `On which focus area do you want \n to add goals?`}
              font="center"
              fontsize={20}
              titlecolor="#484848"
            >
              {this.state.goalstepmodal == 0 &&
                this.renderGaolBoardFocuseAreas(this.state.focusAreaData)
              }
              {this.state.focusAreaData.length == 0 && <>
                <View
                  style={[styles.mobileInput, { borderWidth: 0, marginTop: 0, alignItems: 'center', justifyContent: 'center' }]}
                >
                  <Text style={{
                    height: Scale(40),
                    fontSize: 16,
                    fontWeight: '500',
                    lineHeight: 21,
                    color: '#484848',

                  }}>{"No focus areas found.Try refreshing"}</Text>
                </View>
              </>
              }
              {this.state.isAddGoal && <>
                <View
                  style={[styles.mobileInput, { marginBottom: 20, borderRadius: Scale(9), width: '100%', alignSelf: 'center' }]}
                >
                  <TextInput
                    maxLength={49}
                    testID={"txtInputFirstName"}
                    style={[styles.Input, { paddingVertical: Scale(9.5) }]}
                    placeholderTextColor="#7CBBFF"
                    placeholder={""}
                    value={this.state.goalnm}
                    {...this.txtInputGoalNamePrpos} //Merge Engine::From BDS - {...this.testIDProps}
                  />
                </View>
              </>}
              {this.state.iscompeteGaol && <View style={{ margin: Scale(10) }}>
                <CalendarStrip
                  initDate={this.state.goalCompetionDate}
                  onSelect={(m) => {
                    if (m.isBefore(moment())) {
                      this.showAlert("Alert", "Please choose a future date.", "");
                      return false;
                    } else {
                      this.setState({ goalCompetionDate: m })
                    }
                  }} />


                {Platform.OS == 'android' ? <DateTimePicker value={this.state.goalCompetionTime} mode="time" onSelect={(t) => {
                  this.setState({ goalCompetionTime: t });
                }
                }
                /> :
                  <>
                    <View>
                      {this.renderTimePickerIOs(this.state.goalCompetionTime, ((t:any) => {

                        this.setState({ goalCompetionTime: t })
                      }))}

                    </View>

                  </>
                }

              </View>
              }
              {this.state.goalstepmodal < 2 && <Button {...this.btnNxtModal}>
                Next
              </Button>}
              {this.state.iscompeteGaol && <Button
                {...this.btnSubmitModal}
              >
                Submit
              </Button>}
            </GoalModal>
          )}
        </View>
      </>
    )
  }
  renderScrollViewHeight = () => {
    return dimensions.hp(!this.state.actionData.length ? 0 : ((Math.min(this.state.actionData.length, 4) * 6) + (3 + Math.min(this.state.actionData.length, 4))));
  }
  renderModalTitle = (type: string) => {
    if (type == "Add action item") {
      return this.state.selectActionDuration ? "When do you wish to complete?" : "Add action item"
    }
    else {
      return this.state.selectActionDuration ? "When do you wish to complete?" : "Edit action item"
    }


  }
  renderEditActionModal = () => {
    return (
      <ModalWrapper
        visible={this.state.isshowEditActionModal}
        onClose={this.toggleEditActionModal}
        title={this.renderModalTitle("Edit action item")}
      >
        <Formik
          data-test-id='formicActionID'
          initialValues={{
            title: this.state.editActionItm,
            time: moment("10:00", "hh:mm"),
            date: this.handleDateCheck()
          }}
          validationSchema={this.actionSchema}
          onSubmit={(data) => {
            if (data.date.isBefore(moment())) {
              Alert.alert("", "Please select a future date");
              return;
            }

            this.completeAction( {id: this.state.editActionItmId, action_item: data.title.trim(), date: data.date.format("DD/MM/YYYY"),   time_slot: this.state.action_time == "" ? data.time.format("hh:mm a") : this.state.action_time
            })
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit, validateForm }) => (
            <View>
              {!this.state.selectActionDuration ? (
                <>
                  <Input
                    maxLength={49}
                    value={values.title}
                    onChange={handleChange("title")}
                    onBlur={handleBlur("title")}
                    errorText={errors.title}
                    touched={touched.title}
                    mb={4}
                    autoFocus={true}
                    style={this.inputStyleValue()}

                  />

                  <Button
                   testID="currentActionNextBtnID"
                    onPress={this.selectDuration}
                    mode="outlined"
                    textColor="accent"
                    disabled={!!errors.title}
                  >
                    Next
                  </Button>

                  <Button
                    onPress={() => this.completeAction({id: this.state.editActionItmId, action_item: values.title, is_complete: true })}
                    mode="outlined"
                    textColor="accent"
                    disabled={values.title.trim().length  < 3}
                  >
                    Mark as Complete
                  </Button>
                </>
              ) : (
                <>
                  <CalendarStrip
                    initDate={values.date}
                    onSelect={(m) => {
                      if (m.isBefore(moment())) {
                        Alert.alert("", "Please select a future date");
                      }
                      setFieldValue("date", m);
                    }}
                  />
                  {Platform.OS == 'android' ? <DateTimePicker 
                    testID="currentActionDateTimeID"
                     isSlider={this.state.isCurrenAction}
                      sliderTime={this.state.currentActionTime}
                  value={values.time} mode="time" 
                  onSelect={(time) => {
                   this.onSelectDateTimevalue()
                    setFieldValue("time", time)
                  }} />
                    :
                    <>
                      <View>
                        {this.renderTimePickerIOs(values.time,  ((t:any) => {
                          setFieldValue("time", t)
                        }))}

                      </View>

                    </>
                  }
                  <Button onPress={handleSubmit} loading={this.state.actionLoader}>
                    Submit
                  </Button>
                  <Button
                    onPress={this.toggleEditActionModal}
                    mode="outlined"
                    textColor="accent"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </View>
          )}

        </Formik>
      </ModalWrapper>
    )
  }

  renderAddActionItmModal = () => {
    return (
      <ModalWrapper
        visible={this.state.showActionModal}
        onClose={this.toggleActionModal}
        title={this.renderModalTitle("Add action item")}
      >
        <Formik
         data-test-id='addformicActionID'
          initialValues={{
            title: "",
            time: moment("10:00", "hh:mm"),
            date: moment()
          }}
          validationSchema={this.actionSchema}
          onSubmit={(data) => {
            if (data.date.isBefore(moment())) {
              Alert.alert("", "Please select a future date");
              return;
            }
            this.createAction({
              date: data.date.format("DD/MM/YYYY"),
              action_item: data.title.trim(),
              time_slot: this.state.action_time == "" ? data.time.format("hh:mm a") : this.state.action_time

            });
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit, validateForm }) => (
            <>
              {!this.state.selectActionDuration ? (
                <>
                  <Input
                    maxLength={49}
                    value={values.title}
                    onChange={handleChange("title")}
                    onBlur={handleBlur("title")}
                    errorText={errors.title}
                    touched={touched.title}
                    mb={4}
                    autoFocus={true}

                    style={this.inputStyleValue()}
                  />
                  <Button
                    onPress={this.selectDuration}
                    mode="outlined"
                    textColor="accent"
                    disabled={!!errors.title}
                  >
                    Next
                  </Button>

                </>
              ) : (
                <>
                  <CalendarStrip
                    initDate={values.date}
                    onSelect={(m) => {
                      if (m.isBefore(moment())) {
                        Alert.alert("", "Please select a future date");
                      }
                      setFieldValue("date", m);
                    }}
                  />
                  {Platform.OS == 'android' ? <DateTimePicker value={values.time} mode="time" onSelect={(t) => setFieldValue("time", t)} />
                    :
                    <View>
                      {this.renderTimePickerIOs(values.time,  ((t:any) => {
                        setFieldValue("time", t)
                      }))}

                    </View>

                  }
                  <Button onPress={handleSubmit} disabled={this.state.actionLoader} loading={this.state.actionLoader}>
                    Submit
                  </Button>
                </>
              )}
            </>
          )}
        </Formik>
      </ModalWrapper>
    )
  }
  renderActionItems = () => {
    return (
      <View>
        <View style={[styles.actionItemContainer, { marginLeft: 9, marginVertical: Scale(20) }]}>
          <View style={styles.row}>
            <View style={[styles.rowItem, {height:20}]}>
              <Text style={{ justifyContent: 'center', color: '#3F3F3F', fontSize: 16, fontWeight: '500', fontFamily: 'Roboto-Medium' }}>Current Action Items</Text>
            </View>
            <Button
               testID="addActionItemID"
              onPress={this.toggleActionModal}
              textColor="primary"
              mode="outlined"
              textStyle={styles.actionButtonText}
              style={styles.actionButton}
            >
              Add Action Item +
            </Button>

          </View>
        </View>
        <ScrollView
          nestedScrollEnabled
          style={[
            styles.actionScrollSection, {
              height: this.renderScrollViewHeight()
            }]}
        >
          {this.state.actionData.length > 0 && this.renderActions()}
        </ScrollView>
        {this.state.showActionModal && this.renderAddActionItmModal()}

       
        {this.state.isshowEditActionModal && this.renderEditActionModal()}
       
      </View>
    )
  }

  renderGoalModal = () => {
    return (
      this.state.competeGoalModal && (
        <GoalModal
          visible={this.state.competeGoalModal}
          onClose={() => this.setState({
            competeGoalModal: false
          })}
          title={this.state.isEditcompeteGaol ? `When do you wish to complete it?` : `Edit your goal`}
          font="center"
          fontsize={20}
          titlecolor="#484848"
        >
          {this.state.editgoalstepmodal < 1 && <View
            style={[styles.mobileInput, { marginBottom: 20, width: '100%', alignSelf: 'center', borderRadius: Scale(9) }]}
          >
            <TextInput
              maxLength={49}
              testID={"txtInputFirstName"}
              style={[styles.Input, { paddingVertical: Scale(9.5) }]}
              placeholderTextColor="#7CBBFF"
              placeholder={""}
              value={this.state.editgoal}
              {...this.txtInputEditGoalNamePrpos} //Merge Engine::From BDS - {...this.testIDProps}
            />
          </View>
          }
          {this.state.isEditcompeteGaol && <View style={{ margin: Scale(10) }}>
            <CalendarStrip
              initDate={this.state.goalCompetionDate}
              onSelect={(m) => {
                if (m.isBefore(moment())) {
                  this.showAlert("Alert", "Please choose a future date.", "");
                  return false;
                } else {
                  this.setState({ goalCompetionDate: m })
                }
              }} />


            {Platform.OS == 'android' ? <DateTimePicker 
                 testID="currenGoaleDateTimeId"
                 isSlider={this.state.isCurrenGole}
                 sliderTime={this.state.currentGoleTime}
            value={this.state.goalCompetionTime} mode="time" 
            onSelect={(time) => {
              this.onselectCurrengoleTimeDate(time)
            }
            }
            /> :
              <>
                <View>
                  {this.renderTimePickerIOs(this.state.goalCompetionTime,  ((t:any) => {
                    this.setState({ goalCompetionTime: t })
                  }))}

                </View>

              </>
            }

          </View>
          }

          {this.state.isEditcompeteGaol && <Button testID="currengoalsaveBtn" {...this.btnSaveCompeteGoalModal}
            textStyle={styles.actionButtonText}

          >
            Save
          </Button>
          }
          {this.state.editgoalstepmodal < 1 && <Button {...this.btnEditNxtModal}
            mode="outlined"
            textColor="bluemagenta"
            textStyle={styles.actionButtonText}
            testID="CurrentGoalNextID"
          >
            Next
          </Button>}
          {this.state.editgoalstepmodal < 1 && <Button {...this.btnDeleteGoal}
            mode="outlined"
            textColor="bluemagenta"
            textStyle={styles.actionButtonText}
          >
            Delete
          </Button>}
          {this.state.editgoalstepmodal < 1 && <Button
            testID="goalMarkcompletedID"
            {...this.btnMarkasCompeteGoal}
            textStyle={styles.actionButtonText}

          >
            Mark as Complete
          </Button>}
        </GoalModal>
      )
    )
  }
  // Customizable Area End
  // Customizable Area Start
  render() {
    const localAppointmentData = this.getAppointDataLocal()
    return (
      <Drawer ref={(ref: any) => { this.drawer = ref; }}
        type="overlay"
        tapToClose={true}
        openDrawerOffset={0.25}
        content={this.renderDrawer()}
        style={{ flex: 1 }}
      >
        <>
          <StatusBar backgroundColor={'rgb(153,150,199)'} />
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView scrollEnabled={Platform.OS == "ios" ? this.state.scrollOn : true} nestedScrollEnabled={false} refreshControl={
              <RefreshControl refreshing={this.state.loading} onRefresh={this.onRefresh} />
            }>
              <View style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
                <ImageBackground
                  source={require("../assets/view_bg.png")} style={{ flex: 1, width: dimensions.wp(100), height: dimensions.hp(47) }} resizeMode="cover" resizeMethod="auto">
                  <View style={styles.Header}>
                    <View style={{
                      flexDirection: 'row', justifyContent: 'space-between', width: '92%',
                      height: Scale(70),
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                      <TouchableOpacity testID="menu_open" onPress={() =>{
                        this.stopeAudioplay()
                        this.drawer?.open?.()}}>
                        <Image source={require('../assets/imagenav_menu.png')} />
                      </TouchableOpacity>
                      <View style={{
                        flexDirection: 'column', alignItems: 'center', marginTop: Scale(20),
                        alignSelf: 'center',
                      }} >
                        <Text testID="welcomeTextID" style={[styles.Text1, styles.welcomText]}>{configJSON.welcome}</Text>
                        <Text style={[styles.Text2,]} numberOfLines={1}>{this.state.full_name}!</Text>
                      </View>
                      <TouchableOpacity >
                        <Image style={{ height: 40, width: 40, borderRadius: 20, marginRight: 10, marginBottom: 10 }} source={this.state.prifileimage ? { uri: this.state.prifileimage } : IMG_CONST.dummyPROFILE_ICON} />
                      </TouchableOpacity>
                      <Image source={require("../assets/imagenav_ring3.png")} style={{ position: 'absolute', left: this.renderWidth(), top: dimensions.hp(37), }} />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', height: height / 13, width: '93%', alignSelf: 'center', justifyContent: 'space-between' }}>
                    <View style={styles.boxContainer}>
                      <View style={[styles.box1,{width:'88%', overflow:'hidden'}]}>
                        <TouchableOpacity style={[styles.btn, {margin:5}]}
                          {...this.wellBeingAssessPessProps}
                          testID="wellBeingPess"
                        >
                          <Image source={require("../assets/edit.png")} resizeMode="contain" style={styles.edit} />
                          <Text style={[styles.editText, { fontSize:11.7 } ]}>Well-Being Assessment</Text>

                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.box2}>
                      <TouchableOpacity testID="Assessbtn" style={styles.btn} {...this.asessYourselfPressProps}>
                        <Image source={require("../assets/task-square.png")} resizeMode="contain" style={styles.edit} />
                        <Text style={styles.taskSquareText}>Assess Yourself</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', height: height / 13, width: '93%', alignSelf: 'center', justifyContent: 'space-between' }}>
                    <View style={styles.boxContainer}>
                      <View style={[styles.box1 ,{width:'88%', overflow:'hidden'}]}>
                        <TouchableOpacity style={styles.btn}
                          onPress={() => {this.stopeAudioplay();this.props.navigation.navigate('Appointments')}}
                          testID="AppointmentsPess"
                        >
                          <Image source={require("../assets/edit.png")} resizeMode="contain" style={styles.edit} />
                          <Text testID="bookAppointmentsID" style={styles.editText}>{configJSON.bookAppointment}</Text>

                        </TouchableOpacity>
                      </View>


                    </View>
                    <View style={styles.box2}>
                      <TouchableOpacity style={styles.btn}
                        onPress={() => {this.stopeAudioplay();this.props.navigation.navigate('JourneyDashBoard')}}
                        testID="JourneyDashpress"
                      >
                        <Image source={require("../assets/progress.png")} resizeMode="contain" style={styles.progressimg} />
                        <Text style={styles.editText}>My Progress</Text>

                      </TouchableOpacity>
                    </View>

                  </View>


                  <View style={[styles.mainexportBox, { marginTop: 20 }]}>
                    {this.renderTopStrenght(this.state.topStrenghts)}

                    {
                      this.renderDashboardFocuseAreaItems(this.state.focusAreaData)
                    }

                  </View>
                </ImageBackground>
               
                <View style={[styles.block, { marginLeft: 10, marginTop: Platform.OS == "android" ? Scale(63) : Scale(100) }]}>
                  <Typography color="text" size={15} font="MED" mb={2}>Suggested for you</Typography>
                </View>
                <View style={[styles.block, { marginLeft: 10 }]}>
                  <View style={styles.row}>
                    <Typography color="text" size={14} font="MED" mb={2}>Articles</Typography>
                    <TouchableOpacity onPress={() => this.onPressArticle("articles")}>
                      <Typography style={[styles.moreLink, { textDecorationLine: Platform.OS == "ios" ? 'underline' : 'none' }]} color="text" size={13} font="MED" mb={2}>View more</Typography>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  style={styles.horizontalScroll}
                >
                  {this.renderArticles()}
                </ScrollView>
                <View style={[styles.block, { marginLeft: 10, marginTop: Scale(15) }]}>

                  <View style={styles.row}>
                    <Typography color="text" size={14} font="MED" mb={2}>Audios</Typography>
                    <TouchableOpacity onPress={() => this.onPressArticle("audio")}>
                      <Typography style={[styles.moreLink, { textDecorationLine: Platform.OS == "ios" ? 'underline' : 'none' }]} color="text" size={13} font="MED" mb={2}>View more</Typography>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  style={styles.horizontalScroll}
                >
                  {this.renderAudio()}
                </ScrollView>

                <View style={[styles.block, { marginLeft: 10, marginTop: Scale(10) }]}>
                  <View style={styles.row}>
                    <Typography color="text" size={14} font="MED" mb={2}>Care Videos</Typography>
                    <TouchableOpacity onPress={() => this.onPressArticle("video")}>
                      <Typography style={[styles.moreLink, { textDecorationLine: Platform.OS == "ios" ? 'underline' : 'none' }]} color="text" size={13} font="MED" mb={2}>View more</Typography>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  style={styles.horizontalScroll}
                >
                  {this.renderVideo()}
                </ScrollView>
              {this.state.videoModal ? <VideoPlayer
                  visible={this.state.videoModal}
                  url={this.state.videoUrl}
                  onClose={this.closeVideo}
                /> : null}
               

              
                <View style={[styles.upcomingView ,{marginBottom: Platform.OS == "ios" ? 35 : 1}]}>
                  <View style={[styles.actionItemContainer, { alignSelf: 'flex-start', alignItems: 'flex-start' }]}>
                    <View style={[styles.row, { justifyContent: 'flex-start' }]}>
                      <View style={[styles.rowItem, { width: '80%' ,height:24 }]}>
                        <Text style={{
                          color: '#3F3F3F', fontSize: 16, fontWeight: '500', fontFamily: 'Roboto-Medium', textAlign: 'left',
                        }}>Upcoming Appointments</Text>

                        <Text style={{ justifyContent: 'center', color: '#878787', fontSize: 11, fontWeight: '400', marginTop: Scale(5) }}> {this.state.appointmentData?.length > 0 ? "View the appointment details" : "No appointment details"}</Text>
                      </View>

                    </View>
                  </View>
                </View>

                  {this.state.appointmentData.map((item) => {
                    return this.getList({item})
                  })}

                {this.state.showMeetingModal && (
                  <Meeting
                    meetingId={this.state.meeting.id}
                    token={this.state.meeting.token}
                    visible={this.state.showMeetingModal}
                    onClose={this.endMeeting}
                  />
                )}
               
                {this.renderRadialSlider()}
              
                {this.renderAddGoal()}
                <View style={{ backgroundColor: '#fff', height: Scale(200), flexDirection: 'row', width: '92%', alignItems: 'center', justifyContent: "space-between", borderRadius: 10, borderColor: '#979797', alignSelf: 'center' }}>
                  {this.renderGoalCureentItm()}
                  {this.renderCompetedGoal()}
                </View>

                {this.renderGoalModal()}

                
                {this.renderActionItems()}
              </View>
            </ScrollView >
            <Toast
              ref={(toast) => (this.toastRef = toast)}
              position={"bottom"}
              positionValue={150}
              textStyle={{ fontwidth: "bold", color: "#ffffff" }}
              fadeOutDuration={1000}
            />
          </SafeAreaView>
        </>
      </Drawer >
    );
  }
  // Customizable Area End
}


// Customizable Area Start
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    // height: Platform.OS === "web" ? '100vh' : 'auto',
    backgroundColor: "#F5FCFF",
  },
  Header: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    height: height / 9,
    // borderWidth:1,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Scale(15),
  },
  Text1: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 30,
    color: '#FFFFFF'
  },
  Text2: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    color: '#FFFFFF',
    left: '10%'
  },
  boxContainer: {
    height: Scale(45),
    width: '58%',
    // backgroundColor: '#9D90D0',
    borderRadius: 10,
    bottom: 4,
    alignItems: 'center',
    borderWidth: 0
  },
  box1: {
    height: Scale(35),
    width: '86%',
    backgroundColor: '#ffff',
    borderRadius: 10,
    borderColor: '#0080BE',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',

    top: 7.5,
    left: 9
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 6,
  },
  edit: {
    tintColor: '#0080BE',
    height: height / 33,
    width: width / 18,
  },
  editText: {
    color: '#0080BE',
    left: 5,
    fontWeight: '700',
    fontSize: 11,
    // flex: 1,
    // flexWrap: 'wrap'
  },
  box2: {
    height: Scale(35),
    width: '41%',
    backgroundColor: '#ffff',
    borderRadius: 10,
    borderColor: '#0080BE',
    borderWidth: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // top: 7.5,
    right: 9,
    top: 4,
  },
  taskSquare: {
    tintColor: '#0080BE',
    height: height / 33,
    width: width / 18
  },

  taskSquareText: {
    color: '#0080BE',
    fontWeight: '700',
    fontSize: 12,
    left: 5
  },
  mainexportBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: dimensions.hp(24), //height / 3.5,
    width: '92%',
    alignSelf: 'center',
  },
  boxHeader: {
    height: Scale(185),
    width: '46%',
    backgroundColor: '#EAF9FF',
    borderRadius: 12,
    borderColor: '#95D5F4',
    borderWidth: 3,
    elevation: 5,

  },
  exportText: {
    flexDirection: 'row',
    height: Scale(35),
    top: 10,

  },
  exportText3: {
    flexDirection: 'row',
    // height: Scale(25),
    marginRight: 10,
  },
  exportText2: {
    flexDirection: 'row',
    // height: Scale(25),
    // marginLeft: 4,
    marginEnd: 0,
  },
  TextHeader: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#484848',
    height: Scale(40)
  },
  TextPoints: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 21,
    color: '#0080BE'
  },
  exportImage: {
    top: 4,
    right: 3
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    height: '40%',
    borderWidth: 1,
    width: '90%'

  },
  buttonClose: {
    backgroundColor: "#2196F3",
    width: '90%',
    height: 40
  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonStyle: {
    backgroundColor: "#2196F3",
    width: '95%',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    top: 15
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: '700'
  },
  tableBox: {
    borderWidth: 0.1,
    borderRadius: 18,
    borderColor: "#979797",
    // padding: 15,
    // marginVertical: 10,
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    elevation: 10,
    // height: Scale(90),
  },
  actionItemContainer: {
    padding: "4%",
    paddingTop: 0,
    alignSelf: 'center'
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },
  rowItem: {
    width: "50%",
    height:18,
    marginBottom: Platform.OS == "android" ? 20 : 0
  },
  actionButton: {
    width: "49%",
    paddingVertical: Scale(4),
    marginBottom: 0,
    height: dimensions.hp(5),
    // zIndex:1000,
    paddingHorizontal: 0
  },
  actionButtonText: {
    fontSize: Scale(13.5)
  },
  actionScrollSection: {
    height: dimensions.hp(31),
    marginBottom: dimensions.hp(2)
  },
  actionRow: {
    paddingHorizontal: dimensions.wp(5),
    borderWidth: 1,
    borderRadius: dimensions.wp(3),
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: dimensions.wp(4),
    elevation: 5,
    marginBottom: dimensions.hp(2),
    height: dimensions.hp(6)
  },
  activeActionRow: {
    backgroundColor: "#DFFEDF",
    borderColor: Colors.green
  },
  inActiveActionRow: {
    borderColor: `${Colors.red}66`,
    backgroundColor: Colors.white
  },
  actionCheckbox: {
    height: dimensions.hp(2.5),
    width: dimensions.hp(2.5),
    borderRadius: dimensions.hp(1.25),
    marginRight: dimensions.wp(4)
  },
  activeActionCheckbox: {
    backgroundColor: Colors.green
  },
  inactiveActionCheckbox: {
    backgroundColor: Colors.borderColor
  },
  actionText: {
    width: dimensions.wp(72)
  },
  moreLink: {
    borderBottomColor: Colors.text,
    borderBottomWidth: 1
  },
  block: {
    paddingHorizontal: "4%",
    marginHorizontal: Scale(6)
  },
  horizontalScroll: {
    paddingLeft: dimensions.wp(4),
    paddingRight: 0,
    marginLeft: 10,
    paddingBottom:10
  },
  article: {
    elevation: 4,
    marginRight: dimensions.wp(3),
    width: dimensions.wp(30),
    height: dimensions.wp(54),
    position: "relative",
    marginTop: -(dimensions.hp(2))
  },
  articleImage: {
    position: "absolute",
    // top: "-10%",
    // left: "-10%",
    // width: "115%",
    // height: "120%",
    resizeMode: "contain"
  },
  audioWrapper: {
    marginRight: dimensions.wp(5),
    marginBottom: dimensions.hp(2)
  },
  audio: {
    width: dimensions.wp(28),
    height: dimensions.wp(28),
    borderRadius: dimensions.wp(3),
    borderWidth: 3,
    borderColor: "#c9c2f2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: dimensions.hp(1)
  },
  audioPlay: {
    width: dimensions.wp(12),
    height: dimensions.wp(12),
    borderRadius: dimensions.wp(6),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent,
    borderWidth: 3,
    borderColor: "#c6c6c6"
  },
  audioPlayBtn:{
    width: dimensions.wp(8),
    height: dimensions.wp(8),
    borderRadius: dimensions.wp(4),
    justifyContent:'center',
    alignItems:'center'
  },
  audioIcon: {
    width: dimensions.wp(5),
    height: dimensions.wp(5),
    resizeMode: "contain",
    tintColor: Colors.white
  },
  audioIconImg:{
    width: dimensions.wp(3),
    height: dimensions.wp(3),
    resizeMode: "contain",
    tintColor: Colors.white
  },
  videoBlock: {
    width: dimensions.wp(70),
    height: dimensions.wp(55),
    borderRadius: dimensions.wp(3),
    borderWidth: 3,
    borderColor: "#c9c2f2",
    marginRight: dimensions.wp(4),
    marginBottom: dimensions.hp(1),
    overflow: "hidden"
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlay: {
    width: dimensions.wp(15),
    height: dimensions.wp(15),
    borderRadius: dimensions.wp(7.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#867CCA",
    borderWidth: 3,
    borderColor: "#c6c6c6"
  },
  innerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  checkIpSytle: {
    flexDirection: "row",
    backgroundColor: '#4793E0',
    //  margin:10,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    color: '#3E3E3E',
    textAlign: 'left',
    margin: 10,
    opacity: 1,
    backgroundColor: 'transparent',
    fontStyle: 'normal',
    fontWeight: 'normal',
    borderRadius: 19,
    marginLeft: 40,
    textAlignVertical: 'top',
  },
  Input: {
    color: Colors.text,
    paddingLeft:5,
    fontSize: Scale(17)
  },
  mobileInput: {
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#979797", //"#767676",
    borderRadius: 2,
    includeFontPadding: true,
    margin: 10
  },
  // drawer styling
  containerFilter: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  HomeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  headerImage: {
    flexDirection: "row",
    alignItems: "center"
  },
  ProfileImage: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(40),
    resizeMode: "cover",
    borderColor: "#c2b2d8"
  },
  profileText: {
    fontSize: Scale(15),
    color: "#000",
    marginTop: Scale(10)
  },
  AccountText: {
    fontSize: Scale(15),
    color: "#000",
    marginLeft: Scale(20),
  },
  profileFirstText: {
    color: "gray",
    fontSize: Scale(15)
  },
  ProfileTextHeader: {
    marginLeft: Scale(20)
  },
  line: {
    width: Scale(210),
    height: Scale(1),
    borderWidth: Scale(0.3),
    borderColor: "#DDD",
    marginTop: Scale(30),
    alignSelf: "center"
  },
  account: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#8c69c6"
  },
  accoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Scale(20)
  },
  scrollViewstyle: {
    marginTop: 20,
    width: 120 * 2,
    height: 120,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'lightgrey',
    paddingBottom: 50
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  SquareShapeView: {
    width: 120 * 2,
    height: 120,
    backgroundColor: '#00BCD4'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  docTitle: {
    // position: "absolute",
    // width: "50%",
    // top: "20%",
    // left: "10%"
  },
  progressimg: {
    tintColor: '#0080BE',
    height: height / 38,
    width: width / 18,
    resizeMode: 'contain',
    opacity: .7
  },
  currentGoalText:{ color: '#fff', fontSize: 14, textAlign: 'center', marginLeft: 15 },
  currentGoalBtn:{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10, backgroundColor: 'transparent', },
  welcomText:{ marginLeft: Scale(10) },
  correnGoalScrol:{ marginBottom: 20, },
  goalViewCard:{ marginBottom: 0 },
  upcomingView:{ marginHorizontal: Scale(5), marginTop: Scale(10),},
});
// Customizable Area End
