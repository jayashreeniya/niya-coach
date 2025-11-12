Feature: HRDashboard

    Scenario: User navigates to HR Dashboard
        Given I am a User loading HR Dashboard
        When I navigate to the HR Dashboard
        Then HR Dashboard will load with out errors
        And HR Dashboard will display messages
        And HR Dashboard will display notifcation if no messages
        And HR Dashboard will display notifcation if API failure
        And I can leave the screen with out errors