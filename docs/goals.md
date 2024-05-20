---
title: Goals
layout: default
nav_order: 2
---

# Goals
// TODO introduction

## Scenarios
// TODO introduction

### Impact Map
// TODO introduction
![Impact map of the project](resources/images/Impact%20Map.png)

### Business Goals
* Allowing the customers to make orders in an easier way using a web app
* Allowing the employees to manage them in real time from an application
* Allowing the management of the menu in an easier way using a web app
* Allowing the management of the inventory in an easier way using a web app

### Project goal
The goal of our project is to:
* Front-end:
  * implement a Java application (for the employees)
  * implement an Angular application (for the customers)
  * implement an Angular application (for the managers)
* Back-end:
  * implement microservices exposing REST API
  * implement a WebSocket connection with a server that interacts behind the scenes with microservices

We implement also containerization using Docker.

### Continuous Integration

* Usage of Continuous Integration processes to:
  * Back-end self-assessment policy and quality assurance: 
    * In order to keep development and main branches clean, it’s required to use pull requests. Each of them starts the CI. It checks if the code is formatted, if all tests pass and if the coverage is high enough
    * After every push on development and main branches CI releases the new code and the relative information on SonorCloud. The developers have to follow the hints given by tool
    * Each commit is signed and it must follow the “conventional commits pattern”
  * After every push CI will start the *semantic release*
  * Generate and deliver the code documentation automatically (using adequate plugins)

## Requirements

### Client Interview
In the following section it’s reported the first interview with the client.  
*“I’m the owner of a cafè and I’m quite interested in introducing new technologies to help my activity to modernize since my customers and my employees are generally really young. 
My idea is to have three different softwares to use: I was thinking about a web application for the customers, that will allow them to make orders, a software for our PC, that the waiters and the kitchen staff can use, and a web application for our managers to help them manage the inventory and the menu of the cafè. 
I had this idea because we manage everything on paper and it starts to be quite complicated. 
The menu changes quite frequently because we use seasonal products and when an item runs out my waiters have to remember it because there is no way to indicate it on the old paper menus. Also, I want to avoid too long queues for take away and too many phone calls to make home delivery orders. All the orders will be made by the application and when they are ready the system will notify the customer using the email he left at the moment of the order.
Paper orders go missing quite frequently and sometimes they are made twice. I want to avoid that, too.
Also the inventory is quite complicated to do manually, so some kind of database would be fantastic.
In the first version of this project there is no need to implement any payment system.
I’d like something quite simple and usable, we are not a fancy cafè!”*

### Functional requirements

* Web app for customers:
  * (Menu)
    * list available menu items
    * add an item in the order recap
  * (Orders)
    * modify the order
    * choose the type of order (from the table, take-away, home delivery)
    * send the order
    * receive emails from the system
* Software for employees:
  * (Orders management)
    * show recap of the different orders in real time
    * change the status of the order
* Web app for manager:
  * (Warehouse management)
    * manage ingredients and their quantity
    * restock missing ingredients
    * keep some ingredients information
  * (Menu management)
    * manage items and their recipe
    * keep some items information
  * (Notifications)
    * receive missing ingredients notifications














