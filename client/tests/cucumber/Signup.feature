Feature: Signup
  In order to preserve my progress
  As a new student
  I want to be able to signup

  Background:
    Given I am a new student
    And I am on the signup page

  Scenario: New student signs up with email and password
    When I sign up with email and password
    Then I see that I am logged in

  Scenario: New student signs up with facebook
    When I sign up with facebook
    Then I see that I am logged in