Feature: HomePage

    Scenario: User navigates to Home Page screen
        Given I am a User loading Home Page screen
        When I navigate to the Home Page screen
        Then Home Page screen will load with out errors
        When I press on current goal item in home page
        Then I can see the result in modal page
        When I press on mark as completed button in modal
        Then I can see the result in completed goal
        When I press on curren goal Item
        Then I see the result Modal in home page
        When I press on curren goal next Modal
        Then I can see the DatetimepickerModal
        When I can select the time in DateTimePicker Modal
        Then I can see the selected time in modal
        When I press on curren goal save button
        Then I can see the update Time in curren goals
        When I press on current Action item 
        Then I see the current Action time in Modal
        When I send the appointment data in home page
        Then I see the appointment data in Home page
        When I send the form data to modal
        Then I see the values in modal in home page
        When I press on Add goal button in home page
        Then I see the Add goal Text in modal
        When I press on Add action item button
        Then I see the Add action item text in modal

    Scenario: User navigates to Home Page
        Given I am a User loading Home Page
        When I navigate to the Home Page
        Then Home Page will load with out errors
        And Home Page will display data
        And Dashboard will display data
        And Dashboard will display notifcation if API failure
        And I can leave the screen with out errors