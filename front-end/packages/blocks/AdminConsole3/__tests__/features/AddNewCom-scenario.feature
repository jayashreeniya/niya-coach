Feature: AddNewCom

    Scenario: User navigates to AddNewCom
        Given I am a User loading AddNewCom
        When I navigate to the AddNewCom
        Then Response token from the session
        And Network response for get all requests
        And Network response for get profile data requests
        And AddNewCom will load with out errors
        And I can update device token with out errors
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors