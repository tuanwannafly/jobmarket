package com.tuan.jobmarket.service;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


@Component("userDetailsSerivce")
public class CustomUserDetailsService implements UserDetailsService {
    private final UserService userSerice;

    public CustomUserDetailsService(UserService userSerice) {
        this.userSerice = userSerice;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.tuan.jobmarket.domain.User  user = this.userSerice.handleGetUserByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("User or password khong phu hop");
        }
        return new User(
            user.getEmail(),
            user.getPassword(),
            Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));
    }
}
