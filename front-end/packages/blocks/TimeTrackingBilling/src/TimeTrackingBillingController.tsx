import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start

import { AppContext } from "../../../components/src/context/AppContext";
export type NavObject = TypeNav
export interface TypeNav {
  addListener: Function
  goBack: Function,
  getParam:Function,
  navigate:Function
}
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: NavObject;
  scrrenid: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  TrackingDataList:[],
  loading:boolean
  pageNo: number;
  limit: number;
  totalCount: number;
  // Customizable Area End
}

interface SS {
  scrrenid: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class TimeTrackingBillingController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
   static contextType?= AppContext; 
 
    getuserTrackingDetailsApiCallId:string="";
    
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
   
       // Customizable Area End
    ];
   // Customizable Area End
    this.state = {
    
      // Customizable Area Start
      TrackingDataList:[],
      pageNo:0,
      limit: 12,
      totalCount:0,
      loading:false
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  

  // Customizable Area Start
  networkTimeTrackingRequest = ({
    endPoint,
    method,
    headers,
    body,
    newState
  }:{
    endPoint: string;
    headers?: Record<string, string>;
    body?: Record<string, object>;
    method: "GET" | "POST" | "PUT" | "DELETE";
    newState?: Partial<S>;
  }) => {
  
    const defaultHeaders = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.context?.state?.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    if(typeof newState === "object"){
      this.setState(prev => ({ ...prev, ...newState }));
    }
   
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers || defaultHeaders)
    );
    if(body){
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      );
    }
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );
   
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return requestMessage.messageId;
  }
  async receive(from: string, message: Message) {
   
    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const responseJson = message.getData(
          getName(MessageEnum.RestAPIResponceSuccessMessage)
        );
        const apiRequestCallId = message.getData(
          getName(MessageEnum.RestAPIResponceDataMessage)
        );
    
       
          this.setState({ loading: false });
          if(apiRequestCallId === this.getuserTrackingDetailsApiCallId){
            let res_data=responseJson?.data;
            let data_cnt=responseJson?.count;
            let track_userData=[...this.state.TrackingDataList, ...res_data] || [];
             if(res_data){
               this.setState(prev => ({
                 totalCount :data_cnt ,
                 TrackingDataList: (prev.pageNo === 0)?
                 res_data :track_userData,
                 loading:false
      
      
               }));
             }
             
         
          }
      
      }
    // Customizable Area End
  }




  getUserDataList = async (currentPageNo?:number) => {
    let strBodydata={
      limit: `${this.state.limit}`,
       page: `${currentPageNo || this.state.pageNo}`
   }
   let urlParams = new URLSearchParams(strBodydata).toString();

    this.getuserTrackingDetailsApiCallId = this.networkTimeTrackingRequest({
      endPoint: `bx_block_time_tracking_billing/summary_tracks/all_account?${urlParams}`,
      method: "GET",
      newState: { loading: true }
    });
  };

  routeChange = (userid:string)=>{
    this.props.navigation?.navigate('TimeTrackingDetails',{userid:userid})
  }

  fetchMoreData = () => {
 
    if(
      (this.state.pageNo >=Math.floor(this.state.totalCount/this.state.limit)) ||
      this.state.loading
    ){  
      return;
    }
    this.setState(prevState => ({
      pageNo: prevState.pageNo + 1
    }), () => this.getUserDataList());
  }

  async componentDidMount() {

     this.getUserDataList();

  
   
 }


  // Customizable Area End
}
