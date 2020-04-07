Cypress.Commands.add(
  'downloadFile',
  {
    prevSubject: true
  },
  function(element) {
    let docstub;
    cy.document().then(function(document) {
      const createElement = document.createElement.bind(document);
      docstub = cy.stub(document, 'createElement', function(name) {
        const el = createElement(name);
        if (name === 'a') {
          const setAttribute = el.setAttribute.bind(el);
          cy.stub(el, 'setAttribute', function(attr, value) {
            switch (attr) {
              case 'href':
              case 'download':
                break;
              default:
                setAttribute(attr, value);
            }
          });
        }
        return el;
      });
    });
    cy.window().then(function(window) {
      return new Promise(function(resolve, reject) {
        try {
          //eslint-disable-next-line cypress/no-assigning-return-values
          const urlstub = cy.stub(window.URL, 'createObjectURL', function(blob) {
            Cypress.Blob.blobToBase64String(blob).then(function(string) {
              urlstub.restore();
              docstub.restore();
              resolve(atob(string));
            });
          });
          element.click();
        }
        catch (e) {
          reject(e);
        }
      });
    });
  }
);
