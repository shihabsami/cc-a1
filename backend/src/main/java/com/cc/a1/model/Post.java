package com.cc.a1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "users_id")
    @NotNull(message = "User cannot be null.")
    private User user;

    private String text;

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL)
    private Image image;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Like> likes;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Comment> comments;

    private Date createdAt;

    /**
     * Saves the timestamp of creation.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

}
