import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { AppContext } from "../../../components/src/context/AppContext";
export type NavigationObject = TypeNav
export interface TypeNav {
  goBack: Function
  getParam: Function
}



// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: NavigationObject;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  sender: string;
  receiver: string;
  loading: boolean;
  chatServiceId: string;
  newMessage: string;
  messages: [];
  userid: string;
  DataList: [],
  pageNo: number,
  limit: number,
  totalCount: number,
  displayChat: string,
  chatLoader: boolean,
  chatUserNm: string
  // Customizable Area End
}

interface SS {
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class ChatBackuprestoreController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getchatreqApiCallId: string = "";
  getconversationApicallID: string = "";
  deliverMsgApiCallId: string = "";
  getuserlistApiCallId: string = "";
  getChatBackupApiCallId: string = "";

  static contextType?= AppContext;


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
      newMessage: "",
      messages: [],
      loading: false,
      userid: "",
      sender: "",
      receiver: "",
      chatServiceId: "",
      totalCount: 0,
      DataList: [],
      limit: 12,
      pageNo: 0,
      displayChat: "",
      chatLoader: true,
      chatUserNm: ""
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );


    this.setState({ loading: false });

    if (apiRequestCallId === this.getchatreqApiCallId) {

      if (responseJson?.data) {
        this.setState({ sender: responseJson?.data?.current_user, receiver: responseJson?.data?.requested_user, chatServiceId: responseJson?.data?.room_id }, () => {
          this.getMessages();
        });
      }

    }
    else if (apiRequestCallId === this.getuserlistApiCallId) {
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
    else {
      this.chatApiHandling(message);
    }

    // Customizable Area End
  }

  // Customizable Area Start
  chatApiHandling = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );
    if (apiRequestCallId === this.getconversationApicallID) {
      this.setState({
        chatLoader: false
      })
      if (responseJson?.data) {

        this.setState({ messages: responseJson?.data, loading: false, chatLoader: false });
      }

    }
    else if (apiRequestCallId === this.deliverMsgApiCallId) {
      if (responseJson) {
        this.setState({ loading: true, newMessage: "", chatLoader: true }, () => {
          this.getMessages();
        });
      }
    }
    else if (apiRequestCallId === this.getChatBackupApiCallId) {
      this.setState({ chatLoader: false });
      alert("Backup Complete")

    }
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


  showDisplayChat = (userName: string, ChatID: string) => {
    this.setState({
      displayChat: userName
    })
    this.createChatRequest(ChatID)
  }

  getUserList = async (currentPageNo?: number) => {
    let strBody = {
      limit: `${this.state.limit}`,
      page: `${currentPageNo || this.state.pageNo}`
    }
    let urlParams = new URLSearchParams(strBody).toString();

    this.getuserlistApiCallId = this.networkApiRequest({
      endPoint: `bx_block_chatbackuprestore/chat_backup_restores/participant_list?${urlParams}`,
      method: "POST",

      newState: { loading: true }
    });
  };

  networkApiRequest = ({
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


    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    const defaultHeaders = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.context?.state?.token
    };


    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );
    if (typeof newState === "object") {
      this.setState(prev => ({ ...prev, ...newState }));
    }
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers || defaultHeaders)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );
    if (body) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      );
    }
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return requestMessage.messageId;
  }

  getMessages = async () => {

    this.setState({
      chatLoader: true,
      messages: []
    })
    if (this.state.chatServiceId) {
      let apibody = {
        room_id: this.state.chatServiceId
      }
      let urlParamsid = new URLSearchParams(apibody).toString();

      this.getconversationApicallID = this.networkApiRequest({
        endPoint: `bx_block_chatbackuprestore/chat_backup_restores/all_chat_message?${urlParamsid}`,
        method: "GET",
        newState: { loading: true }
      })
    }
  }

  createChatRequest = async (currentUserId?: string) => {
    let par_id = this.props.navigation.getParam('userid');

    if (par_id || currentUserId) {

      let strBody = {
        participant_user_id: `${currentUserId || par_id}`
      }
      let urlParams = new URLSearchParams(strBody).toString();

      this.getchatreqApiCallId = this.networkApiRequest({
        endPoint: `bx_block_chatbackuprestore/chat_backup_restores/chat_request?${urlParams}`,
        method: "POST",

        newState: { loading: true }
      });
    }
  };


  async componentDidMount() {
    this.createChatRequest();
    this.getUserList();
  }


  chatMessagesend = async () => {
    let msgBody = {
      room_id: this.state.chatServiceId,
      message: this.state.newMessage
    }
    let urlmsgParams = new URLSearchParams(msgBody).toString();

    this.deliverMsgApiCallId = this.networkApiRequest({
      endPoint: `bx_block_chatbackuprestore/chat_backup_restores/creating_chat_message?${urlmsgParams}`,
      method: "POST",

      newState: { loading: true }
    });
  }

  chatBackupApi = async () => {
    this.setState({
      chatLoader: true
    })
    this.getChatBackupApiCallId = this.networkApiRequest({
      endPoint: `bx_block_chatbackuprestore/chat_backup_restores/chat_backup`,
      method: "GET",

      newState: { loading: true }
    });
  }


  onMsgChange = (textmsg: string) => {
    this.setState({ newMessage: textmsg });
  }



  // Customizable Area End
}
