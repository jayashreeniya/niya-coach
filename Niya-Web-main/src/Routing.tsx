import React from "react";
import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import {Login} from "./components/login/Login"

const navigate = (path: string): React.JSX.Element => {
  return <Navigate replace to={path} />;
};

const Routing = (): React.JSX.Element => {

    useNavigate();
    const isUserLoggedIn = true;
    return (
      <Routes>
        <Route element={isUserLoggedIn ? <Outlet /> : navigate("/login")}>
        <Route index element={navigate("/home")} />
         <Route path="/login" element={<Login />} />
          </Route>
      </Routes>
    );
  };
  
  export default Routing;