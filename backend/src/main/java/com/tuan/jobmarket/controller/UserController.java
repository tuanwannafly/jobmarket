package com.tuan.jobmarket.controller;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
import com.tuan.jobmarket.domain.dto.ResultPaginationDTO;
import com.tuan.jobmarket.service.UserService;
import com.turkraft.springfilter.boot.Filter;

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
    public ResponseEntity<User> handeCreateUser(@RequestBody User user) {
        // String hashPass = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User user1 = this.userService.handelCreateUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user1);
    }

    @GetMapping("/users")
    public ResponseEntity<ResultPaginationDTO> getAllUser(
        @Filter Specification<User> spect,
        Pageable pageable
    ) {

        return ResponseEntity.status(HttpStatus.OK).body(this.userService.fetchAllUser(spect, pageable));
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
    @PutMapping("/users")
    public ResponseEntity<User> updateUser(@Valid @RequestBody User user) {
        User update = this.userService.handleUpdateUser( user);
        return ResponseEntity.status(HttpStatus.OK).body(update);
    }
}
