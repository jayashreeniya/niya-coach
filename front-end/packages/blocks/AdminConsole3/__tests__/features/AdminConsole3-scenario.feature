Feature: AdminConsole3

    Scenario: User navigates to AdminConsole3
        Given I am a User loading AdminConsole3
        When I navigate to the AdminConsole3
        Then AdminConsole3 will load with out errors
        And I can leave the screen with out errors