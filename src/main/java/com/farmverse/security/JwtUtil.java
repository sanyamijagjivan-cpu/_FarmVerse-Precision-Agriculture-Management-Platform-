package com.farmverse.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET =
            "farmverseSecretKeyfarmverseSecretKey123456";

    private final Key key =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    private final long EXPIRATION = 86400000;

    public String generateToken(String email){

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(System.currentTimeMillis()+EXPIRATION)
                )

                .signWith(key, SignatureAlgorithm.HS256)

                .compact();

    }

    public String extractUsername(String token){

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody()

                .getSubject();

    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails){

        String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);

    }

    private boolean isTokenExpired(String token){

        Date expiration =
                Jwts.parserBuilder()

                        .setSigningKey(key)

                        .build()

                        .parseClaimsJws(token)

                        .getBody()

                        .getExpiration();

        return expiration.before(new Date());

    }

}
