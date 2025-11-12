Feature: RandomNumberGenerator

    Scenario: User navigates to RandomNumberGenerator
        Given I am a User loading RandomNumberGenerator
        When I navigate to the RandomNumberGenerator
        Then RandomNumberGenerator will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors