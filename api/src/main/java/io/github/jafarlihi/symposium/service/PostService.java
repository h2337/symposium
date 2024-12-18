package io.github.jafarlihi.symposium.service;

import io.github.jafarlihi.symposium.model.Post;
import io.github.jafarlihi.symposium.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(Long threadId, Long userId, String content) {
        Post post = new Post();
        post.setThreadId(threadId);
        post.setUserId(userId);
        post.setContent(content);
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }
}
