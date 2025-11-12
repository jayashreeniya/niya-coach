Feature: Email Account Registration
    Scenario: Register Email Account
        Given I am a User attempting to Register
        When I navigate to the Registration Screen
        Then I can enter a full name with out errors
        And I can enter a email with out errors
        And I can enter a access code with out errors 
        And I can enter a password with out errors
        And I can toggle the Password Show/Hide with out errors
        And I can enter a confimation password with out errors
        And I can toggle the Confimation Password Show/Hide with out errors
        And I can accept terms and conditions
        And I can select signUp without errors
        And I can go back to Login screen
       
   
    Scenario: Empty full name
        Given I am a User attempting to Register with a Email
        When I Register with an empty full name
        Then Registration Should Fail
        And RestAPI will return an error

    Scenario: Invalid Email
        Given I am a User attempting to Register with a Email
        When I Register with an Invalid Email
        Then Registration Should Fail
        And RestAPI will return an error

    Scenario: Invalid Access Code
        Given I am a User attempting to Register with a Email
        When I Register with an Invalid Access Code
        Then Registration Should Fail
        And RestAPI will return an error

   
    Scenario: Invalid Password
        Given I am a User attempting to Register with a Email
        When I Register with an Invalid Password
        Then Registration Should Fail
        And RestAPI will return an error

    Scenario: Password and RePassword do not match
        Given I am a User attempting to Register with a Email
        When I Register with Password and RePassword that do not match
        Then Registration Should Fail
        And RestAPI will return an error

    Scenario: Valid Registration
        Given I am a User attempting to Register with a Email
        When I Register with all valid data
        Then Registration Should Succeed
        Then RestAPI will return token
        And Terms and Condition

    Scenario: full name length less then 3 char
        Given I am a User attempting to Register with a full name length less then 3 chart
        When I Register with full name
        Then Registration Should Succeed
  
