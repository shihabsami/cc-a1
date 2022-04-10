package com.cc.a1.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Image URL cannot be blank.")
    private String url;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "posts_id")
    @NotNull(message = "Post cannot be null.")
    private Post post;

}
