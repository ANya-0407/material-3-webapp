package com.myapp.user.application;

import com.myapp.common.NotFoundException;
import com.myapp.user.domain.User;
import com.myapp.user.domain.UserRepository;

import java.util.UUID;

public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }

    public User getById(UUID id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("User %s not found".formatted(id)));
    }
}