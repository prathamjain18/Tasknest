package com.tasknest.tasknestbackend.repository;

import com.tasknest.tasknestbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    //The UserRepository interface extends the JpaRepository interface
    //so the CRUD operations can be used

    User findByEmail(String email);
    User findByUserID(int userID);
}
