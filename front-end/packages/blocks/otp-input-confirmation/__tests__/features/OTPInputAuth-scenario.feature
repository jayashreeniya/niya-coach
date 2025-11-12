Feature: OTPInputAuth

    Scenario: User navigates to OTP Input Auth 
        Given I am a User loading OTP Input Auth
        When I navigate to the OTP Input Auth
        Then OTP Input Auth will load with out errors
        And I can Enter the OTP with out errors
        And Network responseJson message error response for get all requests
        And I can select the button with with out errors
        And I can leave the screen with out errors