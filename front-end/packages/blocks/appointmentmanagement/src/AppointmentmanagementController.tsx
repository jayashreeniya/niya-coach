import moment from "moment";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { headerImgBg, backImg, calendarDate, appointmentConfirmedImg } from './assets'
import { Alert, BackHandler } from 'react-native'
let d = new Date();
let m = d.getMonth(); //current month
let y = d.getFullYear(); //current year
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { checkBoxImg, unCheckBoxIMg } from "../../Chatbot6/src/assets";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export interface S {
  // Customizable Area Start
  available_date: any;
  date: any;
  selected_date: any;
  start_time: any;
  end_time: any;
  id: any;
  pageNo: number;
  token: string;
  appointmentsList: any;
  isRefreshing: boolean;
  isconfirmModal: boolean;
  isconfirmPress: boolean;
  isSlotModal: boolean;
  modalTitle: string;
  modalSubtitle: string;
  shownisconfirmmsg: boolean;
  SliderPad: any;
  TIME: any;
  width: any;
  selected: any;
  selecteDateValue:moment.Moment
  totaldaysInMonth: any;
  seleCoachData: any;
  converted_time: any;
  selecteTime24Hr: any;
  service_provider_id: any;
  showId: any;
  loading: boolean;
  options: any[];
  checked: string;
  is_bking_pressed: boolean
  isSliderTime:boolean,
  // Customizable Area End
}

export interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class AppointmentmanagementController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  addAppointmentApiCallId: any;
  getAppointmentsListApiCallId: any;
  deleteAllAppointmentsApiCallId: any;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area End
    ];

    this.isStringNullOrBlank = this.isStringNullOrBlank.bind(this);
    let endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + 30);
    this.state = {
      // Customizable Area Start
      id: 0,
      start_time: "06:00",//new Date(),
      end_time: "06:59",//endTime,
      date: new Date(),
      available_date: moment(new Date()).format("DD/MM/YYYY"),//moment(new Date()).format("MM DD YYYY"),//moment(new Date()).format("MMM YYYY DD"),
      selected_date: moment(new Date()).format("DD/MM/YYYY"),
      appointmentsList: [],
      pageNo: 1,
      token: "",
      isRefreshing: false,
      isconfirmModal: false,
      isconfirmPress: false,
      shownisconfirmmsg: false,
      modalTitle: 'Appointment confirmation',
      modalSubtitle: `Do you want to confirm this appointment with `,
      SliderPad: 12,
      TIME: { min: 0, max: 24 },
      width: 20,
      selected: [6],
      selecteDateValue:moment(`${new Date().getHours()}:${new Date().getMinutes()}`, "hh:mm A"),
      totaldaysInMonth: new Date(y, m + 1, 0),
      seleCoachData: "",
      converted_time: "6:00 AM",
      selecteTime24Hr: "6:00 AM",
      service_provider_id: "",
      showId: "",
      loading: false,
      options: [{ id: "01", min: 30 }, { id: "02", min: 60 }],
      checked: "",
      is_bking_pressed: false,
      isSlotModal: false,
      isSliderTime:false,
      // Customizable Area End
    };

    // Customizable Area Start
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    BackHandler.addEventListener('hardwareBackPress', () => {
      if(this.props.navigation.isFocused()){this.props.navigation.navigate('HomePage');
      return true;
    }

    });
    this.props.navigation.addListener('didFocus', () => {
      this.setState({
        token: this.context.state.token, isSlotModal: true, is_bking_pressed: false, checked: "", start_time: "06:00", end_time: "06:59", converted_time: "6:00 AM", available_date: moment(new Date()).format("DD/MM/YYYY"),
        selected_date: moment(new Date()).format("DD/MM/YYYY"), selected: [6], date: new Date(), appointmentsList: []
      }, () => {


      });

    });
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  receive = async (from: String, message: Message) => {
    // Customizable Area Start
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.addAppointmentApiCallId != null &&
      this.addAppointmentApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );


        this.addAppRespHandling(responseJson)
    }
    else if (getName(MessageEnum.SessionResponseMessage) === message.id) {

      this.setState({ token: this.context.state.token });
    }
    else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.getAppointmentsListApiCallId != null &&
      this.getAppointmentsListApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
     
        this.getBookedAppResHandling(responseJson)
    
    }
    // Customizable Area End
  };

  // Customizable Area Start
  addAppRespHandling=(responseJson:any)=>{
    this.setState({loading:false})
    if (responseJson && !responseJson.errors && responseJson.data) {
      let d = this.state.available_date
      this.setState({ date: d })

      this.setState({ is_bking_pressed: false, loading: false, shownisconfirmmsg: true, isconfirmPress: true, modalTitle: 'Appointment confirmed', modalSubtitle: `Confirmed appointment with coach \n${responseJson.data.attributes.coach_details.full_name} on ${moment(responseJson.data.attributes.start_time, 'DD/MM/YYYY HH').format('DD MMM YYYY hh A ')}.\nPlease note : To reschedule your session, you need to cancel the booked session and book a new session. Booked sessions can only be canceled  24 hours prior to the scheduled time.` })

      setTimeout(() => {
        this.setState({
          is_bking_pressed: false, loading: false, shownisconfirmmsg: false, isconfirmPress: false, isconfirmModal: false, modalTitle: 'Appointment confirmation', modalSubtitle: `Do you want to confirm this appointment with ${this.state.seleCoachData.full_name}?`,
        });
        this.props.navigation.push('HomePage', { from: "booking" });
      }, 5000);

    } else if (responseJson?.errors) {
      console.log("Eror", responseJson.errors);
      Alert.alert("Error", responseJson?.errors[0]?.booking_date,[{text:"OK",onPress:() =>this.setState({ is_bking_pressed: false, shownisconfirmmsg: false, isconfirmPress: false, isconfirmModal: false })},],{cancelable:false});

    } else {
      if(responseJson?.status==500){
        Alert.alert("Error","An error has occuured. Please try again later.",[{text:"OK",onPress:()=>{this.setState({is_bking_pressed:false,loading:false,shownisconfirmmsg:false,isconfirmPress:false,isconfirmModal:false,modalTitle:'Appointment confirmation',modalSubtitle:`Do you want to confirm this appointment with ${this.state.seleCoachData.full_name}?`})}},],{cancelable:false});
      }
      this.setState({ is_bking_pressed: false, loading: false, shownisconfirmmsg: false, isconfirmPress: false, isconfirmModal: false, modalTitle: 'Appointment confirmation', modalSubtitle: `Do you want to confirm this appointment with ${this.state.seleCoachData.full_name}?` });
      this.props.navigation.navigate('HomePage');
     
    }
  }

  getBookedAppResHandling=(responseJson:any)=>{
    if (responseJson && !responseJson.errors && responseJson.data) {
       
      const noEmptyStrings:any = [];
      for(const item of responseJson?.data){
        const timeSlots=item?.attributes?.timeslots
        if(timeSlots && timeSlots.length>=1){
          noEmptyStrings.push(item)
        }
      }
      this.setState(prevState => ({
        appointmentsList: [...prevState.appointmentsList, ...noEmptyStrings],
        loading: false
      }));

    } else {
       this.setState({ appointmentsList: [], loading: false });

    }
  }

  static contextType?: Context<any> = AppContext;

  isStringNullOrBlank(str: string) {
    return str === null || str.length === 0;
  }

  addAppointment(): boolean {
    let min = this.state.checked == "01" ? 29 : 59
    let endTime = moment(this.state.start_time, "HH:mm").add(min, 'minute').format("HH:mm");

    if (
      this.isStringNullOrBlank(this.state.selected_date) ||
      this.isStringNullOrBlank(this.state.start_time) ||
      this.isStringNullOrBlank(this.state.end_time)
    ) {
      this.showAlert(
        configJSON.errorTitle,
        configJSON.errorAllFieldsAreMandatory,
        ""
      );
      return false;
    }
    this.setState({ loading: true })

    const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: this.state.token,
    };

    const attrs = {
      start_time: this.state.start_time,
      end_time: endTime,
      service_provider_id: this.state.seleCoachData.id,
      booking_date: this.state.selected_date
    };


    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.addAppointmentApiCallId = requestMessage.messageId;

    const httpBody = {
      ...attrs,
    };
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.appointmentAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.addAppointmentAPiMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  getAppointmentList = (token: any) => {

    const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.setState({ loading: true })
    // const attrs = {
    //   service_provider_id: "1",
    //   availability_date: this.state.available_date,
    // };
    const attrs = {
      booking_date: this.state.selected_date,
      start_time: moment(this.state.start_time, "HH:mm").format("hh:mm A"),
      per_page: "2",
      page: `${this.state.pageNo}`
    }
    this.getAppointmentsListApiCallId = requestMessage.messageId;
    let urlParams = new URLSearchParams(attrs).toString();

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.viewCoachAvailability}?${urlParams}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getAppointmentListAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleScroll = ({ nativeEvent }: {
    nativeEvent: {
      layoutMeasurement: { height: number },
      contentOffset: { y: number },
      contentSize: { height: number }
    }
  }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isCloseToBottom && !this.state.loading) {
      this.loadMoreAppointments();
    }
  };

  loadMoreAppointments = () => {
    this.setState(prevState => ({pageNo: prevState.pageNo + 1}), () => {
      this.getAppointmentList(this.state.token);
    })
  }

  navigateToAppointments = () => {
    this.props.navigation.navigate("Appointments");
  };
  // Customizable Area Start

  schdeuleCallProps = {
    onPress: () => {
      this.setState({ isconfirmModal: true })
    }
  }
  headerbgImgProps = {
    source: headerImgBg
  }
  backImgProps = {
    source: backImg
  }
  dateImgProps = {
    source: calendarDate
  }
  confirmAppointment = {
    source: appointmentConfirmedImg
  }
  backbtnPressProps = {
    onPress: () => {
      console.log("Pressed ")
      // this.props.navigation.goBack(null);
      this.props.navigation.navigate('HomePage');
    },
  };
  showConfirmModalMsg = {
    onPress: () => {
      // this.setState({ is_bking_pressed: true })
      this.addAppointment()

    }
  }

  onLayout = (event: any) => {
    this.setState({ width: event.nativeEvent.layout.width - this.state.SliderPad * 2 })
  };

  onValuesChangeFinish = (values: any) => {
    let seletedtime = 0 + values;
    let integerPart = Math.floor(seletedtime);
    let decimalPart = seletedtime - integerPart;
    if (decimalPart == 0) {
      const initialTime = new Date();
      initialTime.setHours(integerPart);
      initialTime.setMinutes(0);
      let datestr = moment(initialTime).format("hh:mm A");

      this.setState({ converted_time: integerPart + .00 });
      this.setState({selecteTime24Hr :  datestr, isSliderTime:true })

      this.setState({ selected: values, start_time: integerPart + ":00", end_time: values + ":" + 59, converted_time: integerPart + .00 }, () => {
        this.getAppointmentList(this.state.token);
      })
    }
    else if (decimalPart == 0.25) {
      const initialTime = new Date();
      initialTime.setHours(integerPart);
      initialTime.setMinutes(15);

      let datestr = moment(initialTime).format("hh:mm A");

      this.setState({ converted_time: integerPart + .15 });
      this.setState({selecteTime24Hr :  datestr , isSliderTime:true})

      this.setState({ selected: values, start_time: integerPart + ":15", end_time: values + ":" + 59, converted_time: integerPart + .15 }, () => {
        this.getAppointmentList(this.state.token);
      })
    }
    else if (decimalPart == 0.50) {
      const initialTime = new Date();
      initialTime.setHours(integerPart);
      initialTime.setMinutes(30);

      let datestr = moment(initialTime).format("hh:mm A");
      this.setState({selecteTime24Hr : datestr, isSliderTime:true})
      this.setState({ converted_time: initialTime });
      this.setState({ selected: values, start_time: integerPart + ":30", end_time: values + ":" + 59, converted_time: initialTime }, () => {
        this.getAppointmentList(this.state.token);
      })
    }
    else if (decimalPart == 0.75) {
      const initialTime = new Date();
      initialTime.setHours(integerPart);
      initialTime.setMinutes(45);

      let datestr = moment(initialTime).format("hh:mm A");
      this.setState({selecteTime24Hr : datestr,isSliderTime:true})

      this.setState({ converted_time: initialTime });
      this.setState({ selected: values, start_time: integerPart + ":45", end_time: values + ":" + 59, converted_time: initialTime }, () => {
        this.getAppointmentList(this.state.token);
      })
    }
    else {
      this.getListFromValue(values)
    }
  };

  getListFromValue(values: any) {
    this.setState({ converted_time: values });
    this.setState({ selected: values, start_time: values, end_time: values + ":" + 59, converted_time: values }, () => {
      this.getAppointmentList(this.state.token);
    })
  }

  DateChange = (availableDate: any) => {
    this.setState({ appointmentsList:[], pageNo:1,selected_date: moment(availableDate).format('DD/MM/YYYY'), available_date: availableDate }, () => {
      this.getAppointmentList(this.state.token)

    })

  }

  btnHideImageProps = {
    source
      : unCheckBoxIMg,
  };
  btnShowImageProps = {
    source
      : checkBoxImg,
  };

  onSelectedTimeFunction = (time:moment.Moment)=>{
    this.setState({ appointmentsList:[], pageNo:1,selecteDateValue: time, isSliderTime:false,start_time:time.format("HH:mm") });
    this.getAppointmentList(this.state.token);
  }

  // Customizable Area End
}
