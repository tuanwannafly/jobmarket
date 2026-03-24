package com.tuan.jobmarket.domain.response.resume;

import java.time.Instant;

import com.tuan.jobmarket.domain.constant.ResumeStateEnum;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResFetchResumeDTO {
    private long id;
    private String email;
    private String url;

    @Enumerated(EnumType.STRING)
    private ResumeStateEnum status;

    private Instant createdAt;
    private Instant updatedAt;

    private String createdBy;
    private String updatedBy;

    private String companyName;

    private UserResume user;
    private JobResume job;

    public ResFetchResumeDTO() {
    }

    public ResFetchResumeDTO(String companyName, Instant createdAt, String createdBy, String email, long id, JobResume job, ResumeStateEnum status, Instant updatedAt, String updatedBy, String url, UserResume user) {
        this.companyName = companyName;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.email = email;
        this.id = id;
        this.job = job;
        this.status = status;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.url = url;
        this.user = user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public ResumeStateEnum getStatus() {
        return status;
    }

    public void setStatus(ResumeStateEnum status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public UserResume getUser() {
        return user;
    }

    public void setUser(UserResume user) {
        this.user = user;
    }

    public JobResume getJob() {
        return job;
    }

    public void setJob(JobResume job) {
        this.job = job;
    }

    @Getter
    @Setter
    public static class UserResume {
        private long id;
        private String name;

        public UserResume(long id, String name) {
            this.id = id;
            this.name = name;
        }

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @Getter
    @Setter
    public static class JobResume {
        private long id;
        private String name;

        public JobResume(long id, String name) {
            this.id = id;
            this.name = name;
        }

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
