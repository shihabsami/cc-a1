package com.cc.a1.repository;

import com.cc.a1.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentsRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPost_Id(long postId);

}
