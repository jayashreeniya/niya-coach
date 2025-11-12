Object.defineProperty(exports, "__esModule", {
    value: true
  });

//APi Methods
exports.httpGetMethod = "GET";
exports.httpPostMethod =  "POST";

exports.profileValidationSettingsAPiEndPoint = "profile/validations";
exports.passwordRecoveryStartOtpAPiEndPoint = "bx_block_forgot_password/otps";
exports.passwordRecoveryConfirmOtpAPiEndPoint = "bx_block_forgot_password/otp_confirmations";
exports.passwordRecoveryChangePasswordAPiEndPoint ="bx_block_forgot_password/forgot_password"; 
exports.forgotPasswordAPiContentType = "application/json";
exports.pleaseEnterAValidEmail = "Please enter a valid email";
exports.emailIsRequired = "Email is required";
exports.phoneNumberIsNotValid = "Phone number is not valid";
exports.phoneNumberIsRequired = "Phone number is required";
exports.otpCodeIsRequired = "Phone number is required";
exports.pleaseEnterAPassword = "Please enter a password";
exports.passwordMustBeAtLeast2Characters = "Password must be at least 2 characters";
exports.pleaseConfirmYourPassword = "Please confirm your password";
exports.passwordsMustMatch = "Passwords must match";
exports.invalidEmailAddress = "Invalid email address";
exports.invalidPassword = "Invalid password";
exports.goToOtpAfterPhoneValidationErrorTitle = "Error";
exports.goToOtpAfterPhoneValidationErrorBody = "Please select country code";
exports.labelTextIsAccountRecovery = "Reset \nPassword";

exports.labelTextNewPassRecovery = "Create New Password";
exports.restPassSubLabel="Select which contact detail should we \n     use to reset password?";
exports.secondLabelText = "Please choose what type of account you signed up with."
exports.thirdLabelText = "To Reset your password, please enter the email associated with your account.";
exports.forthLabelText = "We sent a confirmation code to the following email:";
exports.fifthLabelText = "To Reset your password, please enter the phone number associated with your account."
exports.sixthLabelText = "We sent a confirmation code to the following phone:"

exports.firstInputAutoCompleteType = "email";
exports.firstInputPlaceholder = "Email";
exports.firstInputKeyboardStyle = "email-address";
exports.firstInputErrorColor = "red";

exports.buttonTextIsNext =  "Create";
exports.buttonTextBacktoLogin =  "Back to login";

exports.buttonSendEmail = "Send";
exports.emailPassbLabel="Forgot your password?";
exports.emailPassSubLabel="Enter your registered email below to receive a password reset OTP";
exports.buttonColorForNextButton =  "#EFEFEF";

exports.secondInputAutoCompleteType = "tel";
exports.secondInputKeyboardType= "phone-pad"
exports.secondInputPlaceholder = "Mobile"
exports.secondInputErrorColor = "red";

exports.buttonMobilegetOtp= "Get OTP";
exports.mobileotpbLabel="Enter your mobile number \nto reset password";
exports.mobileotpsubLabel="We will send you one time pasword (OTP)";

exports.thirdInputPlaceholder = "Enter OTP";
exports.thirdInputErrorColor = "red";

exports.buttonTitleIsSMSPhoneAccount = "Via SMS"; 
exports.buttonTitleIsEmailAccount = "Via E-Mail";

exports.labelTextIsPleaseEnterYourNewPassword = "Please enter your new password."; 
exports.labelTextIsYourPasswordHasBeenSuccessfullyChanged = "Password Created Successfully!!"; 

exports.handled = "handled";

exports.placeholderIsReTypePassword = "Re-Type Password";

exports.buttonTitleIsOk = "Ok"
exports.buttonColorForOkButton = "#6200EE"; 

exports.placeholderIsPassword = "Password";
exports.countryCodeSelectorPlaceholder = "Select Country";
// Customizable Area Start
exports.phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
// Customizable Area End