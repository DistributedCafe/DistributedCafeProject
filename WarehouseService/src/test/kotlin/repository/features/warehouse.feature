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
      |name |  quantity |response |
      |milk     | 99    |      ERROR   |
      |coffee         | 5 | OK         |

  Scenario: Manager wants to check if milk is present in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager asks if milk is present
    Then Manager receives "true"

  Scenario: Manager wants to check the quantity of milk in the warehouse
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager asks the quantity of the milk
    Then Manager receives 99
