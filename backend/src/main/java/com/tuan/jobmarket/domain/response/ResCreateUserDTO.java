package com.tuan.jobmarket.domain.response;

import java.time.Instant;

import com.tuan.jobmarket.domain.constant.GenderEnum;
import com.tuan.jobmarket.domain.response.ResUserDTO.RoleUser;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCreateUserDTO {
    private long id;
    private String name;
    private String email;
    private GenderEnum gender;
    private String address;
    private int age;
    private Instant createdAt;

    private CompanyUser company;
    private RoleUser role;

    @Getter
    @Setter
    public static class CompanyUser {
        private long id;
        private String name;
    }

    @Getter
    @Setter
    public static class RoleUser {
    private long id;
    private String name;
}


}
