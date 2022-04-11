package com.cc.a1.service;

import com.cc.a1.exception.LikeAlreadyExistsException;
import com.cc.a1.model.Like;
import com.cc.a1.model.Post;
import com.cc.a1.model.User;
import com.cc.a1.repository.LikesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class LikesService {

    private final LikesRepository likesRepository;
    private final PostsService postsService;
    private final UsersService usersService;

    @Autowired
    public LikesService(LikesRepository likesRepository, PostsService postsService,
                        UsersService usersService) {
        this.likesRepository = likesRepository;
        this.postsService = postsService;
        this.usersService = usersService;
    }

    public Like addLike(long postId, String username) {
        Post post = postsService.getPostById(postId);
        User user = usersService.getUserByUsername(username);
        if (likesRepository.existsByPostAndUser(post, user))
            throw new LikeAlreadyExistsException(
                    String.format("Like on post by id %d by user with username %s already exists.", postId, username));

        Like like = new Like();
        like.setPost(post);
        like.setUser(user);
        return likesRepository.save(like);
    }

    @Transactional
    public void removeLike(long postId, String username) {
        Post post = postsService.getPostById(postId);
        User user = usersService.getUserByUsername(username);
        if (!likesRepository.existsByPostAndUser(post, user))
            throw new LikeAlreadyExistsException(
                    String.format("Like on post by id %d by user with username %s does not exist.", postId, username));

        likesRepository.deleteByPostAndUser(post, user);
    }

}
