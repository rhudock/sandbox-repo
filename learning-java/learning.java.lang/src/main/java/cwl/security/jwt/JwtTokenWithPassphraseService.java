package cwl.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.TextCodec;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * create and validate JWT tokens for Apple iMessage server
 *
 */
@Service
public class JwtTokenWithPassphraseService {

    public static String createJwtToken() {
        return createJwtToken("f740e2e4-9d87-11e7-8f5a-7b88b04daa8e", TextCodec.BASE64.decode("OkuHIn9j3AmbZVEigpzKsLWWfXF7IFye/39elSUsTwU="));
    }

    public static String createJwtToken(String cspId, byte[] passPhraseByte) {
        Date now = new Date();

        String jws = Jwts.builder()
                .setIssuer(cspId)
                .setIssuedAt(now)
                .signWith(
                        SignatureAlgorithm.HS256,
                        passPhraseByte
                )
                .compact();

        return jws;
    }

    public static Claims verifySigniture(String jwt, byte[] passPhraseByte) {
        Claims claims = Jwts.parser()
                .setSigningKey(passPhraseByte)
                .parseClaimsJws(jwt).getBody();
        return claims;
    }
}
