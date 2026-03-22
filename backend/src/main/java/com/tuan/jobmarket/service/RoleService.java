package com.tuan.jobmarket.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Role;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;

@Service
public interface RoleService {
    boolean existByName(String name);
    Role create(Role r);
    Role fetchById(long id);
    Role update(Role r);
    void delete(long id);
    ResultPaginationDTO getRoles(Specification<Role> spec, Pageable pageable);
    Role findByName(String name);
}
