'use strict';

var fs = require('fs');
var assert = require('assert');

//var agentMemory = require('../mockAgentMemory.js').getAgentMemory();
// The state as it was at this part of the flow (context)
var state = require('./mockStates.js').stateModel();
var certificates = require('../certificates.js');

// Test Certificates are found.
var results = certificates.localVariables();
assert.equal(true, results.CBAPublicCertificates.length === 2);
assert.equal(true, results.NuancePublicCertificates.length === 1);
assert.equal(true, results.NuancePrivateCertificate != undefined);

// Run Verification.
// Sign Payload with private key.

// Create the request as we would recieve from Client.
state.context.input = {
	"@SCI": "",
	"@IID": "userIdentifier",
	"@TimeStamp": "2017-11-01T14:48:26.942763+10:00",
	"UserText": "userText",
	"NleResults": true,
	"NinaVars": {
		"assetType": "assetType",
		"invocationpoint": "invocationPoint"
	}
};

certificates.signRequest(state);
assert.equal(true, state.context.input.NinaVars.secret === "Mbt1I3PK1voz++CkRg+N8KEBuTF7+Ea46HhBoKnRJgwLN7AqhOYqbmkWI1h9Y7k3GtvghX4CKolZHtokyhAjSB/omD7pbn9tvuWzNmNEbeZi5BAYVPf325kMnAPmrkNBloEIWzIpJHU7lY39gdKpGii901U/afytJe0d6ncP4T5I6D2tOygcWr+N0ypTbm4EyZnF5ILAiOYFRUJDEPwLbZ0v74FNpgSxP3dfUh5JUcd38yAvyOy6xg6KfYIjF3h7f1Qm3lymxC4SnUNJJuBWwXpcYRWW7v0/l1tDnLxddW4TQKCvanNN24AIOR9t0fXcXLFtFqBZOnAiHDg4lFp2ZQ==");

// Mock up settings.
state.context.sessionData = {
	settings: {},
	debug: {}
};
state.context.sessionData.settings.useNuanceCertificates = true;  // Use Nuance Certs

// Now we have a request object setup lets Validate the Request using our public key.
var result = certificates.verifyRequest(state);
assert.equal(true, result);

// Run again just to double check.
certificates.signRequest(state);
result = certificates.verifyRequest(state);
assert.equal(true, result);

certificates.signRequest(state);
state.context.input.UserText = "james";  // Change the request object AFTER signing. Verify will fail now.
result = certificates.verifyRequest(state);
assert.equal(false, result);

state.context.sessionData.settings.useNuanceCertificates = false;  // Use CBA Certs

// Might as well make some changes to test key IS different
state.context.input = {
	"@SCI": "",
	"@IID": "userIdentifier",
	"@TimeStamp": "2017-11-01T14:48:30.942763+10:00",
	"UserText": "CBA User Text",
	"NleResults": true,
	"NinaVars": {
		"assetType": "assetType",
		"invocationpoint": "invocationPoint"
	}
};


certificates.signRequest(state);
assert.equal(true, state.context.input.NinaVars.secret === "jVxBcQ4dcIGsxw8W/jMl9MHio81rkTXpY7WBM61tSjdimXyV0fMMNfQahiSyHvWbkHPEUAUf4EGZGEABg6phS2iiTBPtyIQ5nPBoGBCoP0UaLnzZcG+PmAuAw5P21K7Aejxir/D/ip9Jeqk+PKyRXOvFgtNBwv7AzLQVHRC4ga0SFxff6eq9d52xIgzbwMNZo2yag7hI1CBPm4zNOZDhV4pvLniHnf9Ug5jevbI8bckFhOnBMRi+Bb75U6Kq9rRzM4Lwn+VtuT5adHrRIvgfUSBQ7LMAHLopEh6c4gBg1Pq8XDuf7zCuXkXpoXVR0dEAcCkWInuDSKVF6u0hJBKRIA==");

// Mock up settings.
state.context.sessionData = {
	settings: {},
	debug: {}
};
state.context.sessionData.settings.useNuanceCertificates = true;  // Use Nuance Certs

// Now we have a request object setup lets Validate the Request using our public key.
var result = certificates.verifyRequest(state);
assert.equal(true, result);

// Run again just to double check.
certificates.signRequest(state);
result = certificates.verifyRequest(state);
assert.equal(true, result);

certificates.signRequest(state);
state.context.input.UserText = "james";  // Change the request object AFTER signing. Verify will fail now.
result = certificates.verifyRequest(state);
assert.equal(false, result);