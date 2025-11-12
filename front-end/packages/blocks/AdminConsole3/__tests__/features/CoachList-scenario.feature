Feature: CoachList

    Scenario: User navigates to CoachList
        Given I am a User loading CoachList
        When I navigate to the CoachList
        Then Response token from the session
        And Network response for get all requests
        And Network response for get User Groups data requests
        And Network response for get coaches data requests
        And CoachList will load with out errors
        And I can update device token with out errors
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors