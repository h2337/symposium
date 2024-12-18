package io.github.jafarlihi.symposium.service;

import io.github.jafarlihi.symposium.model.Category;
import io.github.jafarlihi.symposium.model.Thread;
import io.github.jafarlihi.symposium.repository.CategoryRepository;
import io.github.jafarlihi.symposium.repository.ThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ThreadRepository threadRepository;
    @Autowired
    private ThreadService threadService;

    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(String name, String color) {
        Category category = new Category();
        category.setName(name);
        category.setColor(color);
        return categoryRepository.save(category);
    }

    public void deleteCategory(Integer id) {
        List<Thread> threads = threadRepository.findByCategoryId(id.longValue());
        for (Thread thread : threads)
            threadService.deleteThread(thread.getId());
        categoryRepository.deleteById(id.longValue());
    }
}
