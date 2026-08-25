import React, { useState,useEffect,useRef  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import DatePicker from 'react-date-picker';
import "./calebder.css";
import "./myAppointments.css";
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

const RAZORPAY_BUTTON_ID = "pl_TRCE2nX6hdQyB3";

/**
 * Razorpay Payment Button embed. The redirect after payment is configured in the
 * Razorpay dashboard (set to /payment-success), not here.
 * React strips <script> from JSX, so the tag is injected imperatively.
 */
const RazorpayPayButton = ({ buttonId }) => {
  const formRef = useRef(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return undefined;

    form.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", buttonId);
    form.appendChild(script);

    return () => {
      form.innerHTML = "";
    };
  }, [buttonId]);

  return <form ref={formRef} />;
};

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
    const [showPayModal, setShowPayModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState(null);
    const [validatingCoachId, setValidatingCoachId] = useState(null);
   // const BOUNDARY = "----WebKitFormBoundary7MA4YWxkTrZu0gW";

  useEffect(() => {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (role === "coach") {
      navigate("/coach-appointments", { replace: true });
      return;
    }
    const authToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!authToken) {
      navigate("/login", { replace: true, state: { from: "/bookappointment" } });
    }
  }, [navigate]);

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
     var apiBaseUrl3 = "https://niya-backend-oiut.onrender.com/bx_block_calendar/booked_slots/view_coach_availability?booking_date="+date+"&start_time="+selectedHour+":00"
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
     var apiBaseUrl3 = "https://niya-backend-oiut.onrender.com/bx_block_calendar/booked_slots/view_coach_availability?booking_date="+date+""
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
      
        // Check if Razorpay returned with payment success
        // Razorpay adds razorpay_payment_id to URL after successful payment
        let hasPaymentId = urlParams.has('payment_id') || urlParams.has('razorpay_payment_id');
        
        console.log("Checking payment status:", {
          hasPaymentId: hasPaymentId,
          payment_id: urlParams.get('payment_id'),
          razorpay_payment_id: urlParams.get('razorpay_payment_id'),
          justReturnedFromPayment: justReturnedFromPayment
        });
        
        // ONLY show success if payment_id exists in URL (proof of payment)
        if(hasPaymentId){
        
        console.log("✅ Payment successful (payment_id found in URL), showing confirmation popup and sending emails");
        
        // Get payment_id from URL
        let paymentId = urlParams.get('razorpay_payment_id') || urlParams.get('payment_id') || 'completed';
        let bookingId = localStorage.getItem("booksloatid");
         
         // Call backend to confirm payment and send emails
         if(bookingId && bookingId > 0) {
           var confirmPaymentUrl = "https://niya-backend-oiut.onrender.com/bx_block_calendar/booked_slots/confirm_payment";
           
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
        
        // No payment_id in URL
        console.log("❌ No payment_id in URL");
        setVisibility(false);
        
        let coachbook = localStorage.getItem("coachbooked");
        console.log("Checking if we need to cancel booking. coachbook:", coachbook);
        console.log("justReturnedFromPayment:", justReturnedFromPayment);
        
        // If user just returned from payment page but NO payment_id, they didn't pay
        if(coachbook === "true" && justReturnedFromPayment === "true"){
          console.log("🚫 User returned from Razorpay without paying - cancelling booking");
          
          let booksloatids = localStorage.getItem("booksloatid");
          let conames = localStorage.getItem("coachname");

          console.log("Cancelling booking ID:", booksloatids, "for coach:", conames);
          
          if(booksloatids > 0){

            const formData = new FormData();
            formData.append("booked_slot_id", booksloatids);


            try {
              const response = axios.post(
                  "https://niya-backend-oiut.onrender.com/bx_block_calendar/booked_slots/cancel_booking",
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




            var apiBaseUrl33 = "https://niya-backend-oiut.onrender.com/bx_block_calendar/booked_slots/cancel_booking"
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
              console.log("✅ Booking cancelled successfully:", JSON.stringify(data));
              // No email sent on cancellation
              // Clear all flags
              localStorage.removeItem("payment_redirect");
              localStorage.setItem("booksloatid", 0);
              localStorage.setItem("coachbooked", false);
          })
          .catch((error) =>{ 
              console.error("❌ Error cancelling booking:", error.message);
              console.log(JSON.stringify(error.message));
              // Clear flags even if cancel fails
              localStorage.removeItem("payment_redirect");
              localStorage.setItem("booksloatid", 0);
              localStorage.setItem("coachbooked", false);
            }
          );
          
          }  // closes if(token)
          
          // Clear the payment_redirect flag since we handled the cancellation
          localStorage.removeItem("payment_redirect");
          }  // closes if(booksloatids > 0)
        }  // closes if(coachbook && justReturnedFromPayment)

        }  // closes else (no payment_id)
      }  // closes if(coachbook === "true")

        if(apiloaded === false){
        
            console.log("entered in")
        var apiBaseUrl3 = "https://niya-backend-oiut.onrender.com/bx_block_assessmenttest/focus_areas"
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
        navigate("/appointments");
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
          var starttime = String(hovers).padStart(2, "0")+":"+String(mints).padStart(2, "0");

       console.log("🚀 Validating slot before payment...");
       console.log("Coach:", coachid, coachname, "Date:", selecteddate, "Time:", starttime, "-", endtime);

        // Confirm the slot is actually bookable BEFORE charging the customer.
        // A cold backend can take a while to answer, so the button reflects it.
        setValidatingCoachId(coachid);
        try {
          const validateRes = await fetch(
            "https://niya-backend-oiut.onrender.com/bx_block_calendar/booked_slots/validate_slot",
            {
              method: "POST",
              headers: { "Content-Type": "application/json", token: token },
              body: JSON.stringify({
                booked_slot: {
                  service_provider_id: coachid,
                  booking_date: selecteddate,
                  start_time: starttime,
                  end_time: endtime,
                },
              }),
            }
          );
          const validateData = await validateRes.json();
          if (!validateRes.ok || validateData.valid !== true) {
            const errObj = validateData?.errors?.[0] || {};
            const reason =
              errObj.booking_date ||
              errObj.start_time ||
              errObj.end_time ||
              validateData?.message ||
              "This slot is no longer available.";
            alert(reason + " Please pick another time.");
            return;
          }
        } catch (e) {
          console.error("Slot validation failed:", e);
          alert("We couldn't confirm the slot right now. Please try again in a moment.");
          return;
        } finally {
          setValidatingCoachId(null);
        }

        console.log("✅ Slot available - proceeding to payment");

        // Store ALL booking details in localStorage + sessionStorage for payment success page
        // DON'T create booking in database yet - only after payment succeeds!
        localStorage.setItem("coachid", coachid);
        localStorage.setItem("coachname", coachname);
        localStorage.setItem("selecteddate", selecteddate);
        localStorage.setItem("starttime", starttime);
        localStorage.setItem("endtime", endtime);
        localStorage.setItem("payment_redirect", "true");
        sessionStorage.setItem("coachid", coachid);
        sessionStorage.setItem("coachname", coachname);
        sessionStorage.setItem("selecteddate", selecteddate);
        sessionStorage.setItem("starttime", starttime);
        sessionStorage.setItem("endtime", endtime);
        if (token) {
          sessionStorage.setItem("accessToken", token);
          localStorage.setItem("accessToken", token);
          localStorage.setItem("authenticated", "true");
        }
        const role = localStorage.getItem("userRole");
        const userId = localStorage.getItem("userId");
        if (role) sessionStorage.setItem("userRole", role);
        if (userId) sessionStorage.setItem("userId", userId);
        
        console.log("✅ Booking details stored in localStorage");

        setPendingBooking({
          coachname: coachname,
          selecteddate: selecteddate,
          starttime: starttime,
          endtime: endtime,
        });
        setShowPayModal(true);
      }

      const closePayModal = () => {
        setShowPayModal(false);
        setPendingBooking(null);
        localStorage.removeItem("payment_redirect");
      };

      function PayModal() {
        return (
          <Modal show={showPayModal} onHide={closePayModal} centered>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: 20 }}>Confirm and pay</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ textAlign: "center" }}>
              {pendingBooking && (
                <div style={{ marginBottom: 18, lineHeight: 1.7 }}>
                  <div><b>Coach:</b> {pendingBooking.coachname}</div>
                  <div><b>Date:</b> {pendingBooking.selecteddate}</div>
                  <div><b>Time:</b> {pendingBooking.starttime} - {pendingBooking.endtime}</div>
                </div>
              )}
              <p style={{ fontSize: 14, color: "#555" }}>
                Your slot is held while you pay. Complete the payment to confirm the appointment.
              </p>
              <RazorpayPayButton buttonId={RAZORPAY_BUTTON_ID} />
            </Modal.Body>
          </Modal>
        );
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
            <span>At your booked time, open My Appointments at https://book-appointment.niya.app/appointments and tap Connect Now to join the video session with your coach.</span><br></br>
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
                <Button className="w-100" variant="primary" type="submit" style={{"marginTop":10,"height":50}} disabled={validatingCoachId !== null} onClick={() => bookcoack(user.attributes.coach_details.id, user.attributes.coach_details.full_name)}>{validatingCoachId === user.attributes.coach_details.id ? "Checking availability..." : "Schedule a call"}</Button>
                
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
            <header className="appointments-header" style={{ textAlign: "left", marginBottom: 8 }}>
              <img
                className="appointments-logo"
                src={Logo}
                alt="Niya"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
              <nav className="appointments-nav">
                <button type="button" className="nav-link" onClick={() => navigate("/")}>
                  Home
                </button>
                <button type="button" className="nav-link active" onClick={() => navigate("/bookappointment")}>
                  Book Appointment
                </button>
                {!token ? (
                  <button type="button" className="nav-link" onClick={() => navigate("/login", { state: { from: "/bookappointment" } })}>
                    Login
                  </button>
                ) : (
                  <button type="button" className="nav-link" onClick={() => navigate("/appointments")}>
                    My Appointments
                  </button>
                )}
              </nav>
            </header>

            <img className="img-thumbnail mx-auto d-block" src={Logo} alt="logo" style={{"width":180,"marginTop":24,"backgroundColor":"var(--body-bg)"}}/><br></br><br></br>
      
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

           <PayModal/>

           <BookCoachSuccess/>

       </div>  
           
      

    );
}
export default Bookappointment;