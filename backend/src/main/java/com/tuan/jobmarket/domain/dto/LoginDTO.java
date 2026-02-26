package com.tuan.jobmarket.domain.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginDTO {

    @NotBlank(message= "username khong duoc de trong")
    private String username;
    
    @NotBlank(message= "password khong duoc de trong")
    private String password;
    public LoginDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public LoginDTO() {
    }
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }
}
