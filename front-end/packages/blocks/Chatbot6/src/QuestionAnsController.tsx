import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
// Customizable Area Start
import { BackHandler } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { imgPasswordInVisible, imgPasswordVisible , bgImg, backImg,unCheckBoxIMg,checkBoxImg} from "./assets";
// @ts-ignore
import {NavigationActions, StackActions} from "react-navigation";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { set_user_data } from "../../../components/src/context/actions";


export interface ChooseQuestionsData{
  data: {
  id: string,
    type: string,
    attributes: {
        account_id: 642,
        assesment_test_question: {
            id: number,
            title: string,
            created_at: string,
            updated_at: string,
            sequence_number: number
        },
        assesment_test_answer: {
            id: number,
            assesment_test_question_id: number,
            created_at:string,
            updated_at: string,
            answers: string,
            title: null | string
        },
        upcoming_question: null | {
          id: number,
          question_title:string,
          test_type: null | string,
          sequence_number: null | number | string,
          created_at: string,
          updated_at: string,
          assesment_test_answer_id: number
        },
        upcoming_answers: null | {
          id: number,
          assesment_test_type_id: number,
          title: null | string,
         answers: string,
          test_type_id: null | number,
          created_at: string,
          updated_at: string
        }[]
    }
}
}
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
   options:any[];
  // Customizable Area Start
  token:string
  sequence_number:any;
  question_id:any;
  answer_id:any;
  checked:any[];
  isNxt:boolean;
  loading:boolean;
  questionAnsButtonLoading: boolean;
  showGConfirmModal:boolean;
  name:string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class QuestionAnsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getPersonalityTestApiCallId: string="";
  chooseanswersforPersonalityTestQue:string="";
  chooseMultipleAnsForItem:string="";
  getfocusAreaApiCallId:string="";
  addProfilenameTestApiCallId:string="";
  getProfileApi:string="";
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
      options:[],
    
      // Customizable Area Start
      token:"",
      sequence_number:0,
      question_id:0,
      answer_id:0,
      checked:[],
      isNxt:false,
      loading:false,
      questionAnsButtonLoading: false,
      showGConfirmModal: false,
      name:""
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }
  async receive(from: string, message: Message) {
    // Customizable Area Start
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
     
      if (apiRequestCallId && responseJson) {
      
        const resetAction = StackActions.reset({
          index: 0,
          key: null, // <-- this
          actions: [NavigationActions.navigate({ routeName: 'BottomTabNavigator' })]
      })
         if (apiRequestCallId === this.getPersonalityTestApiCallId) {
            if(responseJson.error != undefined)
            {
              setTimeout(()=>{
                this.showAlert(
                  configJSON.errorTitle,
                  responseJson.error,
                );
              },500)
  
              return false;
            }else{

              this.setState({options:responseJson.data,isNxt:false})
              await AsyncStorage.setItem("personalQuestions",JSON.stringify(responseJson.data))
             
              return false;
          }
        }

        if (apiRequestCallId === this.chooseanswersforPersonalityTestQue) {
        
          if(responseJson.error != undefined)
            {
              setTimeout(()=>{
                this.showAlert(
                  configJSON.errorTitle,
                  responseJson.error,
                );
              },500)
      
              return false;
            }else{
      
            
            this.handleChooseAnswer(responseJson)
             
            }
        }
        
        if(apiRequestCallId==this.chooseMultipleAnsForItem){
          
          if(responseJson.error != undefined)
          {
            setTimeout(()=>{
              this.showAlert(
                configJSON.errorTitle,
                responseJson.error,
              );
            },500)

            return false;
          }else{
            
            if(!this.context.state.isNew){
            const newState = {
              isNew: false,
              isshowReass:false
            }
            this.context.dispatch({ type: set_user_data, payload: newState });
            this.props.navigation.navigate("HomePage");
            }else{
              await AsyncStorage.setItem("modalPart","true")
              this.setState({showGConfirmModal:true});
            }
           
        }}
        if(apiRequestCallId==this.getfocusAreaApiCallId){
         
          if(responseJson.error != undefined)
          {
            setTimeout(()=>{
              this.showAlert(
                configJSON.errorTitle,
                responseJson.error,
              );
            },500)

            return false;
          }else{

            this.props.navigation.dispatch(resetAction)
        }}
        if(apiRequestCallId==this.addProfilenameTestApiCallId){
          this.getDataDataList();
         
        }
        if (apiRequestCallId==this.getProfileApi) {
         
          let profilenm=responseJson.data.attributes.profile_name ? responseJson?.data.attributes?.profile_name:responseJson?.data?.attributes?.full_name;
         
          const newState = {
           
            name:profilenm
          }
           this.context.dispatch({ type: set_user_data, payload: newState });
          
                    
        }
      }
    } 
 
    // Customizable Area End
  }

//   async receive(from: string, message: Message) {
//     // runEngine.debugLog("Message Recived",  getName(MessageEnum.RestAPIResponceMessage) === message.id,"getName(MessageEnum.RestAPIResponceMessage) === message.id" );
//     console.log("message.id",message.id);
//     if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
//       let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));
//       console.log(value ,"//////quen ans ");
//       this.showAlert(
//         "Change Value",
//         "From: " + this.state.txtSavedValue + " To: " + value
//       );

//       this.setState({ txtSavedValue: value });
//     }

//     // Customizable Area Start
   
//    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
//     runEngine.debugLog("*******Message Recived", message);
  
//     let token = message.getData(getName(MessageEnum.SessionResponseToken));
//     console.log(token,"token -=---")
//     this.setState({ token: token });
//     this.getAssessmenttestQuestions(token)

//    } 
//   if (
//   getName(MessageEnum.RestAPIResponceMessage) === message.id &&
//   this.getPersonalityTestApiCallId != null &&
//   this.getPersonalityTestApiCallId ===
//     message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
// ) {
//     console.log(responseJson,"<<<======>>>>>>>:::::");

//      var responseJson = message.getData(
//     getName(MessageEnum.RestAPIResponceSuccessMessage)
//   );
//   console.log(responseJson,"assement test api response :::::");
//   var errorReponse = message.getData(
//     getName(MessageEnum.RestAPIResponceErrorMessage)
//   );

//   if (responseJson && !responseJson.errors && responseJson.data) {
 
//   console.log(responseJson,"responseJson inside if ")
   
//   } else {
//     this.showAlert("Alert", "No Slots", "");
//     var errorReponse = message.getData(
//       getName(MessageEnum.RestAPIResponceErrorMessage)
//     );

//     this.parseApiCatchErrorResponse(errorReponse);
//   }
// }
//     // Customizable Area End
//   }


handleChooseAnswer=async( responseJson: ChooseQuestionsData)=>{

       if(responseJson.data.attributes.upcoming_question!=null&&responseJson.data.attributes.upcoming_answers!=null){
        const checkedData = await AsyncStorage.getItem(`checkedIds`);
        if(checkedData){
          const data = JSON.parse(checkedData)

          if(data.question_id === responseJson.data.attributes.upcoming_question.id){
            this.setState({checked:data.answers_id})
          }
        }
        
         let emptyArr=[]
         emptyArr.push(responseJson.data)
         await AsyncStorage.setItem("question3",JSON.stringify(emptyArr));

          this.setState({options:emptyArr,isNxt:true});
        }
        else{ this.props.navigation.navigate('ChooseCategory',{name:this.props.navigation.state.params.name, data: this.state.options});
        this.setState({questionAnsButtonLoading: false})
      }
       
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

  
  bgImgProps={
    source:bgImg      //backgImg
  }

  nxtPressProps={
    onPress:async()=>{
      const data = {
        sequence_number:this.state.sequence_number,
        question_id:this.state.question_id,   
        answer_id:this.state.answer_id,
      };
      
      if(this.state.sequence_number === 1){
        await AsyncStorage.setItem("seqNum",JSON.stringify(this.state.sequence_number));
      }

      await AsyncStorage.setItem(`answers${this.state.sequence_number}`, JSON.stringify(data));
      if(this.state.isNxt){
      
        this.chooseMultipleAnswersforItemQuestions()
      }
      else this.chooseanswersAssessmenttestQuestions();
        // this.props.navigation.navigate('ChooseCategory',{name:this.props.navigation.state.params.name});
    }
  }
  backImageProps = {
    source: backImg,
  };
  backbtnPressProps = {
    onPress: () => {
      this.handleBackButtonClick()
      this.props.navigation.goBack();
      
    },
  };

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
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

  bgImgChooseCatyProps={
    source:bgImg      //backgImg
  }
  letsBeginPressProps={
    onPress:()=>{
      this.props.navigation.navigate('ReassorOrContinue');
    }
  }
  async componentDidMount() {
    super.componentDidMount();
      this.props.navigation.addListener("willFocus", () => {
        try{
          if(this.props.navigation.state.routeName==='QuestionAns'){
            this.getAssessmenttestQuestions(this.context.state.token)
          }else{
            this.setState({options: this.props.navigation.state.params.data,})
          }
        }catch(error){
          this.showAlert(
            configJSON.errorTitle,
            configJSON.somethingWentWrong
          );
        }
       
        this.getDetails()
      });
    // Customizable Area Start
      this.handleGetPreviousAnswer();
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    // Customizable Area End
  }


  handleBackButtonClick =  ()=>{
    const handleDelete = async ()=>{
      const question3 = await AsyncStorage.getItem("question3");

      if(this.props.navigation.state.routeName === "ChooseCategory" && question3){
        await AsyncStorage.removeItem("question3")
      }
    }

    handleDelete();
    
  return null
  }

  handleGetPreviousAnswer = async () => {
    const QuestionAnsAns = await AsyncStorage.getItem("answers1");
    const ChooseCategoryAns = await AsyncStorage.getItem("answers2");
    const seqNum = await AsyncStorage.getItem("seqNum");
    const personalQuestions = await AsyncStorage.getItem("personalQuestions");
    const question3 = await AsyncStorage.getItem("question3");
    const modalPart = await AsyncStorage.getItem("modalPart");
    const wellBeing = await AsyncStorage.getItem("wellBeing");
    if(wellBeing === "true"){
      this.props.navigation.navigate('WellbeingCategories');
    }

    if(modalPart === "true"){
      this.setState({showGConfirmModal:true,token:this.context.state.token});
      this.props.navigation.navigate('ChooseCategory');
    }

      

      

      if(question3){
        const data = JSON.parse(question3)
  
        const checkedData = await AsyncStorage.getItem(`checkedIds`);
          if(checkedData){
            const data = JSON.parse(checkedData)
            this.setState({checked:data.answers_id})
          }
  
        this.setState({options:data,isNxt:true});
        this.props.navigation.navigate('ChooseCategory',{name:this.props.navigation.state.params.name, data: this.state.options});
        await AsyncStorage.removeItem("seqNum");
      }

    if( personalQuestions && seqNum && seqNum === "1" && question3 === null){
      this.setState({options:JSON.parse(personalQuestions),isNxt:false,token:this.context.state.token})

      this.props.navigation.navigate('ChooseCategory',{name:this.props.navigation.state.params.name});
    }

    if (
      ChooseCategoryAns &&
      this.props.navigation.state.routeName === "ChooseCategory"
    ) {
      const data = JSON.parse(ChooseCategoryAns);
  
      this.setState({
        question_id: data.question_id,
        answer_id: data.answer_id,
        sequence_number: data.sequence_number
      });
    }
      
    
  
    
  
    

    if (
      QuestionAnsAns !== null &&
      this.props.navigation.state.routeName === "QuestionAns"
    ) {
      const data = JSON.parse(QuestionAnsAns);
      
      this.setState({
        question_id: data.question_id,
        answer_id: data.answer_id,
        sequence_number: data.sequence_number
      });
    }
  };
  
  getDetails=()=>{
    this.setState({name: this.context.state.name, token: this.context.state.token})
  }

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
      profile_name:this.state.name
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

  // Customizable Area Start
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

// Customizable Area End
  getAssessmenttestQuestions=async(token:string)=>{
    this.setState({loading: true, })
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token:token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getPersonalityTestApiCallId = requestMessage.messageId;
   
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.personalityTestQuestions}`
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

  removeStorage=async()=>{
    await AsyncStorage.removeItem("answers2");
    await AsyncStorage.removeItem("answers1");
    await AsyncStorage.removeItem("question3");
    await AsyncStorage.removeItem("checkedIds");
    await AsyncStorage.removeItem("personalQuestions");
    await AsyncStorage.removeItem("seqNum");
  }

  chooseanswersAssessmenttestQuestions=()=>{
   
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token:this.state.token,
    };
    if(this.state.sequence_number==0||this.state.question_id==0||this.state.answer_id==0){
      this.showAlert(
        configJSON.errorTitle,
        "No option is selected"
      );
      return false;
    }
 
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.chooseanswersforPersonalityTestQue = requestMessage.messageId;
    if(this.props.navigation.state.routeName==='QuestionAns'){
      this.setState({ questionAnsButtonLoading: true})
    }else{
      this.setState({loading: true})
    }
     const attrs = {
      sequence_number: this.state.sequence_number,
      question_id:this.state.question_id,
      answer_id:  this.state.answer_id,
       };
       const httpBody = {
        sequence_number: this.state.sequence_number,
       question_id:this.state.question_id,
       answer_id:  this.state.answer_id,
      };
  
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.chooseanswersApi}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);

  }
  chooseMultipleAnswersforItemQuestions= async ()=>{
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token:this.state.token,
    };
    if(this.state.checked.length<1){
      this.showAlert(
        configJSON.errorTitle,
        "No option is selected"
      );
      return false;
    }
    if(this.state.checked.length>3){
      this.showAlert(
        configJSON.errorTitle,
        "You can select maximum of 3 options "
      );
      return false;
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.chooseMultipleAnsForItem = requestMessage.messageId;
   
   
       const httpBody = {
        question_id: this.state.question_id,
        answer_ids:  this.state.checked,
      };
      this.setState({loading:true})
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.chooseMultipleAnswers}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

   this.removeStorage();

    runEngine.sendMessage(requestMessage.id, requestMessage);

  }

  btnHideImageProps = {
    source
      : unCheckBoxIMg,
  };
  btnShowImageProps = {
    source 
      : checkBoxImg,
  };
  btnMulOptionShowHideProps=(id:any,question_id:any) => {
    this.setState({question_id:question_id})
    let ids=[...this.state.checked];
  
    if(ids.includes(id)){
   
      ids=ids.filter((_id)=>_id!==id);

    }else{
      if(this.state.checked.length>2){
        this.showAlert(
          configJSON.errorTitle,
          `You can select maximum of 3 options`
        );
        return false;
      }
     else ids.push(id);
    }
    AsyncStorage.setItem("checkedIds",JSON.stringify({question_id,answers_id:ids}))
    this.setState({checked:ids});


};


  // Customizable Area End
}
