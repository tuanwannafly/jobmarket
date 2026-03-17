package com.tuan.jobmarket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tuan.jobmarket.domain.Job;
import com.tuan.jobmarket.domain.Skill;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    List<Job> findBySkillsIn(List<Skill> skills);
}
