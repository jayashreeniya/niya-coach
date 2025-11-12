Feature: HRProfile

    Scenario: User navigates to HRProfile
        Given I am a User loading HRProfile
        When I navigate to the HRProfile
        Then Response token from the session
        And Network response for get all requests
        And HRProfile will load with out errors
        And I can update device token with out errors
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors