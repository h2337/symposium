package io.github.jafarlihi.symposium.repository;

import io.github.jafarlihi.symposium.model.Thread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ThreadRepository extends PagingAndSortingRepository<Thread, Long> {
    Page<Thread> findByCategoryId(Long categoryId, Pageable pageable);
    List<Thread> findByCategoryId(Long categoryId);
}
