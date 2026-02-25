package com.tuan.jobmarket.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.service.UserService;

import jakarta.validation.Valid;

@RestController
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/create/users")
    public User handeCreateUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return this.userService.handelCreateUser(user);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = this.userService.findAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser( @PathVariable("id") Long id) {
        var  user = this.userService.fecthUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser( @PathVariable("id") Long id) {
        this.userService.deleteUser(id);
        return ResponseEntity.ok("delete user");
    }
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id,@Valid @RequestBody User user) {
        User update = this.userService.handleUpdateUser(id, user);
        return ResponseEntity.status(HttpStatus.OK).body(update);
    }
}
