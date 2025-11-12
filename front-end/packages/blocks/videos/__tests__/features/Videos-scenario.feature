Feature: Videos

    Scenario: User navigates to Videos
        Given I am a User loading Videos
        When I navigate to the Videos
        Then Videos will load with out errors
        And I can leave the screen with out errors