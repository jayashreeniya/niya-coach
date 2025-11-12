import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start

import { otpImg } from "./assets";
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
  otp: string;
  otpAuthToken: string;
  userAccountID: string;
  title:string;
  labelInfo: string;
  toMessage: string;
  isFromForgotPassword: boolean;
  loading:boolean
  // Customizable Area End
}

export interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class OTPInputAuthController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  otpAuthApiCallId: any="";
  btnTxtSubmitOtp: string="";
  placeHolderOtp: string="";
  title:string="";
  labelInfo: string="";
  submitButtonColor: any = configJSON.submitButtonColor;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage)
      // Customizable Area End
    ];

    this.receive = this.receive.bind(this);

    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    // Customizable Area Start
    this.state = {
      otp: "",
      otpAuthToken: "",
      userAccountID: "",
      title:configJSON.labelPageTitle,
      labelInfo: configJSON.labelInfo,
      toMessage: "",
      isFromForgotPassword: true,
      loading:false
    };

    this.btnTxtSubmitOtp = configJSON.btnTxtSubmitOtp;
    this.placeHolderOtp = configJSON.placeHolderOtp;
    // Customizable Area End
  }

  async receive(from: String, message: Message) {
    // Customizable Area Start
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.otpAuthApiCallId != null &&
      this.otpAuthApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
    
     
        if (
          responseJson !== undefined &&
          responseJson.message 
        ) {

          setTimeout(() => {
            this.setState({loading:false})
          }, 500);
       

        if (this.state.isFromForgotPassword) {
          // runEngine.debugLog("about to send NavigationNewPasswordMessage");
          const msg: Message = new Message(
            getName(MessageEnum.NavigationNewPasswordMessage)
          );
          
        
          msg.addData(
            getName(MessageEnum.AuthTokenDataMessage),
            this.state.otpAuthToken
          );
          msg.addData(
            getName(MessageEnum.AuthTokenPhoneNumberMessage),
            this.state.userAccountID
          );
          msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
          msg.addData(getName(MessageEnum.NavigationNewPasswordMessage), true);
      
          this.send(msg);
        } else {
        
          const msg: Message = new Message(
            getName(MessageEnum.NavigationMobilePhoneAdditionalDetailsMessage)
          );

          msg.addData(
            getName(MessageEnum.AuthTokenDataMessage),
            this.state.otpAuthToken
          );

          msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
          msg.addData(getName(MessageEnum.NavigationNewPasswordMessage), true);
      
          this.send(msg);
        }
      } 
      else {
       
          this.setState({loading:false})
    
        //Check Error Response
        this.parseApiErrorResponse(responseJson);
      }

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if (errorReponse != null) {
        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const phoneAuthToken = message.getData(
        getName(MessageEnum.AuthTokenDataMessage)
      );

      const phoneNumber = message.getData(
        getName(MessageEnum.AuthTokenPhoneNumberMessage)
      );
      console.log(phoneNumber,"phoneNumber")

      const forgotPasswordBool = message.getData(
        getName(MessageEnum.EnterOTPAsForgotPasswordMessage)
      );

      const emailValue = message.getData(
        getName(MessageEnum.AuthTokenEmailMessage)
      );

      console.log(emailValue,"emailValue")
      const userAccountID = phoneNumber ? "+91" + phoneNumber : "" + emailValue;

      console.log(userAccountID,"userAccountID");
      let updatedLabel = this.state.labelInfo;
      if (userAccountID && userAccountID !== "undefined") {
        updatedLabel = updatedLabel.replace("phone", userAccountID);
      }
      

      this.setState({
        otpAuthToken:
          phoneAuthToken && phoneAuthToken.length > 0
            ? phoneAuthToken
            : this.state.otpAuthToken,
        userAccountID: userAccountID,
        labelInfo: updatedLabel,
        isFromForgotPassword:
          forgotPasswordBool === undefined
            ? this.state.isFromForgotPassword
            : forgotPasswordBool
      });
    }
    // Customizable Area End
  }




  // Customizable Area Start
  async componentDidMount() {
    super.componentDidMount();
   
  }
  async submitOtp() {
  console.log("Submitting otp ",)
    if (!this.state.otp || this.state.otp.length === 0) {
      this.showAlert(configJSON.errorTitle, configJSON.errorOtpNotValid);
      return;
    }

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.setState({loading:true})
    if (this.state.isFromForgotPassword) {
      // console.log("entered is from forgot password!");
      const header = {
        "Content-Type": configJSON.apiVerifyOtpContentType
      };

      //GO TO REQUEST STATE
      this.otpAuthApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.apiVerifyForgotPasswordOtpEndPoint
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );

      const data = {
        token: this.state.otpAuthToken ? this.state.otpAuthToken : "",
        otp: this.state.otp ? this.state.otp : ""
      };

      const httpBody = {
        // data: data
        token: this.state.otpAuthToken ? this.state.otpAuthToken : "",
        otp: this.state.otp ? this.state.otp : ""
     
      };

      //requestMessage.addData(getName(MessageEnum.RestAPIRequestMethodMessage), "POST");

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(httpBody)
      );
    } else {
      const headers = {
        "Content-Type": configJSON.apiVerifyOtpContentType,
        token: this.state.otpAuthToken
      };

      this.otpAuthApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.apiVerifyOtpEndPoint + this.state.otp
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(headers)
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(JSON.stringify({}))
      );
    }

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiVerifyOtpMethod
    );
    // console.log("requestMessage.id is: " + requestMessage.id);
    runEngine.sendMessage(requestMessage.id, requestMessage);
    // this.props.navigation.navigate('NewPassword');
  }

  btnSubmitOTPProps = {
    
    onPress: () => this.submitOtp()
    // onPress: () => this.submitandNxt()
  };

  submitandNxt=()=>{
   this.props.navigation.navigate('NewPassword');
  }
  txtMobilePhoneOTPWebProps = {
   
    handleTextChange:(text: string) => {console.log(this.state.userAccountID);this.setState({ otp: text })}
    // onChangeText: (text: string) => this.setState({ otp: text })
  };

  txtMobilePhoneOTPMobileProps = {
    ...this.txtMobilePhoneOTPWebProps,
    keyboardType: "numeric"
  };

  txtMobilePhoneOTPProps = this.isPlatformWeb()
    ? this.txtMobilePhoneOTPWebProps
    : this.txtMobilePhoneOTPMobileProps;

    mobileNumbOtpImgProps={
      source:otpImg      //otpImg
    }
  // Customizable Area End
}
