Feature: Weareglad

    Scenario: User navigates to Weareglad
        Given I am a User loading Weareglad
        When I navigate to the Weareglad
        Then Weareglad will load with out errors
        And I can navigate to home without errors
        And I can leave the screen with out errors