Feature: WellBeingAssTest

    Scenario: User navigates to WellBeingAssTest
        Given I am a User loading WellBeingAssTest
        When I navigate to the WellBeingAssTest
        Then WellBeingAssTest will load with out errors
        And Network response for get all requests
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can select Answer choice with out error
        And I can leave the screen with out errors