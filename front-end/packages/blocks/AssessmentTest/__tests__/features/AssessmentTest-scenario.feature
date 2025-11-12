Feature: AssessmentTest

    Scenario: User navigates to AssessmentTest
        Given I am a User loading AssessmentTest
        When I navigate to the AssessmentTest
        Then AssessmentTest will load with out errors
        And I can select the options with out errors
        And I can select the button with with out errors
        And Modal Display based on Score if exists
        And I will get Next set of Questions
        And I can select the Answers for the Questions
        And I can submit the Answers for the Questions
        And I will Get Result Of The Test
        And I can leave the screen with out errors
        
      