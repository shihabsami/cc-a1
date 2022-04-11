package com.cc.a1.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@Table(name = "comments")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "users_id")
    @NotNull(message = "User cannot be null.")
    private User user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "posts_id")
    @NotNull(message = "Post cannot be null.")
    private Post post;

}
