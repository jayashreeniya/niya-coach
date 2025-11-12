Feature: VideoLibrary

    Scenario: User navigates to VideoLibrary
        Given I am a User loading VideoLibrary
        When I navigate to the VideoLibrary
        Then VideoLibrary will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors