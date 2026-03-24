package com.tuan.jobmarket.config;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tuan.jobmarket.domain.Company;
import com.tuan.jobmarket.domain.Job;
import com.tuan.jobmarket.domain.Permission;
import com.tuan.jobmarket.domain.Role;
import com.tuan.jobmarket.domain.Skill;
import com.tuan.jobmarket.domain.User;
import com.tuan.jobmarket.domain.constant.GenderEnum;
import com.tuan.jobmarket.domain.constant.LevelEnum;
import com.tuan.jobmarket.repository.CompanyRepository;
import com.tuan.jobmarket.repository.JobRepository;
import com.tuan.jobmarket.repository.PermissionRepository;
import com.tuan.jobmarket.repository.RoleRepository;
import com.tuan.jobmarket.repository.SkillRepository;
import com.tuan.jobmarket.repository.UserRepository;

@Service
public class DatabaseInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;

    public DatabaseInitializer(
            PermissionRepository permissionRepository,
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            CompanyRepository companyRepository,
            SkillRepository skillRepository,
            JobRepository jobRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.companyRepository = companyRepository;
        this.skillRepository = skillRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> START INIT DATABASE");
        try {
            long countPermissions = this.permissionRepository.count();
            long countRoles = this.roleRepository.count();
            long countUsers = this.userRepository.count();
            long countCompanies = this.companyRepository.count();
            long countSkills = this.skillRepository.count();
            long countJobs = this.jobRepository.count();

            // ===== PERMISSIONS =====
            if (countPermissions == 0) {
                ArrayList<Permission> arr = new ArrayList<>();
                arr.add(new Permission("Create a company", "/api/v1/companies", "POST", "COMPANIES"));
                arr.add(new Permission("Update a company", "/api/v1/companies", "PUT", "COMPANIES"));
                arr.add(new Permission("Delete a company", "/api/v1/companies/{id}", "DELETE", "COMPANIES"));
                arr.add(new Permission("Get a company by id", "/api/v1/companies/{id}", "GET", "COMPANIES"));
                arr.add(new Permission("Get companies with pagination", "/api/v1/companies", "GET", "COMPANIES"));
                arr.add(new Permission("Create a job", "/api/v1/jobs", "POST", "JOBS"));
                arr.add(new Permission("Update a job", "/api/v1/jobs", "PUT", "JOBS"));
                arr.add(new Permission("Delete a job", "/api/v1/jobs/{id}", "DELETE", "JOBS"));
                arr.add(new Permission("Get a job by id", "/api/v1/jobs/{id}", "GET", "JOBS"));
                arr.add(new Permission("Get jobs with pagination", "/api/v1/jobs", "GET", "JOBS"));
                arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
                arr.add(new Permission("Update a permission", "/api/v1/permissions", "PUT", "PERMISSIONS"));
                arr.add(new Permission("Delete a permission", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
                arr.add(new Permission("Get a permission by id", "/api/v1/permissions/{id}", "GET", "PERMISSIONS"));
                arr.add(new Permission("Get permissions with pagination", "/api/v1/permissions", "GET", "PERMISSIONS"));
                arr.add(new Permission("Create a resume", "/api/v1/resumes", "POST", "RESUMES"));
                arr.add(new Permission("Update a resume", "/api/v1/resumes", "PUT", "RESUMES"));
                arr.add(new Permission("Delete a resume", "/api/v1/resumes/{id}", "DELETE", "RESUMES"));
                arr.add(new Permission("Get a resume by id", "/api/v1/resumes/{id}", "GET", "RESUMES"));
                arr.add(new Permission("Get resumes with pagination", "/api/v1/resumes", "GET", "RESUMES"));
                arr.add(new Permission("Create a role", "/api/v1/roles", "POST", "ROLES"));
                arr.add(new Permission("Update a role", "/api/v1/roles", "PUT", "ROLES"));
                arr.add(new Permission("Delete a role", "/api/v1/roles/{id}", "DELETE", "ROLES"));
                arr.add(new Permission("Get a role by id", "/api/v1/roles/{id}", "GET", "ROLES"));
                arr.add(new Permission("Get roles with pagination", "/api/v1/roles", "GET", "ROLES"));
                arr.add(new Permission("Create a user", "/api/v1/users", "POST", "USERS"));
                arr.add(new Permission("Update a user", "/api/v1/users", "PUT", "USERS"));
                arr.add(new Permission("Delete a user", "/api/v1/users/{id}", "DELETE", "USERS"));
                arr.add(new Permission("Get a user by id", "/api/v1/users/{id}", "GET", "USERS"));
                arr.add(new Permission("Get users with pagination", "/api/v1/users", "GET", "USERS"));
                arr.add(new Permission("Create a subscriber", "/api/v1/subscribers", "POST", "SUBSCRIBERS"));
                arr.add(new Permission("Update a subscriber", "/api/v1/subscribers", "PUT", "SUBSCRIBERS"));
                arr.add(new Permission("Delete a subscriber", "/api/v1/subscribers/{id}", "DELETE", "SUBSCRIBERS"));
                arr.add(new Permission("Get a subscriber by id", "/api/v1/subscribers/{id}", "GET", "SUBSCRIBERS"));
                arr.add(new Permission("Get subscribers with pagination", "/api/v1/subscribers", "GET", "SUBSCRIBERS"));
                arr.add(new Permission("Download a file", "/api/v1/files", "POST", "FILES"));
                arr.add(new Permission("Upload a file", "/api/v1/files", "GET", "FILES"));
                this.permissionRepository.saveAll(arr);
            }

            // ===== ROLES =====
            if (countRoles == 0) {
                List<Permission> allPermissions = this.permissionRepository.findAll();
                Role adminRole = new Role();
                adminRole.setName("SUPER_ADMIN");
                adminRole.setDescription("Admin thi full permissions");
                adminRole.setActive(true);
                adminRole.setPermissions(allPermissions);
                this.roleRepository.save(adminRole);
            }

            // ===== USERS =====
            if (countUsers == 0) {
                User adminUser = new User();
                adminUser.setEmail("admin@gmail.com");
                adminUser.setAddress("hn");
                adminUser.setAge(25);
                adminUser.setGender(GenderEnum.MALE);
                adminUser.setName("I'm super admin");
                adminUser.setPassword(this.passwordEncoder.encode("123456"));
                Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
                if (adminRole != null) adminUser.setRole(adminRole);
                this.userRepository.save(adminUser);
            }

            // ===== COMPANIES =====
            if (countCompanies == 0) {
                List<Company> companies = new ArrayList<>();
                String[][] companyData = {
                    {"Amazon.com, Inc", "Seattle, Washington, USA", "1716687538974-amzon.jpg"},
                    {"Apple Inc.", "Cupertino, California", "1716687768336-apple.jpg"},
                    {"Google LLC", "Mountain View, California, Hoa Ky", "1716687909879-google.png"},
                    {"Lazada Viet Nam", "Lau 19, 20 Saigon Centre, 67 Le Loi, Quan 1, TP Ho Chi Minh", "1716688017004-lazada.png"},
                    {"Netflix Inc", "Los Gatos, California, Hoa Ky", "1716688067538-netflix.png"},
                    {"Adobe Photoshop", "Microsoft Windows va Mac OS X", "1716688187365-photoshop.png"},
                    {"Tap doan Adobe", "San Jose, California, Hoa Ky", "1716688251710-pr.jpg"},
                    {"Shopee", "5 Science Park Drive, Shopee Building, Singapore 118265", "1716688292011-shopee.png"},
                    {"Tiki", "52 Ut Tich, Phuong 4, Tan Binh, TP Ho Chi Minh", "1716688336563-tiki.jpg"},
                    {"Tiktok", "China", "1716688386288-tiktok.jpg"}
                };
                for (String[] d : companyData) {
                    Company c = new Company();
                    c.setName(d[0]);
                    c.setAddress(d[1]);
                    c.setLogo(d[2]);
                    c.setDescription("<p>Cong ty " + d[0] + "</p>");
                    companies.add(c);
                }
                this.companyRepository.saveAll(companies);
                System.out.println(">>> INIT: Inserted 10 companies");
            }

            // ===== SKILLS =====
            if (countSkills == 0) {
                List<String> skillNames = Arrays.asList(
                    "REACT.JS", "REACT NATIVE", "VUE.JS", "ANGULAR",
                    "NEST.JS", "TYPESCRIPT", "JAVA", "FRONTEND",
                    "BACKEND", "FULLSTACK", "JAVA SPRING"
                );
                List<Skill> skills = new ArrayList<>();
                for (String name : skillNames) {
                    Skill skill = new Skill();
                    skill.setName(name);
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
                System.out.println(">>> INIT: Inserted 11 skills");
            }

            // ===== JOBS =====
            if (countJobs == 0) {
                List<Company> allCompanies = this.companyRepository.findAll();
                List<Skill> allSkills = this.skillRepository.findAll();

                java.util.function.Function<String, Company> fc = (name) ->
                    allCompanies.stream().filter(c -> c.getName().equals(name)).findFirst().orElse(null);

                java.util.function.Function<List<String>, List<Skill>> fs = (names) -> {
                    List<Skill> result = new ArrayList<>();
                    for (String n : names) {
                        allSkills.stream().filter(s -> s.getName().equals(n)).findFirst().ifPresent(result::add);
                    }
                    return result;
                };

                List<Job> jobs = new ArrayList<>();

                // Job 1 - Lazada (index 3 = "Lazada Viet Nam")
                Job j1 = new Job();
                j1.setName("Manual Tester - Khoi CNTT");
                j1.setLocation("HANOI"); j1.setSalary(15000000); j1.setQuantity(10);
                j1.setLevel(LevelEnum.INTERN); j1.setIsActive(true);
                j1.setStartDate(Instant.parse("2024-05-05T02:08:00Z"));
                j1.setEndDate(Instant.parse("2024-05-31T02:08:03Z"));
                j1.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Tiep nhan yeu cau kiem thu san pham CNTT</li><li>Thuc hien kiem thu, danh gia chat luong san pham</li></ul>");
                j1.setCompany(fc.apply("Lazada Viet Nam"));
                j1.setSkills(fs.apply(Arrays.asList("REACT.JS", "JAVA")));
                jobs.add(j1);

                // Job 2 - Tiki
                Job j2 = new Job();
                j2.setName("eCommerce Project Manager/Tester (Magento)");
                j2.setLocation("HOCHIMINH"); j2.setSalary(25000000); j2.setQuantity(3);
                j2.setLevel(LevelEnum.MIDDLE); j2.setIsActive(true);
                j2.setStartDate(Instant.parse("2024-05-31T02:16:36Z"));
                j2.setEndDate(Instant.parse("2025-06-30T02:16:38Z"));
                j2.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Quan ly du an eCommerce tren Adobe Commerce/Magento</li></ul>");
                j2.setCompany(fc.apply("Tiki"));
                j2.setSkills(fs.apply(Arrays.asList("VUE.JS", "NEST.JS", "FRONTEND")));
                jobs.add(j2);

                // Job 3 - Amazon
                Job j3 = new Job();
                j3.setName("Technical Project Manager - Salary Up to $2500");
                j3.setLocation("DANANG"); j3.setSalary(50000000); j3.setQuantity(2);
                j3.setLevel(LevelEnum.SENIOR); j3.setIsActive(true);
                j3.setStartDate(Instant.parse("2024-05-28T02:26:15Z"));
                j3.setEndDate(Instant.parse("2024-06-29T02:26:17Z"));
                j3.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Quan ly du an ky thuat theo phuong phap Agile/Scrum</li></ul>");
                j3.setCompany(fc.apply("Amazon.com, Inc"));
                j3.setSkills(fs.apply(Arrays.asList("JAVA", "FULLSTACK", "JAVA SPRING")));
                jobs.add(j3);

                // Job 4 - Google
                Job j4 = new Job();
                j4.setName("BrSE - Bridge Engineer (Project Manager) ~ $2000");
                j4.setLocation("HANOI"); j4.setSalary(41500000); j4.setQuantity(3);
                j4.setLevel(LevelEnum.MIDDLE); j4.setIsActive(true);
                j4.setStartDate(Instant.parse("2024-05-27T02:29:37Z"));
                j4.setEndDate(Instant.parse("2024-05-31T02:29:39Z"));
                j4.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>La cau noi giua khach hang Nhat Ban va doi du an Offshore Viet Nam</li></ul>");
                j4.setCompany(fc.apply("Google LLC"));
                j4.setSkills(fs.apply(Arrays.asList("ANGULAR", "NEST.JS", "TYPESCRIPT", "BACKEND", "FULLSTACK")));
                jobs.add(j4);

                // Job 5 - Netflix
                Job j5 = new Job();
                j5.setName("[Hybrid-HN] Bridge Software Engineer (BrSE)-Up to $3000");
                j5.setLocation("DANANG"); j5.setSalary(60000000); j5.setQuantity(2);
                j5.setLevel(LevelEnum.MIDDLE); j5.setIsActive(true);
                j5.setStartDate(Instant.parse("2024-05-31T02:32:05Z"));
                j5.setEndDate(Instant.parse("2024-06-29T02:32:06Z"));
                j5.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Gathering system domain knowledge and convey to project team in Vietnam</li></ul>");
                j5.setCompany(fc.apply("Netflix Inc"));
                j5.setSkills(fs.apply(Arrays.asList("JAVA", "BACKEND", "JAVA SPRING")));
                jobs.add(j5);

                // Job 6 - Tiktok
                Job j6 = new Job();
                j6.setName("IT communicator/ BridgeSE (English/Japanese N2/Chinese)");
                j6.setLocation("OTHER"); j6.setSalary(15000000); j6.setQuantity(5);
                j6.setLevel(LevelEnum.FRESHER); j6.setIsActive(true);
                j6.setStartDate(Instant.parse("2024-05-31T02:34:05Z"));
                j6.setEndDate(Instant.parse("2024-06-27T02:34:08Z"));
                j6.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Support communication between global office and Vietnam staff</li></ul>");
                j6.setCompany(fc.apply("Tiktok"));
                j6.setSkills(fs.apply(Arrays.asList("REACT.JS", "NEST.JS", "JAVA", "FRONTEND", "FULLSTACK")));
                jobs.add(j6);

                // Job 7 - Tap doan Adobe
                Job j7 = new Job();
                j7.setName("Remote Sr Front-End Dev (TypeScript, ReactJS, English)");
                j7.setLocation("HOCHIMINH"); j7.setSalary(30000000); j7.setQuantity(5);
                j7.setLevel(LevelEnum.FRESHER); j7.setIsActive(true);
                j7.setStartDate(Instant.parse("2024-05-30T02:35:14Z"));
                j7.setEndDate(Instant.parse("2024-06-05T02:35:15Z"));
                j7.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Develop and maintain client projects with React, Next.js, TypeScript</li></ul>");
                j7.setCompany(fc.apply("Tap doan Adobe"));
                j7.setSkills(fs.apply(Arrays.asList("REACT NATIVE", "FRONTEND")));
                jobs.add(j7);

                // Job 8 - Tap doan Adobe
                Job j8 = new Job();
                j8.setName("Mid/Sr Frontend Developer (ReactJS, TypeScript)");
                j8.setLocation("DANANG"); j8.setSalary(20000000); j8.setQuantity(3);
                j8.setLevel(LevelEnum.JUNIOR); j8.setIsActive(true);
                j8.setStartDate(Instant.parse("2024-05-30T02:36:22Z"));
                j8.setEndDate(Instant.parse("2024-06-19T02:36:23Z"));
                j8.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Thiet ke, phat trien va kiem thu web application</li></ul>");
                j8.setCompany(fc.apply("Tap doan Adobe"));
                j8.setSkills(fs.apply(Arrays.asList("VUE.JS", "JAVA")));
                jobs.add(j8);

                // Job 9 - Lazada
                Job j9 = new Job();
                j9.setName("Front-end coder");
                j9.setLocation("HANOI"); j9.setSalary(10000000); j9.setQuantity(5);
                j9.setLevel(LevelEnum.INTERN); j9.setIsActive(true);
                j9.setStartDate(Instant.parse("2024-06-01T02:37:19Z"));
                j9.setEndDate(Instant.parse("2024-06-08T02:37:21Z"));
                j9.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Develop and maintain web applications using ReactJS, JavaScript and TypeScript</li></ul>");
                j9.setCompany(fc.apply("Lazada Viet Nam"));
                j9.setSkills(fs.apply(Arrays.asList("REACT.JS", "REACT NATIVE", "TYPESCRIPT")));
                jobs.add(j9);

                // Job 10 - Netflix
                Job j10 = new Job();
                j10.setName("Junior Frontend ReactJS Dev (JavaScript, HTML, CSS)");
                j10.setLocation("DANANG"); j10.setSalary(20000000); j10.setQuantity(10);
                j10.setLevel(LevelEnum.FRESHER); j10.setIsActive(true);
                j10.setStartDate(Instant.parse("2024-06-08T02:38:18Z"));
                j10.setEndDate(Instant.parse("2024-07-31T02:38:19Z"));
                j10.setDescription("<h2>Mo Ta Cong Viec</h2><ul><li>Lap trinh front-end, chuyen cac file thiet ke sang HTML, CSS</li></ul>");
                j10.setCompany(fc.apply("Netflix Inc"));
                j10.setSkills(fs.apply(Arrays.asList("VUE.JS", "ANGULAR")));
                jobs.add(j10);

                this.jobRepository.saveAll(jobs);
                System.out.println(">>> INIT: Inserted 10 jobs");
            }

            boolean allSkipped = countPermissions > 0 && countRoles > 0 && countUsers > 0
                    && countCompanies > 0 && countSkills > 0 && countJobs > 0;

            if (allSkipped) {
                System.out.println(">>> SKIP INIT DATABASE ~ ALREADY HAVE DATA...");
            } else {
                System.out.println(">>> END INIT DATABASE");
            }

        } catch (Exception e) {
            System.out.println(">>> ERROR INIT DATABASE: " + e.getMessage());
            e.printStackTrace();
            System.out.println(">>> APP WILL CONTINUE WITHOUT INIT DATA");
        }
    }
}
