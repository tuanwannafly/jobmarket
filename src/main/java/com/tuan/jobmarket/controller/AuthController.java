package com.tuan.jobmarket.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tuan.jobmarket.domain.dto.LoginDTO;
import com.tuan.jobmarket.domain.dto.ResLoginDTO;
import com.tuan.jobmarket.util.SecurityUtil;

import jakarta.validation.Valid;

@RestController
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    


    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
    }



    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());

    
    Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

    
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String access_token = this.securityUtil.createToken(authentication);
    ResLoginDTO res = new ResLoginDTO();
    res.setAccessToken(access_token);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    return ResponseEntity.ok().body(res);
    }
}
