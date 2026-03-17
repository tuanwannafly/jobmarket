package com.tuan.jobmarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class JobmarketApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobmarketApplication.class, args);
	}

}
