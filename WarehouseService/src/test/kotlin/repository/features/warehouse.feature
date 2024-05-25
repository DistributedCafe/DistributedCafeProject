Feature: Interacting with the warehouse

  Scenario: Manager wants to check the list of ingredients in the warehouse
    Given milk and tea are in the warehouse
    When Manager asks for the list of ingredients in the warehouse
    Then Manager receives
      | milk |
      | tea |
