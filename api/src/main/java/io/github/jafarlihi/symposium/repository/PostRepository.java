package io.github.jafarlihi.symposium.repository;

import io.github.jafarlihi.symposium.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
