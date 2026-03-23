package com.tuan.jobmarket.domain.response.email;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResEmailJob {
    private String name;
    private double salary;
    private CompanyEmail company;
    private List<SkillEmail> skills;

    public void setName(String name) {
        this.name = name;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public void setCompany(CompanyEmail company) {
        this.company = company;
    }

    public void setSkills(List<SkillEmail> skills) {
        this.skills = skills;
    }

    public String getName() {
        return name;
    }

    public double getSalary() {
        return salary;
    }

    public CompanyEmail getCompany() {
        return company;
    }

    public List<SkillEmail> getSkills() {
        return skills;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class CompanyEmail {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class SkillEmail {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}

