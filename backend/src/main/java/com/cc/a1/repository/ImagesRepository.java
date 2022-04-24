package com.cc.a1.repository;

import com.cc.a1.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImagesRepository extends JpaRepository<Image, Long> {

    Optional<Image> findByUser_Id(Long id);

}
