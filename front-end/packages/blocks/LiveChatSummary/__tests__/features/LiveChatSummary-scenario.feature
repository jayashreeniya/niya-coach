Feature: LiveChatSummary

    Scenario: User navigates to LiveChatSummary
        Given I am a User loading LiveChatSummary
        When I navigate to the LiveChatSummary
        Then LiveChatSummary will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors