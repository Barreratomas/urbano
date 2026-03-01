describe('Flows e2e', () => {
  beforeEach(() => {
    // login bypass or use UI
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button').contains('Login').click();
    cy.url().should('include', '/');
  });

  it('should toggle favorite in courses table', () => {
    cy.visit('/courses');
    cy.get('table').should('be.visible');
    // find first heart icon and click
    cy.get('table tbody tr').first().find('button').first().click();
    // check it toggled (color change would be ideal check)
  });

  it('should navigate to calendar', () => {
    cy.get('nav').contains('Calendar').click();
    cy.url().should('include', '/calendar');
    cy.contains('Course Calendar').should('be.visible');
  });

  it('should subscribe to a course', () => {
    cy.visit('/courses');
    cy.get('table tbody tr').first().find('a').click();
    cy.url().should('match', /\/courses\/.+/);
    // toggle enroll button
    cy.get('button').then(($btn) => {
      if ($btn.text().includes('Enroll')) {
        cy.wrap($btn).click();
        cy.contains('Unenroll').should('be.visible');
      } else {
        cy.wrap($btn).click();
        cy.contains('Enroll').should('be.visible');
      }
    });
  });

  it('should send contact form', () => {
    cy.visit('/contact');
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="subject"]').type('Help');
    cy.get('textarea[name="message"]').type('Need support');
    cy.get('button').contains('Send').click();
    // cy.on('window:alert', (str) => expect(str).to.equal('Enviado'))
  });
});
