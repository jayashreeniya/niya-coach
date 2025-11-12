Feature: UserFeedbackDet

    Scenario: User navigates to UserFeedbackDet
        Given I am a User loading UserFeedbackDet
        When I navigate to the UserFeedbackDet
        Then UserFeedbackDet will load with out errors
        And Response token from the session
        And Network response for get all requests
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors