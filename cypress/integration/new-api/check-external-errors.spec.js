/// <reference types="cypress" />
describe('Check external errors', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(600);
  });

  it('load default data and set external errors', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);
    cy.get('.setExternalErrors').click();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > span'
    ).should('have.text', ' hoi ');

    cy.get(
      'body > app-root > new-api > form > fieldset > fieldset.name > span'
    ).should('not.exist');

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.House > span'
    ).should('not.exist');

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.name > span'
    ).should('not.exist');

    cy.get('body > app-root > new-api > form > p:nth-child(2) > span').should(
      'have.text',
      '"INVALID"'
    );
    cy.get('body > app-root > new-api > form > p:nth-child(3) > span').should(
      'have.text',
      `{
  "name": "dep name 1",
  "groups": [
    {
      "id": 33,
      "name": "group name 1"
    },
    {
      "id": 44,
      "name": "group name 2"
    }
  ],
  "company": {
    "name": "comp name 1",
    "country": "USA",
    "state": "California",
    "house": "221b",
    "permissions": [
      true,
      false
    ]
  },
  "cabinets": [
    55,
    66
  ],
  "peopleAges": [
    {
      "age": "18"
    }
  ],
  "transports": [
    {
      "type": "car",
      "transportNumber": "DMC-12",
      "numberOfTurbines": null,
      "numberOfWheels": 4
    },
    {
      "type": "airplane",
      "transportNumber": "Boeing 737",
      "numberOfTurbines": 2,
      "numberOfWheels": null
    }
  ]
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(4) > span').should(
      'have.text',
      `{
  "company": {
    "children": {
      "state": {
        "messages": [
          "hoi"
        ]
      }
    }
  }
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(5) > span').should(
      'have.text',
      `{
  "company": {
    "state": [
      "hoi"
    ]
  }
}`
    );
  });

  it('load default data and set and clear external errors', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);
    cy.get('.setExternalErrors').click();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > span'
    ).should('have.text', ' hoi ');

    cy.get('.unsetExternalErrors').click();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > span'
    ).should('not.exist');

    cy.get(
      'body > app-root > new-api > form > fieldset > fieldset.name > span'
    ).should('not.exist');

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.House > span'
    ).should('not.exist');

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.name > span'
    ).should('not.exist');

    cy.get('body > app-root > new-api > form > p:nth-child(2) > span').should(
      'have.text',
      '"VALID"'
    );
    cy.get('body > app-root > new-api > form > p:nth-child(3) > span').should(
      'have.text',
      `{
  "name": "dep name 1",
  "groups": [
    {
      "id": 33,
      "name": "group name 1"
    },
    {
      "id": 44,
      "name": "group name 2"
    }
  ],
  "company": {
    "name": "comp name 1",
    "country": "USA",
    "state": "California",
    "house": "221b",
    "permissions": [
      true,
      false
    ]
  },
  "cabinets": [
    55,
    66
  ],
  "peopleAges": [
    {
      "age": "18"
    }
  ],
  "transports": [
    {
      "type": "car",
      "transportNumber": "DMC-12",
      "numberOfTurbines": null,
      "numberOfWheels": 4
    },
    {
      "type": "airplane",
      "transportNumber": "Boeing 737",
      "numberOfTurbines": 2,
      "numberOfWheels": null
    }
  ]
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(4) > span').should(
      'have.text',
      `{}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(5) > span').should(
      'have.text',
      `{}`
    );
  });

  it('load default data and clear field with ValidateIf logic and set external errors', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);
    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > input'
    ).clear();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > span'
    ).should('have.text', ' state should not be empty ');

    cy.get('.setExternalErrors').click();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > span'
    ).should('have.text', ' hoi,state should not be empty ');

    cy.get(
      'body > app-root > new-api > form > fieldset > fieldset.name > span'
    ).should('not.exist');

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.House > span'
    ).should('not.exist');

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.name > span'
    ).should('not.exist');

    cy.get('body > app-root > new-api > form > p:nth-child(2) > span').should(
      'have.text',
      '"INVALID"'
    );
    cy.get('body > app-root > new-api > form > p:nth-child(3) > span').should(
      'have.text',
      `{
  "name": "dep name 1",
  "groups": [
    {
      "id": 33,
      "name": "group name 1"
    },
    {
      "id": 44,
      "name": "group name 2"
    }
  ],
  "company": {
    "name": "comp name 1",
    "country": "USA",
    "state": "",
    "house": "221b",
    "permissions": [
      true,
      false
    ]
  },
  "cabinets": [
    55,
    66
  ],
  "peopleAges": [
    {
      "age": "18"
    }
  ],
  "transports": [
    {
      "type": "car",
      "transportNumber": "DMC-12",
      "numberOfTurbines": null,
      "numberOfWheels": 4
    },
    {
      "type": "airplane",
      "transportNumber": "Boeing 737",
      "numberOfTurbines": 2,
      "numberOfWheels": null
    }
  ]
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(4) > span').should(
      'have.text',
      `{
  "company": {
    "children": {
      "state": {
        "messages": [
          "hoi",
          "state should not be empty"
        ]
      }
    }
  }
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(5) > span').should(
      'have.text',
      `{
  "company": {
    "state": [
      "hoi",
      "state should not be empty"
    ]
  }
}`
    );
  });
});
