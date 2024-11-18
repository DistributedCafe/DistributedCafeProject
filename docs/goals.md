---
title: Goals
layout: default
nav_order: 2
---

# Goals
// TODO introduction

## Scenarios

### Impact Map
![Impact map of the project](resources/images/Impact%20Map.png)

### Scenarios with Gherkin

We used Gherkin to better identify the warehouse use cases and testing them.
``` 
Feature: Interacting with the warehouse

  Scenario Outline: Manager adds a new ingredient
    Given there are 99 units of milk and 4 units of tea in the warehouse
    When Manager adds an ingredient with name <name> and quantity <quantity>
    Then Manager receives <response> and message <message>
    Examples:
      |name     |quantity |response | message                          |
      |milk     |99       |400      | ERROR_INGREDIENT_ALREADY_EXISTS  |
      |butter   |-2       |400      | ERROR_WRONG_PARAMETERS           |
      |coffee   |5        |200      | OK                               |
      
  ```

## Business Goals
* Allowing the customers to make orders in an easier way using a web app
* Allowing the employees to manage them in real time from an application
* Allowing the management of the menu in an easier way using a web app
* Allowing the management of the inventory in an easier way using a web app

## Project goal
The goal of our project is to:
* Front-end:
  * implement a Java application (for the employees)
  * implement an Angular application (for the customers)
  * implement an Angular application (for the managers)
* Back-end:
  * implement microservices exposing REST API
  * implement a WebSocket connection with a server that interacts behind the scenes with microservices

We implement also containerization using Docker.

## Continuous Integration

* Usage of Continuous Integration processes to:
  * Back-end self-assessment policy and quality assurance: 
    * In order to keep development and main branches clean, it’s required to use pull requests. Each of them starts the CI. It checks if the code is formatted, if all tests pass and if the coverage is high enough
    * After every push on development and main branches CI releases the new code and the relative information on SonarCloud. The developers have to follow the hints given by tool
    * Each commit is signed and it must follow the “conventional commits pattern”
  * After every push CI will start the *semantic release* in the main branch
  * Generate and deliver the code documentation automatically (using adequate plugins)
















