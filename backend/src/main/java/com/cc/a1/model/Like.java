package com.cc.a1.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@Table(name = "likes")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "users_id")
    @NotNull(message = "User cannot be null.")
    private User user;

    @ManyToOne
    @JoinColumn(name = "posts_id")
    @NotNull(message = "Post cannot be null.")
    private Post post;

}
