Feature: SendPushnotification

    Scenario: User navigates to send push notifications
        Given I am a User loading send push notifications
        When I navigate to the send push notifications
        Then send push notifications will load with out errors
        And send push notifications will render with mock data
        And send push notifications will render with empty data
        And send push notifications will load notifications from the server
        And I can enter the notificatio Title
        And I can enter the description of notification
        And I can select the Category for sending the notification
        And I can click the notification send Button
       