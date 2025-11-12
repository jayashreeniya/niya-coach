Feature: User Profile
    Scenario: User navigates to User Profile
        Given I am a User loading User Profile
        When I navigate to the User Profile Screen
        Then User Profile will load with out errors
        Then I can enter a full name with out errors
        And I can enter a email with out errors
        And I can select gender
        And I can select submit without errors
        And User Profile failed to load data from the server
        And I can leave the screen with out errors

   