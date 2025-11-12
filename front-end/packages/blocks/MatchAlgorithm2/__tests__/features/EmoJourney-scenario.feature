Feature: EmoJourney

    Scenario: User navigates to EmoJourney
        Given I am a User loading EmoJourney
        When I navigate to the EmoJourney
        Then EmoJourney will load with out errors
        And Response token from the session
        And Network response for get all requests
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can see journal rendered
        And I can leave the screen with out errors