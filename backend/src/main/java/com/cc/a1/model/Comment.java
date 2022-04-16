package com.cc.a1.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date createdAt;

    @NotBlank(message = "Comment text cannot be blank.")
    private String text;

    @ManyToOne
    @JoinColumn(name = "users_id")
    @NotNull(message = "User cannot be null.")
    private User user;

    @ManyToOne
    @JoinColumn(name = "posts_id")
    @NotNull(message = "Post cannot be null.")
    private Post post;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

}
