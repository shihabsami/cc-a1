package com.cc.a1.service;

import com.cc.a1.model.Comment;
import com.cc.a1.model.Post;
import com.cc.a1.model.User;
import com.cc.a1.repository.CommentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentsService {

    private final CommentsRepository commentsRepository;
    private final PostsService postsService;
    private final UsersService usersService;

    @Autowired
    public CommentsService(CommentsRepository commentsRepository, PostsService postsService,
                           UsersService usersService) {
        this.commentsRepository = commentsRepository;
        this.postsService = postsService;
        this.usersService = usersService;
    }

    public Comment save(String text, long postId, String username) {
        Post post = postsService.getPostById(postId);
        User user = usersService.getUserByUsername(username);
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setText(text);
        return commentsRepository.save(comment);
    }

    public List<Comment> getByPostId(long postId) {
        return commentsRepository.findByPost_Id(postId);
    }

}
