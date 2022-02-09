/// <reference types="cypress" />
describe('Check ValidateIf logic', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(600);
  });

  it('load default data and clear field with ValidateIf logic', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);
    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > input'
    ).clear();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > span'
    ).should('have.text', ' state should not be empty ');

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
      "state should not be empty"
    ]
  }
}`
    );
  });

  it('load default data and clear field for disable error in field with ValidateIf logic', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);
    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > input'
    ).clear();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > span'
    ).should('have.text', ' state should not be empty ');

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.Country > input'
    ).clear();
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
    "country": "",
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
      `{}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(5) > span').should(
      'have.text',
      `{}`
    );
  });

  it('load default data and clear field with ValidateIf logic and set other value to input and save form', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > input'
    ).clear();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > span'
    ).should('have.text', ' state should not be empty ');

    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.State > input'
    ).type('Texas', { force: true });
    cy.wait(600);

    cy.get('.onSaveClick').click();
    cy.wait(600);

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
    "state": "Texas",
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
    cy.get('body > app-root > new-api > form > p:nth-child(6) > span').should(
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
    "state": "Texas",
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
  });
});
