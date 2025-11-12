import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { Dimensions } from "react-native";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { set_user_data } from "../../../components/src/context/actions";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  password: string;
  email: string;
  enablePasswordField: boolean;
  checkedRememberMe: boolean;
  placeHolderEmail: string;
  placeHolderPassword: string;
  imgPasswordVisible: any;
  imgPasswordInVisible: any;
  labelHeader: string;
  btnTxtLogin: string;
  labelRememberMe: string;
  btnTxtSocialLogin: string;
  labelOr: string;
  loading: boolean;
  width:any,
  height:any;
  token:string;
  role:string;
  userid:any

  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class EmailAccountLoginController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiEmailLoginCallId: string = "";
  validationApiCallId: string = "";
  getProfileApi:string="";
  emailReg: RegExp;
  passRegex: RegExp;
  labelTitle: string = "";
  getfocusAreaApiCallId:string="";
  devicetokenApiCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.ReciveUserCredentials),
    ];

    this.state = {
      email: "",
      password: "",
      enablePasswordField: true,
      checkedRememberMe: false,
      placeHolderEmail: configJSON.placeHolderEmail,
      placeHolderPassword: configJSON.placeHolderPassword,
      imgPasswordVisible: configJSON.imgPasswordVisible,
      imgPasswordInVisible: imgPasswordInVisible,
      labelHeader: configJSON.labelHeader,
      btnTxtLogin: configJSON.btnTxtLogin,
      labelRememberMe: configJSON.labelRememberMe,
      btnTxtSocialLogin: configJSON.btnTxtSocialLogin,
      labelOr: configJSON.labelOr,
      loading: false,
      width:Dimensions.get("screen").width,
      height:Dimensions.get("screen").height,
      token:"",
      role:"",
      userid:""
    };

    this.emailReg = new RegExp("");
    this.passRegex = new RegExp("");
    this.labelTitle = configJSON.labelTitle;
    // Customizable Area End

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    this.callGetValidationApi();
    this.send(new Message(getName(MessageEnum.RequestUserCredentials)));
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;
  
  btnSocialLoginProps = {
    onPress: () => this.goToSocialLogin(),
  };
  // Customizable Area End

  // Customizable Area Start
  btnEmailLogInProps = {
    onPress: () => this.doEmailLogIn(),
  };
  // Customizable Area End

  // Customizable Area Start
  btnPasswordShowHideProps = {
    onPress: () => {
      this.setState({ enablePasswordField: !this.state.enablePasswordField });
      this.txtInputPasswordProps.secureTextEntry =
        !this.state.enablePasswordField;
      this.btnPasswordShowHideImageProps.source = this.txtInputPasswordProps
        .secureTextEntry
         ? imgPasswordInVisible
        : imgPasswordVisible;
    },
  };
  // Customizable Area End

  // Customizable Area Start
 /* Web Event Handling*/
  handleClickShowPassword = () => {
    this.setState({
      enablePasswordField: !this.state.enablePasswordField,
    });
  };
  // Customizable Area End

  // Customizable Area Start
  setEmail = (text: string) => {
    this.setState({
      email: text,
    });
  };
  // Customizable Area End

  // Customizable Area Start
  setPassword = (text: string) => {
    this.setState({
      password: text,
    });
  };
  // Customizable Area End

  // Customizable Area Start
  setRememberMe = (value: boolean) => {
    this.setState({ checkedRememberMe: value });
  };
  // Customizable Area End

  // Customizable Area Start
  CustomCheckBoxProps = {
    onChangeValue: (value: boolean) => {
      this.setState({ checkedRememberMe: value });
      this.CustomCheckBoxProps.isChecked = value;
    },
    isChecked: false,
    tintColors: {true: 'rgb(71,147,224)'}
  };
  // Customizable Area End

  // Customizable Area Start
  btnForgotPasswordProps = {
    onPress: () => this.goToForgotPassword(),
  };
  // Customizable Area End

  // Customizable Area Start
  txtInputPasswordProps = {
    onChangeText: (text: string) => {
      this.setState({ password: text });

      //@ts-ignore
      this.txtInputPasswordProps.value = text;
    },
    secureTextEntry: true,
  };
  // Customizable Area End

  // Customizable Area Start
  btnPasswordShowHideImageProps = {
    source:imgPasswordInVisible
  };
  // Customizable Area End

  // Customizable Area Start
  btnRememberMeProps = {
    onPress: () => {
      this.setState({ checkedRememberMe: !this.CustomCheckBoxProps.isChecked });
      this.CustomCheckBoxProps.isChecked = !this.CustomCheckBoxProps.isChecked;
    },
  };
  // Customizable Area End

  // Customizable Area Start
  txtInputEmailWebProps = {
    onChangeText: (text: string) => {
      this.setState({ email: text.trim() });

      //@ts-ignore
      this.txtInputEmailProps.value = text.trim();
    },
  };
  // Customizable Area End

  // Customizable Area Start
  txtInputEmailMobileProps = {
    ...this.txtInputEmailWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };
  // Customizable Area End

  // Customizable Area Start
  txtInputEmailProps = this.isPlatformWeb()
    ? this.txtInputEmailWebProps
    : this.txtInputEmailMobileProps;
   // Customizable Area End

  // Customizable Area Start
  btnSignUpProps = {
      onPress: () => this.goToSignUp(),
  };
  // Customizable Area End

  // Customizable Area Start
  goToSignUp() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigateEmailSignUpMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationForgotPasswordPageInfo), "email");
    this.send(msg);
  }
  // Customizable Area End

  // Customizable Area Start
  isFirstTimeUserAssesing(token:any){
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
      configJSON.loginAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
   
  }
  // Customizable Area End

  // Customizable Area Start
  saveFcmTOken=async(token:any)=> {
    let fcmtoken=await AsyncStorage.getItem('fcmToken');
    console.log("fcm token",fcmtoken)
    this.setState({loading:true})
    const header = {
      "Content-Type": configJSON.loginApiContentType,
      token:token
    };

    const attrs = {
      device_token:fcmtoken
     
    };
  const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.devicetokenApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
     'bx_block_push_notifications/device_token'
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(attrs)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.loginAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }
  // Customizable Area End

  // Customizable Area Start
    getDataDataList =  (token:any) => {
      console.log("calling the User details");
      const header = {
        "Content-Type": configJSON.validationApiContentType,
        token:token,
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

  // Customizable Area End
 
  async receive(from: string, message: Message) {
    // Customizable Area Start
    console.log("==============receive");
    if (getName(MessageEnum.ReciveUserCredentials) === message.id) {
      const userName = message.getData(getName(MessageEnum.LoginUserName));

      const password = message.getData(getName(MessageEnum.LoginPassword));

      const countryCode = message.getData(
        getName(MessageEnum.LoginCountryCode)
      );

      if (!countryCode && userName && password) {
        this.setState({
          email: userName,
          password: password,
          checkedRememberMe: true,
        });

        //@ts-ignore
        this.txtInputEmailProps.value = userName;

        //@ts-ignore
        this.txtInputPasswordProps.value = password;

        this.CustomCheckBoxProps.isChecked = true;
      }
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
    
      if (apiRequestCallId != null) {
        this.setState({ loading: false});
        if (
          apiRequestCallId === this.validationApiCallId &&
          responseJson !== undefined
        ) {
          let arrayholder = responseJson.data;

          if (arrayholder && arrayholder.length !== 0) {
            let regexData = arrayholder[0];

            if (regexData && regexData.email_validation_regexp) {
              this.emailReg = new RegExp(regexData.email_validation_regexp);
              this.passRegex=new RegExp(regexData.password_validation_regexp)
            }
          }
        }

        if (apiRequestCallId === this.apiEmailLoginCallId) {
          if (responseJson && responseJson.meta && responseJson.meta.token) {
            console.log(responseJson ,"login response ")
             this.setState({token:responseJson?.meta?.token,userid:responseJson.meta?.id,  role: responseJson.meta?.role ? responseJson.meta?.role : "",})
            this.getDataDataList(responseJson.meta.token);
    
            this.saveLoggedInUserData(responseJson);
            this.sendLoginSuccessMessage();
            this.saveFcmTOken(responseJson?.meta?.token);
                    
          } else {
            //Check Error Response
            this.parseApiErrorResponse(responseJson);
            this.sendLoginFailMessage();
          }

          

          this.parseApiCatchErrorResponse(errorReponse);
        }
        console.log(responseJson,"-=-=-=-=-=-=-responseJson");
       
        if (apiRequestCallId==this.getProfileApi) {

          let profilenm=responseJson.data.attributes.profile_name ? responseJson?.data.attributes?.profile_name:responseJson?.data?.attributes?.full_name;
           const newState = {
            auth: !!this.state.token,
            id: this.state.userid,
            email: this.state.email,
            token:this.state.token,
            role: this.state.role,
            isNew: false,
            isshowReass:true,
            name:profilenm
          }
           this.context.dispatch({ type: set_user_data, payload: newState });
          
           this.isFirstTimeUserAssesing(this.state.token);
          
        }
        if(apiRequestCallId==this.devicetokenApiCallId){
          console.log(responseJson);
          this.setState({ loading: false});
        
           
        }
        if(apiRequestCallId==this.getfocusAreaApiCallId){
          this.setState({ loading: false});
          if(responseJson?.errors != undefined)
          {
            this.props.navigation.navigate('Chatbot6')
          }else{
            console.log("ressassorcontine")
                this.props.navigation.navigate('ReassorOrContinue');
          }
           
        }
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  sendLoginFailMessage() {
    const msg: Message = new Message(getName(MessageEnum.LoginFaliureMessage));
    this.send(msg);
  }
  // Customizable Area End

 // Customizable Area Start
  sendLoginSuccessMessage() {
    const msg: Message = new Message(getName(MessageEnum.LoginSuccessMessage));

    msg.addData(getName(MessageEnum.LoginUserName), this.state.email);
    msg.addData(getName(MessageEnum.CountyCodeDataMessage), null);
    msg.addData(getName(MessageEnum.LoginPassword), this.state.password);
    msg.addData(
      getName(MessageEnum.LoginIsRememberMe),
      this.state.checkedRememberMe
    );

    
    this.send(msg);
  }
 // Customizable Area End

 // Customizable Area Start
  saveLoggedInUserData(responseJson: any) {
   
    if (responseJson && responseJson.meta && responseJson.meta.token) {
     
      const msg: Message = new Message(getName(MessageEnum.SessionSaveMessage));

      msg.addData(
        getName(MessageEnum.SessionResponseData),
        JSON.stringify(responseJson)
      );
      msg.addData(
        getName(MessageEnum.SessionResponseToken),
        responseJson.meta.token
      );

      this.send(msg);
    }
  }
  // Customizable Area End

  // Customizable Area Start
  openInfoPage() {
    const msg: Message = new Message(getName(MessageEnum.AccoutLoginSuccess));

    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

    this.send(msg);
  }
  // Customizable Area End

 // Customizable Area Start
  goToForgotPassword() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationForgotPasswordMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationForgotPasswordMessage), "ForgotPassword");
    this.send(msg);
  }
  // Customizable Area End
 
  // Customizable Area Start
 goToSocialLogin() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationSocialLogInMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }
  // Customizable Area End

  // Customizable Area Start
  doEmailLogIn(): boolean {
    if (
      this.state.email === null ||
      this.state.email.length === 0 ||
      !this.emailReg.test(this.state.email)
    ) {
      this.showAlert("Error", configJSON.errorEmailNotValid);
      return false;
    }

    if (this.state.password === null || this.state.password.length === 0) {
      this.showAlert("Error", configJSON.errorPasswordNotValid);
      return false;
    }
    
    if (this.state.password.length> 0 && !this.passRegex.test(this.state.password)) {
      this.showAlert("Error", "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character");
      return false;
    }

    this.setState({loading:true})
    const header = {
      "Content-Type": configJSON.loginApiContentType,
    };

    const attrs = {
      email: this.state.email,
      password: this.state.password,
    };

    const data = {
      type: "email_account",
      attributes: attrs,
    };

    const httpBody = {
      data: data,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.apiEmailLoginCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.loginAPIEndPoint
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
      configJSON.loginAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }
  // Customizable Area End

 
  // Customizable Area Start
  callGetValidationApi() {
    const headers = {
      "Content-Type": configJSON.validationApiContentType,
    };

    const getValidationsMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.validationApiCallId = getValidationsMsg.messageId;

    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.urlGetValidations
    );

    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );
    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );
    runEngine.sendMessage(getValidationsMsg.id, getValidationsMsg);
  }
  // Customizable Area End
}

