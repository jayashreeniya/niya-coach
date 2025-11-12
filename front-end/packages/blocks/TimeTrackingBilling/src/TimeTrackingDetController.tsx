import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
export type NavObject = TypeNav
export interface TypeNav {
  addListener: Function
  goBack: Function,
  getParam:Function
}
import { AppContext } from "../../../components/src/context/AppContext";

// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: NavObject;
  screenid: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  TrackingDataList:[],
  limit: number;

  loading:boolean,
  totalCount: number;
  userid:string
  pageNo: number;

  // Customizable Area End
}

interface SS {
  screenid: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class TimeTrackingDetController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getuserTrackingDetailsCallId:string="";
  
   static contextType?= AppContext; 
 
     
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
   
       // Customizable Area End
    ];
  // Customizable Area End
    this.state = {
     // Customizable Area Start
      loading:true,
      TrackingDataList:[],
      userid:"",
      pageNo:0,
      limit:12,
      totalCount:0,
      // Customizable Area End
    };
   
    // Customizable Area Start
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area End
  }

  // Customizable Area Start
  async componentDidMount() {
      this.getUserDataList();

  
  }

  async receive(from: string, message: Message) {
   
    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const responseJsonData = message.getData(
          getName(MessageEnum.RestAPIResponceSuccessMessage)
        );
   
       
          this.setState({ loading: false });
          const apiCallId = message.getData(
            getName(MessageEnum.RestAPIResponceDataMessage)
          );
       
          this.setState({loading:false});
           if(apiCallId === this.getuserTrackingDetailsCallId){
            let resData=responseJsonData?.data;
            let resData_cnt=responseJsonData?.count
            let track_detailData=[...this.state.TrackingDataList, ...resData] || [];
          
            if(resData){
              this.setState(prevpage => ({
                totalCount :resData_cnt ,
                TrackingDataList: (prevpage.pageNo === 0)?
                resData :
                track_detailData,
                  loading:false
    
              }));
            
            }
        
        
           }

      }
    // Customizable Area End
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

  getUserDataList = async (currentPageNo ?:number) => {
  const userid= this.props.navigation.getParam('userid');   
  const header = {
      contentType: "application/json",
      token: this?.context?.state?.token
    };
   
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    const rawdata = {
      account_id: userid,
      limit: `${this.state.limit}`,
      page: `${currentPageNo || this.state.pageNo}`

    };
    let urlParams = new URLSearchParams(rawdata).toString();
  
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

  
    this.getuserTrackingDetailsCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `bx_block_time_tracking_billing/summary_tracks/month_wise_record?${urlParams}`
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      'GET'
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

  }; 
  // Customizable Area End
}
