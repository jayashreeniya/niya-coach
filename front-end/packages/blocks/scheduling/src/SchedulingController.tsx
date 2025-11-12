import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import moment from "moment";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  selectedTime: number;
  selectedDate: string;
  timeSlots: object[];
  serviceProviderId: string;
  serviceProviderSchedule: any;
  details: any;
  token: any;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class SchedulingController extends BlockComponent<Props, S, SS> {
  
  // Customizable Area Start
  serviceProviderDetailApiId:any;
  serviceProviderScheduleApiId:any;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage), 
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.SessionResponseMessage)
    ];

    this.state = {
      selectedTime: 0,
      selectedDate: moment().format("YYYY-MM-DD"),
      timeSlots: [],
      serviceProviderId: "",
      serviceProviderSchedule: "",
      details: {},
      token: null
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {

    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      this.setState({ token: token });
      this.getServiceProviderDetails({
        setApiCallId: 'serviceProviderScheduleApiId',
        serviceProviderId: this.state.serviceProviderId,
        availableDate: this.state.selectedDate,
        token
      })
    }

    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {

      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if(responseJson && responseJson.errors) {
        
        this.setState({serviceProviderSchedule: []});

        if ( typeof responseJson.errors === 'string' ) {
          this.showAlert("", responseJson.errors)
        } else {
          this.parseApiErrorResponse(responseJson);
          this.parseApiCatchErrorResponse(errorReponse);
        }
      }
       else if (apiRequestCallId != null) {

        if (apiRequestCallId === this.serviceProviderScheduleApiId) {
          this.setState({
            serviceProviderSchedule: responseJson && responseJson.data ? responseJson.data : ''
          });
        }
        if (apiRequestCallId === this.serviceProviderDetailApiId) {
          let msg = new Message(getName(MessageEnum.NavigationCalendarMessage));
          msg.addData(
            getName(MessageEnum.CalendarProviderDetailsResponseMessage),
            responseJson
          );
          this.send(msg);
          this.unsubscribeMessages();
          return;
        }
      }
    } else if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      runEngine.debugLog("Availability Message Received", message);
      const serviceProviderIdMessage = message.getData(
        getName(MessageEnum.ServiceProviderIdMessage)
      );
      if (serviceProviderIdMessage) {
        this.setState({
          serviceProviderId: serviceProviderIdMessage
        });
      }

      const CalendarProviderDetailsApiMessage = message.getData(
        getName(MessageEnum.CalendarProviderDetailsApiMessage)
      );
      if (CalendarProviderDetailsApiMessage) {
        this.getServiceProviderDetails({...CalendarProviderDetailsApiMessage, setApiCallId: 'serviceProviderDetailApiId'});
        return;
    
      }
    }
    
    // Customizable Area End
  }

  // Customizable Area Start
  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  onSelectDate = (selectedDateStr: string) => {
    const {details} = this.state;
    this.setState({
      selectedDate: selectedDateStr,
      timeSlots: [],
      selectedTime: 0
    });
    this.getServiceProviderAvailability(selectedDateStr, details);
  };

  calendarProps = {
    minDate: moment(),
    onSelectDate: (selectedDate: string) => this.onSelectDate(selectedDate)
  };

  async getServiceProviderAvailability(selectedDateStr: any, profileData: any){
    const token = this.state.token || '';
    if(profileData && profileData.id && selectedDateStr){
      this.getServiceProviderDetails({
        setApiCallId: 'serviceProviderScheduleApiId',
        serviceProviderId: profileData.id,
        availableDate: moment(selectedDateStr).format("YYYY/MM/DD"),
        token
      })
    } else if(this.state.serviceProviderId && selectedDateStr){
      this.getServiceProviderDetails({
        setApiCallId: 'serviceProviderScheduleApiId',
        serviceProviderId: this.state.serviceProviderId,
        availableDate: moment(selectedDateStr).format("YYYY/MM/DD"),
        token
      })
    }
  }

  async getServiceProviderDetails(dataObj: any) {
    const { setApiCallId, serviceProviderId, availableDate, token } = dataObj;

    const header = {
      "Content-Type": configJSON.applicationJsonApiContentType,
      token,
    };
    
    this.apiCall({
      setApiCallId,
      header,
      method: configJSON.getApiMethodType,
      endPoint: `${configJSON.serviceProviderAPiEndPoint}?availability_date=${availableDate}&service_provider_id=${serviceProviderId}`,
      body: null
    });
    return true;
  }

  apiCall = async (data: any) => {

    const { setApiCallId, header, endPoint, method, body } = data;
    
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    if(setApiCallId === 'serviceProviderDetailApiId'){
      this.serviceProviderDetailApiId = requestMessage.messageId;
    }else if(setApiCallId === 'serviceProviderScheduleApiId'){
      this.serviceProviderScheduleApiId = requestMessage.messageId;
    }

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );

    body && requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      body
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  unsubscribeMessages = () => {
    runEngine.unSubscribeFromMessages(this, this.subScribedMessages);
  };
  // Customizable Area End
}