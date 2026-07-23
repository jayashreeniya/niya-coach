import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import "./myAppointments.css";

const API_BASE = "https://niya-backend-oiut.onrender.com";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    processPaymentSuccess();
  }, []);

  const restoreAuth = () => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      token = sessionStorage.getItem("accessToken");
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("authenticated", "true");
        const role = sessionStorage.getItem("userRole");
        const userId = sessionStorage.getItem("userId");
        if (role) localStorage.setItem("userRole", role);
        if (userId) localStorage.setItem("userId", userId);
      }
    }
    return token;
  };

  const processPaymentSuccess = async () => {
    const token = restoreAuth();
    const paymentId =
      searchParams.get("razorpay_payment_id") ||
      searchParams.get("payment_id") ||
      "razorpay_success";

    const bookingDetails = {
      token,
      service_provider_id: localStorage.getItem("coachid") || sessionStorage.getItem("coachid"),
      booking_date: localStorage.getItem("selecteddate") || sessionStorage.getItem("selecteddate"),
      start_time: localStorage.getItem("starttime") || sessionStorage.getItem("starttime"),
      end_time: localStorage.getItem("endtime") || sessionStorage.getItem("endtime"),
      coach_name: localStorage.getItem("coachname") || sessionStorage.getItem("coachname"),
    };

    if (!bookingDetails.token) {
      setErrorMessage("Your session expired during payment. Please log in again to view your appointments.");
      setIsProcessing(false);
      return;
    }

    if (!bookingDetails.service_provider_id || !bookingDetails.booking_date) {
      setErrorMessage("Booking details not found. Please try booking again.");
      setIsProcessing(false);
      return;
    }

    try {
      const createResponse = await fetch(`${API_BASE}/bx_block_calendar/booked_slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: bookingDetails.token,
        },
        body: JSON.stringify({
          service_provider_id: bookingDetails.service_provider_id,
          booking_date: bookingDetails.booking_date,
          start_time: bookingDetails.start_time,
          end_time: bookingDetails.end_time,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.errors?.[0]?.booking_date || "Failed to create booking");
      }

      const bookingData = await createResponse.json();
      const bookedSlotId = bookingData.data?.id;
      if (!bookedSlotId) throw new Error("Booking ID not returned from server");

      await fetch(`${API_BASE}/bx_block_calendar/booked_slots/confirm_payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: bookingDetails.token,
        },
        body: JSON.stringify({
          booked_slot_id: bookedSlotId,
          payment_id: paymentId,
        }),
      });

      localStorage.setItem("authenticated", "true");
      localStorage.setItem("accessToken", bookingDetails.token);

      ["payment_redirect", "coachid", "starttime", "endtime", "selecteddate"].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });

      setSummary({
        coach_name: bookingDetails.coach_name,
        booking_date: bookingDetails.booking_date,
        booking_time: bookingDetails.start_time,
      });
      setIsProcessing(false);
    } catch (error) {
      setErrorMessage(`Booking failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="appointments-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="success-panel">
        <img src={Logo} alt="Niya" style={{ height: 56, marginBottom: 16 }} />

        {isProcessing && (
          <>
            <h1>Processing your payment...</h1>
            <p>Please wait while we confirm your booking.</p>
          </>
        )}

        {!isProcessing && errorMessage && (
          <>
            <h1>Almost there</h1>
            <p className="appointments-error">{errorMessage}</p>
            <div className="success-actions">
              <button type="button" className="primary-btn" onClick={() => navigate("/")}>
                Log in again
              </button>
              <button type="button" className="refresh-btn" onClick={() => navigate("/appointments")}>
                Go to My Appointments
              </button>
            </div>
          </>
        )}

        {!isProcessing && !errorMessage && summary && (
          <>
            <h1>Appointment confirmed</h1>
            <p>
              Confirmed with <strong>{summary.coach_name}</strong> on{" "}
              <strong>
                {summary.booking_date} {summary.booking_time}
              </strong>
            </p>
            <p className="success-note">
              At your booked time, open My Appointments and tap <strong>Connect Now</strong> to join the video session with your coach.
            </p>
            <p className="success-note">
              To reschedule, cancel at least 24 hours before the session and book a new one.
            </p>
            <div className="success-actions">
              <button type="button" className="primary-btn" onClick={() => navigate("/appointments")}>
                Go to My Appointments
              </button>
              <button type="button" className="refresh-btn" onClick={() => navigate("/bookappointment")}>
                Book another
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
