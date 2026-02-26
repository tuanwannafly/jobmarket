package com.tuan.jobmarket.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.domain.dto.ResultPaginationDTO;

@Service
public interface UserService {
    User handelCreateUser(User user);
    List<User> findAllUsers();
    User fecthUserById(Long id);
    void deleteUser(Long id);
    User handleUpdateUser( User user);
    User handleGetUserByUsername(String username);
    ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable);
}
