Feature: ForgotPassword

    Scenario: User navigates to forgot password
        Given I am a User loading forgot password
        When I navigate to the forgot password
        Then forgot password will load with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors