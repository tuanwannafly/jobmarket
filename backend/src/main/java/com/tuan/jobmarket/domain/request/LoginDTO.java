package com.tuan.jobmarket.domain.request;

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

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    
}
