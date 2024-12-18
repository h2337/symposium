package io.github.jafarlihi.symposium.service;

import io.github.jafarlihi.symposium.model.Thread;
import io.github.jafarlihi.symposium.repository.PostRepository;
import io.github.jafarlihi.symposium.repository.ThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ThreadService {

    @Autowired
    private ThreadRepository threadRepository;
    @Autowired
    private PostRepository postRepository;

    public Optional<Thread> getThread(Long id) {
        return threadRepository.findById(id);
    }

    public List<Thread> getThreads(Integer page, Integer pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("createdAt").descending());
        return threadRepository.findAll(pageable).toList();
    }

    public List<Thread> getThreadsByCategoryId(Integer categoryId, Integer page, Integer pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("createdAt").descending());
        return threadRepository.findByCategoryId(categoryId.longValue(), pageable).toList();
    }

    public Thread createThread(Long userId, String title, Long categoryId) {
        Thread thread = new Thread();
        thread.setTitle(title);
        thread.setUserId(userId);
        thread.setCategoryId(categoryId);
        thread.setCreatedAt(LocalDateTime.now());
        return threadRepository.save(thread);
    }

    public void deleteThread(Long threadId) {
        postRepository.deleteByThreadId(threadId);
        threadRepository.deleteById(threadId);
    }
}
