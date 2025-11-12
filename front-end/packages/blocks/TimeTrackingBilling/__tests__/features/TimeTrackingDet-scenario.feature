Feature: TimeTrackingBillingDetails

    Scenario: User navigates to TimeTrackingBillingDetails
        Given I am a User loading TimeTrackingBillingDetails
        When I navigate to the TimeTrackingBillingDetails
        Then TimeTrackingBillingDetails will load with out errors
        And Network error response for get all requests
        And I can leave the screen with out errors