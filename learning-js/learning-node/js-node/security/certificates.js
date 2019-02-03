"use strict";

var crypto = require('crypto');
var localFs = require('fs');

var _CBAPublicCertificates = [];    // For Validating Request
var _NuancePublicCertificates = []; // for testing
var _NuancePrivateCertificate;      // For Generating Response 
var _LastValidCertificate;
var _Error;                         // Error Message if failed to load files.
var _IsError = false;				// If an Error occurs this will be set.

// Functions Called by Application.
module.exports.verifyRequest = verifyRequest;


// Loads Certificates on Startup so don't load on every request.
loadCertificates();


// ** START UNIT TEST HELPERS **
// Functions Exposed for Unit Tests.
module.exports.localVariables = localVariables;
module.exports.hasError = hasError;
module.exports.signRequest = signRequest;
// Function to expose varibles for Unit Tests.
function localVariables() {
	return {
		"CBAPublicCertificates": _CBAPublicCertificates,
		"NuancePublicCertificates": _NuancePublicCertificates,
		"NuancePrivateCertificate": _NuancePrivateCertificate,
		"Error": _Error,
		"IsError": _IsError
	};
}

// Sign Request.
/**
 * signRequest using Nuance Private Certificate.
 * @param state
 */
function signRequest(state) {

	// CBA Protocol requests the request be wrapped with 'TalkAgentRequest' so do this before generating the 'key'
	var json = JSON.stringify({ "TalkAgentRequest": state.context.input });
    console.log("[signRequest] json:" + json);
	var jsonBytes = Buffer.from(json, 'utf8');
    console.log("[signRequest] jsonBytes:" + jsonBytes);
	var sign = crypto.createSign('RSA-SHA256');
	sign.update(jsonBytes);
	var signed = sign.sign(_NuancePrivateCertificate, 'base64');
	console.log("[signRequest] signed:" + signed);

	state.context.input.NinaVars.secret = signed.toString('base64');
}

// ** END UNIT TEST HELPERS **

// Verify the Request signature using public key.
function verifyRequest(state) {
    console.log("[verifyRequest]");
	if (hasError(state)) {
		return false;
	}
	var isDebug = state.context.sessionData.settings.returnSessionInResponse;
	var debug = state.context.sessionData.debug;

	var request = { "TalkAgentRequest": state.context.input };
	var secret = state.context.input.NinaVars.secret;
	request.TalkAgentRequest.NinaVars.secret = undefined;

	var json = JSON.stringify(request);
	var jsonBytes = Buffer.from(json, 'utf8');
	var secretBytes = Buffer.from(secret, 'base64');

	if (isDebug) {
		debug.requestJsonValidate = json;

		var data = '';
		for (var i = 0; i < jsonBytes.length; i++) {
			data += jsonBytes[i].toString() + ',';
		}
		debug.requestJsonBytes = data;

		data = "";
		for (i = 0; i < secretBytes.length; i++) {
			data += secretBytes[i].toString() + ',';
		}
		debug.requestSecretBytes = data;
	}

	return selectAndVerifyCertificate(jsonBytes, secretBytes, state);
}

function selectAndVerifyCertificate(jsonBytes, secretBytes, state) {
    console.log("[selectAndVerifyCertificate]");
    // console.log("[selectAndVerifyCertificate] jsonBytes:" + jsonBytes);
    // console.log("[selectAndVerifyCertificate] secretBytes:" + secretBytes);

	var result = false;

	// Use the last certificate that matched.
/*	if (_LastValidCertificate != undefined) {
		result = verifySignature(jsonBytes, secretBytes, _LastValidCertificate);
		state.context.sessionData.debug.signatureMatched = true;

		if (result === true) {
			return true;
		}
	}*/

	// If we get here the verification failed or no certificate has been selected.
	var logmsg = state.context.sessionData.settings.useNuanceCertificates ? "using _NuancePublicCertificates" : "using _CBAPublicCertificates";
	console.log(logmsg);
	var certificates = state.context.sessionData.settings.useNuanceCertificates ? _NuancePublicCertificates : _CBAPublicCertificates;

	for (var i = 0; i < certificates.length; i++) {
		result = verifySignature(jsonBytes, secretBytes, certificates[i]);

		if (result === true) {
			// assign the certificate that worked so we don't spend time trying all certificates for every request.
			_LastValidCertificate = certificates[i];
			return true;
		}
	}

	return false;
}

function verifySignature(jsonBytes, secretBytes, certificate) {
    console.log("[verifySignature] jsonBytes:" + jsonBytes);
    console.log("[verifySignature] secretBytes:" + secretBytes);
    console.log("[verifySignature] certificate:" + certificate);

	var verifier = crypto.createVerify('sha256');
	verifier.update(jsonBytes);
	var result = verifier.verify(certificate, secretBytes, 'base64');
    console.log("[verifySignature] result:" + result);
	return result;
}

function hasError(state) {
	if (_IsError) {
		state.context.sessionData.debug.certificateError = _Error;
		// Try to load Certificates again:
		loadCertificates();
		if (_IsError) {
			state.context.sessionData.debug.certificateTryAgain = "Error: " + _Error;
		} else {
			state.context.sessionData.debug.certificateTryAgain = "Success";
		}
	}

	return _IsError;
}

// Preload what we can for Certificates Checking. This will save having to do for every request.
function loadCertificates() {
	_IsError = false;
    loadNuancePublicCertificates("/Users/dlee/code/sandbox/sandbox-repo/learning-java/learning.node/js-node/security/Certificates/Nuance/Public");
    loadNuancePrivateCertificate("/Users/dlee/code/sandbox/sandbox-repo/learning-java/learning.node/js-node/security/Certificates/Nuance/Private");  // May Comment out after Nuance testing.
    loadCBAPublicCertificates("/Users/dlee/code/sandbox/sandbox-repo/learning-java/learning.node/js-node/security/Certificates/CBA/Public");
}

// Load the single Nuance Certificate
function loadNuancePublicCertificates(path) {
	try {
		var files = localFs.readdirSync(path);
		for (var i = 0; i < files.length; i++) {
			_NuancePublicCertificates.push(localFs.readFileSync(path + "/" + files[i], "utf8"));
            // console.log("_NuancePublicCertificates:" + _NuancePublicCertificates[i]);
		}

		if (_NuancePublicCertificates.length < 1) {
			_IsError = true;
			_Error = "loadNuancePublicCertificates(). No Certificates Found in: " + path;
		}
	} catch (ex) {
		_IsError = true;
		_Error = "loadNuancePublicCertificates(). " + ex;
		console.error(_Error);
	}
}

// Load the Nuance private certificate
function loadNuancePrivateCertificate(path) {
	try {
		var files = localFs.readdirSync(path);
		for (var i = 0; i < files.length; i++) {
			_NuancePrivateCertificate = localFs.readFileSync(path + "/" + files[i], "utf8");  // if more than one will assign the last one. (shouldn't be more than one!)
            // console.log("_NuancePrivateCertificate:" + _NuancePrivateCertificate[i]);
		}

		if (_NuancePublicCertificates.length < 1) {
			_IsError = true;
			_Error = "loadNuancePrivateCertificate(). No Certificates Found in: " + path;
		}
	} catch (ex) {
		_IsError = true;
		_Error = "loadNuancePrivateCertificate(). " + ex;
	}
}

// Load the CBA Public Certificates
function loadCBAPublicCertificates(path) {
	try {
		var files = localFs.readdirSync(path);
		for (var i = 0; i < files.length; i++) {
			_CBAPublicCertificates.push(localFs.readFileSync(path + "/" + files[i], "utf8"));
            // console.log("_CBAPublicCertificates:" + _CBAPublicCertificates[i]);
		}

		if (_CBAPublicCertificates.length < 1) {
			_IsError = true;
			_Error = "loadCBAPublicCertificates(). No Certificates Found in: " + path;
		}
	} catch (ex) {
		_IsError = true;
		_Error = "loadCBAPublicCertificates(). " + ex;
	}
}