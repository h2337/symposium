package io.github.jafarlihi.symposium.controller;

import com.auth0.jwt.exceptions.JWTVerificationException;
import io.github.jafarlihi.symposium.model.Post;
import io.github.jafarlihi.symposium.service.AuthenticationService;
import io.github.jafarlihi.symposium.service.PostService;
import io.github.jafarlihi.symposium.util.JSONUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity createPost(@RequestBody String request) {
        JSONObject requestObject = new JSONObject(request);
        String token = JSONUtil.getStringFromJSONObject(requestObject, "token");
        String content = JSONUtil.getStringFromJSONObject(requestObject, "content");
        Long threadId = JSONUtil.getLongFromJSONObject(requestObject, "threadId");
        JSONObject response = new JSONObject();
        Long userId;
        try {
            userId = authenticationService.getTokenUserId(token);
        } catch (JWTVerificationException ex) {
            return new ResponseEntity<>(response.put("error", "Invalid token").toString(), HttpStatus.UNAUTHORIZED);
        }
        if (content == null || threadId == null || content.equals(""))
            return new ResponseEntity<>(response.put("error", "Content and/or threadId is missing").toString(), HttpStatus.BAD_REQUEST);
        Post post = postService.createPost(threadId, userId, content);
        if (post == null)
            return new ResponseEntity<>(response.put("error", "Failed to create the post").toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getPosts(@RequestParam Integer threadId, @RequestParam Integer page, @RequestParam Integer pageSize) {
        JSONObject response = new JSONObject();
        if (page == null || pageSize == null)
            return new ResponseEntity<>(response.put("error", "Page and/or pageSize is missing").toString(), HttpStatus.BAD_REQUEST);
        List<Post> posts = postService.getPostsByThreadId(threadId, page, pageSize);
        return new ResponseEntity<>(response.put("posts", posts).toString(), HttpStatus.OK);
    }
}
