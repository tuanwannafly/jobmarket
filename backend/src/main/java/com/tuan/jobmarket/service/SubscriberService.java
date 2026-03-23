package com.tuan.jobmarket.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Job;
import com.tuan.jobmarket.domain.Subscriber;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;
import com.tuan.jobmarket.domain.response.email.ResEmailJob;

@Service
public interface SubscriberService {
    boolean isExistsByEmail(String email);
    Subscriber create(Subscriber subs);
    Subscriber update(Subscriber subsDB, Subscriber subsRequest);
    Subscriber findById(long id);
    // ✅ FIX: Thêm delete và findAll
    void delete(long id);
    ResultPaginationDTO findAll(Specification<Subscriber> spec, Pageable pageable);
    ResEmailJob convertJobToSendEmail(Job job);
    void sendSubscribersEmailJobs();
    Subscriber findByEmail(String email);
}
