Feature: Test NASA's JPL API
Scenario Outline: Correct Schema for dist-max filter with limited data by min-date
    Given I want to know NEO close approaches data within "3" "<units>" units since "2020-01-01"
    When I send the NASA's JPL API
    Then I receive an OK response with defined "mandatory with data" response scheme
    And received data matches query conditions

Examples:
    | units        |
   # | lunar        |
    | astronomical |