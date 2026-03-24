package com.tuan.jobmarket.domain.response.email;

import java.util.List;


public class ResEmailJob {
    private String name;
    private double salary;
    private CompanyEmail company;
    private List<SkillEmail> skills;

    

    public ResEmailJob(CompanyEmail company, String name, double salary, List<SkillEmail> skills) {
        this.company = company;
        this.name = name;
        this.salary = salary;
        this.skills = skills;
    }

    public ResEmailJob() {
    }

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

    

    public static class CompanyEmail {
        private String name;

        public CompanyEmail(String name) {
            this.name = name;
        }



        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }


    public static class SkillEmail {
        private String name;

        

        public SkillEmail() {
        }

        public SkillEmail(String name) {
            this.name = name;
        }

        

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}

