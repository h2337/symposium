package io.github.jafarlihi.symposium.repository;

import io.github.jafarlihi.symposium.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
