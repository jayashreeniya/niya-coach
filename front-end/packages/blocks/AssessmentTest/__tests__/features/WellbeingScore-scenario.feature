Feature: WellbeingScore

    Scenario: User navigates to WellbeingScore
        Given I am a User loading WellbeingScore
        When I navigate to the WellbeingScore
        Then WellbeingScore will load with out errors
        And Network response for get all requests
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can select Answer choice with out error
        And I can leave the screen with out errors