package io.github.jafarlihi.symposium.controller;

import com.auth0.jwt.exceptions.JWTVerificationException;
import io.github.jafarlihi.symposium.model.Post;
import io.github.jafarlihi.symposium.model.Thread;
import io.github.jafarlihi.symposium.service.AuthenticationService;
import io.github.jafarlihi.symposium.service.CategoryService;
import io.github.jafarlihi.symposium.service.PostService;
import io.github.jafarlihi.symposium.service.ThreadService;
import io.github.jafarlihi.symposium.util.JSONUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/thread")
public class ThreadController {

    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private ThreadService threadService;
    @Autowired
    private PostService postService;
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity createThread(@RequestBody String request) {
        JSONObject requestObject = new JSONObject(request);
        String token = JSONUtil.getStringFromJSONObject(requestObject, "token");
        String title = JSONUtil.getStringFromJSONObject(requestObject, "title");
        String content = JSONUtil.getStringFromJSONObject(requestObject, "content");
        Long categoryId = JSONUtil.getLongFromJSONObject(requestObject, "categoryId");
        JSONObject response = new JSONObject();
        Long userId;
        if (token == null)
            return new ResponseEntity<>(response.put("error", "Token missing").toString(), HttpStatus.BAD_REQUEST);
        try {
            userId = authenticationService.getTokenUserId(token);
        } catch (JWTVerificationException ex) {
            return new ResponseEntity<>(response.put("error", "Invalid token").toString(), HttpStatus.UNAUTHORIZED);
        }
        if (title == null || content == null || title.equals("") || content.equals(""))
            return new ResponseEntity<>(response.put("error", "Content and/or title is missing").toString(), HttpStatus.BAD_REQUEST);
        if (categoryService.getCategoryById(categoryId) == null)
            return new ResponseEntity<>(response.put("error", "Non-existing categoryId provided").toString(), HttpStatus.BAD_REQUEST);
        Thread thread = threadService.createThread(userId, title, categoryId);
        if (thread == null)
            return new ResponseEntity<>(response.put("error", "Failed to create the thread").toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        Post post = postService.createPost(thread.getId(), userId, content);
        if (post == null) {
            threadService.deleteThread(thread.getId());
            return new ResponseEntity<>(response.put("error", "Failed to create the post").toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getThreads(@RequestParam(required = false) Integer categoryId, @RequestParam Integer page, @RequestParam Integer pageSize) {
        JSONObject response = new JSONObject();
        if (page == null || pageSize == null)
            return new ResponseEntity<>(response.put("error", "Page and/or pageSize is missing").toString(), HttpStatus.BAD_REQUEST);
        List<Thread> threads = null;
        if (categoryId == null)
            threads = threadService.getThreads(page, pageSize);
        else
            threads = threadService.getThreadsByCategoryId(categoryId, page, pageSize);
        return new ResponseEntity<>(response.put("threads", threads).toString(), HttpStatus.OK);
    }
}
