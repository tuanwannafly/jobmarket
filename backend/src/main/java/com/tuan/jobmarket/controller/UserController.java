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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.domain.response.ResCreateUserDTO;
import com.tuan.jobmarket.domain.response.ResUpdateUserDTO;
import com.tuan.jobmarket.domain.response.ResUserDTO;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;
import com.tuan.jobmarket.service.UserService;
import com.tuan.jobmarket.util.annotation.ApiMessage;
import com.tuan.jobmarket.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/create/users")
    @ApiMessage("Create a new user")
    public ResponseEntity<ResCreateUserDTO> handeCreateUser(@Valid @RequestBody User user) throws IdInvalidException {
        boolean isEmailExist = this.userService.isEmailExist(user.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException(
                    "Email " + user.getEmail() + "da ton tai, vui long su dung email khac.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User user1 = this.userService.handelCreateUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(user1));
    }

    @GetMapping("/users")
    @ApiMessage("fetch all users")
    public ResponseEntity<ResultPaginationDTO> getAllUser(
        @Filter Specification<User> spect,
        Pageable pageable
    ) {

        return ResponseEntity.status(HttpStatus.OK).body(this.userService.fetchAllUser(spect, pageable));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser( @PathVariable("id") Long id) {
        var  user = this.userService.fetchUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ResUserDTO> deleteUser( @PathVariable("id") Long id) throws IdInvalidException {
        User fetchUser = this.userService.fetchUserById(id);
        if (fetchUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.userService.convertToResUserDTO(fetchUser));
    }
    @PutMapping("/users")
    public ResponseEntity<ResUpdateUserDTO> updateUser(@Valid @RequestBody User user) {
        User user1 = this.userService.handleUpdateUser(user);
        // if (user1 == null) {
        //     throw new IdInvalidException("User voi id = " + user1.getId() + " khong ton tai");
        // }
        return ResponseEntity.ok(this.userService.convertToResUpdateUserDTO(user1));
    }
}
