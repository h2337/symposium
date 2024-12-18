package io.github.jafarlihi.symposium.service;

import io.github.jafarlihi.symposium.model.Thread;
import io.github.jafarlihi.symposium.repository.ThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ThreadService {

    @Autowired
    private ThreadRepository threadRepository;

    public List<Thread> getThreads(Integer page, Integer pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("createdAt"));
        return threadRepository.findAll(pageable).toList();
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
        threadRepository.deleteById(threadId);
    }
}
