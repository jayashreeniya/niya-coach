import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import ImagePicker from 'react-native-image-crop-picker';
import { IBlock } from "../../../framework/src/IBlock";
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
  isLoading: any;
  token: any;
  data: any;
  gender: any;
  isData: boolean;
  isdata: any;
  prifileimage: any;
  full_name: any;
  email: any;
  access_code: any;
  phone_number: any;
  image: any;
  country_code: any;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  navigation: any;
  // Customizable Area End
}

export default class UserProfileController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  userProfileApiCallId: any;
  getachievementApiCallId: any;
  role: string = this.props.navigation.getParam("role");
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
      isLoading: false,
      token: '',
      gender: "",
      isData: false,
      prifileimage: "",
      email: "",
      full_name: "",
      access_code: "",
      phone_number: "",
      image: '',
      country_code: '',
      data: [],
      isdata: [
        {
          id: 1,
          name: "Female",
        },
        {
          id: 2,
          name: "Male",
        },
        {
          id: 3,
          name: "Other",
        },
      ],
    };
    // Customizable Area End
  }

  // Customizable Area Start

  static contextType?: Context<any>= AppContext;
 //================== API Function Call ==================
 apiCall = async (data: any) => {
  // Customizable Area Start
  const { contentType, method, endPoint, body, type } = data
  const header = {
    'Content-Type': contentType,
    token: this.state.token
    // token: 'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6OSwiZXhwIjoxNjY1MTQ4ODY5LCJ0b2tlbl90eXBlIjoibG9naW4ifQ.MdEdNCSP5hR88tNt0_CTdX5TGBWtYP3RVL0U9DU50UsOxE3Wu3_zqaFi06YTX8BfrpnXuKVZ08HA18J_4O8gWA'

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
  console.log('apicall*****', requestMessage)
  return requestMessage.messageId;
  // Customizable Area End
};
  async componentDidMount() {
    super.componentDidMount();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('willFocus', () => {
         this.setState({ token: this.context.state.token,isLoading:true }, () => {
        this.getDataDataList()
      });
      });
    }
  }

  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }

  //====================== receive function ================================
  async receive(from: string, message: Message) {
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
      this.setState({isLoading:false});
      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.userProfileApiCallId) {
          this.userProfileSuccessCallBack(responseJson);
        } else if (apiRequestCallId === this.getachievementApiCallId){
          this.getSuccessCallBack(responseJson);
        }

      }
      else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.userProfileApiCallId) {
          this.userProfileFailureCallBack(responseJson)
        } else if (apiRequestCallId === this.getachievementApiCallId){
          this.getFailureCallBack(responseJson)
        }

      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
  }

  //================ success and failure call back ================
  userProfileSuccessCallBack = async (responseJson: any) => {
    this.props.navigation.goBack()
    console.log("@@@ userprofile success call back======", responseJson)
  };

  userProfileFailureCallBack = (error: any) => {
    console.log("@@@ userprofile FailureCallBackk======", error)
  };

  getSuccessCallBack = async (responseJson: any) => {
    console.log("@@@ GateDataSuccessCallBack======", responseJson)
    this.setState({
      prifileimage:responseJson?.data.attributes?.image,
      full_name: responseJson?.data.attributes?.full_name,
      email: responseJson?.data.attributes?.email,
      access_code: responseJson?.data.attributes?.access_code,
      gender: responseJson?.data.attributes?.gender,
      phone_number: responseJson?.data.attributes?.phone_number,
      isLoading: false

    })
  };

  getFailureCallBack = (error: any) => {
    console.log("@@@ GateDataFailureCallBackk======", error)
    this.setState({isLoading: false})
  };
  // ============== NEW PASSWORD ============
  onPressNewDetailsApiCall=async()=>{
    let formdata = new FormData();
    if(this.state.image && this.state.image != ''){ 
    // Customizable Area Start
    formdata.append("profile[image]", this.state.image)
    }
    formdata.append("profile[full_name]", this.state.full_name)
    formdata.append("profile[email]", this.state.email)
    if(!(["hr", "coach","admin"].includes(this.role))){
      formdata.append("profile[access_code]", this.state.access_code)
    }
    if(!(["admin"].includes(this.role))){
      if(this.state.gender!=""){
        formdata.append("profile[gender]", this.state.gender)
      }
     
      formdata.append("profile[full_phone_number]", `${'91'}${this.state.phone_number}`)
    }
    // Customizable Area End
    console.log('hbcbrwvghdhewdc', formdata)
    this.setState({isLoading: true});
    this.userProfileApiCallId = await this.apiCall({
      contentType: "multipart/form-data",
      method: "PUT",
      endPoint: 'update_profile',
      body: formdata,
      type: 'formData'
    });
  }
  onPressNewDetails = async () => {
    //Customizable Area Start
    const mob_pattern = /^\d{10}$/;
    // Customizable Area End
     const pattern =/^[a-z0-9._%-]+@[a-z0-9.-]+.[a-z]{2,4}$/;
     const emailReg = new RegExp(pattern);
    if (this.state.prifileimage === '') {
      alert('please select image')
      return
    }
    if (this.state.full_name === '') {
      alert('please enter your Full name')
      return
    }

    if (!emailReg.test(this.state.email.trim())) {
      this.showAlert('Alert', 'Please enter valid Email Address')
      return;
    }
    if (this.state.access_code === '') {
      if(!(["hr", "coach"].includes(this.role))){
        alert('Please enter Access code')
      }
    }
    //Customizable Area Start
    if(this.state.phone_number[0]<6){
      alert('Enter valid mobile number')
      return
    }
    // Customizable Area End
    if (this.state.gender === '') {
      //Customizable Area Start
      console.log(":::^&*&&*",!(["admin"].includes(this.role)));
      if(!(["admin"].includes(this.role))){
      // Customizable Area End
      alert('please select your gender') 
      //Customizable Area Start
      return;
    }
     // Customizable Area End
    }
    if (this.state.phone_number === '') {
      alert('Please enter your mobile number')
    }
    else {
      //Customizable Area Start
      if(mob_pattern.test(this.state.phone_number)) {
        // Customizable Area End
      this.onPressNewDetailsApiCall();
        //Customizable Area Start
      }else {
        alert('Please enter correct mobile number')
        
      }
      // Customizable Area End
    }
  }

  // ============== NEW PASSWORD ============
  getDataDataList = async () => {
    this.setState({isLoading: true})
    this.getachievementApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: 'profile_details'
    });
  };

  profilePicImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      let imgObj = {
        name: 'profile.jpg',
        type: image.mime,
        uri: image.path,
      }
      this.setState({ prifileimage: image.path, image: imgObj })
    });
  }
  // Customizable Area End

}
