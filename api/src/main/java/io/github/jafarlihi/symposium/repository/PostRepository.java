package io.github.jafarlihi.symposium.repository;

import io.github.jafarlihi.symposium.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("DELETE FROM Post p WHERE p.threadId = :threadId")
    void deleteByThreadId(@Param("threadId") Long threadId);
}
