Feature: UserGroups

    Scenario: User navigates to UserGroups
        Given I am a User loading UserGroups
        When I navigate to the UserGroups
        Then UserGroups will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors