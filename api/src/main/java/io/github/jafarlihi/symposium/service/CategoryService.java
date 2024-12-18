package io.github.jafarlihi.symposium.service;

import io.github.jafarlihi.symposium.model.Category;
import io.github.jafarlihi.symposium.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty())
            return null;
        return category.get();
    }

    public Category createCategory(String name, String color) {
        Category category = new Category();
        category.setName(name);
        category.setColor(color);
        return categoryRepository.save(category);
    }
}
