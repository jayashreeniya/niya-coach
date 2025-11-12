// @ts-nocheck
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { headerbg,headerRightImg } from "../../AssessmentTest/src/assets";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { BackHandler } from "react-native";
import { set_user_data } from "../../../components/src/context/actions";

// Customizable Area End

export const configJSON = require("./config");
type ApiRequestParams = {
    endPoint: string;
    headers?: Record<string, string>;
    body?: Record<string, any>;
    method: "GET" | "POST" | "PUT" | "DELETE";
  }

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
  // Customizable Area Start
  token:string;
  loading:boolean;
  categories: any[];
  selectedCategoryId: number;
  name:string;
  showAlreadyTakenModal: boolean;
  selectedCatName: string;
    last_test_taken_on: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class WellbeingCategoriesController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  
   getCategoriesApiCallId: string="";
   checkAssessmentTakenApiCallId: string = "";
  
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
      // Customizable Area Start
    
    token:"",
    loading:false,
    categories: [],
    name:'',
    selectedCategoryId:0,
    showAlreadyTakenModal: false,
    selectedCatName: '',
    last_test_taken_on: ''
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    // Customizable Area Start
    
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id ) {
        const apiRequestCallId = message.getData(
            getName(MessageEnum.RestAPIResponceDataMessage)
          );
        let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
       let errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
     
      if(errorReponse)
      {
        this.setState({loading:false})
       
    
        return;
      }
      else if(responseJson?.errors || responseJson?.message)
      {       
       
        return false;
      }


      if (responseJson) {
       
          this.setState({loading:false});
        
     
      if(apiRequestCallId === this.getCategoriesApiCallId)
      {
        this.setState({loading:false});
      
        
          
            
              this.setState({categories:responseJson},()=>{
                
              });                      
      } 
      else if(apiRequestCallId === this.checkAssessmentTakenApiCallId)
      {
        this.setState({loading:false,selectedCatName:'',last_test_taken_on:''});
       
        if(responseJson?.data?.last_test_taken_on)
        {
          this.setState({showAlreadyTakenModal:true,last_test_taken_on:responseJson?.data?.last_test_taken_on, selectedCatName:responseJson?.data?.category_name});
        }
        else{
          this.navToQuestions();
        }
      }          
      } 
    }
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;

  navToQuestions = ()=> {
    this.props.navigation.navigate("WellBeingAssTest",{categoryId:this.state.selectedCategoryId});
  }

  cornerImgProps={
    source:headerRightImg
  }
  headerbgImgProps={
    source: headerbg
  }
  letsBeginPressProps={
    onPress:()=>{
    }
  }
  async componentDidMount() {
    super.componentDidMount();
           this.setState({ token: this.context.state.token,name:this.context.state.name},()=>{
            this.getCategories();
           });
    
    // Customizable Area Start
     BackHandler.addEventListener('hardwareBackPress',()=>this.backAction())
    
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  nxtPressProps={
    onPress:()=>{
     
      if(this.state.selectedCategoryId==0)
      {
        this.showAlert("Alert !","No option is selected");
      }
      else{
       
       // this.props.navigation.navigate("WellBeingAssTest",{categoryId:this.state.selectedCategoryId});
       this.checkAssessmentTaken();
      }
      
  
      
     
    }
  }
 
  getCategories(): boolean {
    // Customizable Area Start
    this.setState({loading:true});
   
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getCategoriesApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "bx_block_wellbeing/all_categories"
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
    // Customizable Area End
    return true;
  }


  checkAssessmentTaken(): boolean {
    // Customizable Area Start
    this.setState({loading:true});
   
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.checkAssessmentTakenApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `bx_block_wellbeing/insights_data?category_id=${this.state.selectedCategoryId}`
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
    // Customizable Area End
    return true;
  }
  
  backAction = () => {
   
    const newState = {
      isNew: false,
      isshowReass:false
    }
   this.context.dispatch({ type: set_user_data, payload: newState });
    
   if(this.props.navigation.isFocused()){
    this.props.navigation.navigate('HomePage');
    return true;
  }
};
  componentWillUnmount() {
   
    BackHandler.removeEventListener('hardwareBackPress');

  }

  // Customizable Area End
}
