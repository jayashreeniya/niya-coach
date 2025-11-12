Feature: TargetedFeed

    Scenario: User navigates to TargetedFeed
        Given I am a User loading TargetedFeed
        When I navigate to the TargetedFeed
        Then TargetedFeed will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors