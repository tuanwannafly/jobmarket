package com.tuan.jobmarket.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Company;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;

import jakarta.validation.Valid;

@Service
public interface CompanyService {

    Company handelCreateCompany(Company company);

    ResultPaginationDTO handleGetCompany(Specification<Company> spec, Pageable pageable);
    void deleteCompany(Long id);

    Company handleUpdateCompany( Company user);
    
}
