Feature: Interacting with the warehouse

  Scenario: Manager wants to check the list of ingredients in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager asks for the list of ingredients in the warehouse
    Then Manager receives a list of ingredients with only milk and tea

  Scenario Outline: Manager adds a new ingredient
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager adds an ingredient with <name> and <quantity>
    Then Manager receives a <response> from the warehouse
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
    Then Manager receives <quantity> as quantity
    Examples:
      |name     |quantity |
      |milk     |99       |
      |coffee   |null     |
