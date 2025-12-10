import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import CustomPopup2 from "../../components/CustomPopup2";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    processPaymentSuccess();
  }, []);

  const processPaymentSuccess = async () => {
    console.log("🎉 Payment Success page loaded - Processing booking...");

    // Get booking details from localStorage
    const bookingDetails = {
      token: localStorage.getItem("accessToken"), // Fixed: was "token", should be "accessToken"
      service_provider_id: localStorage.getItem("coachid"),
      booking_date: localStorage.getItem("selecteddate"),
      start_time: localStorage.getItem("starttime"),
      end_time: localStorage.getItem("endtime"),
      coach_name: localStorage.getItem("coachname"),
      user_email: localStorage.getItem("loginuseremailid")
    };

    console.log("Booking details from localStorage:", bookingDetails);

    // Validate we have all required data
    if (!bookingDetails.token || !bookingDetails.service_provider_id || !bookingDetails.booking_date) {
      console.error("❌ Missing booking details in localStorage");
      setErrorMessage("Booking details not found. Please try booking again.");
      setIsProcessing(false);
      setTimeout(() => navigate("/bookappointment"), 3000);
      return;
    }

    try {
      // Create booking in database
      const createBookingUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_calendar/booked_slots";
      
      const bookingPayload = {
        service_provider_id: bookingDetails.service_provider_id,
        booking_date: bookingDetails.booking_date,
        start_time: bookingDetails.start_time,
        end_time: bookingDetails.end_time
      };

      console.log("Creating booking:", bookingPayload);

      const createResponse = await fetch(createBookingUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'token': bookingDetails.token
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const bookingData = await createResponse.json();
      console.log("✅ Booking created:", bookingData);

      const bookedSlotId = bookingData.data?.id;

      if (!bookedSlotId) {
        throw new Error("Booking ID not returned from server");
      }

      // Now confirm payment and send emails
      const confirmPaymentUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_calendar/booked_slots/confirm_payment";
      
      const confirmResponse = await fetch(confirmPaymentUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'token': bookingDetails.token
        },
        body: JSON.stringify({
          booked_slot_id: bookedSlotId,
          payment_id: 'razorpay_success'
        })
      });

      if (!confirmResponse.ok) {
        console.warn("⚠️ Payment confirmation failed, but booking is created");
      } else {
        console.log("✅ Payment confirmed and emails sent");
      }

      // Store for popup display
      localStorage.setItem("coachname", bookingDetails.coach_name);
      localStorage.setItem("bookingdate", bookingDetails.booking_date);
      localStorage.setItem("bookingtime", bookingDetails.start_time);

      // Clear booking flags
      localStorage.removeItem("payment_redirect");
      localStorage.removeItem("coachid");
      localStorage.removeItem("starttime");
      localStorage.removeItem("endtime");

      // Show success popup
      setIsProcessing(false);
      setVisibility(true);

    } catch (error) {
      console.error("❌ Error processing booking:", error);
      setErrorMessage(`Booking failed: ${error.message}`);
      setIsProcessing(false);
      setTimeout(() => navigate("/bookappointment"), 3000);
    }
  };

  const popupCloseHandler = () => {
    setVisibility(false);
    navigate("/bookappointment");
  };

  function BookingSuccessPopup() {
    return (
      <CustomPopup2
        onClose={popupCloseHandler}
        show={visibility}
        title=""
      >
        <div className="popupContentDiv" style={{"textAlign": "center"}}>
          <p style={{"textAlign": "center","fontSize":25}}>Appointment Confirmed</p>
          <span>Confirmed appointment with coach</span><br></br>
          <span id="resmsg">{localStorage.getItem("coachname")} on {localStorage.getItem("bookingdate")} {localStorage.getItem("bookingtime")}</span><br></br>
          
          <span>Please note : To reschedule your session, you need to cancel the booked session and book the new session. Booked session can only be cancelled 24 hours prior to the scheduled time.</span><br></br>
          <span>For the session with the expert please join the zoom link <a href="https://us06web.zoom.us/j/9774013865" target="_blank" rel="noreferrer">https://us06web.zoom.us/j/9774013865</a> at your booked time.</span><br></br>
          <span id="">Thank You!</span><br></br>
          <div className="centBtn"></div>
        </div>
      </CustomPopup2>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <img src={Logo} alt="Niya Logo" style={{ width: "150px", marginBottom: "20px" }} />
        
        {isProcessing && (
          <div>
            <h2>Processing your payment...</h2>
            <p>Please wait while we confirm your booking.</p>
            <div className="spinner" style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "20px auto"
            }}></div>
          </div>
        )}

        {errorMessage && (
          <div style={{ color: "red", marginTop: "20px" }}>
            <h2>Booking Error</h2>
            <p>{errorMessage}</p>
            <p>Redirecting to booking page...</p>
          </div>
        )}
      </div>

      <BookingSuccessPopup />
    </div>
  );
};

export default PaymentSuccess;

