Feature:Contact Us
    Scenario: User navigates to Contact Us
        Given I am a User loading Contact Us
        When I navigate to the Contact Us Screen
        Then Contact Us will load with out errors
        Then I can enter a Desciption with out errors
        And I can select submit without errors
        And Contact Us failed to load data from the server
        And I can leave the screen with out errors

   