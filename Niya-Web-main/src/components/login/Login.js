import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import CustomPopup from "../../components/CustomPopup";
import Logo from "../../assets/images/niyalogo.png";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import { HiLockClosed } from "react-icons/hi2";
import OtpInput from "react-otp-input";

const Login = (props) => {
  

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [value, setValue] = useState("")
  const [inputFullUsername, setInputFullUsername] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPhonenumber, setInputPhonenumber] = useState("");
  const [inputRPassword, setInputRPassword] = useState("");
  const [inputCRPassword, setInputCRPassword] = useState("");
  const [inputAccesscode, setInputAccesscode] = useState("25YNgADc");
  const [otpsent, setSentOTP] = useState(false);
  const [resetpassword, setResetPassword] = useState(false);
  const [code, setCode] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputNewConfirmationPassword, setInputNewConfirmationPassword] = useState("");

 
  const navigate = useNavigate();

  const [visibility, setVisibility] = useState(false);
  const [visibility2, setVisibility2] = useState(false);
  const [visibility3, setVisibility3] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const [authenticated, setauthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || false)
  );
  //const [loginresponsedata, setLoginResponseData] = useState(null);

  const popupCloseHandler = () => {
    setVisibility(false);
   
  };

  const popupCloseHandler2 = () => {
    setVisibility2(false);
    setVisibility(false);
    window.location.reload();
  };

  const popupCloseHandler3 = () => {
    setVisibility3(false);
    setVisibility2(false);
    setVisibility(false);
    window.location.reload();
  };


  const [show, setShow] = useState(false);
  const [showRegisterStatus, setShowRegisterStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rloading, setRLoading] = useState(false);
  const [status , setStatus ] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(resetpassword);
    console.log(showRegisterStatus);
    await delay(500);
    let Username = inputUsername;
    let Password = inputPassword;
    if (inputUsername.length !== 0 || inputPassword.length !== 0) {
      setIsUserLoggedIn(true);
    
    console.log(isUserLoggedIn+" "+authenticated);
   
    
    var apiBaseUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_login/logins"
    const payload = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;'
        },
        body: JSON.stringify({
          "data": {
           "type": "email_account",
           "attributes": {
             "email": ""+Username+"",
             "password": ""+Password+""
            }
          }
        })
    };
    

    if (inputUsername && inputPassword) {
        fetch(apiBaseUrl, payload)
            .then((response) => {
               console.log(response.status);
              if (response.status === 200) {
                   // alert("Logged In! You'll be redirected on Home")
                    return response.json()
                } else {
                  setLoading(false);
                  return setShow(true);
                    
                }
            }).then((data) => {
              var accestToken = data.meta.token;
              if (accestToken.length > 0) {
             
              setauthenticated(true);
              localStorage.setItem("authenticated", true);
              navigate("/wellbeingquestions");
              setLoading(false);
                localStorage.setItem("accessToken", accestToken);
                
                if (authenticated === true) {
                    console.log(this.props)
                    this.props.onLoginSuccess(data)
                }
              }else{
                setShow(true);
              }
            })
            .catch((err) => console.log(err));
    } else {
      console.log("Cannot be Empty");
    }
    

    }else{
      setShow(true);
    }

    
    
  };
  

 

  let fullname = inputFullUsername;
  let email = inputEmail;
  let phonenumber = inputPhonenumber;
  let regpwd = inputRPassword;
  let conregpwd = inputCRPassword;
  let acccode = inputAccesscode;

  const Register = async (event) => {
   setRLoading(true);

    if(inputFullUsername.length === 0){
        alert('please enter fullname');
        setRLoading(false);
        return false;
      }

      if(inputEmail.length === 0){
        alert('please enter email');
        setRLoading(false);
        return false;
      }

       if(inputPhonenumber.length === 0){
        alert('please enter phonenumber with country code');
        setRLoading(false);
        return false;
      }
      
      if(inputPhonenumber.length <= 10){
        alert('please enter phonenumber with country code');
        setRLoading(false);
        return false;
      }

      if(inputRPassword.length === 0){
        alert('please enter password');
        setRLoading(false);
        return false;
      }
      if(inputCRPassword.length === 0){
        alert('please enter confirmation password');
        setRLoading(false);
        return false;
      }

    if(inputRPassword !== inputCRPassword){
    alert('Password and confirmation Password not matched');
    setRLoading(false);
        return false;
    }

    if(inputFullUsername.length !== 0 && inputEmail.length !== 0 && inputPhonenumber.length !== 0 && inputRPassword.length !== 0 && inputCRPassword.length !== 0 && inputAccesscode.length !== 0){

     



      var apiBaseUrl2 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/account_block/accounts"
    const payload2 = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;',
            'accept': 'application/json'
        },
        body: JSON.stringify({
          "data": {
            "type": "email_account",
            "attributes": {
              "full_name": ""+fullname+"",
              "email": ""+email+"",
              "full_phone_number": ""+phonenumber+"",
              "password": ""+regpwd+"",
              "password_confirmation": ""+conregpwd+"",
              "access_code": ""+acccode+""
            }
          }
        })
    };
    

    if(inputFullUsername && inputEmail && inputPhonenumber && inputRPassword && inputCRPassword && inputAccesscode){

        fetch(apiBaseUrl2, payload2)
        .then(async (response) => {
                
                if (!response.ok) {
                  const errorData = await response.json(); // Read error response
                  throw new Error(JSON.stringify(errorData)); // Handle errors
                }else if(response.ok){
                  if (response.status === 200 || response.status === 201) {
                    alert("Registred Successfully...Please Login");
                    setStatus("Registred Successfully...Please Login");
                    navigate("/");
                    window.location.reload();
                  }
                }
                return response.json();
              })
              .then((data) => console.log("Success:", data))
              .catch((error) =>{ console.error("Error:", error.message)
            
                const jsonObject = JSON.parse(error.message);
                const keyName = "errors";
                var mes1 = JSON.stringify(jsonObject[keyName]);
              
                if (mes1.includes("[")) {
                 
                  alert(jsonObject.errors[0].account);
                setRLoading(false);
                } else {
                  if (mes1.includes("Password")) {
                 alert(jsonObject.errors.Password);
                 setRLoading(false);
                  }
                  if (mes1.includes("full_phone_number")) {
                    alert(jsonObject.errors.full_phone_number);
                    setRLoading(false);
                     }
                }
               
               
                
              }
            
            );
    
          }
    }
  };


  const GETOTP = async (event) => {

      if(value.length === 0){
        alert("please enter phone number")
        return false;
     }
      var pnumber = value.replace("+","");
      
      if(pnumber.length < 10){
       alert("please enter valid phonenumber")
       return false;
      }

      var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_forgot_password/otps"
      const payload3 = {
          method: "POST",
          headers: {
              'Content-Type': 'application/json;',
              'accept': 'application/json'
          },
          body: JSON.stringify({
            "full_phone_number": ""+pnumber+""
          })
      };
      
 
      if(pnumber){
  
          fetch(apiBaseUrl3, payload3)
          .then(async (response) => {
            
            if (!response.ok) {
              const errorData = await response.json(); // Read error response
              throw new Error(JSON.stringify(errorData)); // Handle errors
            }else if(response.ok){
              if (response.status === 200 || response.status === 201) {
                
                
                
              }
            }
            return response.json();
          })
          .then((data) =>{ 
          
            var otptoken = data.meta.token;
            localStorage.setItem("otptoken", otptoken);
            setSentOTP(true);
          })
          .catch((error) =>{ console.error("Error:", error.message)
          
            const jsonObject = JSON.parse(error.message);
            const keyName = "errors";
            var mes1 = JSON.stringify(jsonObject[keyName]);
            setSentOTP(false);
            if (mes1.includes("[")) {
              if (mes1.includes("full_phone_number")) {
              alert(jsonObject.errors[0].full_phone_number);
              }else if (mes1.includes("account")) {
                alert(jsonObject.errors[0].account);
              }
            } else {
              
              alert(jsonObject.errors);
              
              }
            
          }
        );
      } 
    
  };
  const handleChange = (code) => setCode(code);

  const VERIFYTOTP = async (event) => {

    if(code.length < 6){
      alert("please enter 6 degit code")
      return;
    }
    let otptoken = localStorage.getItem('otptoken');


    var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_forgot_password/otp_confirmations"
    const payload3 = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;',
            'accept': 'application/json'
        },
        body: JSON.stringify({
          "otp": ""+code+"",
          "token": ""+otptoken+"",
        })
    };
    

    if(code && otptoken){
  
      fetch(apiBaseUrl3, payload3)
      .then(async (response) => {
        
        if (!response.ok) {
          const errorData = await response.json(); // Read error response
          throw new Error(JSON.stringify(errorData)); // Handle errors
        }else if(response.ok){
          if (response.status === 200 || response.status === 201) {
            
            setResetPassword(true);
            setVisibility3(true);
          }
        }
        return response.json();
      })
      .then((data) =>{ 
        setResetPassword(true);
        setVisibility3(true);
        
      })
      .catch((error) =>{ console.error("Error:", error.message)
      
       alert("invalid otp");
      
      }
    );
  } 

    
  } 
  const SUBMITRESETPASSWORD = async (event) => {

  if(inputNewPassword.length === 0){
    alert("please enter new password");
    return;
  }

  if(inputNewConfirmationPassword.length === 0){
    alert("please enter new confirmation password");
    return;
  }


  let otptoken = localStorage.getItem('otptoken');


  var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_forgot_password/forgot_password"
  const payload3 = {
      method: "POST",
      headers: {
          'Content-Type': 'application/json;',
          'accept': 'application/json'
      },
      body: JSON.stringify({
        "token": ""+otptoken+"",
        "new_password": ""+inputNewPassword+"",
        "confirm_password": ""+inputNewConfirmationPassword+""
      })
  };
  

  if(code && otptoken && inputNewPassword && inputNewConfirmationPassword){

    fetch(apiBaseUrl3, payload3)
    .then(async (response) => {
      
      if (!response.ok) {
        const errorData = await response.json(); // Read error response
        throw new Error(JSON.stringify(errorData)); // Handle errors
      }else if(response.ok){
        if (response.status === 200 || response.status === 201) {
          alert("Password Updated Successfully...Please Login");
         
          navigate("/");
          window.location.reload();
          
        }
      }
      return response.json();
    })
    .then((data) =>{ 
      alert("Password Updated Successfully...Please Login");
         
      navigate("/");
      window.location.reload();
      
    })
    .catch((error) =>{ console.error("Error:", error.message)
    
      const jsonObject = JSON.parse(error.message);
            const keyName = "errors";
            var mes1 = JSON.stringify(jsonObject[keyName]);
            setSentOTP(false);
            if (mes1.includes("[")) {
              if (mes1.includes("full_phone_number")) {
              alert(jsonObject.errors[0].full_phone_number);
              }else if (mes1.includes("account")) {
                alert(jsonObject.errors[0].account);
              }else{
                alert("Something went wrong please validate otp.")
              }
            } else {
              
              alert(jsonObject.errors);
              
              }
      
    }
  );
  }  


  }


  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className="sign-in__wrapper">
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded main login-page" onSubmit={handleSubmit}>
        {/* Header */}
        <img
          className="img-thumbnail mx-auto d-block"
          src={Logo}
          alt="logo"
        />
        <div className="h4 text-center">Login</div>
        {/* ALert */}
        {show ? (
          <Alert onClose={() => setShow(false)}>
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}
        
        <Form.Group  controlId="username">
          <Form.Label className="Label">Email:</Form.Label>
          <Form.Control className="mb-2"
            type="text"
            value={inputUsername}
            placeholder="Enter your Email"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group  controlId="password">
          <Form.Label className="Label">Password:</Form.Label>
          <Form.Control className="mb-2"
            type="password"
            value={inputPassword}
            placeholder="Enter your Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
       
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        <div className="" style={{"marginTop":10}}>
        <span className="forgetpwdregister" onClick={() => setVisibility2(true)}>Forgot password?|</span>
        <span className="forgetpwdregister" onClick={() => setVisibility(true)}>Register</span>
       
        </div>
      </Form>
      {/* Footer */}
      
      <CustomPopup
        onClose={popupCloseHandler}
        show={visibility}
        title=""
      >
       
         <img className="img-thumbnail mx-auto d-block" src={Logo} alt="logo" style={{"width": "110px",  "marginLeft": "32%"}} />
         {showRegisterStatus ? (
          <Alert onClose={() => setShowRegisterStatus(false)}>
           <span>{ status }</span>
          </Alert>
        ) : (
          <div />
        )}
         <Form.Group  controlId="fullusername">
          <Form.Control className="mb-2"
            type="text"
            value={inputFullUsername}
            placeholder="FullName"
            onChange={(e) => setInputFullUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group  controlId="emailaddress">
          <Form.Control className="mb-2"
            type="Email"
            value={inputEmail}
            placeholder="email"
            onChange={(e) => setInputEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group  controlId="phonenumber">
          <Form.Control className="mb-2"
            type="phonenumber"
            value={inputPhonenumber}
            placeholder="Full Phonenumber (ex: 919169817869)"
            onChange={(e) => setInputPhonenumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group  controlId="rpassword">
          <Form.Control className="mb-2"
            type="password"
            value={inputRPassword}
            placeholder="Password"
            onChange={(e) => setInputRPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group  controlId="crpassword">
          <Form.Control className="mb-2"
            type="password"
            value={inputCRPassword}
            placeholder="Confirmation Password"
            onChange={(e) => setInputCRPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group  controlId="accesscode">
          <Form.Control className="mb-2"
            type="text"
            value={inputAccesscode}
            placeholder="25YNgADc"
            onChange={(e) => setInputAccesscode(e.target.value)}
            readOnly
            required
          />
        </Form.Group>

        {!rloading ? (
          <Button className="" variant="primary" type="submit" style={{"width":200,"marginLeft":"30%"}} onClick={Register}>
            Register
          </Button>
        ) : (
          <Button className="" variant="primary" type="submit" style={{"width":200,"marginLeft":"30%"}} disabled>
            Register In...
          </Button>
        )}
       
      </CustomPopup>
      

<CustomPopup
        onClose={popupCloseHandler2}
        show={visibility2}
        title=""
      >
        

        {!otpsent ? (
         <div style={{"textAlign":"center"}}>
    <HiLockClosed size={100} /><br></br>
    <b style={{"fontSize":"30px","fontFamily":"Source Sans Pro, sans-serif;"}}>Forgot Password?</b><br></br><br></br>
    <span style={{"fontFamily":"Source Sans Pro, sans-serif;"}}>You can reset your password here.</span>
    <PhoneInput
      placeholder="Enter phone number"
      defaultCountry="IN"
      value={value}
      onChange={setValue}/>
  
  <Button className="" variant="primary" style={{"width":"50%","marginLeft":30,"marginTop":20,"marginBottom":20}} type="submit" onClick={GETOTP}>
  Reset Password
          </Button>
</div>
      ) : (
    
        <div style={{"backgroundColor":"#f3f3f3","paddingLeft":65,"paddingTop":25}}>
  
      <OtpInput
      value={code}
      onChange={handleChange}
      numInputs={6}
      renderSeparator={<span style={{ width: "8px" }}></span>}
      renderInput={(props) => <input {...props} />}
      inputStyle={{
        border: "1px solid transparent",
        borderRadius: "8px",
        width: "54px",
        height: "54px",
        fontSize: "12px",
        color: "#000",
        fontWeight: "400",
        caretColor: "blue",
        textAlign:"center"
      
      }}
      focusStyle={{
        border: "1px solid #CFD3DB",
        outline: "none",
        textAlign:"center"
      }}
      
    />

<Button className="" variant="primary" style={{"width":"50%","marginLeft":70,"marginTop":20,"marginBottom":20}} type="submit" onClick={VERIFYTOTP}>
 Verify OTP
          </Button>
      </div>
    

  )}
      </CustomPopup>


      <CustomPopup
        onClose={popupCloseHandler3}
        show={visibility3}
        title=""
      >

<div style={{"textAlign":"center"}}>
    <HiLockClosed size={100} /><br></br>
    <b style={{"fontSize":"30px","fontFamily":"Source Sans Pro, sans-serif;"}}>You can reset your password here.</b><br></br><br></br>
    
          <Form.Group  controlId="newpasssword">
          <Form.Control className="rmb-2"
            type="text"
            value={inputNewPassword}
            placeholder="new password"
            onChange={(e) => setInputNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group  controlId="newconfirmationpasssword">
          <Form.Control className="rmb-2"
            type="text"
            value={inputNewConfirmationPassword}
            placeholder="new confirmation password"
            onChange={(e) => setInputNewConfirmationPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button className="" variant="primary" style={{"width":"50%","marginLeft":40,"marginTop":20,"marginBottom":20}} type="submit" onClick={SUBMITRESETPASSWORD}>
         Reset Password
          </Button>
        </div>

      </CustomPopup>

    </div>
  );
};

export default Login;
