package com.cc.a1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Getter
@Setter
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Image URL cannot be blank.")
    @Size(max = 1023)
    private String url;

    @OneToOne
    @JoinColumn(name = "posts_id")
    @JsonIgnore
    private Post post;

    @OneToOne
    @JoinColumn(name = "users_id")
    @JsonIgnore
    private User user;

}
