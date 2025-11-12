
Feature:ChooseCategories

    Scenario: User navigates to ChooseCategories
        Given I am a User loading ChooseCategories
        When I navigate to the ChooseCategories
        Then ChooseCategories will load with out errors
        And I can select the options with out errors
        And I can select the button with with out errors
        And I will get Next set of Questions
        And I can select the Answers for the Questions
        And I can submit the Answers for the Questions
        And I can leave the screen with out errors
        
      