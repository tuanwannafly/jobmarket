package com.tuan.jobmarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tuan.jobmarket.domain.Company;

public interface CompanyRepository extends JpaRepository<Company, Long>{
    
}
