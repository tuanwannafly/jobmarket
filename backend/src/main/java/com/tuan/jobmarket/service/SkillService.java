package com.tuan.jobmarket.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Skill;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;

@Service
public interface SkillService {
    boolean isNameExist(String name);
    Skill fetchSkillById(long id);
    Skill createSkill(Skill s);
    Skill updateSkill(Skill s);
    void deleteSkill(long id);
    ResultPaginationDTO fetchAllSkills(Specification<Skill> spec, Pageable pageable);
}
