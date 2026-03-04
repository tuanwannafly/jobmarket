package com.tuan.jobmarket.service.impl;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Skill;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;
import com.tuan.jobmarket.repository.SkillRepository;
import com.tuan.jobmarket.service.SkillService;

@Service
public class SkillServiceImpl implements  SkillService{

    private final SkillRepository skillRepository;

    

    public SkillServiceImpl(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    public boolean isNameExist(String name) {
        return this.skillRepository.existsByName(name);
    }

    @Override
    public Skill fetchSkillById(long id) {
        Optional<Skill> skillOptional = this.skillRepository.findById(id);
        if (skillOptional.isPresent())
            return skillOptional.get();
        return null;
    }

    @Override
    public Skill createSkill(Skill s) {
        return this.skillRepository.save(s);
    }

    @Override
    public Skill updateSkill(Skill s) {
        return this.skillRepository.save(s);
    }

    @Override
    public void deleteSkill(long id) {
        // delete job (inside job_skill table)
        Optional<Skill> skillOptional = this.skillRepository.findById(id);
        Skill currentSkill = skillOptional.get();
        currentSkill.getJobs().forEach(job -> job.getSkills().remove(currentSkill));

        // delete skill
        this.skillRepository.delete(currentSkill);
    }

    @Override
    public ResultPaginationDTO fetchAllSkills(Specification<Skill> spec, Pageable pageable) {
        Page<Skill> pageUser = this.skillRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());

        rs.setMeta(mt);

        rs.setResult(pageUser.getContent());

        return rs;
    }
    
}
