package io.github.jafarlihi.symposium.repository;

import io.github.jafarlihi.symposium.model.Thread;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ThreadRepository extends PagingAndSortingRepository<Thread, Long> {
}
