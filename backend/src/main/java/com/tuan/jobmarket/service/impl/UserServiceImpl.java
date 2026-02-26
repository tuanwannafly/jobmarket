package com.tuan.jobmarket.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.domain.dto.Meta;
import com.tuan.jobmarket.domain.dto.ResultPaginationDTO;
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

    public User handleUpdateUser(User reqUser) {
        User currentUser = this.fecthUserById(reqUser.getId());
        if (currentUser != null) {
            currentUser.setEmail(reqUser.getEmail());
            currentUser.setName(reqUser.getName());
            currentUser.setPassword(reqUser.getPassword());
            // update
            currentUser = this.userRepository.save(currentUser);
        }
        return currentUser;
    }

    @Override
    public User handleGetUserByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }

    @Override
    public ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageUser.getNumber() + 1);
        mt.setPageSize(pageUser.getSize());

        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pageUser.getContent());

        return rs;
    }

}
