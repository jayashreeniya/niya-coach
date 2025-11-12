import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Keyboard } from "react-native";
// Customizable Area Start
import { backImg, checkBoxImg,niyaImg, SendBtn, unCheckBoxIMg, } from "./assets";
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
  options: any[];
  reply: string;
  isSend: boolean;
  keyboardStatus: any;
  checkedRememberMe: boolean;
  checked: any[];
  // Customizable Area Start
  token:any;
  loading:boolean
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class ReassorContinueController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getfocusAreaApiCallId:string ="";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
       // Customizable Area Start
       getName(MessageEnum.SessionResponseMessage),
    
       getName(MessageEnum.RestAPIResponceMessage),
      
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      checkedRememberMe: false,
      checked: [],
      //   options:[{
      //     _id: 0,
      //     text: 'My professional Life',

      //   },
      //   {
      //     _id: 1,
      //     text:'Work Life '
      //   },
      //   {
      //     _id: 2,
      //     text: 'My Physical Wellbeing',

      //   },
      //   {
      //     _id: 3,
      //     text: 'My Financial Wellbeing',

      //   }
      // ],
      options:[],
      keyboardStatus: undefined,
      reply: "",
      isSend: false,

      // Customizable Area Start
      token:"",
      loading:false
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
      let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));

      this.showAlert(
        "Change Value",
        "From: " + this.state.txtSavedValue + " To: " + value
      );

      this.setState({ txtSavedValue: value });
    }

    // Customizable Area Start
    console.log("*******------------",);
     if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.setState({ token: this.context.state.token,loading:true },()=>{
       this.isFirstTimeUserAssesing(this.state.token);
     });
    
      }
   if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
        const apiRequestCallId = message.getData(
          getName(MessageEnum.RestAPIResponceDataMessage)
        );
  
        const responseJson = message.getData(
          getName(MessageEnum.RestAPIResponceSuccessMessage)
        );
        
        this.setState({loading:false});
      if(apiRequestCallId==this.getfocusAreaApiCallId){
        
        if(responseJson.errors != undefined)
        {
          console.log("responseJson.errors");
        }else{
          this.setState({options:[].concat(responseJson.data.attributes)})
        }
      
      }
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
  CustomCheckBoxProps = {
    onChangeValue: (value: boolean) => {
      this.setState({ checkedRememberMe: value });
      this.CustomCheckBoxProps.isChecked = value;
    },
    isChecked: false,
  };
  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = (id: any) => {

    console.log(id, "id");
    let ids = [...this.state.checked];

    if (ids.includes(id)) {
      ids = ids.filter((_id) => _id !== id);

    } else {
      ids.push(id);
    }

    this.setState({ checked: ids });

    // this.setState({ enableField: !this.state.enableField });
    // this.txtInputProps.secureTextEntry = !this.state.enableField;
    // this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
    //   ? checkBoxImg
    //   : unCheckBoxIMg;

  };

  btnShowImageProps = {
    source
      : checkBoxImg,
  };
  btnHideImageProps = {
    source
      : unCheckBoxIMg,
  };
  sendbtnImageProps = {
    source: SendBtn,
  };
  bgImgProps = {
    source: backImg
  }
  sendbtnPressProps = {
    onPress: () => {
      console.log("send  let's BEgin%^%^");

      this.setState({ reply: this.state.reply, isSend: true });

    },
  };
  reAssessProps = {
    onPress: () => {
     
      // this.props.navigation.navigate('Chatbot6')//('QuestionAns');
      this.props.navigation.navigate('QuestionAns', { name: "" });

    }
  }

  continuenxtPressProps = {
    onPress: () => {
      console.log("=====BottomTabNavigator navigate to this ",this.props.navigation);
      this.props.navigation.navigate('BottomTabNavigator');//HomePage//LandingPage
        if(this.context.state.isshowReass){
          const newState = {
            isshowReass:false
          }
          this.context.dispatch({ type: set_user_data, payload: newState });
         
        }
       else   this.props.navigation.navigate('HomePage');
    }
  }
  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

  closeReply = () => {
    this.setState({ reply: "" });
  };


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

  isFirstTimeUserAssesing(token:any){
    console.log("====+++++++",token);
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token:token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getfocusAreaApiCallId = requestMessage.messageId;
   
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getfocusAreaApi}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
   
  }

  async componentDidMount() {
    super.componentDidMount();
   
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
        this.setState({ options:this.props.navigation?.state?.params?.data!=undefined?[].concat(this.props.navigation.state.params.data.attributes):[]});
    
      });
    }
  }
  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };
  backImageProps = {
    source: niyaImg,
  };
  newFncontinuenxtPressProps = {
    onPress: () => {
        if(this.context.state.isshowReass){
          const newState = {
            isshowReass:false
          }
          this.context.dispatch({ type: set_user_data, payload: newState });
         
        }
       else   this.props.navigation.navigate('HomePage');
    }
  }
  // Customizable Area End
}
