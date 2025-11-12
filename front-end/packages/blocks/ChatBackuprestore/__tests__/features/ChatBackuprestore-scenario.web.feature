Feature: ChatBackuprestore

    Scenario: User navigates to ChatBackuprestore
        Given I am a User loading ChatBackuprestore
        When I navigate to the ChatBackuprestore
        Then UserList will load with out errors
        And ChatBackuprestore will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors