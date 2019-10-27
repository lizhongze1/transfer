package com.lzz.transfor;

import com.lzz.common.mongo.MongoOplog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@ComponentScan(basePackages = { "com.lzz"})
public class TransforApplication implements CommandLineRunner {
    @Autowired
    private MongoOplog MongoOplog;
    public static void main(String[] args) {
        SpringApplication.run(TransforApplication.class, args);
    }

    @Override
    public void run(String... args){
        MongoOplog.run();
    }
}
