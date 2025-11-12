Feature: AddNewCoach

    Scenario: User navigates to AddNewCoach
        Given I am a User loading AddNewCoach
        When I navigate to the AddNewCoach
        Then Response token from the session
        And Network response for get all requests
        And Network response for get coach expertises requests
        And Network response for get profile data requests
        And AddNewCoach will load with out errors
        And I can update device token with out errors
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors