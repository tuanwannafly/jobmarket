package com.tuan.jobmarket.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Company;
import com.tuan.jobmarket.domain.dto.ResultPaginationDTO;

import jakarta.validation.Valid;

@Service
public interface CompanyService {

    Company handelCreateCompany(Company company);

    ResultPaginationDTO handleGetCompany(Pageable pageable);


    void deleteCompany(Long id);

    Company handleUpdateCompany( Company user);
    
}
