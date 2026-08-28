package com.farmverse.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getServletPath();

        // =====================================================
        // PUBLIC APIs
        // =====================================================
        // IMPORTANT:
        // Weather is NOT included here.
        // Weather requires JWT authentication.
        // =====================================================

        if (requestPath.startsWith("/api/users/register")
                || requestPath.startsWith("/api/users/login")
                || requestPath.startsWith("/api/market-prices/")
                || requestPath.startsWith("/api/market-price-history/")
                || requestPath.startsWith("/api/crops/predict")
                || requestPath.startsWith("/api/agmarknet/")
                //|| requestPath.startsWith("/api/ai/ask")
                || requestPath.startsWith("/swagger-ui/")
                || requestPath.startsWith("/v3/api-docs/")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        String authHeader = request.getHeader("Authorization");

        String jwt = null;
        String email = null;

        try {

            // =================================================
            // CHECK BEARER TOKEN
            // =================================================

            if (authHeader != null
                    && authHeader.startsWith("Bearer ")) {

                jwt = authHeader.substring(7);

                email = jwtUtil.extractUsername(jwt);
            }

            // =================================================
            // AUTHENTICATE USER
            // =================================================

            if (email != null
                    && SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(email);

                // =================================================
                // VALIDATE JWT
                // =================================================

                if (jwtUtil.isTokenValid(
                        jwt,
                        userDetails)) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );

                    System.out.println(
                            "JWT authentication successful for: "
                                    + email
                    );
                }
            }

        } catch (Exception e) {

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(null);

            System.out.println(
                    "JWT authentication failed: "
                            + e.getMessage()
            );
        }

        // =====================================================
        // CONTINUE REQUEST
        // =====================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}