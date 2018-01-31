Feature: Landing page
  In order to understand what TheBrain is about
  As a new student
  I want to see introduction info on the landing page

  Scenario: New student is introduced to the page
    Given I am a new student
    When I open a landing page
    Then I see introduction info