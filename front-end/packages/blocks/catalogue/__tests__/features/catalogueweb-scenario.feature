Feature: catalogue

    Scenario: User navigates to catalogue
        Given I am a User loading catalogue
        When I navigate to the catalogue
        Then catalogue will load with out errors
        Then catalogue will load data with internal module
        Then catalogue will load data from API
        And I can leave the screen with out errors