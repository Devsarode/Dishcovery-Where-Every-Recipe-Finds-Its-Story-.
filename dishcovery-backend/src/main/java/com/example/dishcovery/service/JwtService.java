package com.example.dishcovery.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

  // TODO: replace with env var/keystore in prod
  private final SecretKey key =
      Keys.hmacShaKeyFor("super-secret-change-me-32bytes-minimum!!".getBytes());

  public String generateToken(Long userId, String username){
    Instant now = Instant.now();
    return Jwts.builder()
        .setSubject(username)
        .addClaims(Map.of("uid", userId))
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(now.plusSeconds(60*60*24))) // 24h
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public record UserClaims(Long userId, String username) {}

  public UserClaims parseToken(String token){
    var claims = Jwts.parserBuilder().setSigningKey(key).build()
        .parseClaimsJws(token).getBody();
    Long uid = ((Number) claims.get("uid")).longValue();
    return new UserClaims(uid, claims.getSubject());
  }

  public String extractBearer(String header){
    if (header == null || !header.startsWith("Bearer "))
      throw new RuntimeException("Missing bearer token");
    return header.substring(7);
  }
}
