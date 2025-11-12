Feature:QuestionAns
 
    Scenario: User will be redirected to last visited screen #4
        Given I am a User loading QuestionAns
        When Storage is true
        Then User will be redirected