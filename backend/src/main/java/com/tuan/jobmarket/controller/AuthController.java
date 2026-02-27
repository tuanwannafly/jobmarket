package com.tuan.jobmarket.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.domain.dto.LoginDTO;
import com.tuan.jobmarket.domain.dto.ResLoginDTO;
import com.tuan.jobmarket.service.UserService;
import com.tuan.jobmarket.util.SecurityUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final UserService userService;
    

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil,
            UserService userService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.userService = userService;
    }


    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        String access_token = this.securityUtil.createToken(authentication);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        ResLoginDTO res = new ResLoginDTO();

        User currentUser = this.userService.handleGetUserByUsername(loginDTO.getUsername());
        if(currentUser != null) 
        {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(currentUser.getId(), currentUser.getEmail(), currentUser.getName());
            res.setUser(userLogin);
        }
        res.setAccessToken(access_token);
        return ResponseEntity.ok().body(res);
    }
}
