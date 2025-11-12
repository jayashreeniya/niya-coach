import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import Orientation from "react-native-orientation-locker";
import { AppContext } from "../../../components/src/context/AppContext";
import { Context } from "react";
import { togglePlayer } from "../../../components/src/AudioPlayer";
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
  // Customizable Area Start
  mediaList: any[];
  header: string;
  loading: boolean;
  documentModal: boolean;
  docUrl: string;
  videoModal: boolean;
  videoUrl: string;
  media: {
    nowPlaying: string;
    duration: number;
    progress: number;
  },
  pageNo: number;
  limit: number;
  totalCount: number;
  selectedId:string;
  currentPageNo: number;
  mediaType: string;
  audioList:any[];
  token:string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class AudioLibraryController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getMediaApiCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage)
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      mediaList: [],
      header: "",
      loading: false,
      documentModal: false,
      docUrl: "",
      videoModal: false,
      videoUrl: "",
      media: {
        nowPlaying: "",
        duration: 0,
        progress: 0
      },
      pageNo:1,
      limit: 5,
      totalCount:0,
      selectedId:"",
      mediaType: '',
      audioList:[],
      currentPageNo:0,
      token:'',
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
      let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));

      this.showAlert(
        "Change Value",
        "From: " + this.state.txtSavedValue + " To: " + value
      );

      this.setState({ txtSavedValue: value });
    }

    // Customizable Area Start
   

    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
  
      if(apiRequestCallId === this.getMediaApiCallId){
        if(responseJson && responseJson.data?.length>=1){
           this.setState(prev => ({
            totalCount : responseJson?.data[0].attributes?.count,
            mediaList: (prev.pageNo === 1)?
            responseJson?.data :
              [...this.state.mediaList, ...responseJson?.data] || [],
              loading:false


          }));
  
        }
        else{
          this.setState({loading:false});
        }
       
      }
    
    }
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;

  async componentDidMount(): Promise<void> {
    Orientation.lockToPortrait();
    const mediaType = this.props.navigation.getParam("type");
    this.setState({mediaType:mediaType,token:this.context.state.token}, () => {
      this.getData(this.state.mediaType);
    });
   
  
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }

  restApiCall = ({
    endPoint,
    method,
    headers,
    body,
    newState
  }:{
    endPoint: string;
    headers?: Record<string, string>;
    body?: Record<string, any>;
    method: "GET" | "POST" | "PUT" | "DELETE";
    newState?: Partial<S>;
    
  }) => {
    if(typeof newState === "object"){
      this.setState(prev => ({ ...prev, ...newState }));
    }
   
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    const defaultHeaders = {
      "Content-Type": configJSON.exampleApiContentType,
      token: this.state.token
    };
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
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );
   
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return requestMessage.messageId;
  }

  getMedia = (currentPageNo?: number) => {
    const params = {
      per_page: `${this.state.limit}`,
      page: `${this.state.pageNo}`,
    }
    const urlParams = new URLSearchParams(params).toString();
    
    this.getMediaApiCallId = this.restApiCall({
      endPoint: `audio_list?${urlParams}`,
      method: "POST",
      newState: { loading: true }
      
    });
  }

  getVideos = () => {
      const params = {
        per_page: `${this.state.limit}`,
        page: `${this.state.pageNo}`,
      }
      const urlParams = new URLSearchParams(params).toString();
  
      this.getMediaApiCallId = this.restApiCall({
        endPoint: `video_list?${urlParams}`,
        method: "GET",
        newState: { loading: true }
      });
  }

  getArticles = () => {
    const params = {
      per_page: `${this.state.limit}`,
      page: `${this.state.pageNo}`,
    }
    const urlParams = new URLSearchParams(params).toString();
    
    this.getMediaApiCallId = this.restApiCall({
      endPoint: `artical_list?${urlParams}`,
      method: "GET",
      newState: { loading: true }
    });
  }

  loadMoreArticles = () => {
    this.setState(prevState => ({pageNo: prevState.pageNo + 1}), () => {
      this.getArticles();
    })
  }

  loadMoreAudios = () => {
    if (this.state.loading) return;

    this.setState(prevState => ({pageNo: prevState.pageNo + 1}), () => {
      this.getMedia();
    })
  }

  loadMoreVideos = () => {
    if (this.state.loading) return;

    this.setState(prevState => ({pageNo: prevState.pageNo + 1}), () => {
      this.getVideos();
    })
  }

  handlePagination = (event:Object, value: number) => {
    this.setState({currentPageNo:value});
    this.getMedia(value);
  }

  togglePlayer = async () => {
    const { current, state, State, duration } = await togglePlayer();
    this.setState({
      media: {
        nowPlaying: (state === State.Playing)? `${current}`: "",
        duration,
        progress: 0
      }
    });
  }

  toggleVideo = () => {
    this.setState(prev => ({
      videoModal: !prev.videoModal
    }));
    Orientation.lockToPortrait();
  }

  fetchMoreData = () => {
    if(
      (this.state.pageNo <=Math.floor(this.state.totalCount/this.state.limit)) ||
      this.state.loading
    ){
      return;
    }
    this.setState(prevState => ({
      pageNo: prevState.pageNo + 1
    }), () => this.getMedia());
  }

  getData=(mediaType:string)=> {
    switch(mediaType){
      case "articles":
        this.setState({ header: "Let's read some articles to make yourself feel better." });
        this.getArticles();
        break;
      case "audio":
        this.setState({ header: "Let's listen to some audios to make yourself feel better." });
        this.getMedia();
        break;
      default:
        this.setState({ header: "Let's watch some videos to make yourself feel better." });
        this.getVideos();
    }
  }

  openDoc = (url:string,title:string,fileContent:any) => {
    this.props.navigation.navigate("DocumentViewer", {
      url: url,
      title: title,
      fileContent:fileContent
    });
  }
  // Customizable Area End
}
