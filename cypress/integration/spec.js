/// <reference types="cypress" />
describe('page', () => {
  it('works', () => {
    cy.visit('/');
    cy.get('button')
      .downloadFile()
      .then(JSON.parse)
      .then(function(json) {
        expect(json).to.eql({
          hello: 'world'
        });
      });
  });
});
