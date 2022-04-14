package com.cc.a1.service;

import com.cc.a1.model.Comment;
import com.cc.a1.model.Post;
import com.cc.a1.model.User;
import com.cc.a1.repository.CommentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Comment save(long postId, String username, String text) {
        Post post = postsService.getPostById(postId);
        User user = usersService.getUserByUsername(username);
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setText(text);
        return commentsRepository.save(comment);
    }

}
