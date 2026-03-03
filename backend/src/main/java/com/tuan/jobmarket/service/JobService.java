package com.tuan.jobmarket.service;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Job;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;
import com.tuan.jobmarket.domain.response.job.ResCreateJobDTO;
import com.tuan.jobmarket.domain.response.job.ResUpdateJobDTO;



@Service
public interface JobService {
    Optional<Job> fetchJobById(long id);
    ResCreateJobDTO create(Job job);
    ResUpdateJobDTO update(Job job);
    void delete(long id);
    ResultPaginationDTO fetchAll(Specification<Job> spec, Pageable pageable);
}
