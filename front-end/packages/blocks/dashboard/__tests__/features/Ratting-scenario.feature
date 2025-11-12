Feature: Ratting

    Scenario: User navigates to Ratting
        Given I am a User loading Ratting
        When I navigate to the Ratting
        Then Ratting will load with out errors
        And Ratting will display messages
        And Ratting will display notifcation if no messages
        And Ratting will display notifcation if API failure
        And I can leave the screen with out errors