import { BlockComponent } from "../../../framework/src/BlockComponent";
import { IBlock } from "../../../framework/src/IBlock";
import { runEngine } from "../../../framework/src/RunEngine";
import { Message } from "../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start
import * as Yup from "yup";
import { bgEnterMobileImg, enterMobileNoOtpImg } from "./assets"
import { Alert, Platform } from "react-native";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  accountType: string;
  emailSchema: any;
  isPhone:boolean;
  phoneSchema: any;
  otpSchema: any;
  passwordSchema: any;
  accountStatus: any;
  passwordRules: any;
  emailValue: any;
  phoneValue: any;
  countryCodeSelected: any;
  token: any;
  enablePasswordField: Boolean;
  btnConfirmPasswordShowHide: Boolean;
  loading:boolean,
  platfromValue:string;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  navigation: any;
  // Customizable Area End
}

// Customizable Area Start
// Customizable Area End

export default class EnterPhoneController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  validationAPICallId: any;
  requestEmailOtpCallId: any;
  requestPhoneOtpCallId: any;
  requestChangePasswordCallId: any;
  requestGoToConfirmationCallId: any;
  otpToken: any;
  isChangePassword: boolean=false;
  isPhone:boolean=false
  //Properties from config
  title: string = configJSON.mobileotpbLabel;
  subLabelTxtResetPass:string=configJSON.mobileotpsubLabel;
  btnLabelText: string = configJSON.buttonMobilegetOtp;
  secondInputAutoCompleteType: any = configJSON.secondInputAutoCompleteType;
  secondInputKeyboardType: any = configJSON.secondInputKeyboardType;
  secondInputPlaceholder: string = configJSON.secondInputPlaceholder;
  secondInputErrorColor: any = configJSON.secondInputErrorColor;
countryCodeSelectorPlaceholder: string =
    configJSON.countryCodeSelectorPlaceholder;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage)
      // Customizable Area End
    ];

    this.receive = this.receive.bind(this);

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    //email schema
    let emailSchema = {
      email: Yup.string()
        .email(configJSON.pleaseEnterAValidEmail)
        .required(configJSON.emailIsRequired)
    };

    //phone schema
    let phoneSchema = {
      // countryCode: Yup.number()
      // .required("Country code is required"),

      phone: Yup.string()
        .matches(configJSON.phoneRegExp, configJSON.phoneNumberIsNotValid)
        .required(configJSON.phoneNumberIsRequired)
    };

    //otpSchema
    let otpSchema = {
      otpCode: Yup.number()
        .min(4)
        .required(configJSON.otpCodeIsRequired)
    };

    //passwordSchema
    let passwordSchema = {
      password: Yup.string()
        .required(configJSON.pleaseEnterAPassword)
        .min(2, configJSON.passwordMustBeAtLeast2Characters),
      confirmPassword: Yup.string()
        .required(configJSON.pleaseConfirmYourPassword)
        .when("password", {
          is: val => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref("password")],
            configJSON.passwordsMustMatch
          )
        })
    };

    this.state = {
      accountType: "sms",
      accountStatus: "EnterPhone",
      emailValue: "",
      phoneValue: "",
      countryCodeSelected: "91",
      passwordRules: "",
      emailSchema: emailSchema,
      phoneSchema: phoneSchema,
      otpSchema: otpSchema,
      passwordSchema: passwordSchema,
      token: "",
      isPhone:false,
      enablePasswordField: true,
      btnConfirmPasswordShowHide: true,
      loading:false,
      platfromValue:""
    };
    // Customizable Area End
  }

  async componentDidMount() {
    super.componentDidMount();
    this.validationRulesRequest();
  }

  validationRulesRequest = () => {
    const header = {
      "Content-Type": configJSON.forgotPasswordAPiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.validationAPICallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.profileValidationSettingsAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  async receive(from: string, message: Message) {
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const otpAuthTkn = message.getData(
        getName(MessageEnum.AuthTokenDataMessage)
      );

      if (otpAuthTkn && otpAuthTkn.length > 0) {
        this.setState({ token: otpAuthTkn });
        if (this.isChangePassword) {
          this.setState({ accountStatus: "ChangePassword" });
        }
        this.otpToken = this.state.token;
        // runEngine.debugLog("otpAuthTkn", this.state.token);
      } else {
        const accountType = message.getData(
          getName(MessageEnum.NavigationForgotPasswordPageInfo)
        );
        if (accountType) {
          this.startForgotPassword(accountType);
        }
      }
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.validationAPICallId &&
      this.validationAPICallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson === undefined) {
        return;
      }

      if (responseJson && responseJson.data[0]) {
         let passRegex = RegExp(
          responseJson.data[0].password_validation_regexp
        );
        const emailRegex = RegExp(responseJson.data[0].email_validation_regexp);
        const passwordRulesFromValidation =
          responseJson.data[0].password_validation_rules;

        this.setState({
          //email schema
          emailSchema: {
            email: Yup.string()
              .email(configJSON.pleaseEnterAValidEmail)
              .required(configJSON.emailIsRequired)
              .matches(emailRegex, configJSON.invalidEmailAddress)
          },
          //password schema
          passwordSchema: {
            password: Yup.string()
              .required(configJSON.pleaseEnterAPassword)
              .matches(passRegex, configJSON.invalidPassword),

            confirmPassword: Yup.string()
              .required(configJSON.pleaseConfirmYourPassword)
              .when("password", {
                is: val => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf(
                  [Yup.ref("password")],
                  configJSON.passwordsMustMatch
                )
              })
          },
          passwordRules: passwordRulesFromValidation
        });
      }
    } 
     else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.requestPhoneOtpCallId !== null &&
      this.requestPhoneOtpCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      setTimeout(() => {
        this.setState({loading:false})
      }, 500);
      if (
        responseJson !== undefined &&
        responseJson.meta &&
        responseJson.meta.token
      ) {
        this.otpToken = responseJson.meta.token;
        this.setState({ token: this.otpToken });
         const msg: Message = new Message(
          getName(MessageEnum.NavigationMobilePhoneOTPMessage)
        );
        msg.addData(
          getName(MessageEnum.AuthTokenDataMessage),
          this.state.token
        );

        msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

       msg.addData(
          getName(MessageEnum.AuthTokenPhoneNumberMessage),
          this.state.phoneValue
        );
        msg.addData(getName(MessageEnum.NavigationOTPInputAuthMessage), true);
        this.send(msg);
     
      }
      //error handling
      else if (responseJson && responseJson.errors) {
        // Customizable Area Start
        if(responseJson?.errors=="Unable to sent otp due to invalid number"){
          Alert.alert("Error",responseJson?.errors)
          return
        }
        // Customizable Area End
         this.parseApiErrorResponse(responseJson);
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );

        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (

      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.requestGoToConfirmationCallId !== null &&
      this.requestGoToConfirmationCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
   
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (responseJson !== undefined && responseJson.data) {
       
        this.setState({
          accountStatus: "Confirmation"
        });
      } else if (responseJson !== undefined && responseJson.errors) {
        console.log("error got accured ,")
        this.parseApiErrorResponse(responseJson);
      } else {
        console.log("errorReponse error got accured ,")
      
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );

        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (getName(MessageEnum.CountryCodeMessage) === message.id) {
      var selectedCode = message.getData(
        getName(MessageEnum.CountyCodeDataMessage)
      );

      if (selectedCode !== undefined) {
        this.setState({
          countryCodeSelected:
            selectedCode.indexOf("+") > 0
              ? selectedCode.split("+")[1]
              : selectedCode
        });
      }
    }
  }

  startForgotPassword(accountType: String) {
  
    this.props.navigation.navigate('ForgotPasswordOTP');
  }



  onSubmitPhone=(values:{phone:string})=>{
    this.props.navigation.navigate('OTPInputAuth')

  }
  goToOtpAfterPhoneValidation(values: { phone: string }) {
 
      if ( this.state.phoneValue.length === 0 ) {
      this.showAlert(
        configJSON.goToOtpAfterPhoneValidationErrorTitle,
        configJSON.phoneNumberIsRequired
      );
      return;
    } 
    if (this.state.phoneValue.length <10 ) {
      this.showAlert(
        configJSON.goToOtpAfterPhoneValidationErrorTitle,
        configJSON.phoneNumberIsNotValid
      );
      return;
    }
    this.setState({loading:true});
     //change status to OTP
    const header = {
      "Content-Type": configJSON.forgotPasswordAPiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    //GO TO REQUEST STATE
    this.requestPhoneOtpCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.passwordRecoveryStartOtpAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    const httpBody = {full_phone_number:this.state.countryCodeSelected + this.state.phoneValue// values.phone
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  
  }

 
  // Customizable Area Start
  txtInputPhoneProps = {
    onChangeText: (text: string) => {
      this.setState({ phoneValue: text });

      //@ts-ignore
      this.txtInputPhoneProps.value = text;
    },
  
  };
  btnOtpProps = {
    onPress: () => this.goToOtpAfterPhoneValidation(this.state.phoneValue),
  };

  bgImgProps={
    source:bgEnterMobileImg      //backgImg
  }
  mobileNumbOtpImgProps={
    source:enterMobileNoOtpImg      //backgImg
  }
  // Customizable Area End
}
