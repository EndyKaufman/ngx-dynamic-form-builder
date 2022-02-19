/// <reference types="cypress" />
describe('Check common logic', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(1000);
  });

  it('display errors after first init', () => {
    cy.get(
      'body > app-root > new-api > form > fieldset > fieldset.name > span'
    ).should('have.text', ' name should not be empty ');
    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.House > span'
    ).should('have.text', ' house should not be empty ');
    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.name > span'
    ).should('have.text', ' name should not be empty ');
    cy.get('body > app-root > new-api > form > p:nth-child(2) > span').should(
      'have.text',
      '"INVALID"'
    );
    cy.get('body > app-root > new-api > form > p:nth-child(3) > span').should(
      'have.text',
      `{
  "name": "",
  "groups": [],
  "company": {
    "name": "",
    "country": "",
    "state": "",
    "house": "",
    "permissions": []
  },
  "cabinets": [],
  "peopleAges": [],
  "transports": []
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(4) > span').should(
      'have.text',
      `{
  "name": {
    "messages": [
      "name should not be empty"
    ]
  },
  "company": {
    "children": {
      "name": {
        "messages": [
          "name should not be empty"
        ]
      },
      "house": {
        "messages": [
          "house should not be empty"
        ]
      }
    }
  }
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(5) > span').should(
      'have.text',
      `{
  "name": [
    "name should not be empty"
  ],
  "company": {
    "name": [
      "name should not be empty"
    ],
    "house": [
      "house should not be empty"
    ]
  }
}`
    );
  });

  it('remove all errors after load default data', () => {
    cy.get('.onLoadClick').click();
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

  it('remove all errors after twice load default data', () => {
    cy.get('.onLoadClick').click();
    cy.wait(1000);
    cy.get('.onLoadClick').click();
    cy.wait(1000);

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
  it('display errors after clear all inputs', () => {
    cy.get('.onClearClick').click();
    cy.wait(600);

    cy.get(
      'body > app-root > new-api > form > fieldset > fieldset.name > span'
    ).should('have.text', ' name should not be empty ');
    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.Jurisdiction > fieldset.House > span'
    ).should('have.text', ' house should not be empty ');
    cy.get(
      'body > app-root > new-api > form > fieldset > div > fieldset > fieldset.name > span'
    ).should('have.text', ' name should not be empty ');
    cy.get('body > app-root > new-api > form > p:nth-child(2) > span').should(
      'have.text',
      '"INVALID"'
    );
    cy.get('body > app-root > new-api > form > p:nth-child(3) > span').should(
      'have.text',
      `{
  "name": "",
  "groups": [],
  "company": {
    "name": "",
    "country": "",
    "state": "",
    "house": "",
    "permissions": []
  },
  "cabinets": [],
  "peopleAges": [],
  "transports": []
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(4) > span').should(
      'have.text',
      `{
  "name": {
    "messages": [
      "name should not be empty"
    ]
  },
  "company": {
    "children": {
      "name": {
        "messages": [
          "name should not be empty"
        ]
      },
      "house": {
        "messages": [
          "house should not be empty"
        ]
      }
    }
  }
}`
    );
    cy.get('body > app-root > new-api > form > p:nth-child(5) > span').should(
      'have.text',
      `{
  "name": [
    "name should not be empty"
  ],
  "company": {
    "name": [
      "name should not be empty"
    ],
    "house": [
      "house should not be empty"
    ]
  }
}`
    );
  });

  it('validate and get json data for save', () => {
    cy.get('.onLoadClick').click();
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
  });
});
