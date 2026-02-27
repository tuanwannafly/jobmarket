package com.tuan.jobmarket.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.domain.dto.ResCreateUserDTO;
import com.tuan.jobmarket.domain.dto.ResUpdateUserDTO;
import com.tuan.jobmarket.domain.dto.ResUserDTO;
import com.tuan.jobmarket.domain.dto.ResultPaginationDTO;

@Service
public interface UserService {
    User handelCreateUser(User user);
    List<User> findAllUsers();
    User fetchUserById(Long id);
    void deleteUser(Long id);
    User handleUpdateUser( User user);
    User handleGetUserByUsername(String username);
    ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable);
    boolean isEmailExist(String email);
    ResCreateUserDTO convertToResCreateUserDTO(User user);
    ResUpdateUserDTO convertToResUpdateUserDTO(User user);
    ResUserDTO convertToResUserDTO(User user);
}
