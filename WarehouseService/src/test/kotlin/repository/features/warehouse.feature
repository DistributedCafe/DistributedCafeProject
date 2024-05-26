Feature: Interacting with the warehouse

  Scenario: Manager wants to check the list of ingredients in the warehouse
    Given only milk and tea are in the warehouse
    When Manager asks for the list of ingredients in the warehouse
    Then Manager receives a list of ingredients with only milk and tea
