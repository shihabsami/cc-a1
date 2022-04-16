package com.cc.a1.repository;

import com.cc.a1.model.Like;
import com.cc.a1.model.Post;
import com.cc.a1.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikesRepository extends JpaRepository<Like, Long> {

    boolean existsByPostAndUser(Post post, User user);

    void deleteByPostAndUser(Post post, User user);

    List<Like> findByPost_Id(long postId);

}
