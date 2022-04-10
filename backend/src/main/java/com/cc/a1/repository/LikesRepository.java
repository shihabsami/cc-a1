package com.cc.a1.repository;

import com.cc.a1.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikesRepository extends JpaRepository<Like, Long> {
}
