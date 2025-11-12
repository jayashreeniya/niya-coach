Feature: UserFeedback

    Scenario: User navigates to UserFeedback
        Given I am a User loading UserFeedback
        When I navigate to the UserFeedback
        Then UserFeedback will load with out errors
        And Response token from the session
        And Network response for get all requests
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors