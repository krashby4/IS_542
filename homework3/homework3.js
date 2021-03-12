const validator = (function() {
    let isValid = true;
    regexEmailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return {
        isNumeric: function(text) {
            isValid = !isNaN(text);
        },
        isInteger: function(text) {
            isValid = Number.isInteger(text);
        },
        isPositiveInteger: function(text) {
            isValid = Number.isInteger(text) && text > 0;
        },
        isNegativeInteger: function(text) {
            isValid = Number.isInteger(text) && text < 0;
        },
        isNonNegativeInteger: function(text) {
            isValid = Number.isInteger(text) && text >= 0;
        },
        isInRange: function(text, m, n) {
            if (!isNaN(text)) {
                if (m === undefined) {
                    isValid = text <= n;
                } else if (n === undefined) {
                    isValid = text >= m;
                } else {
                    isValid = text <= n && text >= m;
                }
            } else {
                isValid = false;
            }
        },
        isValidEmail: function(text) {
            isValid = regexEmailValid.test(text);
        },
        isNonEmpty: function(text) {
            isValid = (typeof text === "string" && text != "");
        },
        lengthIsInRange: function(text, m, n) {
            if (typeof text === "string") {
                if (m === undefined) {
                    isValid = text.length <= n;
                } else if (n === undefined) {
                    isValid = text.length >= m;
                } else {
                    isValid = text.length <= n && text.length >= m;
                }
            } else {
                isValid = false;
            }
        },
        matchesRegex: function(text, regex) {
            isValid = regex.test(text);
        },
        isValid: function() {
            return isValid;
        },
        reset: function() {
            isValid = true;
        }
    };
}());