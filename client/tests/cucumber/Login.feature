Feature: Login
  In order to continue with learning
  As a student
  I want to be able to login

  Background:
    Given I am a returning student

  Scenario: Returning student logs in with facebook
    When I log in with facebook
    Then I see I am logged in

  Scenario: Returning student logs in with email and password
    When I log in with email and password
    Then I see I am logged in