package com.cc.a1.service;

import com.cc.a1.exception.PostNotFoundException;
import com.cc.a1.model.Post;
import com.cc.a1.model.User;
import com.cc.a1.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.cc.a1.misc.Constants.PAGE_SIZE;

@Service
public class PostsService {

    private final PostsRepository postsRepository;
    private final UsersService usersService;

    @Autowired
    public PostsService(PostsRepository postsRepository,
                        UsersService usersService) {
        this.postsRepository = postsRepository;
        this.usersService = usersService;
    }

    public Post savePost(String text, String username) {
        User user = usersService.getUserByUsername(username);
        Post post = new Post();
        post.setText(text);
        post.setUser(user);
        return postsRepository.save(post);
    }

    public Post getPostById(long id) {
        return postsRepository.findById(id).orElseThrow(
                () -> new PostNotFoundException(String.format("Post by id %s not found\n", id)));
    }

    public List<Post> getAllPosts() {
        return postsRepository.findAll();
    }

    public boolean hasMoreAfter(int page) {
        return postsRepository.findAll(PageRequest.of(page + 1, PAGE_SIZE)).hasContent();
    }

    public List<Post> getPosts(int page) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException exception) {
            exception.printStackTrace();
        }
        return postsRepository.findAll(PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt"))).getContent();
    }

    public long getPostCount() {
        return postsRepository.count();
    }

}
