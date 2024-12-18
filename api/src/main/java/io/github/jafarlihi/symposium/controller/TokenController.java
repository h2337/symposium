package io.github.jafarlihi.symposium.controller;

import io.github.jafarlihi.symposium.model.User;
import io.github.jafarlihi.symposium.service.AuthenticationService;
import io.github.jafarlihi.symposium.service.UserService;
import io.github.jafarlihi.symposium.util.JSONUtil;
import org.apache.commons.codec.digest.DigestUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/token")
public class TokenController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping
    public ResponseEntity authenticate(@RequestBody String request) {
        JSONObject requestObject = new JSONObject(request);
        String password = JSONUtil.getStringFromJSONObject(requestObject, "password");
        String username = JSONUtil.getStringFromJSONObject(requestObject, "username");
        String email = JSONUtil.getStringFromJSONObject(requestObject, "email");
        JSONObject response = new JSONObject();
        if ((username == null || username.equals("")) && (email == null || email.equals("")))
            return new ResponseEntity<>(response.put("error", "Username and email both missing").toString(), HttpStatus.BAD_REQUEST);
        if (password == null || password.equals(""))
            return new ResponseEntity<>(response.put("error", "Password is missing").toString(), HttpStatus.BAD_REQUEST);
        User user;
        if (username == null || username.equals(""))
            user = userService.getUserByEmail(email);
        else
            user = userService.getUserByUsername(username);
        if (user == null)
            return new ResponseEntity<>(response.put("error", "User not found").toString(), HttpStatus.BAD_REQUEST);
        String passwordHash = DigestUtils.sha256Hex(password);
        if (passwordHash.equals(user.getPassword())) {
            response.put("token", authenticationService.createToken(user))
                    .put("userId", user.getId())
                    .put("username", user.getUsername())
                    .put("email", user.getEmail())
                    .put("access", user.getAccess());
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response.put("error", "Wrong password").toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
