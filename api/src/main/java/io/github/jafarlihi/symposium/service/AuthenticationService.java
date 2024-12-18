package io.github.jafarlihi.symposium.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import io.github.jafarlihi.symposium.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class uthenticationService {

    private Algorithm jwtAlgorithm;
    private JWTVerifier jwtVerifier;

    @Autowired
    public AuthenticationService(@Value("${jwt.secret}") String secret) {
        jwtAlgorithm = Algorithm.HMAC256(secret);
        jwtVerifier = JWT.require(jwtAlgorithm).build();
    }

    public String createToken(User user) {
        return JWT.create().withClaim("user_id", user.getId()).sign(jwtAlgorithm);
    }

    public Long getTokenUserId(String token) throws JWTVerificationException {
        DecodedJWT jwt = jwtVerifier.verify(token);
        return jwt.getClaim("user_id").asLong();
    }
}
