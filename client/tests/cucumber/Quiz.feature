Feature: Quiz
  In order to memorize faster and retain knowledge from lectures
  As a student
  I want to be able to test my knowledge

  Scenario: User evaluates his answer as correct
    Given I am a returning student
    And I have 2 flashcards left
    When I evaluate my answer as correct
    Then I see 1 flashcard left
    And I see 1 flashcard done

  Scenario: User evaluates his answer as incorrect
    Given I am a returning student
    And I have 2 flashcards left
    When I evaluate my answer as incorrect
    Then I see 2 flashcards left

  Scenario: Returning student is done going through flashcards
    Given I am a returning student
    And I have 1 flashcard left
    When I evaluate my answer as correct
    Then I get to the lecture page

  Scenario: New student is done going through flashcards
    Given I am a new student
    And I have 1 flashcard left
    When I evaluate my answer as correct
    Then I get to the signup page