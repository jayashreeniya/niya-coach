// @ts-nocheck
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
    getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import ImagePicker from 'react-native-image-crop-picker';

import {PasswordInVisible, PasswordVisible } from "./assets";
import AsyncStorgae from "@react-native-async-storage/async-storage";
import { set_user_data } from "../../../components/src/context/actions";
import { initState } from "../../../components/src/context/appContextReducer";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";

// Customizable Area End

export const configJSON = require("./config");

export interface Props {
    navigation: any;
    id: string;
    // Customizable Area Start
    // Customizable Area End
}

interface S {
    // Customizable Area Start
    prifileimage: any;
    full_name: string;
    loading: boolean;
    token: string;
    user_image: any;
    DataList: [];

    email: string;
  
    country_code: string;
    phone_number: any;
    isData: boolean;
    image:any;
    data: any;
    categoriesArray: any;
    selectedCategoryID: any;
    coach_full_name: string;
  
    coach_email: any;
    enablePasswordField: boolean;
    password: string;
    reTypePassword: string;
    enableReTypePasswordField: boolean;
    coach_id:any;
    usertype:any;
    // Customizable Area End
}

interface SS {
    id: any;
    // Customizable Area Start
    // Customizable Area End
}

export default class AddNewCoachController extends BlockComponent<
    Props,
    S,
    SS
> {
    // Customizable Area Start
    drawerRef: any = null;
    static contextType?: Context<any>= AppContext;
    getuserDetailsApiCallId: string = "";
    getCountApiCallId: string = "";
    getEmployeesApiCallId: string = "";
    getCoachExpertiseApiCallId: string = "";
    addNewCoachApiCallId: string = "";
    getCoachDetailApiCallId: string = "";
    devicetokenApiCallId: string = "";
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
            getName(MessageEnum.SessionSaveMessage),

            // Customizable Area End
        ];

        this.state = {
            // Customizable Area Start
            prifileimage: "",
            user_image:"",
            full_name: "",
            loading: false,
            token: "",
            image: '',

            DataList: [],

            email: "",
         
            country_code: "91",
            phone_number: "",
            isData: false,

            data: [],
            categoriesArray: [],

            selectedCategoryID: [],
            coach_full_name: "",
            coach_email: "",
            password: "",
            enablePasswordField: true,
            reTypePassword: "",
            enableReTypePasswordField: true,
            coach_id: '',
            usertype:''
            // Customizable Area End
        };
        runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

        // Customizable Area Start
        // Customizable Area End
    }

    async receive(from: string, message: Message) {


        // Customizable Area Start
        if (getName(MessageEnum.SessionResponseMessage) === message.id) {
            this.setState({ token: this.context.state.token, loading: true }, () => {
                this.getUserDataList();
                this.getAllExpertiseDataList();
                this.getCoachDetails();

            });

        }
        else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
            const responseJson = message.getData(
                getName(MessageEnum.RestAPIResponceSuccessMessage)
            );
            const apiRequestCallId = message.getData(
                getName(MessageEnum.RestAPIResponceDataMessage)
            );
            const errorReponse = message.getData(
                getName(MessageEnum.RestAPIResponceErrorMessage)
            );
            if (errorReponse) {
                this.showAlert("Alert", errorReponse, "");
                   
                }
                else if(responseJson?.errors || responseJson?.message)
              {
                 this.handleError(responseJson);
              }

            if (responseJson) {

                this.setState({ loading: false });


                //Comapny Details
                if (apiRequestCallId === this.getuserDetailsApiCallId) {                    
                    console.log(responseJson,"user profiles");
                    this.setState({
                        user_image: responseJson?.data.attributes?.image,
                        full_name: responseJson?.data.attributes?.full_name,

                    });
                    
                }
            // add new coach
                if (apiRequestCallId === this.addNewCoachApiCallId) {
                    console.log(responseJson ,"//////");                   
                    console.log(responseJson);
                    this.props.navigation.navigate('CoachList',{usertype:"Coaches"});                    
                }

                if (apiRequestCallId === this.getCoachExpertiseApiCallId) {                   
                        this.setState({
                            data: responseJson?.data,

                        });                    
                }

            }
            // coach details


            if(apiRequestCallId === this.getCoachDetailApiCallId){               
                let ids = [...this.state.selectedCategoryID];
                let categories = [...this.state.categoriesArray];

                responseJson?.data?.attributes?.coach_details?.expertise?.map((expert:any)=>{
                   
                    if (ids.includes(expert.id)) {
                        ids = ids.filter((_id) => _id !== expert.id);
                        categories = categories.filter((_id) => _id.id !== expert.id);
            
                    } else {
                        ids.push(expert.id);
                        categories.push(expert);
                    }
                    this.setState({ selectedCategoryID: ids, categoriesArray: categories });

                })
               let number=responseJson?.data?.attributes?.coach_details?.full_phone_number;
               this.setState({
                coach_full_name:responseJson?.data?.attributes?.coach_details?.full_name,
                coach_email:responseJson?.data?.attributes?.coach_details?.email,
                phone_number:number.slice(2),
                loading: false
               });
             
           }
        }
        // Customizable Area End
    }



    // Customizable Area Start


    handleError=(responseJson:any)=>{
        this.showAlert(
          configJSON.errorTitle,
          responseJson?.errors ? responseJson?.errors[0] : responseJson?.message,
        );                    
      
      return false;
      }

    networkRequest = ({
        endPoint,
        method,
        headers,
        body,
        newState
    }: {
        endPoint: string;
        headers?: Record<string, string>;
        body?: Record<string, any>;
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
            getName(MessageEnum.RestAPIRequestHeaderMessage),
            JSON.stringify(headers || defaultHeaders)
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            endPoint
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

    logOut = async () => {
        await AsyncStorgae.removeItem("fcmToken");
        this.saveFcmTOken(this.context.state.token);
  
        setTimeout(() => {
            this.context?.dispatch?.({ type: set_user_data, payload: initState });
        }, 500);
    }

    saveFcmTOken=async(token:any)=> {
   
        let fcmtoken=await AsyncStorgae.getItem('fcmToken');
        console.log("fcm token",fcmtoken)
       
        const attrs = {
          device_token:fcmtoken
        };
    
       
        this.devicetokenApiCallId = this.networkRequest({
          endPoint: "bx_block_push_notifications/device_token",
          method: "POST",
          body:attrs,
          newState: { loading: true }
        });
      }
    getUserDataList = async () => {
        this.getuserDetailsApiCallId = this.networkRequest({
            endPoint: "profile_details",
            method: "GET",
            newState: { loading: true }
        });
    };



    getAllExpertiseDataList = () => {
      
        this.getCoachExpertiseApiCallId = this.networkRequest({
            endPoint: "bx_block_companies/coach_expertise",
            method: "GET",
            newState: { loading: true }
        });
    };

    async componentDidMount() {

        super.componentDidMount();
        this.setState({coach_id:this.props.navigation.getParam("id"), usertype:this.props.navigation.getParam("usertype")});
        this.getFocusOn();
        this.getCoachDetails();


    }

    getToken = () => {
        const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
        this.send(msg);
    }
    getFocusOn = () => {
        if (this.isPlatformWeb() === false) {


            this.props.navigation.addListener('willFocus', () => {
                console.log("Will focues ")
                this.getToken();
            });

        }
    }

    clickCategory = (item: any, Index: number) => {
        let ids = [...this.state.selectedCategoryID];
        let categories = [...this.state.categoriesArray];

        if (ids.includes(item.id)) {
            ids = ids.filter((_id) => _id !== item.id);
            categories = categories.filter((_id) => _id.id !== item.id);

        } else {
            ids.push(item.id);
            categories.push(item);
        }

        this.setState({ selectedCategoryID: ids, categoriesArray: categories });

    };
    apiCall = async (data: any) => {
        // Customizable Area Start
        const { contentType, method, endPoint, body, type } = data
        const header = {
            'Content-Type': contentType,
            token: this.context.state.token
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
        console.log('hgdscfyhavdydfye', requestMessage)
        return requestMessage.messageId;
        // Customizable Area End
    };


    btnPasswordShowHideProps = {
        onPress: () => {
            this.setState({ enablePasswordField: !this.state.enablePasswordField });
            this.txtInputPasswordProps.secureTextEntry = !this.state
                .enablePasswordField;
            this.imgEnablePasswordFieldProps.source = this.txtInputPasswordProps
                .secureTextEntry
                ? PasswordInVisible
                : PasswordVisible;
        }
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
                ? PasswordInVisible
                : PasswordVisible;
        }
    };

    imgEnablePasswordFieldProps = {
        source: PasswordInVisible
    };
    imgEnableRePasswordFieldProps = {
        source: PasswordInVisible
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

    //   new Coach add
    onPressNewDetailsApiCall=async()=>{
        this.setState({loading:true})
        let formdata1 = new FormData();
        let formdata = new FormData();
        let endPoint;
        let method;
        if (this.state.prifileimage && this.state.prifileimage != '') {
            formdata1.append("image", this.state.prifileimage);
              
        }
       if(this.state.coach_id){
        var commasep = this.state.selectedCategoryID.join(",");
        console.log("=========updating the coach",this.state.coach_id);
        formdata1.append("account[id]", this.state.coach_id);
      
        formdata1.append("account[full_name]", this.state.coach_full_name);
        formdata1.append("account[full_phone_number]",`${'91'}${this.state.phone_number}` );
        formdata1.append("account[expertise]",commasep);
        method= "PUT";
        endPoint= 'bx_block_admin/update_coach';
       }
       else{
        
        formdata1.append("account[type]", "email_account");
        formdata1.append("account[full_name]", this.state.coach_full_name)
        formdata1.append("account[email]", this.state.coach_email)
        formdata1.append("account[full_phone_number]", `${'91'}${this.state.phone_number}`)

        formdata1.append("account[password]", this.state.password);
        formdata1.append("account[password_confirmation]", this.state.reTypePassword);
        formdata1.append("account[expertise]", JSON.stringify(this.state.selectedCategoryID));

       
        endPoint= 'bx_block_admin/create_coach';
        method= 'POST';

       }
        this.addNewCoachApiCallId = await this.apiCall({
            contentType: "multipart/form-data",
            method: method,
            endPoint: endPoint,
            body: formdata1,
            type: 'formData'
        });
   
    }
    // ============== NEW PASSWORD ============
    onPressNewDetails = async () => {
        const pattern =/^[a-z0-9._%-]+@[a-z0-9.-]+.[a-z]{2,4}$/;
        const emailReg = new RegExp(pattern);
       
        if (this.state.coach_full_name === '') {
            alert('please enter your Full name')
            return
        }

        if (!emailReg.test(this.state.coach_email.trim())&&this.state.coach_id=="") {
            this.showAlert('Alert', 'Please enter valid Email Address')
            return;
        }

        if (this.state.password === ''&&this.state.coach_id=="") {
            alert('please enter your Password')
        }
        if (this.state.reTypePassword === ''&&this.state.coach_id=="") {
            alert('please enter renter Password')
        }
        if (this.state.phone_number === '') {
            alert('Please enter your mobile number')
        }
        if (this.state.selectedCategoryID.length === 0) {
            alert('Please select Expertise ')
        }
        else {
            this.onPressNewDetailsApiCall()
            }
    }
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
    getCoachDetails =  () => {
    
        const id = this.state.coach_id;
        console.log("insdie the Add New coach get comapny details Apis",id);
      
        var raw = {
            id: id
          };
          
        if(id){
        let urlParams = new URLSearchParams(raw).toString();
         this.getCoachDetailApiCallId = this.networkRequest({
          endPoint: `bx_block_admin/get_coach?${urlParams}`,
          method: "GET",
          newState: { loading: true }
        });
      }
      };

    // Customizable Area End
}
