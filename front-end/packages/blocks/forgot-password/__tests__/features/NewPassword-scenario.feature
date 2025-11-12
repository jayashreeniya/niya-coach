Feature: NewPassword

    Scenario: User navigates to New Password
        Given I am a User loading New Password
        When I navigate to the New Password
        Then NewPassword will load with out errors
        And I can enter a password with out errors
        And I can toggle the Password Show/Hide with out errors
        And I can enter a confimation password with out errors
        And I can toggle the Confimation Password Show/Hide with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors