package com.tuan.jobmarket.service;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Resume;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;
import com.tuan.jobmarket.domain.response.resume.ResCreateResumeDTO;
import com.tuan.jobmarket.domain.response.resume.ResFetchResumeDTO;
import com.tuan.jobmarket.domain.response.resume.ResUpdateResumeDTO;

@Service
public interface ResumeService {
    Optional<Resume> fetchById(long id);
    boolean checkResumeExistByUserAndJob(Resume resume);
    ResCreateResumeDTO create(Resume resume);
    ResUpdateResumeDTO update(Resume resume);
    void delete(long id);
    ResFetchResumeDTO getResume(Resume resume);
    ResultPaginationDTO fetchAllResume(Specification<Resume> spec, Pageable pageable);
    ResultPaginationDTO fetchResumeByUser(Pageable pageable);
}
