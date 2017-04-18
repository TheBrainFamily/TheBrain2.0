Feature: Achievements
  In order to stay motivated
  As a student
  I want to get achievements for the progress

  Scenario: User finishes the quiz for the first lecture
    Given I am a new student
    And I am doing the quiz for the first lecture
    And I have 1 flashcard left
    When I evaluate my answer as correct
    Then I get a "first quiz" achievement

  Scenario: User evaluates 10 flashcards in a row as correct
    Given I am a returning student
    And I evaluated 9 flashcards in a row as correct
    When I evaluate my answer as correct
    Then I get a "10 in a row" achievement