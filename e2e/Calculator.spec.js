import assert from 'assert';

describe('Simple calculator', function() {

    describe('Title bar', function(done) {
        it('should have the titlebar "Simple calculator"', function(done) {
            browser.url('http://localhost:3000');
            assert.equal(browser.getTitle(), 'Simple calculator');

        });
    });

    describe('Support input with mouse', function() {

        describe('Simple calculator is able to add numbers', function() {
            it('should add two numbers 3 and 7 and show 10', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#three');
                browser.click('[data-action="add"]');
                browser.click('#seven');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '10');

            });

            it('should add three numbers 8, 7 and 4 and show 19', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#eight');
                browser.click('[data-action="add"]');
                browser.click('#seven');
                browser.click('[data-action="add"]');
                browser.click('#four');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '19');

            });

            it('should add two numbers 5, 9 and add 2 to the result and show 16', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#five');
                browser.click('[data-action="add"]');
                browser.click('#nine');
                browser.click('[data-action="evaluate"]');
                browser.click('[data-action="add"]');
                browser.click('#two');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '16');

            });
        });

        describe('Simple calculator is able to substract numbers', function() {
            it('should solve expression "73 - 27" and show 46', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#seven');
                browser.click('#three');
                browser.click('[data-action="substract"]');
                browser.click('#two');
                browser.click('#seven');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '46');

            });

            it('should solve expression with three numbers "8 - 7 - 4" and show -3', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#eight');
                browser.click('[data-action="substract"]');
                browser.click('#seven');
                browser.click('[data-action="substract"]');
                browser.click('#four');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '-3');

            });

            it('should solve "5 - 9" and substract "2" from the result and show -6', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#five');
                browser.click('[data-action="substract"]');
                browser.click('#nine');
                browser.click('[data-action="evaluate"]');
                browser.click('[data-action="substract"]');
                browser.click('#two');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '-6');
            });
        });

        describe('Simple calculator is able to multiply and devide numbers', function(done) {
            it('should solve expression "3 / 2" and show 1.5', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#three');
                browser.click('[data-action="devide"]');
                browser.click('#two');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '1.5');
            });

            it('should solve expression with three numbers "-2 * -3 * -4" and show -24', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#two');
                browser.click('[data-action="change-sign"]');
                browser.click('[data-action="multiply"]');
                browser.click('#three');
                browser.click('[data-action="change-sign"]');
                browser.click('[data-action="multiply"]');
                browser.click('#four');
                browser.click('[data-action="change-sign"]');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '-24');
            });

            it('should solve "9 / 4 * 22" and then multiply it with "2" and show 99', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#nine');
                browser.click('[data-action="devide"]');
                browser.click('#four');
                browser.click('[data-action="multiply"]');
                browser.click('#two');
                browser.click('#two');
                browser.click('[data-action="evaluate"]');
                browser.click('[data-action="multiply"]');
                browser.click('#two');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '99');
            });
        });

        describe('Simple calculator have buttons for  0, 1, 2, up to 9', function() {
            it('should have button for 0', function(done) {
                assert.equal(browser.getText('button#zero'), '0');
            });
            it('should have button for 1', function(done) {
                assert.equal(browser.getText('button#one'), '1');
            });
            it('should have button for 2', function(done) {
                assert.equal(browser.getText('button#two'), '2');
            });
            it('should have button for 3', function(done) {
                assert.equal(browser.getText('button#three'), '3');
            });
            it('should have button for 4', function(done) {
                assert.equal(browser.getText('button#four'), '4');
            });
            it('should have button for 5', function(done) {
                assert.equal(browser.getText('button#five'), '5');
            });
            it('should have button for 6', function(done) {
                assert.equal(browser.getText('button#six'), '6');
            });
            it('should have button for 7', function(done) {
                assert.equal(browser.getText('button#seven'), '7');
            });
            it('should have button for 8', function(done) {
                assert.equal(browser.getText('button#eight'), '8');
            });
            it('should have button for 9', function(done) {
                assert.equal(browser.getText('button#nine'), '9');
            });
            it('should have button for decimal point[.]', function(done) {
                assert.equal(browser.getText('button#dot'), '.');
            });
            it('should have button for addition operation[+]', function(done) {
                assert.equal(browser.getText('button[data-action="add"]'), '+');
            });
            it('should have button for substraction operation[–]', function(done) {
                assert.equal(browser.getText('button[data-action="substract"]'), '–');
            });
            it('should have button for multiplication operation [×]', function(done) {
                assert.equal(browser.getText('button[data-action="multiply"]'), '×');
            });
            it('should have button for division operation [÷]', function(done) {
                assert.equal(browser.getText('button[data-action="devide"]'), '÷');
            });
            it('should have button for defining [=]', function(done) {
                assert.equal(browser.getText('button#eq'), '=');
            });
            it('should have button for delete operation [C]', function(done) {
                assert.equal(browser.getText('button[data-action="clear-entry"]'), 'C');
            });
            it('should have button for reset operation [AC]', function(done) {
                assert.equal(browser.getText('button[data-action="all-clear"]'), 'AC');
            });
            it('should have button for copy [COPY]', function(done) {
                assert.equal(browser.getText('button[data-action="copy"]'), 'COPY');
            });
            it('should have button for changing sign [+/-]', function(done) {
                assert.equal(browser.getText('button[data-action="change-sign"]'), '+/-');
            });

            it('should have button to change the sign [+/-]', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#two');
                var two = browser.getValue('input#screen');
                browser.click('[data-action="change-sign"]');
                var magicNumber = browser.getValue('input#screen')
                assert.equal(magicNumber * -1, two);
            });

            it('should solve expression with three numbers "-2 * -3 * -4" and show -24', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#two');
                browser.click('[data-action="change-sign"]');
                browser.click('[data-action="multiply"]');
                browser.click('#three');
                browser.click('[data-action="change-sign"]');
                browser.click('[data-action="multiply"]');
                browser.click('#four');
                browser.click('[data-action="change-sign"]');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '-24');
            });

            it('should solve "9 / 4 * 22" and then multiply it with "2" and show 99', function(done) {
                browser.click('[data-action="all-clear"]');
                browser.click('#nine');
                browser.click('[data-action="devide"]');
                browser.click('#four');
                browser.click('[data-action="multiply"]');
                browser.click('#two');
                browser.click('#two');
                browser.click('[data-action="evaluate"]');
                browser.click('[data-action="multiply"]');
                browser.click('#two');
                browser.click('[data-action="evaluate"]');
                assert.equal(browser.getValue('input#screen'), '99');
            });
        });
    });

    describe('Simple calculator supports the priority of operators', function() {
        it('should evaluate expression "2 + 2 * 2" to "6", not to "8"', function(done) {
            browser.url('http://localhost:3000');
            browser.click('[data-action="all-clear"]');
            browser.click('#two');
            browser.click('[data-action="add"]');
            browser.click('#two');
            browser.click('[data-action="multiply"]');
            browser.click('#two');
            browser.click('[data-action="evaluate"]');
            assert.equal(browser.getValue('input#screen'), '6');
        });

        it('should evaluate expression "2 - 2 * 2" to "-2", not to "0"', function(done) {
            browser.url('http://localhost:3000');
            browser.click('[data-action="all-clear"]');
            browser.click('#two');
            browser.click('[data-action="substract"]');
            browser.click('#two');
            browser.click('[data-action="multiply"]');
            browser.click('#two');
            browser.click('[data-action="evaluate"]');
            assert.equal(browser.getValue('input#screen'), '-2');

        });
    });

    describe('Supports input with keyboard regardless of numpad presense', function() {
        browser.url('http://localhost:3000');
        it('should add "1 + 1"', function(done) {
            browser.click('[data-action="all-clear"]');
            browser.keys('1');
            browser.keys('+');
            browser.keys('1');
            browser.keys('Enter');
            assert.equal(browser.getValue('input#screen'), '2');
        });
    });

});
