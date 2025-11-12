import { set_user_data } from "./actions";
import { AppState, AppAction } from "./types";

export const initState: AppState =  {
  auth: false,
  id: "",
  name: "",
  email: "",
  mobile: "",
  token: "",
  role: "",
  navigationLocation: "",
  isNew: false,
  isshowReass:false
}

export function appContextReducer(state = initState, action: AppAction): AppState{

  
  if(action.type===set_user_data)
  {
    return {
      ...state,
      ...action.payload
    };
  }
  else{
    return state;
  }
  
}