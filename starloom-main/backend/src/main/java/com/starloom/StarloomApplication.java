package com.starloom;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.starloom.mapper")
public class StarloomApplication {
    public static void main(String[] args) {
        SpringApplication.run(StarloomApplication.class, args);
    }
}
