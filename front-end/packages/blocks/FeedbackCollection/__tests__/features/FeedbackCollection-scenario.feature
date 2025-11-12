Feature: FeedbackCollection

    Scenario: User navigates to FeedbackCollection
        Given I am a User loading FeedbackCollection
        When I navigate to the FeedbackCollection
        Then FeedbackCollection will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors