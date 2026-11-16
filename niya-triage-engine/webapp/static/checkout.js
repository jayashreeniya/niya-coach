/* global Razorpay */
(function () {
  var button = document.getElementById("pay-button");
  var form = document.getElementById("razorpay-confirm");
  var status = document.getElementById("pay-status");
  var configNode = document.getElementById("razorpay-config");

  function fail(message) {
    if (status) {
      status.textContent = message;
      status.className = "notice error small";
    }
  }

  if (!button || !form || !configNode) {
    return;
  }

  if (typeof Razorpay === "undefined") {
    fail(
      "The payment window could not load. Check your connection and reload this page."
    );
    return;
  }

  var options = {
    key: configNode.dataset.key || "",
    amount: Number(configNode.dataset.amount || "0"),
    currency: configNode.dataset.currency || "INR",
    name: configNode.dataset.name || "Niyasaathi",
    description: configNode.dataset.description || "Session",
    order_id: configNode.dataset.orderId || "",
    prefill: {
      name: configNode.dataset.prefillName || "",
      email: configNode.dataset.prefillEmail || "",
      contact: configNode.dataset.prefillContact || ""
    },
    theme: { color: "#6c4ab6" },
    handler: function (response) {
      document.getElementById("payment_reference").value =
        response.razorpay_payment_id || "";
      document.getElementById("signature").value =
        response.razorpay_signature || "";
      button.disabled = true;
      button.textContent = "Confirming payment\u2026";
      if (status) {
        status.textContent = "Payment received. Confirming your booking\u2026";
        status.className = "notice info small";
      }
      form.submit();
    },
    modal: {
      ondismiss: function () {
        button.disabled = false;
        if (status) {
          status.textContent =
            "Payment was not completed. Your slot is still held — tap Pay again when ready.";
          status.className = "notice warn small";
        }
      }
    }
  };

  if (!options.key || !options.order_id) {
    fail("Payment is not ready for this booking. Reload the page and try again.");
    return;
  }

  button.addEventListener("click", function () {
    button.disabled = true;
    try {
      var checkout = new Razorpay(options);
      checkout.on("payment.failed", function (response) {
        button.disabled = false;
        var detail =
          (response &&
            response.error &&
            (response.error.description || response.error.reason)) ||
          "Payment failed";
        fail(detail + ". Your slot is still held — try again.");
      });
      checkout.open();
    } catch (_error) {
      button.disabled = false;
      fail("Could not open Razorpay. Reload the page and try again.");
    }
  });
})();
