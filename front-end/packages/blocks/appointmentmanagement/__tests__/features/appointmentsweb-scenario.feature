Feature: appointments

    Scenario: User navigates to appointments
        Given I am a User loading appointments
        When I navigate to the appointments
        And I can select the date
        And I can click the button
        Then appointments will load with out errors
        And I can leave the screen with out errors

    Scenario: User navigates to addappointment
        Given I am a User loading addappointment
        When I navigate to the addappointment
        And I can select the date and time
        And I can click the button
        Then appointment will be added with out errors
        And I can leave the screen with out errors