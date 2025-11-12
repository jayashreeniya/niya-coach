
Feature:QuestionAns

    Scenario: User navigates to QuestionAns
        Given I am a User loading QuestionAns
        When I navigate to the QuestionAns
        Then QuestionAns will load with out errors
        And I can select the options with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors

    Scenario: User will be redirected to last visited screen
        Given I am a User loading QuestionAns
        When Storage is true
        Then User will be redirected
        
        
      