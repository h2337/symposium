package io.github.jafarlihi.symposium.controller;

import io.github.jafarlihi.symposium.model.User;
import io.github.jafarlihi.symposium.service.UserService;
import io.github.jafarlihi.symposium.util.JSONUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity register(@RequestBody String request) {
        JSONObject requestObject = new JSONObject(request);
        String password = JSONUtil.getStringFromJSONObject(requestObject, "password");
        String username = JSONUtil.getStringFromJSONObject(requestObject, "username");
        String email = JSONUtil.getStringFromJSONObject(requestObject, "email");
        JSONObject response = new JSONObject();
        if (username == null || email == null || password == null || username.equals("") || email.equals("") || password.equals(""))
            return new ResponseEntity<>(response.put("error", "Username, email, or password is missing").toString(), HttpStatus.BAD_REQUEST);
        if (password.length() < 6)
            return new ResponseEntity<>(response.put("error", "Minimum password length is 6").toString(), HttpStatus.BAD_REQUEST);
        User user = userService.createUser(username, email, password);
        if (user == null)
            return new ResponseEntity<>(response.put("error", "Failed to create the user").toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
