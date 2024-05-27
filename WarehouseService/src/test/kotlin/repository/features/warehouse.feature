Feature: Interacting with the warehouse

  Scenario: Manager wants to check the list of ingredients in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager asks for the list of ingredients in the warehouse
    Then Manager receives a list of ingredients with only milk and tea

  Scenario Outline: Manager adds a new ingredient
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager adds an ingredient with name <name> and quantity <quantity>
    Then Manager receives <response>
    Examples:
      |name     |quantity |response |
      |milk     |99       |ERROR    |
      |coffee   |5        |OK       |

  Scenario Outline: Manager wants to check if <name> is present in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager asks if <name> is present
    Then Manager receives <response>
    Examples:
      |name     |response |
      |milk     |true     |
      |coffee   |false    |

  Scenario Outline: Manager wants to check the quantity of <name> in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager asks the quantity of the <name>
    Then Manager receives <quantity>
    Examples:
      |name     |quantity |
      |milk     |99       |
      |coffee   |null     |

  Scenario Outline: Manager wants to restock the tea in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager restocks the <name> adding <quantity> units
    Then Manager receives <response>
    Examples:
      |name   |quantity |response |
      |tea    |5        |OK       |
      |coffee |10       |ERROR    |
