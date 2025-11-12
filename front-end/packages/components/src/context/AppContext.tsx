import React, { createContext, Reducer, ReactNode, useContext, useReducer, useEffect, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { set_user_data } from "./actions";
import { appContextReducer, initState } from "./appContextReducer";
import { AppState, AppContext as Context, AppAction } from "./types";

const initContext = {
  state: initState,
  dispatch: () => initState,
  refresh: () => {}
}

interface AppProviderProps {
  children: ReactNode
}

const AppContext = createContext<Context>(initContext);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {

  const [appState, appDispatch] = useReducer<Reducer<AppState, AppAction>>(appContextReducer, initState);
  const mountRef = useRef<boolean>(false);

  function setData(newState: AppState) {
    appDispatch({ type: set_user_data, payload: newState });
  }

  function refresh(){
    setData({ ...appState });
  }

  async function saveState(){
    const dataToSave = JSON.stringify(appState);
    try {
      await AsyncStorage.setItem("user", dataToSave);
      return true;
    } catch(e) {}
    return false;
  }

  async function loadState(){
    const savedData = await AsyncStorage.getItem("user");
    if(savedData){
      const parsedData = JSON.parse(savedData) || initState;
      const {role,auth}=parsedData;
     
      if(auth&&(role==""||role=="employee")){
        const newState = {
          ...parsedData,
            isshowReass:true
         }
         setData(newState);
      }
      else  setData(parsedData);
    } else {
      return initState;
    }
  }

  useEffect(() => {
    if(mountRef.current){
      saveState();
    } else {
      mountRef.current = true;
    }
  }, [appState]);

  useEffect(() => {
    loadState();
  }, []);

  return(
    <AppContext.Provider value={{
      state: appState,
      dispatch: appDispatch,
      refresh
    }}>
      {children}
    </AppContext.Provider>
  );
}

const useAppState = function(){
  return useContext(AppContext).state;
}

const useAppDispatch = function(){
  return useContext(AppContext).dispatch;
}

const useRefresh = function(){
  return useContext(AppContext).refresh;
}

export {
  AppContext,
  AppProvider,
  useAppState,
  useAppDispatch,
  useRefresh
}