Feature: Lecture
  In order to learn faster about a subject
  As a student
  I want to watch a lecture

  Scenario: New student is watching the first lecture
    Given I am a new student
    When I open the lecture page
    Then I see the "first" lecture from the series

  Scenario: Returning student continues watching series
    Given I am a returning student
    And I watched "first" lecture from the series
    And I have no flashcards to be repeated
    When I open the app
    Then I see the "second" lecture from the series

  Scenario: New student is done watching the lecture
    Given I am a new student
    When I finish watching the "first" lecture
    Then I get to the quiz page