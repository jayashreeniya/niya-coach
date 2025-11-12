import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { set_user_data } from "../../../components/src/context/actions";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
}

export interface S {
  // Customizable Area Start
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otpAuthToken: string;
  accessCode: any;
  reTypePassword: string;
  data: any[];
  passwordHelperText: string;
  enablePasswordField: boolean;
  enableReTypePasswordField: boolean;
  countryCodeSelected: string;
  phone: string;
  loading: boolean;
  privacyPolicy: any[]
  termsAndConditionRes:string[];
  errorRes: string;
  // Customizable Area End
}

export interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class EmailAccountRegistrationController extends BlockComponent<
  Props,
  S,
  SS
> {

  // Customizable Area Start
  arrayholder: any[];
  passwordReg: RegExp;
  emailReg: RegExp;
  createAccountApiCallId: any;
  validationApiCallId: string = "";
  privacyPolicyApiID: string = "";
  devicetokenApiCallId: string = "";
  imgPasswordVisible: any;
  imgPasswordInVisible: any;
  labelHeader: any;
  labelFirstName: string;
  lastName: string;
  labelEmail: string;
  labelPassword: string;
  labelRePassword: string;
  lebelAccessCode: any;
  labelLegalText: string;
  labelLegalTermCondition: string;
  labelLegalPrivacyPolicy: string;
  btnTextSignUp: string;
  currentCountryCode: any;
  termsAndConditionApiId:string="";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage)
    ];
    this.receive = this.receive.bind(this);
    this.isStringNullOrBlank = this.isStringNullOrBlank.bind(this);

    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    this.state = {
      // Customizable Area Start
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      reTypePassword: "",
      accessCode: "",
      otpAuthToken: "",
      data: [],
      passwordHelperText: "",
      enablePasswordField: true,
      enableReTypePasswordField: true,
      countryCodeSelected: "91",
      phone: "",
      loading: false,
      privacyPolicy: [],
      termsAndConditionRes:[],
      errorRes: "",
      // Customizable Area End
    };

    // Customizable Area Start
    this.arrayholder = [];
    this.passwordReg = new RegExp("\\w+");
    this.emailReg = new RegExp("\\w+");

    this.imgPasswordVisible = imgPasswordVisible;
    this.imgPasswordInVisible = imgPasswordInVisible;

    this.labelHeader = configJSON.labelHeader;
    this.labelFirstName = configJSON.labelFirstName;
    this.lastName = configJSON.lastName;
    this.labelEmail = configJSON.labelEmail;
    this.labelPassword = configJSON.labelPassword;
    this.labelRePassword = configJSON.labelRePassword;
    this.lebelAccessCode = configJSON.lebelAccessCode;
    this.labelLegalText = configJSON.labelLegalText;
    this.labelLegalTermCondition = configJSON.labelLegalTermCondition;
    this.labelLegalPrivacyPolicy = configJSON.labelLegalPrivacyPolicy;
    this.btnTextSignUp = configJSON.btnTextSignUp;
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      let errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      if (apiRequestCallId && responseJson) {

        setTimeout(() => {
          this.setState({ loading: false });
        }, 500);
        this.reciveRspHandler(apiRequestCallId, responseJson, errorReponse)

      }
      if (apiRequestCallId == this.devicetokenApiCallId) {
        
        this.setState({ loading: false });


      }
      else if(apiRequestCallId===this.termsAndConditionApiId){
        if(responseJson?.data){
          this.setState({termsAndConditionRes:responseJson.data})
        }
      }
    }


    this.navPaylaodResHandler(message)

    // Customizable Area End
  }

  // Customizable Area Start
  navPaylaodResHandler = (message: Message) => {
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const otpAuthTkn = message.getData(
        getName(MessageEnum.AuthTokenDataMessage)
      );
      if (otpAuthTkn && otpAuthTkn.length > 0) {
        this.setState({ otpAuthToken: otpAuthTkn });
        runEngine.debugLog("otpAuthTkn", this.state.otpAuthToken);
        runEngine.unSubscribeFromMessages(this as IBlock, [message.id]);
      }
    }

    if (getName(MessageEnum.CountryCodeMessage) === message.id) {
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

  static contextType?: Context<any> = AppContext;

  goToPrivacyPolicy() {

    this.props.navigation.navigate('PrivacyPolicy');
  }
  navigateToTermsAndCondition() {
    this.props.navigation.navigate('TermsAndCondition');
  }
  goToTermsAndCondition() {
    this.props.navigation.navigate('TermsAndCondition');

  }

  goToLogIn() {

    const msg: Message = new Message(
      getName(MessageEnum.NavigationEmailLogInMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }

  isStringNullOrBlank(str: string) {
    return str === null || str.length === 0;
  }

  isValidEmail(email: string) {
    return this.emailReg.test(email);
  }

  async createAccount(){
    let fcmtoken = await AsyncStorage.getItem('fcmToken');
   
    
  
    const PhoneNumber = /^[6-9][0-9]{9}$/;
    const regName = /^[a-zA-Z]+$/
    
    if (
      this.isStringNullOrBlank(this.state.firstName) ||
      this.isStringNullOrBlank(this.state.email) ||
      this.isStringNullOrBlank(this.state.password) ||
      this.isStringNullOrBlank(this.state.reTypePassword) ||
      this.isStringNullOrBlank(this.state.accessCode)
    ) {
      this.showAlert(
        configJSON.errorTitle,
        configJSON.errorAllFieldsAreMandatory
      );
      return false;
    }
    if(!this.state.firstName.trim()){
      this.showAlert(configJSON.errorTitle, "Name should not be empty.");
      return false;
      
    }

    if(this.state.firstName.length<3){
      this.showAlert(configJSON.errorTitle, "Name must be atleast 3 characters long.");
      return false;
      
    }

    if (!regName.test(this.state.firstName)) {
      
      this.showAlert(configJSON.errorTitle, "Name contains only alphabetic characters.");
      return false;
    }


    if (this.state.phone.length<10) {
      this.showAlert(configJSON.errorTitle, "Phone number must be ten digits.");
      return false;
    }
    if (this.state.phone.length == 10 && PhoneNumber.test(this.state.phone) == false) {

      this.showAlert(configJSON.errorTitle, configJSON.phoneNumberError);
      return false;
    }
    

    if (!this.isValidEmail(this.state.email)) {
      this.showAlert(configJSON.errorTitle, configJSON.errorEmailNotValid);
      return false;
    }


    if (this.state.password !== this.state.reTypePassword) {
      this.showAlert(
        configJSON.errorTitle,
        configJSON.errorBothPasswordsNotSame
      );
      return false;
    }
    this.setState({ loading: true })
    const header = {
      "Content-Type": configJSON.contentTypeApiAddDetail
    };

    const attrs = {
      full_name: this.state.firstName.trim(),

      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.reTypePassword,
      access_code: this.state.accessCode,
      full_phone_number: this.state.countryCodeSelected + this.state.phone,
      device_token:fcmtoken
    };

    const data = {
      type: "email_account",
      attributes: attrs
    };

    const httpBody = {
      data: data,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.createAccountApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.accountsAPiEndPoint
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
      configJSON.apiMethodTypeAddDetail
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  getValidations() {
    const headers = {
      "Content-Type": configJSON.validationApiContentType
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

  isNonNullAndEmpty(value: String) {
    return (
      value !== undefined &&
      value !== null &&
      value !== "null" &&
      value.trim().length > 0
    );
  }

  validateCountryCodeAndPhoneNumber(countryCode: string, phoneNumber: string) {
    let error = null;

    if (this.isNonNullAndEmpty(phoneNumber)) {
      if (!this.isNonNullAndEmpty(String(countryCode))) {
        error = configJSON.errorCountryCodeNotSelected;
      }
    } else if (this.isNonNullAndEmpty(countryCode)) {
      if (!this.isNonNullAndEmpty(phoneNumber)) {
        error = "Phone " + configJSON.errorBlankField;
      }
    }
    return error;
  }

  createuserAccountRespHandling=(responseJson:any,errorReponse:any)=>{
    if (responseJson?.errors) {
      this.setState({errorRes: responseJson?.errors.Password});
    }
    if (responseJson && responseJson?.meta && responseJson?.meta?.token) {
      this.saveLoggedInUserData(responseJson);
      this.sendLoginSuccessMessage();
      let profilenm = responseJson.data.attributes.profile_name ? responseJson?.data.attributes?.profile_name : responseJson?.data?.attributes?.full_name;

      const newState = {
        auth: !!responseJson.meta.token,
        id: responseJson.meta?.id,
        email: this.state.email,
        token: responseJson.meta.token,
        name: profilenm,
        role: responseJson.data?.attributes?.role ? responseJson.data?.attributes?.role : "",
      }
      this.context.dispatch({ type: set_user_data, payload: newState });



    } else {
      //Check Error Response
      this.parseApiErrorResponse(responseJson);
    }

    this.parseApiCatchErrorResponse(errorReponse);
  }
  reciveRspHandler = (apiRequestCallId: any, responseJson: any, errorReponse: any) => {

    if (apiRequestCallId === this.validationApiCallId) {
      this.arrayholder = responseJson.data;

      if (this.arrayholder && this.arrayholder.length !== 0) {
        let regexData = this.arrayholder[0];

        if (regexData.password_validation_regexp) {
          this.passwordReg = new RegExp(
            regexData.password_validation_regexp
          );
        }

        if (regexData.password_validation_rules) {
          this.setState({
            passwordHelperText: regexData.password_validation_rules
          });
        }
        this.emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      }
    }
    if (apiRequestCallId === this.createAccountApiCallId) {

     this.createuserAccountRespHandling(responseJson,errorReponse)
    }
    else if (apiRequestCallId === this.privacyPolicyApiID) {

      if (!responseJson.errors) {
        this.setState({ privacyPolicy: responseJson.data })

      }
      else {

        //Check Error Response
        this.parseApiErrorResponse(responseJson);
      }
    }
  }

  imgEnableRePasswordFieldProps = {
    source: imgPasswordInVisible
  };

  btnConfirmPasswordShowHideProps = {
    onPress: () => {
      this.setState({
        enableReTypePasswordField: !this.state.enableReTypePasswordField
      });
      this.txtInputConfirmPasswordProps.secureTextEntry = !this.state
        .enableReTypePasswordField;
      this.imgEnableRePasswordFieldProps.source = this
        .txtInputConfirmPasswordProps.secureTextEntry
        ? imgPasswordInVisible
        : imgPasswordVisible;
    }
  };

  imgEnablePasswordFieldProps = {
    source: imgPasswordInVisible
  };

  btnPasswordShowHideProps = {
    onPress: () => {
      this.setState({ enablePasswordField: !this.state.enablePasswordField });
      this.txtInputPasswordProps.secureTextEntry = !this.state
        .enablePasswordField;
      this.imgEnablePasswordFieldProps.source = this.txtInputPasswordProps
        .secureTextEntry
        ? imgPasswordInVisible
        : imgPasswordVisible;
    }
  };

  btnSignUpProps = {
    onPress: () => this.createAccount()
  };

  btnLogInProps = {
    onPress: () => this.goToLogIn()
  };

  btnLegalPrivacyPolicyProps = {
    onPress: () => this.goToPrivacyPolicy()
  };

  btnLegalTermsAndConditionProps = {
    onPress: () => this.goToTermsAndCondition()
  };

  txtInputEmailWebPrpos = {
    onChangeText: (text: string) => {
      this.setState({ email: text });
      //@ts-ignore
      this.txtInputEmailPrpos.value = text;
    }
  };

  txtInputEmailMobilePrpos = {
    ...this.txtInputEmailWebPrpos,
    keyboardType: "email-address"
  };

  txtInputEmailPrpos = this.isPlatformWeb()
    ? this.txtInputEmailWebPrpos
    : this.txtInputEmailMobilePrpos;

  txtPhoneNumberWebProps = {
    onChangeText: (text: string) => {
      this.setState({ phone: text });

      //@ts-ignore
      this.txtPhoneNumberProps.value = text;
    }
  };

  txtPhoneNumberMobileProps = {
    ...this.txtPhoneNumberWebProps,
    autoCompleteType: "tel",
    keyboardType: "phone-pad"
  };

  txtPhoneNumberProps = this.isPlatformWeb()
    ? this.txtPhoneNumberWebProps
    : this.txtPhoneNumberMobileProps;

  txtInputLastNamePrpos = {
    onChangeText: (text: string) => {
      this.setState({ lastName: text });

      //@ts-ignore
      this.txtInputLastNamePrpos.value = text;
    }
  };

  txtInputFirstNamePrpos = {
    onChangeText: (text: string) => {
      this.setState({ firstName: text });
      //@ts-ignore
      this.txtInputFirstNamePrpos.value = text;
    }
  };

  txtAccessCodePrpos = {
    onChangeText: (text: string) => {
      this.setState({ accessCode: text });

      //@ts-ignore
      this.txtAccessCodePrpos.value = text;
    }
  };

  txtInputConfirmPasswordProps = {
    onChangeText: (text: string) => {
      this.setState({ reTypePassword: text });

      //@ts-ignore
      this.txtInputConfirmPasswordProps.value = text;
    },
    secureTextEntry: true
  };

  txtInputPasswordProps = {
    onChangeText: (text: string) => {
      this.setState({ password: text });

      //@ts-ignore
      this.txtInputPasswordProps.value = text;
    },
    secureTextEntry: true
  };

  saveLoggedInUserData(responseJson: any) {
    if (responseJson && responseJson.meta && responseJson.meta.token) {
      const newState = {
        auth: !!responseJson.meta.token,
        id: responseJson.meta?.id,
        email: this.state.email,
        token: responseJson.meta.token,
        role: responseJson.meta?.role ? responseJson.meta?.role : "",
        isNew: true
      }
      this.context.dispatch({ type: set_user_data, payload: newState });

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
  sendLoginSuccessMessage() {
    const msg: Message = new Message(getName(MessageEnum.LoginSuccessMessage));

    msg.addData(getName(MessageEnum.LoginUserName), this.state.email);
    msg.addData(getName(MessageEnum.CountyCodeDataMessage), null);
    msg.addData(getName(MessageEnum.LoginPassword), this.state.password);


    this.send(msg);
  }
  getPrivacyPolicyContent() {

    this.setState({ loading: true })
    const header = {
      "Content-Type": configJSON.contentTypeApiAddDetail,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );


    this.privacyPolicyApiID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.privacyPolicyEndPoints}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  getTermsAndConditionData= async () =>{

    // this.setState({ loading: true })
    const header = {
     "Content-Type": configJSON.contentTypeApiAddDetail,
    };
  
    const requestMessage = new Message(
     getName(MessageEnum.RestAPIRequestMessage)
    );
  
    this.termsAndConditionApiId = requestMessage.messageId;
  
    requestMessage.addData(
     getName(MessageEnum.RestAPIResponceEndPointMessage),
     `${configJSON.termAndConditionEndPoint}`
    );
  
    requestMessage.addData(
     getName(MessageEnum.RestAPIRequestHeaderMessage),
     JSON.stringify(header)
    );
  
    requestMessage.addData(
     getName(MessageEnum.RestAPIRequestMethodMessage),
     configJSON.validationApiMethodType
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getPrivacyPolicyContent();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getPrivacyPolicyContent();
      });
    }
  }
 

  // Customizable Area End
}
