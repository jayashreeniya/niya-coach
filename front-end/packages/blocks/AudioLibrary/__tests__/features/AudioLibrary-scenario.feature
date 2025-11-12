Feature: AudioLibrary

    Scenario: User navigates to AudioLibrary
        Given I am a User loading AudioLibrary
        When I navigate to the AudioLibrary
        Then AudioLibrary will load with out errors
        And I can enter text with out errors
        And I can leave the screen with out errors
    
    Scenario: User navigates to AudioLibrary to view Articles
        Given I am a User loading AudioLibrary
        When I navigate to the AudioLibrary
        Then AudioLibrary will load with out errors
    
    Scenario: User navigates to AudioLibrary to view Audios
        Given I am a User loading AudioLibrary
        When I navigate to the AudioLibrary
        Then AudioLibrary will load with out errors
    
    Scenario: User navigates to AudioLibrary to view Videos
        Given I am a User loading AudioLibrary
        When I navigate to the AudioLibrary
        Then AudioLibrary will load with out errors
