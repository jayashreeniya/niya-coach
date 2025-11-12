Feature: JourneyDashBoard

    Scenario: User navigates to JourneyDashBoard
        Given I am a User loading JourneyDashBoard
        When I navigate to the JourneyDashBoard
        Then JourneyDashBoard will load with out errors
        And Response token from the session
        And Network response for get all requests
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors