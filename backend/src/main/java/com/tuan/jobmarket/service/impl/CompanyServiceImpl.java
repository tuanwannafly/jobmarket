package com.tuan.jobmarket.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Company;
import com.tuan.jobmarket.domain.dto.Meta;
import com.tuan.jobmarket.domain.dto.ResultPaginationDTO;
import com.tuan.jobmarket.repository.CompanyRepository;
import com.tuan.jobmarket.service.CompanyService;

@Service
public class CompanyServiceImpl implements CompanyService{

    private final CompanyRepository companyRepository;


    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public Company handelCreateCompany(Company company) {
        return this.companyRepository.save(company);
    }

    @Override
    public ResultPaginationDTO handleGetCompany(Specification<Company> spec, Pageable pageable) {
        Page<Company> pageCompany = this.companyRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageCompany.getNumber() + 1);
        mt.setPageSize(pageCompany.getSize());

        mt.setPages(pageCompany.getTotalPages());
        mt.setTotal(pageCompany.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pageCompany.getContent());
        return rs;
    }

    @Override
    public void deleteCompany(Long id) {
        this.companyRepository.deleteById(id);
    }

    @Override
    public Company handleUpdateCompany(Company c) {
        Optional<Company> companyOptional = this.companyRepository.findById(c.getId());
        if (companyOptional.isPresent()) {
            Company currentCompany = companyOptional.get();
            currentCompany.setLogo(c.getLogo());
            currentCompany.setName(c.getName());
            currentCompany.setDescription(c.getDescription());
            currentCompany.setAddress(c.getAddress());
            return this.companyRepository.save(currentCompany);
        }
        return null;
    }

    // @Override
    // public ResultPaginationDTO handleGetCompany(Pageable pageable) {
    //     Page<Company> pageCompany = this.companyRepository.findAll(spec, pageable);
    //     ResultPaginationDTO rs = new ResultPaginationDTO();
    //     Meta mt = new Meta();

    //     mt.setPage(pageCompany.getNumber() + 1);
    //     mt.setPageSize(pageCompany.getSize());

    //     mt.setPages(pageCompany.getTotalPages());
    //     mt.setTotal(pageCompany.getTotalElements());

    //     rs.setMeta(mt);
    //     rs.setResult(pageCompany.getContent());
    //     return rs;
    // }
}
