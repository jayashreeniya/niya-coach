import React, { useState,useEffect  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import DatePicker from 'react-date-picker';
import "./calebder.css";
import Select from 'react-select';
import dateFormat from 'dateformat';
// Bootstrap components
import { Button, Card, Col, Alert, Modal} from "react-bootstrap";
import "../../components/login/bootstrap.css";
import Media from "../../components/login/Media";
import Avatar from "../../components/login/Avatar";
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { FaLanguage } from "react-icons/fa6";
// Card styles
import "../../components/login/card.scss";
import CustomPopup2 from "../../components/CustomPopup2";
import axios from "axios";

const Bookappointment = () => {
    let token = localStorage.getItem('accessToken');
    const location = useLocation();
    const navigate = useNavigate();
    const [Focusareas, setFocusareas] = useState([]);
    const [apiloaded, setApiloaded] = useState(false);
    const [value, onChange] = useState(new Date());
    const [selectvalue1, setSelectvalue1] = useState("");
    const [selectvalue2, setSelectvalue2] = useState("");
    const [coachlist, setCoachlist] = useState([]);
   // const [pageloaded, setPageloaded] = useState(false);
    const [selecteddate, setSetdate] = useState("");
    const [hovers, setHovers] = useState(0);
    const [mints, setMints] = useState("00");
    const [visibility, setVisibility] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
   // const BOUNDARY = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
  const setSelectvalue4 = async (e) => {

   const selectedMinute = e.value;
   setMints(selectedMinute);
   setSelectvalue2(selectedMinute);

  }

   const setSelectvalue3 = async (e) => {

     const selectedHour = e.value;
     setHovers(selectedHour);
     setSelectvalue1(selectedHour);
     var date = dateFormat(value, "dd/mm/yyyy");
     console.log("Selected time: " + selectedHour + ":" + selectvalue2 + " on " + date);
     setSetdate(date);
     
     // Send booking_date and start_time as separate parameters
     var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_calendar/booked_slots/view_coach_availability?booking_date="+date+"&start_time="+selectedHour+":00"
      const payload3 = {
           method: "GET",
              headers: {
              'Content-Type': 'application/json;',
              'accept': 'application/json',
              "token": ""+token+"",
              }
                 
              };


              if(token){

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
          
            setCoachlist(data.data);
           
          })
          .catch((error) =>{ console.error("Error:", error.message)
              
 

          }
      );


    }

    }


   
   const handleChange = async (value, e) => {

     onChange(value);
     var date = dateFormat(value, "dd/mm/yyyy");
     console.log("Date selected: " + date + " (Time will be: " + selectvalue1 + ":" + selectvalue2 + ")");
     setSetdate(date);
     var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_calendar/booked_slots/view_coach_availability?booking_date="+date+""
      const payload3 = {
           method: "GET",
              headers: {
              'Content-Type': 'application/json;',
              'accept': 'application/json',
              "token": ""+token+"",
              }
                 
              };


              if(token){

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
          
            setCoachlist(data.data);
           
           
          })
          .catch((error) =>{ console.error("Error:", error.message)
              
 

          }
      );


    }
  }
    const options1 = [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
      { value: '7', label: '7' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
      { value: '10', label: '10' },
      { value: '11', label: '11' },
      { value: '12', label: '12' },
      { value: '13', label: '13' },
      { value: '14', label: '14' },
      { value: '15', label: '15' },
      { value: '16', label: '16' },
      { value: '17', label: '17' },
      { value: '18', label: '18' },
      { value: '19', label: '19' },
      { value: '20', label: '20' },
      { value: '21', label: '21' },
      { value: '22', label: '22' },
      { value: '23', label: '23' } 
    ]
    const options2 = [
      { value: '00', label: '00' },
      { value: '15', label: '15' },
      { value: '30', label: '30' },
      { value: '45', label: '45' }
    ]
   

    useEffect(() => {
        onScreenLoad();
       
    },)

    

   const onScreenLoad = async () => {
       console.log("screen loaded")
      
       var locationd = window.location.search;
       const urlParams = new URLSearchParams(locationd);
       
       let coachbook = localStorage.getItem("coachbooked");
       let justReturnedFromPayment = localStorage.getItem("payment_redirect");
       
       
       if(coachbook === "true"){
       
         // Check if has payment_id OR just returned from payment redirect
         if(urlParams.has('payment_id') === true || justReturnedFromPayment === "true"){
         
         console.log("Payment successful, showing confirmation popup and sending emails");
         
         // Get payment_id from URL
         let paymentId = urlParams.get('payment_id') || 'completed';
         let bookingId = localStorage.getItem("booksloatid");
         
         // Call backend to confirm payment and send emails
         if(bookingId && bookingId > 0) {
           var confirmPaymentUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_calendar/booked_slots/confirm_payment";
           
           fetch(confirmPaymentUrl, {
             method: "POST",
             headers: {
               'Content-Type': 'application/json',
               'token': token
             },
             body: JSON.stringify({
               booked_slot_id: bookingId,
               payment_id: paymentId
             })
           })
           .then(response => response.json())
           .then(data => {
             console.log("Payment confirmed and emails sent:", data);
           })
           .catch(error => {
             console.error("Error confirming payment:", error);
           });
         }
         
         // Show success popup
         setVisibility(true);
         localStorage.setItem("booksloatid", 0);
         localStorage.setItem("coachbooked", false);
         localStorage.removeItem("payment_redirect"); // Clear the flag
         
           
           


         }else{

         setVisibility(false);
         let coachbook = localStorage.getItem("coachbooked");
         console.log("else coachbook "+coachbook);
         if(coachbook === "true"){

         let booksloatids = localStorage.getItem("booksloatid");
         let conames = localStorage.getItem("coachname");

         console.log("booksloatids :"+booksloatids+" "+conames);
         if(booksloatids > 0){

            const formData = new FormData();
            formData.append("booked_slot_id", booksloatids);


            try {
              const response = axios.post(
                  "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_calendar/booked_slots/cancel_booking",
                  formData,
                  {
                      headers: {
                          "accept": "application/json",
                          "token": token, // Token added in headers
                          "Content-Type": "multipart/form-data"
                      }
                  }
              );
      
              console.log("Response  canceling booking :", JSON.stringify(response.data));
          } catch (error) {
              console.error("Error canceling booking:", error);
          }




            var apiBaseUrl33 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_calendar/booked_slots/cancel_booking"
            const payload33 = {
                 method: "POST",
                    headers: {
                    "accept": "application/json",
                    "token": ""+token+""
                    },
                    body: formData
                       
                    };
    
            if(token){
      
              fetch(apiBaseUrl33, payload33)
              .then(async (response) => {
                 
              if (!response.ok) {
              const errorData = await response.json(); // Read error response
              throw new Error(JSON.stringify(errorData)); // Handle errors
              }else if(response.ok){
              console.log("cancel booking suatus: "+response.status)
                if (response.status === 200 || response.status === 201) {
     
                  localStorage.setItem("booksloatid", 0);
                  localStorage.setItem("coachbooked", false);
                  }
          }
          return response.json();
          })
          .then((data) =>{ 
              console.log("Booking cancelled successfully:", JSON.stringify(data));
              // No email sent on cancellation
          })
          .catch((error) =>{ console.error("Error:", error.message)
            console.log(JSON.stringify(error.message));
           // localStorage.setItem("booksloatid", 0);
            //localStorage.setItem("coachbooked", false);
              
              }
            );
          }

          }
        }

        }
      }

        if(apiloaded === false){
        
            console.log("entered in")
        var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/focus_areas"
        const payload3 = {
             method: "POST",
                headers: {
                'Content-Type': 'application/json;',
                'accept': 'application/json',
                "token": ""+token+"",
                }
                   
                };
  
  
                if(token){
  
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
                
                setApiloaded(true);
                const answers = data.data.attributes;
                setFocusareas(answers);
  
            })
            .catch((error) =>{ console.error("Error:", error.message)
               // alert(JSON.stringify(error.message))
                
   
  
            }
        );
    }
        }
    }

    function App() {
        return (
          <div className="App">
            <div className="page-deets">
              
            </div>
      
            {/* Iterate over imported array in userData */}
            <div className="users">
                <h2>Focus Areas You Selected</h2><br></br>
                <ul>
              {Focusareas.assesment_test_type_answers && Focusareas.assesment_test_type_answers.map && Focusareas.assesment_test_type_answers.map((user, index) => (
                
                <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
            
                <div className="col-md-5"><label></label></div><div className="col-md-6" style={{ "textAlign": "left" }}>
               
                <li style={{"marginBottom":10}}> 
                  
                   <span style={{"paddingRight":10}}> *</span><span style={{"fontSize":20}}>{user.answers}</span>
                 
                </li>
                </div>
                </div>
    
              ))}
              </ul>
            </div>
          </div>
        );
      }

      const popupCloseHandler = () => {
        setVisibility(false);
      };

      const bookcoack = async (coachid,coachname) => { 

      if(selecteddate.length === 0){

        alert("please select date");
        return;
      }
          
      
      if(hovers === 0){

            alert("please select time");
            return;
          }
          var splitdate = selecteddate.split("/");
          var dd = splitdate[0];
          var mm = splitdate[1];
          var yy = splitdate[2];
          
          var d1 =  new Date(yy,mm-1,dd,hovers,mints);
          var d2 =  new Date(yy,mm-1,dd,hovers,mints);
          
          //var m = 29;
          var m = 59;
         
          d2.setTime(d1.getTime() + (m * 60 * 1000));
          //alert(d2);
          //alert(d2.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false }));
         
          var endtime = d2.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
          var starttime = hovers+":"+mints;

       // alert(coachid+" "+coachname+" "+hovers+"  "+mints+" "+selecteddate+" "+starttime+" "+endtime);

        var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_calendar/booked_slots"
        const payload3 = {
             method: "POST",
                headers: {
                'Content-Type': 'application/json;',
                'accept': 'application/json',
                "token": ""+token+"",
                },
                body: JSON.stringify({
                  "start_time": ""+starttime+"",
                  "end_time": ""+endtime+"",
                  "service_provider_id": coachid,
                  "booking_date": ""+selecteddate+"",
                })
                   
                };

        if(token){
  
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
          
          
          console.log(JSON.stringify(data));
          var bookedsloat_id = data.data.id;
         
         localStorage.setItem("coachname", ''+coachname+' on '+ selecteddate +' '+starttime+' to '+endtime+'.');
         localStorage.setItem("coachbooked", true);
         localStorage.setItem("booksloatid", bookedsloat_id);
         localStorage.setItem("onlycoachname", coachname);
         localStorage.setItem("selecteddate", selecteddate);
         localStorage.setItem("starttime", starttime);
         localStorage.setItem("endtime", endtime);
         localStorage.setItem("payment_redirect", "true"); // Flag that we're going to payment

        window.location.href="https://razorpay.com/payment-button/pl_PlfPpsIDwS9SkD/view/?utm_source=payment_button&utm_medium=button&utm_campaign=payment_button";
          

          
      })
      .catch((error) =>{ 
           console.error("Booking Error:", error.message);
           
           localStorage.setItem("coachbooked", false);
					localStorage.setItem("booksloatid", 0);
       
       try {
         const jsonObject = JSON.parse(error.message);
         console.log("Error details:", jsonObject);
         const keyName = "errors";
         var mes1 = JSON.stringify(jsonObject[keyName]);
         
         if (mes1 && mes1.includes("[")) {
           if (mes1.includes("booking_date")) {
             alert(jsonObject.errors[0].booking_date);
           } else {
             alert("Something went wrong. Please try again.")
           }
         } else if (jsonObject.errors) {
           alert(jsonObject.errors);
         } else {
           alert("Failed to book appointment. Please check the date/time and try again.");
         }
       } catch (parseError) {
         console.error("Error parsing booking error:", parseError);
         alert("Failed to book appointment: " + error.message);
       }
          


          }
        );
      }
     
      }

      function BookCoachSuccess() {
        return (

          <CustomPopup2
          onClose={popupCloseHandler}
          show={visibility}
          title=""
          >
  
            <div class="popupContentDiv" style={{"text-align": "center"}}>
            <p style={{"text-align": "center","fontSize":25}}>Appointment Confirmed</p>
            <span>Confirmed appointment with coach</span><br></br>
            <span id="resmsg">{localStorage.getItem("coachname")}</span><br></br>
            
            <span>Please note : To reschedule your session, you need to cancel the booked session and book the new session. Booked session can only be cancelled 24 hours prior to the scheduled time.</span><br></br>
            <span>For the session with the expert please join the zoom link <a href="https://us06web.zoom.us/j/9774013865" target="_blank" rel="noopener noreferrer" style={{"color":"#0066cc","textDecoration":"underline"}}>https://us06web.zoom.us/j/9774013865</a> at your booked time.</span><br></br>
            <span id="">Thank you.</span><br></br>
            <div class="centBtn">
            
            </div>
            </div>
  
  
        </CustomPopup2>
        );
      }

      function App2() {
        return (
          <div className="App">
            <div className="page-deets">
              
            </div>
      
            {/* Iterate over imported array in userData */}
            <div className="col-md-12" style={{"display":"ruby"}}>
            
           
                  
              {coachlist && coachlist.map && coachlist.map((user, index) => (
                <div className="col-md-5" style={{"paddingLeft":20,"paddingRight":20,"paddingTop":20}}>
                   
                    
                    <Col>
                    <Card className="mb-4">
                    <Card.Body>
                  <Media name={user.attributes.coach_details.full_name} subtitle={user.attributes.coach_details.education}>
                  <Avatar url={user.attributes.coach_details.image} size="80" className="me-3"></Avatar>
                  </Media>
                
                  <div className="specialization scroll scroll2">
                  {user.attributes.coach_details.expertise && user.attributes.coach_details.expertise.map && user.attributes.coach_details.expertise.map((user1, index1) => (
                    <span> {user1.specialization},</span>
                    ))}
                 </div>

                 <div style={{"display":"inline-flex","paddingTop":25}}>
                {(() => {
                      if (user.attributes.coach_details.rating === null || user.attributes.coach_details.rating === "null" || user.attributes.coach_details.rating === "undefined" || user.attributes.coach_details.rating === undefined) {
                      return (
                      <div><FaStar size={20} style={{"marginRight":5,"paddingBottom":3}}/> <span style={{"marginRight":35}}>4.0</span></div>
                      )
        
                    } else {
                      return (
                      <div><FaStar size={20} style={{"marginRight":5,"paddingBottom":3}}/> <span style={{"marginRight":35}}>{user.attributes.coach_details.rating}.0</span></div>
                      )
                    }
                  })()}
      <IoLocationOutline size={20} style={{"marginRight":5}}/><span style={{"marginRight":50}}>{user.attributes.coach_details.city}</span>
      <FaLanguage  size={20} style={{"marginRight":5,"paddingTop":5}}/><span style={{"marginRight":50}}>{user.attributes.coach_details.languages}</span>
   
      </div>      
                <Button className="w-100" variant="primary" type="submit" style={{"marginTop":10,"height":50}} onClick={() => bookcoack(user.attributes.coach_details.id, user.attributes.coach_details.full_name)}>Schedule a call</Button>
                
              </Card.Body>
            </Card>
          </Col>
                 
                
               </div>
    
              ))}
              
            </div>
           
          </div>
        );
      }



    return (
       
        <div style={{"textAlign":"center"}}>
            <img className="img-thumbnail mx-auto d-block" src={Logo} alt="logo" style={{"width":180,"marginTop":50,"backgroundColor":"var(--body-bg)"}}/><br></br><br></br>
      
            <App/><br></br>

            <h2>Book An Appointment</h2><br></br>
            <ul style={{"marginLeft":"44%"}}>
            <li style={{"marginBottom":10}}> 
              <label>
                <input
                  type="radio"
                  name="question1"
                  value="60"
                  checked
                 
                />
                <span style={{"paddingLeft":10}}>Book 60 min</span>
              </label>
            </li>
            </ul>
            <div style={{"marginLeft":70}}>
              <b>Date</b> <b style={{"paddingLeft":100}}>Hour</b> <b style={{"paddingLeft":52}}>Minute</b><br></br>
            </div>
              <div style={{"display":"inline-flex"}}>
            <DatePicker onChange={(value, e) => handleChange(value, e)} selectd value={value} format="dd/MM/yyyy" minDate={new Date()}/>
            <Select className="basic-single" onChange={setSelectvalue1 => {
            setSelectvalue3(setSelectvalue1);
        }} options={options1} defaultValue={options1[0]}/>
            <Select className="basic-single"onChange={setSelectvalue2 => {
            setSelectvalue4(setSelectvalue2); }}options={options2} defaultValue={options2[0]}/>
           
            </div>

            <div>
           
            <App2/>
            </div>

           <BookCoachSuccess/>

       </div>  
           
      

    );
}
export default Bookappointment;