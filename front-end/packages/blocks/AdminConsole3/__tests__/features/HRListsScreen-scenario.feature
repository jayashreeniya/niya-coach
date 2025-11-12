Feature: HRListsScreen

    Scenario: User navigates to HRListsScreen
        Given I am a User loading HRListsScreen
        When I navigate to the HRListsScreen
        Then Response token from the session
        And Network response for get all requests
        And HRListsScreen will load with out errors
        And I can update device token with out errors
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors