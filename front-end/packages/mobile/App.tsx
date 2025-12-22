import React, { useEffect, useMemo, useRef, useState } from "react";
import SplashScreen from 'react-native-splash-screen';
import styles from './AppStyles'
import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import {  LogBox, View, Image, Text } from 'react-native'
import * as ReactNavigation from "react-navigation";
// import { register } from "@videosdk.live/react-native-sdk"; // Removed - using Zoom links instead
import * as RootNavigation from '../framework/src/RootNavigation';
import { AppProvider, useAppState } from '../components/src/context/AppContext';
import UserList from "../blocks/ChatBackuprestore/src/UserList";
import HomePage from "../blocks/dashboard/src/HomePage";
import HomeScreen from "../components/src/HomeScreen";
import InfoPage from '../blocks/info-page/src/InfoPageBlock'
import VisualAnalytics from "../blocks/visualanalytics/src/VisualAnalytics";
import VideoLibrary from "../blocks/VideoLibrary/src/VideoLibrary";
import FeedbackCollection from "../blocks/FeedbackCollection/src/FeedbackCollection";
import RecommendationEngine4 from "../blocks/RecommendationEngine4/src/RecommendationEngine4";
import SocialMediaAccountLoginScreen from "../blocks/social-media-account-login/src/SocialMediaAccountLoginScreen";
import QuestionBank from "../blocks/QuestionBank/src/QuestionBank";
import AudioLibrary from "../blocks/AudioLibrary/src/AudioLibrary";
import OTPInputAuth from "../blocks/otp-input-confirmation/src/OTPInputAuth";
import UserGroups from "../blocks/UserGroups/src/UserGroups";
import ChatBackuprestore from "../blocks/ChatBackuprestore/src/ChatBackuprestore";
import RolesPermissions2 from "../blocks/RolesPermissions2/src/RolesPermissions2";
import Videos from "../blocks/videos/src/Videos";
import PeopleManagement2 from "../blocks/PeopleManagement2/src/PeopleManagement2";
import RandomNumberGenerator from "../blocks/randomnumbergenerator/src/RandomNumberGenerator";
import Pushnotifications from "../blocks/pushnotifications/src/Pushnotifications";
import ForgotPassword from "../blocks/forgot-password/src/ForgotPassword";
import ForgotPasswordOTP from "../blocks/forgot-password/src/ForgotPasswordOTP";
import NewPassword from "../blocks/forgot-password/src/NewPassword";
import Notifications from "../blocks/notifications/src/Notifications";
import Chatbot6 from "../blocks/Chatbot6/src/Chatbot6";
import VideoCall5 from "../blocks/VideoCall5/src/VideoCall5";
import Interactivefaqs from "../blocks/interactivefaqs/src/Interactivefaqs";
import AddInteractivefaqs from "../blocks/interactivefaqs/src/AddInteractivefaqs";
import AdminConsole3 from "../blocks/AdminConsole3/src/AdminConsole3";
import Appointments from "../blocks/appointmentmanagement/src/Appointments";
import AddAppointment from "../blocks/appointmentmanagement/src/AddAppointment";
import Settings5 from "../blocks/Settings5/src/Settings5";
import UserProfileBasicBlock from "../blocks/user-profile-basic/src/UserProfileBasicBlock";
import ContactUsScreen from "../blocks/user-profile-basic/src/ContactUsScreen";
import TimeTrackingDet from "../blocks/TimeTrackingBilling/src/TimeTrackingDet"


import MatchAlgorithm2 from "../blocks/MatchAlgorithm2/src/MatchAlgorithm2";
import BulkUploading from "../blocks/BulkUploading/src/BulkUploading";
import Scheduling from "../blocks/scheduling/src/Scheduling";
import LiveChatSummary from "../blocks/LiveChatSummary/src/LiveChatSummary";
import Categoriessubcategories from "../blocks/categoriessubcategories/src/Categoriessubcategories";
import ContentManagement from "../blocks/ContentManagement/src/ContentManagement";
import CountryCodeSelector from "../blocks/country-code-selector/src/CountryCodeSelector";
import CountryCodeSelectorTable from "../blocks/country-code-selector/src/CountryCodeSelectorTable";
import TimeTrackingBilling from "../blocks/TimeTrackingBilling/src/TimeTrackingBilling";
import SocialMediaAccountRegistrationScreen from "../blocks/social-media-account-registration/src/SocialMediaAccountRegistrationScreen";
import Contactus from "../blocks/contactus/src/Contactus";
import AddContactus from "../blocks/contactus/src/AddContactus";
import Catalogue from "../blocks/catalogue/src/Catalogue";
import EducationalUserProfile from "../blocks/educational-user-profile/src/EducationalUserProfile";
import Chat9 from "../blocks/Chat9/src/Chat9";
import EmailAccountRegistration from "../blocks/email-account-registration/src/EmailAccountRegistration";
import Dashboard from "../blocks/dashboard/src/Dashboard";
import AssessmentTest from "../blocks/AssessmentTest/src/AssessmentTest";
import Splashscreen from "../blocks/splashscreen/src/Splashscreen";
import TargetedFeed from "../blocks/TargetedFeed/src/TargetedFeed";
import Onboardingguide from "../blocks/onboardingguide/src/Onboardingguide";
import EmailAccountLoginBlock from "../blocks/email-account-login/src/EmailAccountLoginBlock";
import ShareCalendar from "../blocks/ShareCalendar/src/ShareCalendar";
import LandingPage from "../blocks/landingpage/src/LandingPage";
import ChooseCategory from '../blocks/Chatbot6/src/ChooseCategories'
import QuestionAns from '../blocks/Chatbot6/src/QuestionAns';
import ReassorOrContinue from '../blocks/Chatbot6/src/ReassOrContinue';
import EnterEmail from '../blocks/forgot-password/src/EnterEmail';
import EnterPhone from '../blocks/forgot-password/src/EnterPhone';
import PasswordCreatedSuccessfully from '../blocks/forgot-password/src/PasswordCreatedSuccessfully';
import PrivacyPolicy from '../blocks/email-account-registration/src/PrivacyPolicy';
import TermsAndCondition from '../blocks/email-account-registration/src/TermsAndCondition';
import CoachDashboard from "../blocks/dashboard/src/CoachDashboard";
import DocumentViewer from '../components/src/DocumentViewer';
import EmoJourney1 from '../blocks/QuestionBank/src/EmoJourney1';
import Weareglad from '../blocks/QuestionBank/src/Weareglad';
import EmoJourney from '../blocks/MatchAlgorithm2/src/EmoJourney';
import JourneyDashBoard from '../blocks/MatchAlgorithm2/src/JourneyDashBoard';
import CoachList from '../blocks/AdminConsole3/src/CoachList';
import AddNewCoach from '../blocks/AdminConsole3/src/AddNewCoach';
import AddNewCom from '../blocks/AdminConsole3/src/AddNewCom';
import GameScreen from '../components/src/games/Game';

import { checkHome, unchekHome, niyacheck, niyauncheck, mycoachcheck, mycoachuncheck, journychcheck, journychuncheck } from '../blocks/dashboard/src/assets';
import CoachTab from '../blocks/landingpage/src/CoachTab';

import WellBeingAssTest from '../blocks/AssessmentTest/src/WellBeingAssTest';
import WellbeingCategories from '../blocks/AssessmentTest/src/WellbeingCategories';
import WellbeingScore from '../blocks/AssessmentTest/src/WellbeingScore';

import DetailComView from '../blocks/AdminConsole3/src/DetailComView';
import HRListsScreen from '../blocks/AdminConsole3/src/HRListsScreen';
import Ratting from '../blocks/dashboard/src/Ratting';
import HRDashboard from '../blocks/dashboard/src/HRDashboard';
import SendPushnotification from '../blocks/pushnotifications/src/SendPushnotification';
import HRProfile from '../blocks/AdminConsole3/src/HRProfile';
import UserFeedback from '../blocks/AdminConsole3/src/UserFeedback';
import UserFeedbackDet from '../blocks/AdminConsole3/src/UserFeedbackDet';
import GamesCompleted from '../blocks/QuestionBank/src/GamesCompleted';
import UserProfile from '../blocks/user-profile-basic/src/UserProfile';
import TrackPlayer from "react-native-track-player";

const reactNavigationKeys = Object.keys(ReactNavigation || {});
console.log('[debug] react-navigation keys:', reactNavigationKeys);
const {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createNavigationContainer,
} = ReactNavigation as any;

const createAppContainerExport = (ReactNavigation as any).createAppContainer;
console.log(
  '[debug] createAppContainer type:',
  typeof createAppContainerExport,
  'createNavigationContainer type:',
  typeof createNavigationContainer
);

const createAppContainer =
  createAppContainerExport ?? createNavigationContainer;

const NewUsrStack = createStackNavigator({
  Chatbot6: { screen: Chatbot6, navigationOptions: { header: null, title: "Chatbot6" } },
  QuestionAns: { screen: QuestionAns, navigationOptions: { header: null, title: "QuestionAns" } },
  ReassorOrContinue: { screen: ReassorOrContinue, navigationOptions: { header: null, title: "ReassorOrContinue" } },
  ChooseCategory: { screen: ChooseCategory, navigationOptions: { header: null, title: "ChooseCategory" } },
  // HomePage: { screen: HomePage, navigationOptions: { header: null, title: "" } },
  WellbeingCategories: { screen: WellbeingCategories, navigationOptions: { header: null, title: "Assessment Categories"}},
  WellBeingAssTest: { screen: WellBeingAssTest, navigationOptions: { header: null, title: "Questions Wellbeing" }},
  WellbeingScore: { screen: WellbeingScore, navigationOptions: { header: null, title: "Wellbeing Score" }},

  })

  const renderBHome=(focused:boolean)=>{
    return (
      <View style={styles.outerContainer}>
        <View style={styles.tabContainer}>
          <Image source={focused ? checkHome : unchekHome} style={styles.homeIcons} />
          <Text style={{ color: focused ? "#746ead" : 'grey' }}>Home</Text>
        </View>
      </View>
    )
  }
const renderReassignorcont=(focused:boolean)=>{
  return (
    <View style={styles.outerContainer}>
      <View style={styles.tabContainer}>
        <Image source={focused ? niyacheck : niyauncheck} style={styles.homeIcons} />
        <Text style={{ color: focused ? "#746ead" : 'grey' }}>NIYA</Text>
      </View>
    </View>
  )
}

const renderMyCoach=(focused:boolean)=>{
  return (
    <View style={styles.outerContainer}>
      <View style={styles.tabContainer}>
        <Image source={focused ? mycoachuncheck : mycoachcheck} style={styles.homeIcons} />
        <Text style={{ color: focused ? "#746ead" : 'grey' }}>My Coach</Text>
      </View>
    </View>
  )
}
const renderEmoJourney=(focused:boolean)=>{
  return (
    <View style={styles.outerContainer}>
      <View style={styles.tabContainer}>
        <Image source={focused ? journychcheck : journychuncheck} style={styles.homeIcons} />
        <Text style={{ color: focused ? "#746ead" : 'grey' }}>Journey</Text>
      </View>
    </View>
  )
}

const BottomTabNavigator = createBottomTabNavigator(
  {
    HomePage: { screen: HomePage, navigationOptions: { header: null, title: "HomePage" } },
    ReassorOrContinue: { screen: ReassorOrContinue, navigationOptions: { header: null } },
    MyCoachTab: { screen: LandingPage, navigationOptions: { title: "CoachTab" } },
    EmoJourney: { screen: EmoJourney, navigationOptions: { header: null, title: "Journey" } }
  },
  {
    initialRouteName: 'HomePage',
    defaultNavigationOptions: ({ navigation }: any) => ({
      tabBarIcon: ({ focused }: any) => {
        const { routeName } = navigation.state;

        if (routeName === "HomePage") {
          return renderBHome(focused);
        }
        if (routeName === "ReassorOrContinue") {
          TrackPlayer.pause();
          return renderReassignorcont(focused);
        }
        if (routeName === "MyCoachTab") {
          TrackPlayer.pause();
          return renderMyCoach(focused);
        }
        if (routeName === "EmoJourney") {
          TrackPlayer.pause();
          return renderEmoJourney(focused);
        }
        return null;
      }
    }),
    tabBarOptions: {
      style: styles.bottomTabStyle,
      showLabel: false,
      keyboardHidesTabBar: true
    }
  }
);


const SplashStack = createStackNavigator({
  Splashscreen: { screen: Splashscreen, navigationOptions: { title: "Splashscreen", header: null } },
  EmailAccountLoginBlock: { screen: EmailAccountLoginBlock, navigationOptions: { header: null, title: "EmailAccountLoginBlock" } },
  Chatbot6: { screen: Chatbot6, navigationOptions: { header: null, title: "Chatbot6" } },
  ReassorOrContinue: { screen: ReassorOrContinue, navigationOptions: { header: null, title: "ReassorOrContinue" } },

});
const ReassStack=createStackNavigator({
  ReassorOrContinue: { screen: ReassorOrContinue, navigationOptions: { header: null, title: "ReassorOrContinue" } },
  QuestionAns: { screen: QuestionAns, navigationOptions: { header: null, title: "QuestionAns" } },
  ChooseCategory: { screen: ChooseCategory, navigationOptions: { header: null, title: "ChooseCategory" } },
  
});
const EmpStack = createStackNavigator({
  HomePage: { screen: BottomTabNavigator, navigationOptions: { header: null, title: "" } },
  ChooseCategory: { screen: ChooseCategory, navigationOptions: { header: null, title: "ChooseCategory" } },
  QuestionAns: { screen: QuestionAns, navigationOptions: { header: null, title: "QuestionAns" } },
  VisualAnalytics: { screen: VisualAnalytics, navigationOptions: { title: "VisualAnalytics" } },
  VideoLibrary: { screen: VideoLibrary, navigationOptions: { title: "VideoLibrary" } },
  FeedbackCollection: { screen: FeedbackCollection, navigationOptions: { title: "FeedbackCollection" } },
  RecommendationEngine4: { screen: RecommendationEngine4, navigationOptions: { title: "RecommendationEngine4" } },
  SocialMediaAccountLoginScreen: { screen: SocialMediaAccountLoginScreen, navigationOptions: { title: "SocialMediaAccountLoginScreen" } },
  QuestionBank: { screen: QuestionBank, navigationOptions: { title: "QuestionBank" } },
  AudioLibrary: { screen: AudioLibrary, navigationOptions: { title: "AudioLibrary", header: null } },
  OTPInputAuth: { screen: OTPInputAuth, navigationOptions: { header: null, title: "OTPInputAuth" } },
  UserGroups: { screen: UserGroups, navigationOptions: { title: "UserGroups" } },
  ChatBackuprestore: { screen: ChatBackuprestore, navigationOptions: { title: "ChatBackuprestore",header:null } },
  UserList:{ screen: UserList, navigationOptions: { title:"UserList" ,header:null } },
 
  RolesPermissions2: { screen: RolesPermissions2, navigationOptions: { title: "RolesPermissions2" } },
  Videos: { screen: Videos, navigationOptions: { title: "Videos" } },
  PeopleManagement2: { screen: PeopleManagement2, navigationOptions: { title: "PeopleManagement2" } },
  RandomNumberGenerator: { screen: RandomNumberGenerator, navigationOptions: { title: "RandomNumberGenerator" } },
  Pushnotifications: { screen: Pushnotifications, navigationOptions: { title: "Pushnotifications" } },
  // password start from here 
  ForgotPassword: { screen: ForgotPassword, navigationOptions: { header: null, title: "ForgotPassword" } },
  ForgotPasswordOTP: { screen: ForgotPasswordOTP, navigationOptions: { title: "ForgotPasswordOTP" } },
  NewPassword: { screen: NewPassword, navigationOptions: { header: null, title: "NewPassword" } },
  EnterEmail: { screen: EnterEmail, navigationOptions: { header: null, title: "" } },
  EnterPhone: { screen: EnterPhone, navigationOptions: { header: null, title: "" } },
  PasswordCreatedSuccessfully: { screen: PasswordCreatedSuccessfully, navigationOptions: { header: null, title: "PasswordCreatedSuccessfully" } },
  Notifications: { screen: Notifications, navigationOptions: { title: "Notifications" } },
  VideoCall5: { screen: VideoCall5, navigationOptions: { title: "VideoCall5" } },
  Interactivefaqs: { screen: Interactivefaqs, navigationOptions: { title: "Interactivefaqs" } },
  AddInteractivefaqs: { screen: AddInteractivefaqs, navigationOptions: { title: "AddInteractivefaqs" } },
  Appointments: { screen: Appointments, navigationOptions: { title: "Appointments", header: null, } },
  AddAppointment: { screen: AddAppointment, navigationOptions: { title: "AddAppointment" } },
  Settings5: { screen: Settings5, navigationOptions: { title: "Settings5" } },
  UserProfileBasicBlock: { screen: UserProfileBasicBlock, navigationOptions: { title: "UserProfileBasicBlock", header: null } },
  UserProfile: { screen: UserProfile, navigationOptions: { title: "UserProfile", header: null } },
  
  ContactUsScreen: { screen: ContactUsScreen, navigationOptions: { title: "ContactUsScreen", header: null } },
  Chatbot6: { screen: Chatbot6, navigationOptions: { header: null, title: "Chatbot6" } },
   MatchAlgorithm2: { screen: MatchAlgorithm2, navigationOptions: { title: "MatchAlgorithm2" } },
  BulkUploading: { screen: BulkUploading, navigationOptions: { title: "BulkUploading" } },
  Scheduling: { screen: Scheduling, navigationOptions: { title: "Scheduling" } },
  LiveChatSummary: { screen: LiveChatSummary, navigationOptions: { title: "LiveChatSummary" } },
  Categoriessubcategories: { screen: Categoriessubcategories, navigationOptions: { title: "Categoriessubcategories" } },
  ContentManagement: { screen: ContentManagement, navigationOptions: { title: "ContentManagement" } },
  CountryCodeSelector: { screen: CountryCodeSelector, navigationOptions: { title: "CountryCodeSelector" } },
  CountryCodeSelectorTable: { screen: CountryCodeSelectorTable, navigationOptions: { title: "CountryCodeSelectorTable" } },
  TimeTrackingBilling: { screen: TimeTrackingBilling, navigationOptions: { title: "TimeTrackingBilling",header:null } },
  TimeTrackingDet:{screen:TimeTrackingDet,navigationOptions:{header:null,title:'TimeTrackingDet'}},

  SocialMediaAccountRegistrationScreen: { screen: SocialMediaAccountRegistrationScreen, navigationOptions: { title: "SocialMediaAccountRegistrationScreen" } },
  Contactus: { screen: Contactus, navigationOptions: { title: "Contactus" } },
  AddContactus: { screen: AddContactus, navigationOptions: { title: "AddContactus" } },
  Catalogue: { screen: Catalogue, navigationOptions: { title: "Catalogue" } },
  EducationalUserProfile: { screen: EducationalUserProfile, navigationOptions: { title: "EducationalUserProfile" } },
  Chat9: { screen: Chat9, navigationOptions: { title: "Chat9" } },
  PrivacyPolicy: { screen: PrivacyPolicy, navigationOptions: { title: "Privacy Policy", header: null } },
  TermsAndCondition: { screen: TermsAndCondition, navigationOptions: { title: "TermsAndCondition", header: null } },
  Dashboard: { screen: Dashboard, navigationOptions: { title: "Dashboard" } },
  AssessmentTest: { screen: AssessmentTest, navigationOptions: { header: null, title: "AssessmentTest" } },
  TargetedFeed: { screen: TargetedFeed, navigationOptions: { title: "TargetedFeed" } },
  Onboardingguide: { screen: Onboardingguide, navigationOptions: { title: "Onboardingguide" } },
  ShareCalendar: { screen: ShareCalendar, navigationOptions: {header: null,  title: "ShareCalendar" } },
  LandingPage: { screen: LandingPage, navigationOptions: { title: "LandingPage",header: null} },
  InfoPage: { screen: InfoPage, navigationOptions: { title: "Info" } },
  BottomTabNavigator: { screen: BottomTabNavigator, navigationOptions: { header: null, gesturesEnabled: false } },
  EmoJourney1: { screen: EmoJourney1, navigationOptions: { header: null, title: "Emo Journey"}},
  Weareglad: { screen: Weareglad, navigationOptions: { header: null, title: "We are glad" }},
  CoachTab: { screen: CoachTab, navigationOptions: { header: null } },
  DocumentViewer: { screen: DocumentViewer, navigationOptions: { header: null, title: "Player" } },
  EmoJourney: { screen: EmoJourney, navigationOptions: { header: null, title: "Journey" } },
  JourneyDashBoard: { screen: JourneyDashBoard, navigationOptions: { header: null, title: "Dashboard"} },
  // WellBeingAssTest
  WellBeingAssTest: { screen: WellBeingAssTest, navigationOptions: { header: null, title: "Questions Wellbeing" }},
  WellbeingCategories: { screen: WellbeingCategories, navigationOptions: { header: null, title: "Assessment Categories"}},
  WellbeingScore: { screen: WellbeingScore, navigationOptions: { header: null, title: "Wellbeing Score" }},
  GameScreen: { screen: GameScreen, navigationOptions: { header: null } },
  Ratting: { screen: Ratting, navigationOptions: { header: null, title: "Feedback" } },
  GamesCompleted: { screen: GamesCompleted, navigationOptions: { header: null, title: "Games Completed" } }
});

const GuestStack = createStackNavigator({

  Splashscreen: { screen: Splashscreen, navigationOptions: { title: "Splashscreen", header: null } },
  ChooseCategory: { screen: ChooseCategory, navigationOptions: { header: null, title: "ChooseCategory" } },
  SocialMediaAccountLoginScreen: { screen: SocialMediaAccountLoginScreen, navigationOptions: { title: "SocialMediaAccountLoginScreen" } },
  OTPInputAuth: { screen: OTPInputAuth, navigationOptions: { header: null, title: "OTPInputAuth" } },
  // password start from here 
  ForgotPassword: { screen: ForgotPassword, navigationOptions: { header: null, title: "ForgotPassword" } },
  ForgotPasswordOTP: { screen: ForgotPasswordOTP, navigationOptions: { title: "ForgotPasswordOTP" } },
  NewPassword: { screen: NewPassword, navigationOptions: { header: null, title: "NewPassword" } },
  EnterEmail: { screen: EnterEmail, navigationOptions: { header: null, title: "" } },
  EnterPhone: { screen: EnterPhone, navigationOptions: { header: null, title: "" } },
  PasswordCreatedSuccessfully: { screen: PasswordCreatedSuccessfully, navigationOptions: { header: null, title: "PasswordCreatedSuccessfully" } },
  CountryCodeSelector: { screen: CountryCodeSelector, navigationOptions: { title: "CountryCodeSelector" } },
  CountryCodeSelectorTable: { screen: CountryCodeSelectorTable, navigationOptions: { title: "CountryCodeSelectorTable" } },
  SocialMediaAccountRegistrationScreen: { screen: SocialMediaAccountRegistrationScreen, navigationOptions: { title: "SocialMediaAccountRegistrationScreen" } },
  EmailAccountRegistration: { screen: EmailAccountRegistration, navigationOptions: { header: null, title: "EmailAccountRegistration" } },
  PrivacyPolicy: { screen: PrivacyPolicy, navigationOptions: { title: "Privacy Policy", header: null } },
  TermsAndCondition: { screen: TermsAndCondition, navigationOptions: { title: "TermsAndCondition", header: null } },
  EmailAccountLoginBlock: { screen: EmailAccountLoginBlock, navigationOptions: { header: null, title: "EmailAccountLoginBlock" } }
});
const HRStack = createStackNavigator({
  HRDashboard: { screen: HRDashboard, navigationOptions: { header: null } },
  UserProfile: { screen: UserProfile, navigationOptions: { title: "UserProfile", header: null } },
  ContactUsScreen: { screen: ContactUsScreen, navigationOptions: { header: null } },
  PrivacyPolicy: { screen: PrivacyPolicy, navigationOptions: { title: "Privacy Policy", header: null } },
  TermsAndCondition: { screen: TermsAndCondition, navigationOptions: { title: "TermsAndCondition", header: null } },
 
});

const CoachStack = createStackNavigator({
  HomeScreen: { screen: CoachDashboard, navigationOptions: { header: null, gesturesEnabled: false } },
  Chat9: { screen: Chat9, navigationOptions: { header: null, gesturesEnabled: false } },
  UserProfile: { screen: UserProfile, navigationOptions: { title: "UserProfile", header: null } },
  ContactUsScreen: { screen: ContactUsScreen, navigationOptions: { header: null } },
  PrivacyPolicy: { screen: PrivacyPolicy, navigationOptions: { header: null } },
  Game: { screen: GameScreen, navigationOptions: { header: null } },
});

const AdminStack = createStackNavigator({
  AdminConsole3: { screen: AdminConsole3, navigationOptions: { title: "AdminConsole3",header: null } },
  UserGroups: { screen: UserGroups, navigationOptions: { title: "UserGroups" } },
  RolesPermissions2: { screen: RolesPermissions2, navigationOptions: { title: "RolesPermissions2" } },
  PeopleManagement2: { screen: PeopleManagement2, navigationOptions: { title: "PeopleManagement2" } },
  Pushnotifications: { screen: Pushnotifications, navigationOptions: { title: "Pushnotifications" } },
  Settings5: { screen: Settings5, navigationOptions: { title: "Settings5" } },
  UserProfile: { screen: UserProfile, navigationOptions: { title: "UserProfile", header: null } },
  ContactUsScreen: { screen: ContactUsScreen, navigationOptions: { title: "ContactUsScreen", header: null } },
  PrivacyPolicy: { screen: PrivacyPolicy, navigationOptions: { title: "Privacy Policy", header: null } },
  CoachList: { screen: CoachList, navigationOptions: { header: null } },
  AddNewCoach:{screen:AddNewCoach, navigationOptions: { header: null }},
  AddNewComp:{screen:AddNewCom, navigationOptions: { header: null }},
  DetailComView:{screen:DetailComView,navigationOptions:{header:null}},
  HRListsScreen:{screen:HRListsScreen,navigationOptions:{header:null}},
  Notifications: { screen: Notifications, navigationOptions: { title: "Notifications" } },
  SendPushnotification: { screen: SendPushnotification, navigationOptions: { header: null } },
  HRProfile: { screen: HRProfile, navigationOptions: { header: null } },
  UserFeedback: { screen: UserFeedback, navigationOptions: { header:null, title: 'User Feedback'}},
  UserFeedbackDet: { screen: UserFeedbackDet, navigationOptions: { header: null, title: "User Feedback Details" }}
 
});

if (!HomeScreen.instance) {
  const defaultProps = {
    navigation: null,
    id: "HomeScreen"
  };
  const homeScreen = new HomeScreen(defaultProps);
}

// Replace deprecated YellowBox with LogBox
LogBox.ignoreAllLogs(false);
LogBox.ignoreLogs(['Warning:']);

// VideoSDK registration removed - using Zoom links for video calls instead

const RootNavigator = createSwitchNavigator(
  {
    Splash: SplashStack,
    Emp: EmpStack,
    Guest: GuestStack,
    Coach: CoachStack,
    HR: HRStack,
    Admin: AdminStack,
    NewUser: NewUsrStack,
    Reass: ReassStack,
  },
  {
    initialRouteName: 'Splash',
  }
);

const getRootRoute = (auth: boolean, role: string, isNew: boolean, isshowReass: boolean) => {
  if (auth) {
    if (role === "" || role === "employee") {
      if (isNew) {
        return "NewUser";
      }
      if (isshowReass) {
        return "Reass";
      }
      return "Emp";
    }
    if (role === "hr") {
      return "HR";
    }
    if (role === "admin") {
      return "Admin";
    }
    return "Coach";
  }
  return "Guest";
};

const AppContainer = createAppContainer(RootNavigator);

const NavigationOrchestrator = () => {
  const { auth, role, isNew, isshowReass } = useAppState();
  const lastRouteRef = useRef<string | null>(null);
  const [navigatorReady, setNavigatorReady] = useState(false);
  const targetRoute = useMemo(() => getRootRoute(auth, role, isNew, isshowReass), [auth, role, isNew, isshowReass]);

  useEffect(() => {
    if (!navigatorReady) {
      return;
    }
    if (lastRouteRef.current === targetRoute) {
      return;
    }
    lastRouteRef.current = targetRoute;
    RootNavigation.navigate(targetRoute, undefined);
  }, [navigatorReady, targetRoute]);

  const handleRef = (nav: any) => {
    if (nav && nav._navigation) {
      RootNavigation.navigationRef.current = nav._navigation;
      RootNavigation.isReadyRef.current = true;
      if (!navigatorReady) {
        setNavigatorReady(true);
      }
    }
  };

  return (
    <AppContainer ref={handleRef} />
  );
};

export function App() {
  useEffect(() => {
    requestPermission()
  }, []);
  
  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };
  
  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const requestPermission = async() => {
    try {
      const checkPermission = await checkNotificationPermission();
    if (checkPermission !== RESULTS.GRANTED) {
      await requestNotificationPermission();
    }
    } catch (err) {
      alert('error')
    }
  }

  return (
    <AppProvider>
      <NavigationOrchestrator />
    </AppProvider>
  );
};

