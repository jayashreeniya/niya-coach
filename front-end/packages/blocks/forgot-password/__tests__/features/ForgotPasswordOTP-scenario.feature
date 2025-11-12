Feature: ForgotPasswordOTP

    Scenario: User navigates to forgot password OTP
        Given I am a User loading forgot password OTP
        When I navigate to the forgot password OTP
        Then forgot password OTP  will load with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors