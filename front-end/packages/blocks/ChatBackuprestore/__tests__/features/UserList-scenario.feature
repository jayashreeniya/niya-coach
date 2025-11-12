Feature: UserList

    Scenario: User navigates to UserList Screen
        Given I am a User loading UserList
        When I navigate to the UserList
        Then UserList will load with out errors
        And Network error response for get all requests
        And I can leave the screen with out errors