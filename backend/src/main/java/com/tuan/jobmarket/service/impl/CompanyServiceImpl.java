package com.tuan.jobmarket.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Company;
import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;
import com.tuan.jobmarket.repository.CompanyRepository;
import com.tuan.jobmarket.repository.UserRepository;
import com.tuan.jobmarket.service.CompanyService;

@Service
public class CompanyServiceImpl implements CompanyService{

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Company handelCreateCompany(Company company) {
        return this.companyRepository.save(company);
    }

    @Override
    public ResultPaginationDTO handleGetCompany(Specification<Company> spec, Pageable pageable) {
        Page<Company> pageCompany = this.companyRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

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

    @Override
    public Optional<Company> findById(long id) {
        return this.companyRepository.findById(id);
    }

    @Override
    public void handleDeleteCompany(long id) {
        Optional<Company> comOptional = this.companyRepository.findById(id);
        if (comOptional.isPresent()) {
            Company com = comOptional.get();
            // fetch all user belong to this company
            List<User> users = this.userRepository.findByCompany(com);
            this.userRepository.deleteAll(users);
        }

        this.companyRepository.deleteById(id);
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
