const validator = (function() {
    regexEmailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return {
        yourNameValid: function(text) {
            if (typeof text === "string" && text != "") {
                document.getElementById("yourNameAns").innerHTML = "";
            } else {
                document.getElementById("yourNameAns").innerHTML = "Name field cannot be empty";
            }
        },
        yourAddressValid: function(text) {
            if (typeof text === "string" && text != "") {
                document.getElementById("yourAddressAns").innerHTML = "";
            } else {
                document.getElementById("yourAddressAns").innerHTML = "Please provide an address";
            }
        },
        yourEmailValid: function(text) {
            if (regexEmailValid.test(text)) {
                document.getElementById("yourEmailAns").innerHTML = "";
            } else {
                document.getElementById("yourEmailAns").innerHTML = "Please input a valid email address";
            }
        },
        yourPhoneNumValid: function(text) {
            if (text == "") {
                document.getElementById("yourPhoneNumAns").innerHTML = "Please fill out phone number field";
            } else if (!isNaN(text) && text.length == 10) {
                document.getElementById("yourPhoneNumAns").innerHTML = "";
            } else if (text.length < 10) {
                document.getElementById("yourPhoneNumAns").innerHTML = "Please provide a valid phone number"
            } else {
                document.getElementById("yourPhoneNumAns").innerHTML = "Only use digits to input phone number";
            }
        }
    };
}());

function validateForm() {
    validator.yourNameValid(document.getElementById("yourName").value);
    validator.yourAddressValid(document.getElementById("yourAddress").value);
    validator.yourEmailValid(document.getElementById("yourEmail").value);
    validator.yourPhoneNumValid(document.getElementById("yourPhoneNum").value);
}
