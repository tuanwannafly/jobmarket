package com.tuan.jobmarket.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
import com.tuan.jobmarket.util.SecurityUtil;
import com.tuan.jobmarket.util.annotation.ApiMessage;
import com.tuan.jobmarket.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ FIX: /create/users → /users
    @PostMapping("/users")
    @ApiMessage("Create a new user")
    public ResponseEntity<ResCreateUserDTO> createUser(@Valid @RequestBody User user)
            throws IdInvalidException {
        if (this.userService.isEmailExist(user.getEmail())) {
            throw new IdInvalidException(
                    "Email " + user.getEmail() + " đã tồn tại, vui lòng sử dụng email khác.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User newUser = this.userService.handleCreateUser(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.userService.convertToResCreateUserDTO(newUser));
    }

    @GetMapping("/users")
    @ApiMessage("Fetch all users")
    public ResponseEntity<ResultPaginationDTO> getAllUser(
            @Filter Specification<User> spect, Pageable pageable) {
        return ResponseEntity.ok(this.userService.fetchAllUser(spect, pageable));
    }

    @GetMapping("/users/{id}")
    @ApiMessage("Fetch user by id")
    public ResponseEntity<ResUserDTO> getUser(@PathVariable("id") Long id)
            throws IdInvalidException {
        User user = this.userService.fetchUserById(id);
        if (user == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }
        return ResponseEntity.ok(this.userService.convertToResUserDTO(user));
    }

    // ✅ FIX: Thực sự gọi deleteUser service
    @DeleteMapping("/users/{id}")
    @ApiMessage("Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id)
            throws IdInvalidException {
        User fetchUser = this.userService.fetchUserById(id);
        if (fetchUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }
        this.userService.deleteUser(id);
        return ResponseEntity.ok(null);
    }

    @PutMapping("/users")
    @ApiMessage("Update a user")
    public ResponseEntity<ResUpdateUserDTO> updateUser(@Valid @RequestBody User user) {
        User updated = this.userService.handleUpdateUser(user);
        return ResponseEntity.ok(this.userService.convertToResUpdateUserDTO(updated));
    }

    // ✅ FIX: Thêm endpoint change-password mà FE đang gọi
    @PatchMapping("/users/change-password")
    @ApiMessage("Change password")
    public ResponseEntity<Void> changePassword(
            @RequestBody Map<String, String> body) throws IdInvalidException {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new IdInvalidException("Không tìm thấy user đang đăng nhập"));

        User user = this.userService.handleGetUserByUsername(email);
        if (user == null) {
            throw new IdInvalidException("User không tồn tại");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IdInvalidException("Mật khẩu hiện tại không đúng");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        this.userService.handleUpdateUser(user);
        return ResponseEntity.ok(null);
    }
}
