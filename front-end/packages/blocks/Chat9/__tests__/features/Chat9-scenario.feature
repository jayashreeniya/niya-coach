Feature: Chat9

    Scenario: User navigates to Chat9
        Given I am a User loading Chat9
        When I navigate to the Chat9
        Then Chat9 will load with out errors
        And Response token from the session
        And Network response for get Conversation details requests
        And Network response for get Appointment details requests
        And I can enter text with out errors
        And I can select the button with with out errors
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors