<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" entityID="https://portal.touchcommerce.com/default">
    <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:1.1:protocol urn:oasis:names:tc:SAML:2.0:protocol">
        <md:KeyDescriptor use="signing">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                    <ds:X509Certificate>${cert}</ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:KeyDescriptor use="encryption">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                    <ds:X509Certificate>${cert}</ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${protocol}${domain}/portal/SSLEndpoint.jsp?so=default-sp"/>
        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${protocol}${domain}/portal/SSOEndpoint.jsp" index="0"/>
        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:1.0:profiles:browser-post" Location="${protocol}${domain}/portal/SSOEndpoint.jsp/saml/sp/saml1-acs.php/default-sp" index="1"/>
        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact" Location="${protocol}${domain}/portal/SSOEndpoint.jsp/saml/sp/saml2-acs.php/default-sp" index="2"/>
        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:1.0:profiles:artifact-01" Location="${protocol}${domain}/portal/SSOEndpoint.jsp/saml/sp/saml1-acs.php/default-sp/artifact" index="3"/>
    </md:SPSSODescriptor>
    <md:ContactPerson contactType="technical">
        <md:GivenName>Fred</md:GivenName>
        <md:SurName>Pinn</md:SurName>
        <md:EmailAddress>fpinn@touchcommerce.com</md:EmailAddress>
    </md:ContactPerson>
</md:EntityDescriptor>