import { Dispatch } from "react";

import { set_user_data } from "./actions";

export interface AppState {
  auth: boolean;
  id: string;
  name: string;
  email: string;
  mobile: string;
  token: string;
  role: string;
  navigationLocation: string;
  isNew: boolean;
  isshowReass:boolean;
}

export type AppAction = {
  type: typeof set_user_data;
  payload: {
    auth?: boolean;
    id?: string;
    name?: string;
    email?: string;
    mobile?: string;
    token?: string;
    role?: string;
    navigationLocation?: string;
    isNew: boolean;
    isshowReass:boolean;
  }
}

export type AppContext = {
  state: AppState
  dispatch: Dispatch<AppAction>;
  refresh: () => void;
}