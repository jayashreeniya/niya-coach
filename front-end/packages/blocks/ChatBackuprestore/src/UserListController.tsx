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
  getParam: Function,
  navigate: Function
}
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: NavObject;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  DataList: [],
  pageNo: number,
  limit: number,
  totalCount: number
  loading: boolean

  // Customizable Area End
}

interface SS {
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class UserListController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  static contextType?= AppContext;

  getuserlistApiCallId: string = "";
  getChatBackupApiCallId: string = "";
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
      totalCount: 0,
      DataList: [],
      limit: 11,
      loading: false,
      pageNo: 0,

      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }



  // Customizable Area Start
  networkRequestcall = ({
    endPoint,
    method,
    headers,
    body,
    newState
  }: {
    endPoint: string;
    headers?: Record<string, string>;
    body?: Record<string, object>;
    method: "GET" | "POST" | "PUT" | "DELETE";
    newState?: Partial<S>;
  }) => {
    if (typeof newState === "object") {
      this.setState(prev => ({ ...prev, ...newState }));
    }
    const defaultHeaders = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.context?.state?.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );


    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );


    if (body) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      );
    }
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers || defaultHeaders)
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


      this.setState({ loading: false });
      if (apiRequestCallId === this.getuserlistApiCallId) {
        let userRes = responseJson.data;
        let user_cnt = responseJson.count;
        let user_data = [...this.state.DataList, ...userRes] || [];
        if (userRes) {
          this.setState(prev => ({
            totalCount: user_cnt,
            DataList: (prev.pageNo === 0) ?
              userRes :
              user_data,
            loading: false


          }));

        }
        else {
          this.showAlert("Error", "Something went wrong")
        }
      }   
      else if (apiRequestCallId === this.getChatBackupApiCallId) {
        alert("Backup Complete")
    }


    }
    // Customizable Area End
  }

  chatBackupApi = async () => {
    this.getChatBackupApiCallId = this.networkRequestcall({
      endPoint: `bx_block_chatbackuprestore/chat_backup_restores/chat_backup`,
      method: "GET",

      newState: { loading: true }
    });
  }


  getUserList = async (currentPageNo?: number) => {
    let strBody = {
      limit: `${this.state.limit}`,
      page: `${currentPageNo || this.state.pageNo}`
    }
    let urlParams = new URLSearchParams(strBody).toString();

    this.getuserlistApiCallId = this.networkRequestcall({
      endPoint: `bx_block_chatbackuprestore/chat_backup_restores/participant_list?${urlParams}`,
      method: "POST",

      newState: { loading: true }
    });
  };

  async componentDidMount() {

    this.getUserList();


  }

  fetchMoreData = () => {
    if (
      (this.state.pageNo >= Math.floor(this.state.totalCount / this.state.limit)) ||
      this.state.loading
    ) {
      return;
    }
    this.setState(prevState => ({
      pageNo: prevState.pageNo + 1
    }), () => this.getUserList());
  }


  

 

  // Customizable Area End
}
