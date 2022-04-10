package com.cc.a1.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comments")
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
