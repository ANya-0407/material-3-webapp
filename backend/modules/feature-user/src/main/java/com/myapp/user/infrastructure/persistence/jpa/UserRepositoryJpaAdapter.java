package com.myapp.user.infrastructure.persistence.jpa;

import com.myapp.user.domain.User;
import com.myapp.user.domain.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class UserRepositoryJpaAdapter implements UserRepository {

    private final SpringDataUserJpaRepository jpa;

    public UserRepositoryJpaAdapter(SpringDataUserJpaRepository jpa) { this.jpa = jpa; }

    @Override public Optional<User> findById(UUID id) {
        return jpa.findById(id).map(UserJpaEntity::toDomain);
    }

    @Override public boolean existsByEmail(String normalizedEmail) {
        return jpa.existsByEmail(normalizedEmail);
    }

    @Override public boolean existsByPhone(String phoneE164) {
        return jpa.existsByPhoneE164(phoneE164);
    }

    @Override public User save(User user) {
        return UserJpaEntity.toDomain(jpa.save(UserJpaEntity.fromDomain(user)));
    }
}