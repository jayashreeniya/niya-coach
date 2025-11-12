Feature: User Profile BasicBlock
    Scenario: User navigates to User Profile BasicBlock
        Given I am a User loading User Profile BasicBlock
        When I navigate to the User Profile BasicBlock 
        Then User Profile BasicBlock will load with out errors
        Then I can enter a full name with out errors
        And I can enter a email with out errors
        And I can select submit without errors
        And User Profile BasicBlock failed to load data from the server
        And I can leave the screen with out errors

   