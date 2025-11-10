package com.myapp.user.application;

import com.myapp.user.domain.PersonaRepository;
import com.myapp.user.domain.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserModuleConfig {

    @Bean
    public UserService userService(UserRepository userRepository) {
        return new UserService(userRepository);
    }

    @Bean
    public UserRegistrationService userRegistrationService(UserRepository userRepository,
                                                           PersonaRepository personaRepository,
                                                           PasswordEncoder passwordEncoder) {
        return new UserRegistrationService(userRepository, personaRepository, passwordEncoder);
    }
}