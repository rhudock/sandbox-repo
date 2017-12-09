"use strict";

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
	if (_LastValidCertificate != undefined) {
		result = verifySignature(jsonBytes, secretBytes, _LastValidCertificate);
		state.context.sessionData.debug.signatureMatched = true;

		if (result === true) {
			return true;
		}
	}

	// If we get here the verification failed or no certificate has been selected.
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
