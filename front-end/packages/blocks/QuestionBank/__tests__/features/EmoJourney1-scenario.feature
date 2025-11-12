Feature: EmoJourney1

    Scenario: User navigates to EmoJourney1
        Given I am a User loading EmoJourney1
        When I navigate to the EmoJourney1
        Then EmoJourney1 will load with out errors
        And Network response for get all requests
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can select answer choice and go next with out errors
        And Answer submit response for post requests
        And I can leave the screen with out errors