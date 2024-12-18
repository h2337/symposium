package io.github.jafarlihi.symposium.controller;

import com.auth0.jwt.exceptions.JWTVerificationException;
import io.github.jafarlihi.symposium.model.Category;
import io.github.jafarlihi.symposium.model.User;
import io.github.jafarlihi.symposium.service.AuthenticationService;
import io.github.jafarlihi.symposium.service.CategoryService;
import io.github.jafarlihi.symposium.service.UserService;
import io.github.jafarlihi.symposium.util.JSONUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity createCategory(@RequestBody String request) {
        JSONObject requestObject = new JSONObject(request);
        String token = JSONUtil.getStringFromJSONObject(requestObject, "token");
        String name = JSONUtil.getStringFromJSONObject(requestObject, "name");
        String color = JSONUtil.getStringFromJSONObject(requestObject, "color");
        JSONObject response = new JSONObject();
        Long userId;
        if (token == null || name == null || color == null)
            return new ResponseEntity<>(response.put("error", "Token, name, or color is missing").toString(), HttpStatus.BAD_REQUEST);
        try {
            userId = authenticationService.getTokenUserId(token);
        } catch (JWTVerificationException ex) {
            return new ResponseEntity<>(response.put("error", "Invalid token").toString(), HttpStatus.UNAUTHORIZED);
        }
        User user = userService.getUserById(userId);
        if (user == null || !user.getAccess().equals(99L))
            return new ResponseEntity<>(response.put("error", "Insufficient privileges").toString(), HttpStatus.UNAUTHORIZED);
        Category category = categoryService.createCategory(name, color);
        if (category == null)
            return new ResponseEntity<>(response.put("error", "Failed to create the category, name already exists?").toString(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getCategories() {
        JSONObject response = new JSONObject();
        List<Category> categories = categoryService.getCategories();
        return new ResponseEntity<>(response.put("categories", categories).toString(), HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity deleteCategory(@RequestBody String request) {
        JSONObject requestObject = new JSONObject(request);
        String token = JSONUtil.getStringFromJSONObject(requestObject, "token");
        Integer id = JSONUtil.getIntegerFromJSONObject(requestObject, "id");
        JSONObject response = new JSONObject();
        Long userId;
        if (token == null || id == null)
            return new ResponseEntity<>(response.put("error", "Token, name, or color is missing").toString(), HttpStatus.BAD_REQUEST);
        try {
            userId = authenticationService.getTokenUserId(token);
        } catch (JWTVerificationException ex) {
            return new ResponseEntity<>(response.put("error", "Invalid token").toString(), HttpStatus.UNAUTHORIZED);
        }
        User user = userService.getUserById(userId);
        if (user == null || !user.getAccess().equals(99L))
            return new ResponseEntity<>(response.put("error", "Insufficient privileges").toString(), HttpStatus.UNAUTHORIZED);
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
