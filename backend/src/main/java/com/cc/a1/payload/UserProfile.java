package com.cc.a1.payload;

import com.cc.a1.model.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class UserProfile {

    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private Image image;
    private List<Post> posts;
    private List<Like> likes;
    private List<Comment> comments;
    private Date createdAt;

    public UserProfile(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.image = user.getImage();
        this.posts = user.getPosts();
        this.likes = user.getLikes();
        this.comments = user.getComments();
        this.createdAt = user.getCreatedAt();
    }

}
