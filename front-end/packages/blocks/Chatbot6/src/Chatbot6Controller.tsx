import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { GiftedChat,Send } from 'react-native-gifted-chat';
import { Alert } from "react-native";
// Customizable Area Start
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backImg, imgPasswordInVisible, imgPasswordVisible , SendBtn,} from "./assets";
import { boolean } from "yup";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { set_user_data } from "../../../components/src/context/actions";

// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
 
   reply:string;
   isSend:boolean;
   keyboardStatus: any
  // Customizable Area Start
  loading:boolean;
  token:string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class Chatbot6Controller extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  addProfilenameTestApiCallId:string="";
  getProfileApi:string="";
  getuserProfileDetailsCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
    
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
 
      keyboardStatus: undefined,
      reply:"",
      isSend:false,
     
      // Customizable Area Start
      loading:false,
      token:""
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }
 
  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
      console.log("inside if ")
      let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));

      this.showAlert(
        "Change Value",
        "From: " + this.state.txtSavedValue + " To: " + value
      );

      this.setState({ txtSavedValue: value });
    }

    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
       
      this.setState({ token: this.context.state.token,loading:true },()=>{
       
      });
     
  
     } 
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
         getName(MessageEnum.RestAPIResponceDataMessage)
       );
 
       var responseJson = message.getData(
         getName(MessageEnum.RestAPIResponceSuccessMessage)
       );
 
      
 
       setTimeout(()=>{  
         this.setState({loading:false});
       },100)
      
    if(apiRequestCallId==this.addProfilenameTestApiCallId){
      this.getDataDataList();
     
    }
    if (apiRequestCallId==this.getProfileApi) {
      console.log("Settong the name",responseJson.data)
     
      let profilenm=responseJson.data.attributes.profile_name ? responseJson?.data.attributes?.profile_name:responseJson?.data?.attributes?.full_name;
         
      const newState = {
        name:profilenm
      }
       this.context.dispatch({ type: set_user_data, payload: newState });
       this.props.navigation.navigate('QuestionAns',{name:this.state.reply});
                
    }

    if (apiRequestCallId === this.getuserProfileDetailsCallId) {
      const nameEdited = await AsyncStorage.getItem("nameEdited");
    
      let profilenm = responseJson.data.attributes.profile_name
        ? responseJson?.data.attributes?.profile_name
        : responseJson?.data?.attributes?.full_name;
    
        if (nameEdited ) {      
          this.setState({ reply: profilenm, isSend: true });
        }

     
    };    
  }
    // Customizable Area End
  }

  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  txtInputMobileProps = {
    ...this.txtInputWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };

  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = {
    onPress: () => {
      this.setState({ enableField: !this.state.enableField });
      this.txtInputProps.secureTextEntry = !this.state.enableField;
      this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

  sendbtnImageProps = {
    source: SendBtn,
  };
  bgImgProps={
    source:backImg
  }
  sendbtnPressProps = {
    onPress: async () => {
      
      const regName = /^[a-zA-Z]+[a-zA-Z\s]*?[^0-9]$/;
      if (!regName.test(this.state.reply)) {
        Alert.alert('Invalid name given.');
      } else {
        this.setState({ reply: this.state.reply, isSend: true });
        await AsyncStorage.setItem("nameEdited", this.state.reply );

      }
     
    },
    
  };
  letsBeginPressProps={
    onPress:()=>{
      this.props.navigation.navigate('QuestionAns',{name:this.state.reply});
    }
  }

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

	 closeReply = () => {
    this.setState({reply:""});
	};

  handleNavigateToQuestionAns= async ()=>{
    const nameEdited = await AsyncStorage.getItem("nameEdited");

    if (nameEdited) {
      const newState = {
        name: nameEdited
      };
      this.context.dispatch({ type: set_user_data, payload: newState });
      this.props.navigation.navigate('QuestionAns',{name:nameEdited});
    }
  }
  doButtonPressed() {
    let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue
    );
    this.send(msg);
  }

 
  // web events
  setInputValue = (text: string) => {
    this.setState({ txtInputValue: text });
  };

  setEnableField = () => {
    this.setState({ enableField: !this.state.enableField });
  };

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;

  newfnPfofilenmletsBeginPressProps={
    onPress:()=>{
      this.addProfileName();
      // this.props.navigation.navigate('QuestionAns',{name:this.state.reply});
    }
  }

  getProfileName = () => {
    const header = {
      contentType: "application/json",
      token: this.context.state?.token || this.state.token
    };
  
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
  
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
  
    this.getuserProfileDetailsCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `profile_details`
    );
  
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "GET"
    );
  
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  

  addProfileName=()=>{
  
    console.log("////Addprofilenmae ");
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token:this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    const httpBody = {
    profile_name:this.state.reply
    }
    this.addProfilenameTestApiCallId = requestMessage.messageId;
   
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `profile_name_update`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      'POST'
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);


}

  getDataDataList =  () => {
    console.log("calling the User details");
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token:this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getProfileApi =  requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `profile_details`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "GET"
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
   
    
  };

  async componentDidMount() {
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      
      });
    }

    this.getProfileName();
    this.handleNavigateToQuestionAns();
 
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };
  // Customizable Area End
}
