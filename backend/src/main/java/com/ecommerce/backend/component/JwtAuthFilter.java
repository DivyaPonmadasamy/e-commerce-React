package com.ecommerce.backend.component;

import java.io.IOException;
import java.util.Set;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.backend.services.JwtService;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    // endpoints we want to skip from filtering (add more if needed)
    private static final Set<String> SKIP_PATHS = Set.of(
            "/login",
            "/register",
            "/getallproducts",
            "/validatetoken",
            "/saveuser",
            "/products/**",
            "/getallcategories");

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // --- 1) skip preflight and explicit public paths ---
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())
                || SKIP_PATHS.stream().anyMatch(path -> request.getRequestURI().startsWith(path))) {
            filterChain.doFilter(request, response);
            return;
        }

        // --- 2) extract token from cookie ---
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // --- 3) validate and set security context ---
        try {
            if (token != null && jwtService.validateToken(token)) {
                String email = jwtService.extractEmail(token);
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                            null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            // token parsing/validation failed — do not set authentication
            // Let request continue so controller can return proper response (or you may
            // choose to send 401 here)
        }

        filterChain.doFilter(request, response);
    }
}