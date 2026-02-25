package com.tuan.jobmarket.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.repository.UserRepository;
import com.tuan.jobmarket.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }



    @Override
    public User handelCreateUser(User user) {
        return this.userRepository.save(user);
    }



    @Override
    public List<User> findAllUsers() {
        return this.userRepository.findAll();
    }



    @Override
    public User fecthUserById(Long id) {
        return this.userRepository.findById(id).get();
    }



    @Override
    public void deleteUser(Long id) {
        this.userRepository.deleteById(id);
    }



    @Override
    public User handleUpdateUser(Long id, User user) {
       User request = userRepository.findById(id).get();
        request.setName(user.getName());
        request.setEmail(user.getEmail());
        request.setPassword(user.getPassword());
        this.userRepository.save(request);
        return request;
    }



    @Override
    public User handleGetUserByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }

    
    
}
