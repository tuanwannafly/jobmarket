package com.tuan.jobmarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tuan.jobmarket.domain.User;


public interface  UserRepository extends JpaRepository<User, Long>{

    User findByEmail(String email);
}
