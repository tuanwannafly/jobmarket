package com.tuan.jobmarket.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.User;

@Service
public interface UserService {
    User handelCreateUser(User user);
    List<User> findAllUsers();
    User fecthUserById(Long id);
    void deleteUser(Long id);
    User handleUpdateUser(Long id, User user);
}
