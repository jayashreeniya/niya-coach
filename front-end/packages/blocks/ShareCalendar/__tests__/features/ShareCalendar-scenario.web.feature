Feature: ShareCalendar

    Scenario: User navigates to ShareCalendar
        Given I am a User loading ShareCalendar
        When I navigate to the ShareCalendar
        Then ShareCalendar will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors