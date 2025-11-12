Feature: appointments

    Scenario: User navigates to appointments
        Given I am a User loading appointments
        When I navigate to the appointments
        And I can select the date and time
        Then appointments will load with out errors
        Then I will book appointments with out errors
        And I can leave the screen with out errors
        
    Scenario: User navigates to addappointment
        Given I am a User loading addappointment
        When I navigate to the addappointment
        And I can select the date and time
        And I can click the button
        Then appointment will be added with out errors
        And I can leave the screen with out errors

    Scenario: User navigates to addappointment screen
        Given I am a User loading addappointment screen
        When I navigate to the addappointment screen
        Then I can see the addappointment Screen without errors
        When I select the Time in DateTimePicker
        Then I can see the Time in appointment Screen
        When Page is loading time network call is happen 
        Then I can see the coach data
        When I change time by MultiSlider
        Then I can see the Time in appointment screen