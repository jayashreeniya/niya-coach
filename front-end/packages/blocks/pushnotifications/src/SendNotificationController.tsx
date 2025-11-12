import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";

import { IBlock } from "../../../framework/src/IBlock";
import { Alert } from "react-native";


// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  id: string;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  token: any;
  isTalkabout: any;
  isData: boolean;
  isMessage: any;
  isResModal:boolean;
  modalSubtitle:string;
  loading:boolean;
  title:string;
  description:string;
  category:any;
  isdata:any[];
  selectedcat:string
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  navigation: any;
  // Customizable Area End
}

export default class SendNotificationController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  contactUsApiCallId: any;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.SessionResponseMessage)
    ];

    this.receive = this.receive.bind(this);
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    this.state = {
      token: '',
      isTalkabout: "",
      isData: false,
      isMessage: "",
      isResModal:false,
      modalSubtitle:"",
      loading:false,
      title:"",
      description:"",
      category:"",
      selectedcat:"",
      isdata: [
        {
          id: 1,
          name: "Employees",
          val:"employee"
        },
        {
          id: 2,
          name: "Coach",
          val:"coach"
        },
        {
          id: 3,
          name: "HR",
          val:"hr"
        },
      ],
    };
    // Customizable Area End
  }


  
  async componentDidMount() {
    // Customizable Area Start
    super.componentDidMount();
   
    this.getToken();
  

    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('willFocus', () => {
        this.getToken();
      });
    }

 
    // this.getDataDataList()
    // Customizable Area End
  }

 
  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }

  //====================== receive function ================================
  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.setState({ token: this.context.state.token });
    }

    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      )

      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      )
      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )
      this.setState({loading:false})
      
      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.contactUsApiCallId) {
          this.contactUsSuccessCallBack(responseJson);
          this.showAlert("Alert", responseJson?.message.toString(), "");
        } 

      }
      else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.contactUsApiCallId) {
          this.contactUsFailureCallBack(responseJson)
        } 

      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
    // Customizable Area End
  }

  //================ success and failure call back ================
  contactUsSuccessCallBack = async (responseJson: any) => {
    this.setState({isResModal:true,modalSubtitle: responseJson?.message})
    console.log("@@@ notifcation  back======", responseJson);
 
  };

  contactUsFailureCallBack = (error: any) => {
    console.log("@@@ contact us FailureCallBackk======", error)
  };

  // Customizable Area End

  //================== API Function Call ==================
  apiCall = async (data: any) => {
    // Customizable Area Start
    const { contentType, method, endPoint, body, type } = data
    const header = {
      'Content-Type': contentType,
      token: this.context.state.token
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    )
    body && type != 'formData' ?
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      )

      : requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        body
      );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    console.log('hgdscfyhavdydfye', requestMessage)
    return requestMessage.messageId;
    // Customizable Area End
  };

  sendNotifcation = async () => {
    if(this.state.title==""){
      Alert.alert(
        "Error",
        "Please Enter Title   ",
        [
            { text: "OK"}
        ]
    );
    return
    }
    if(this.state.selectedcat==""){
      Alert.alert(
        "Error",
        "Please select  category   ",
        [
            { text: "OK"}
        ]
    );
    return
    }
    if(this.state.description==""){
      Alert.alert(
        "Error",
        "Please Enter Description   ",
        [
            { text: "OK"}
        ]
    );
    return
    }

    this.setState({loading:true})
    let body = {
      title: this.state.title,
      desc: this.state.description,
      role:this.state.selectedcat
  }
    this.contactUsApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "POST",
      endPoint: 'bx_block_push_notifications/send_notifications',
      body: body
    });
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;

   newFnsendNotifcation = async () => {
     if(this.state.title==""){
       Alert.alert(
         "Error",
         "Please Enter Title   ",
         [
             { text: "OK"}
         ]
     );
     return
     }
     if(this.state.selectedcat==""){
       Alert.alert(
         "Error",
         "Please Select Category   ",
         [
             { text: "OK"}
         ]
     );
     return
     }
     if(this.state.description==""){
       Alert.alert(
         "Error",
         "Please Enter Description   ",
         [
             { text: "OK"}
         ]
     );
     return
     }
 
     this.setState({loading:true})
     let body = {
       title: this.state.title,
       desc: this.state.description,
       role:this.state.selectedcat
   }
     this.contactUsApiCallId = await this.apiCall({
       contentType: "application/json",
       method: "POST",
       endPoint: 'bx_block_push_notifications/send_notifications',
       body: body
     });
   }
  // Customizable Area End

}
