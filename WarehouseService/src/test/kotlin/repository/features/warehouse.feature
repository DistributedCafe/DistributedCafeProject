Feature: Interacting with the warehouse

  Scenario Outline: Manager adds a new ingredient
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager adds an ingredient with name <name> and quantity <quantity>
    Then Manager receives <response>
    Examples:
      |name     |quantity |response |
      |milk     |99       |400      |
      |coffee   |5        |200      |

  Scenario Outline: Manager wants to restock the <name> in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager restocks the <name> adding <quantity> units
    Then Manager receives <response>
    Examples:
      |name   |quantity |response |
      |coffee |10       |404      |
      |tea    |5        |200      |

  Scenario Outline: System wants to decrease the <name> quantity in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When System decreases the <name> quantity by <quantity>
    Then System receives <response>
    Examples:
      |name   |quantity |response |
      |coffee |1        |404      |
      |tea    |4        |200      |
      |milk   |100      |400      |

  Scenario: Manager wants to check the list of ingredients in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager asks for the list of ingredients in the warehouse
    Then Manager receives 200

  Scenario: Manager wants to check the list of ingredients in the warehouse
    Given there are no ingredients in the warehouse
    When Manager asks for the list of ingredients in the warehouse
    Then Manager receives 404

  Scenario: Manager wants to check the list of available ingredients in the warehouse
    Given there are 99 units of milk, 4 units of tea and 0 unit of coffee in the warehouse
    When Manager asks for the list of available ingredients in the warehouse
    Then Manager receives 200

  Scenario: Manager wants to check the list of available ingredients in the warehouse
    Given there are no ingredients in the warehouse
    When Manager asks for the list of available ingredients in the warehouse
    Then Manager receives 404

