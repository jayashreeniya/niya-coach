Feature: GamesCompleted

    Scenario: User navigates to GamesCompleted
        Given I am a User loading GamesCompleted
        When I navigate to the GamesCompleted
        Then GamesCompleted will load with out errors
        And I can navigate to Appointments with out errors
        And I can navigate to HomePage with out errors
        And I can leave the screen with out errors