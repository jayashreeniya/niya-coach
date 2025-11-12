Feature: Coachdashboard

    Scenario: User navigates to Coach dashboard
        Given I am a User loading Coach dashboard
        When I navigate to the Coach dashboard
        Then Coach dashboard will load with out errors
        And Coach Dashboard will display messages
        And Coach Dashboard will display notifcation if no messages
        And Coach Dashboard will display notifcation if API failure
        And I can leave the screen with out errors