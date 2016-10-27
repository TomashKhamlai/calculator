var Calculator = {};

(function(Calculator) {
    "use strict";

    function Event(sender) {
        this._sender = sender;
        this._listeners = [];
    }

    Event.prototype = {
        attach: function(listener) {
            this._listeners.push(listener);
        },
        notify: function(args) {
            var index;

            for (index = 0; index < this._listeners.length; index += 1) {
                this._listeners[index](this._sender, args);
            }
        }
    };

    function CalculatorModel() {
        var self = this,
            defaults = {};
        // properties
        this._definition = 0;
        this._expression = "";
        // events
        this.expressionChanged = new Event(this);
        this.expressionEvaluated = new Event(this);
        this.definitionChanged = new Event(this);

        (function(expression, definition, ob) {
            // console.log(expression, ' ', definition);
            ob.expr = expression;
            ob.def = definition;
            defaults = ob;
            return defaults;
        })(this._expression, this._definition, defaults);

        //methods
        this.resetExpression = function() {
            // console.log(defaults.def);
            // console.log(defaults.expr);
            //self._definition = defaults.def;
            self._expression = defaults.expr;
        };

        this.setExpression = function(data) {
            // console.log("DATA: ", data);
            var operationSign = "";
            var value = "";
            if (data.operation && data.operation !== '=') {
                operationSign = " " + data.operation + " ";
                //console.log(operationSign);
            }
            if (data.value) {
                value = operationSign + data.value;
                // console.log(value);
            }
            self._expression += value;
            // console.log("SE: ", self._expression);
            self.expressionChanged.notify({});
        };

        this.setDefinition = function(value) {
            self._definition = value.substring(0, 9);
            self.definitionChanged.notify({ value: value });
            self.resetExpression();
        };

        this.evaluateExpression = function() {
            // add some helpers
            // return what Array.prototype.pop() returns
            // without changing of the array 
            if (!Array.prototype.last) {
                Array.prototype.last = function() {
                    return this[this.length - 1];
                };
            }

            //checks if array is inhabitant
            if (!Array.prototype.empty) {
                Array.prototype.empty = function() {
                    return this.length === 0;
                };
            }

            var operators = {
                    // declaration and implementation of the supported operators
                    '+': function(x, y) {
                        return x + y;
                    },
                    '-': function(x, y) {
                        return x - y;
                    },
                    '×': function(x, y) {
                        return x * y;
                    },
                    '÷': function(x, y) {
                        return x / y;
                    }
                },
                expression = self._expression,
                definition = evaluate(expression);

            self.setDefinition(definition);
            //addition("+") and substraction("-") have priority "1"
            //multiplication and substraction have priority "2"
            function getPriority(operand) {
                return operand === '+' ||
                    operand === '-' ? 1 :
                    operand === '×' ||
                    operand === '÷' ? 2 :
                    -1; //common code for errors, not obvious, but let it be

            }
            // One step functions called from two different situations
            function operate(operands, func) {
                var right = parseFloat(operands.pop());
                // console.log('right ', right);
                var left = parseFloat(operands.pop());
                // console.log('left ', left);
                // console.log('func ', func);
                operands.push(operators[func](left, right).toString());

            }

            // Function gets the string on input
            // In the body of this function there are two "stacks"
            //
            // The string transformed to array by space delimiter.
            // Elements of array could be signed numbers and operation signs
            // => "-8", "22", "0", ...
            function evaluate(expr) {
                //create data containers
                var operatorsStack = [],
                    operandsStack = [],
                    exprArray = expr.split(' '),
                    len = exprArray.length;


                // convertion
                // console.log('exprArray ', exprArray);
                // console.log('len ', len);

                for (var i = 0; i < len; i++) {
                    var token = exprArray[i]; //token
                    // console.log('index: ', index);
                    // console.log('token ', token);
                    if (token in operators) {
                        // console.log('token in operators');
                        // console.log('operandsStack ', operandsStack);
                        // console.log('operatorsStack: ', operatorsStack);
                        var curentOperation = token;
                        while (!operatorsStack.empty() &&
                            getPriority(operatorsStack.last()) >= getPriority(curentOperation)) {
                            operate(operandsStack, operatorsStack.last());
                            operatorsStack.pop();
                            // console.log('operandsStack ', operandsStack);
                            // console.log('operatorsStack: ', operatorsStack);
                        }
                        operatorsStack.push(curentOperation);

                    } else {
                        // console.log('token is not in operators');
                        operandsStack.push(token);
                        // console.log('operandsStack ', operandsStack);
                        // console.log('operatorsStack: ', operatorsStack);
                    }
                }

                while (!operatorsStack.empty()) {
                    operate(operandsStack, operatorsStack.last());
                    operatorsStack.pop();
                    // console.log('operandsStack ', operandsStack);
                    // console.log('operatorsStack: ', operatorsStack);
                }
                // console.log('len: ', len);
                return operandsStack.last();
            }


        };
    }

    function CalculatorView(model, ui) {

        var self = this,
            inputButtons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
            actions = {
                "all-clear": function(act) {
                    self.funcKeyPressed.notify({ action: act });
                },
                "clear-entry": function(act) {
                    self.funcKeyPressed.notify({ action: act });
                },
                "copy": function(act, ev) {
                    self.funcKeyPressed.notify({ action: act, evt: ev });
                },
                "change-sign": function(act) {
                    self.funcKeyPressed.notify({ action: act });
                },
                "evaluate": function(act) {
                    self.funcKeyPressed.notify({ action: act });
                },
                "add": function(act) {
                    self.funcKeyPressed.notify({ action: act });
                },
                "substract": function(act) {
                    self.funcKeyPressed.notify({ action: act });
                },
                "multiply": function(act) {
                    self.funcKeyPressed.notify({ action: act });
                },
                "devide": function(act) {
                    self.funcKeyPressed.notify({ action: act });
                }
            };

        this._model = model;
        this._ui = document.getElementById(ui);
        this._display = this._ui.getElementsByClassName('screen')[0];
        this._input = this._display.firstElementChild;
        //console.log(this._display);

        // Subscribe for changes in model
        this._model.expressionEvaluated.attach(function(sender, data) {
            self._input.value = data.definition;
        });

        this._model.definitionChanged.attach(function(sender, data) {
            self._input.value = data.value;
        });

        this._model.expressionChanged.attach(function() {
            //    console.log(args);
            self._input.value = "0";
        });

        // UI logic and manipulations
        this._ui.addEventListener('click', captureClicks);
        this._ui.addEventListener('keypress', captureKeyboard);

        // this['clear-entry'] = function() {
        //     self.display.value = ""
        // }

        this.funcKeyPressed = new Event(this);

        function passInput(val) {
            // console.log('passed value: ', val);
            if (val === ".") {
                if (self._input.length === 0) {
                    self._input.value = "0.";
                } else if (self._input.value.indexOf(".") === -1) {
                    self._input.value += ".";
                }
            } else if (val === "0") {
                if (self._input.value.length === 0 || (parseFloat(self._input.value + 0, 10) === 0 && self._input.value.indexOf(".") === -1)) {
                    self._input.value = 0;
                } else {
                    self._input.value += val;
                }
            } else {
                self._input.value = parseFloat(self._input.value + val);
            }

            if (self._input.value.length > 10) {
                // console.log('l: ', self._input.value.length);
                self._input.value = self._input.value.slice(self._input.value.length - 11, self._input.value.length - 1);
            }
        }

        function captureKeyboard(evt) {
            evt.preventDefault();
            evt.returValue = false;
            var keyCode = evt.keyCode,
                chrCode = "",
                action = "",
                value = "";

            if (evt.charCode !== null) {
                chrCode = evt.charCode;
            } else if (evt.which !== null) {
                chrCode = evt.which;
            } else if (evt.keyCode !== null) {
                chrCode = evt.keyCode;
            }


            action = getAction(keyCode);
            // console.log("action: ", action, " keyCode: ", keyCode);
            value = String.fromCharCode(chrCode);
            //console.log("value: ", value);
            //};
            CaptureInput(evt, action, value);

            function getAction(keyC) {
                switch (keyC) {
                    case 8: // 8
                        console.log('backspase pressed');
                        return "clear-entry";

                    case 13: // 13
                        // console.log('enter pressed');
                        return "evaluate";

                    case 42: // 106
                        // console.log('multiply pressed');
                        return "multiply";

                    case 43: // 107
                        // console.log('plus pressed');
                        return "add";

                    case 45: // 109
                        // console.log('minus pressed');
                        return "substract";

                        // 110
                    case 47: // 111
                        // console.log('devide pressed');
                        return "devide";

                    default:
                        // console.log('puted');
                        return "put";
                }
            }
        }

        function CaptureInput(evt, action, value) {
            if (action in actions) {
                actions[action](action, evt);
            }

            if (inputButtons.indexOf(value) > -1) {
                // console.log(value);
                passInput(value);
            }
        }

        function captureClicks(evt) {
            var target = evt.target,
                action = target.getAttribute('data-action') || "put",
                value = target.value;

            CaptureInput(evt, action, value);
        }
    }

    function CalculatorController(model, view) {
        this._model = model;
        this._view = view;
        var self = this;

        function copy(evt) {
            var t = evt.target;
            var c = t.getAttribute("data-target");
            var inp = (c ? document.querySelector(c) : null);

            if (inp && inp.select) {
                inp.select();
                var success = false;

                try {
                    // copy text
                    success = document.execCommand('copy');
                } catch (err) {
                    success = false;
                }

                if (success) {
                    //console.log("inp: ", inp.value)
                    var backup = inp.value;
                    inp.blur();
                    self._view._input.value = "Copied!";
                    setTimeout(function() { self._view._input.value = backup; }, 1500);

                } else {
                    alert('please press Ctrl/Cmd+C to copy');
                }
            }
        }
        //this["clear-enry"] = View.clearEntry();
        //this["all-clear"] = this.allClear();
        this._view.funcKeyPressed.attach(function(sender, args) {
            var value, operation;
            //console.log('performed action: ', args.action);
            switch (args.action) {
                case "all-clear":
                    self._model.setExpression({ operation: "", value: "" });
                    break;
                case "change-sign":
                    self._view._input.value *= -1;
                    break;
                case "clear-entry":
                    //console.log('user is clearing');
                    self._view._input.value = self._view._input.value.slice(0, self._view._input.value.length - 1);
                    break;
                case "copy":
                    copy(args.evt);
                    // console.dir(args);
                    // console.log('copied');
                    break;
                case "add":
                    operation = self._view._display.getAttribute("data-before") || "";
                    value = self._view._input.value;
                    self._model.setExpression({ operation: operation, value: value });
                    self._view._display.setAttribute("data-before", "+");
                    break;
                case "substract":
                    operation = self._view._display.getAttribute("data-before") || "";
                    value = self._view._input.value;
                    self._model.setExpression({ operation: operation, value: value });
                    self._view._display.setAttribute("data-before", "-");
                    break;
                case "multiply":
                    //console.log('self._view: ', self._view._input.value);
                    //console.log("data-before: ", self._view._display.getAttribute("data-before"));
                    operation = self._view._display.getAttribute("data-before") || "";
                    value = self._view._input.value;
                    self._model.setExpression({ operation: operation, value: value });
                    self._view._display.setAttribute("data-before", "×");
                    break;
                case "devide":
                    operation = self._view._display.getAttribute("data-before") || "";
                    value = self._view._input.value;
                    self._model.setExpression({ operation: operation, value: value });
                    self._view._display.setAttribute("data-before", "÷");
                    break;
                case "evaluate":
                    operation = self._view._display.getAttribute("data-before") || "";
                    //console.log(operation);
                    value = self._view._input.value;
                    //console.log(value);
                    self._model.setExpression({ operation: operation, value: value });
                    self._model.evaluateExpression();
                    self._view._display.setAttribute("data-before", "=");
                    break;
                default:
                    // console.log('default')
                    break;
            }
        });
    }

    Calculator.initialize = function() {
        var model = new CalculatorModel(),
            view = new CalculatorView(model, "calculator"),
            controller = new CalculatorController(model, view);
    };

})(Calculator);
