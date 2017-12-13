package cwl.security.jwt.example;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.NoSuchAlgorithmException;
import java.util.Date;

/**
 *
 */
public class JwtTokenHSEx {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenHSEx.class);

    private static byte[] secret = "mysecret".getBytes();

    public static void main(String[] args) throws NoSuchAlgorithmException {

        Date now = new Date();

        String jws = Jwts.builder()
                .setIssuer("issuer")
                .setIssuedAt(now)
                .signWith(
                        SignatureAlgorithm.HS256,
                        secret
                )
                .compact();

        Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(jws).getBody();


        logger.info("claims issuer is {}", claims.getIssuer());
        logger.info("claims issuered at {}", claims.getIssuedAt());
    }

}
