package com.tuan.jobmarket.service;

import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Subscriber;

@Service
public interface SubscriberService {
    boolean isExistsByEmail(String email);
    Subscriber create(Subscriber subs);
    Subscriber update(Subscriber subsDB, Subscriber subsRequest);
    Subscriber findById(long id);
}
