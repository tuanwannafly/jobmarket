package com.tuan.jobmarket.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuan.jobmarket.domain.Company;
import com.tuan.jobmarket.domain.dto.ResultPaginationDTO;
import com.tuan.jobmarket.service.CompanyService;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class CompanyController {
    private final CompanyService companyService;

    
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/create/company")
    public ResponseEntity<?> handeCreateUser(@RequestBody Company company) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.companyService.handelCreateCompany(company));
    }


    @GetMapping("/companies")
    public ResponseEntity<ResultPaginationDTO> getCompany(
                @Filter Specification<Company> spect,
        Pageable pageable) {
        return ResponseEntity.ok(this.companyService.handleGetCompany(spect, pageable));
    }

    // @GetMapping("/companies/{id}")
    // public ResponseEntity<Company> getCompany( @PathVariable("id") Long id) {
    //     var  company = this.companyService.fecthCompanyById(id);
    //     return ResponseEntity.status(HttpStatus.OK).body(company);
    // }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<String> deleteUser( @PathVariable("id") Long id) {
        this.companyService.deleteCompany(id);
        return ResponseEntity.ok("delete company done");
    }

    @PutMapping("/companies")
    public ResponseEntity<Company> updateCompany(@Valid @RequestBody Company reqCompany) {
        Company updatedCompany = this.companyService.handleUpdateCompany(reqCompany);
        return ResponseEntity.ok(updatedCompany);
    }
}
