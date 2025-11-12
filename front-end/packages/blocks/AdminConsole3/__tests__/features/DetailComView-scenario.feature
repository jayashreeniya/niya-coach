Feature: DetailComView

    Scenario: User navigates to DetailComView
        Given I am a User loading DetailComView
        When I navigate to the DetailComView
        Then Response token from the session
        And Network response for get all requests
        And DetailComView will load with out errors
        And I can update device token with out errors
        And Network error response for get all requests
        And Network responseJson message error response for get all requests
        And I can leave the screen with out errors