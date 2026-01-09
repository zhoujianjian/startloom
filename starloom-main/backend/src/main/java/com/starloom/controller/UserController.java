package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/userLogin")
    public Result<?> login(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String password = params.get("password");
        String walletAddress = params.get("wallet_address");
        String signature = params.get("signature");
        String timestamp = params.get("timestamp");

        if (walletAddress != null && signature != null) {
            return userService.walletLogin(walletAddress, signature, timestamp);
        }
        return userService.login(email, password);
    }

    @PostMapping("/sendEmailCode")
    public Result<?> sendEmailCode(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String language = params.getOrDefault("language", "zh");
        return userService.sendEmailCode(email, language);
    }

    @PostMapping("/register")
    public Result<?> register(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String password = params.get("password");
        String verifyCode = params.get("verifyCode");
        return userService.register(email, password, verifyCode);
    }

    @GetMapping("/loginOut")
    public Result<?> loginOut() {
        return Result.success();
    }

    @PostMapping("/sendEmailCode4ResetPassword")
    public Result<?> sendResetPasswordCode(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String language = params.getOrDefault("language", "zh");
        return userService.sendResetPasswordCode(email, language);
    }

    @PostMapping("/checkEmailCode4ResetPassword")
    public Result<?> checkResetCode(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String verifyCode = params.get("verifyCode");
        return userService.checkResetCode(email, verifyCode);
    }

    @PostMapping("/resetPassword")
    public Result<?> resetPassword(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String password = params.get("password");
        String verifyCode = params.get("verifyCode");
        return userService.resetPassword(email, password, verifyCode);
    }

    @GetMapping("/checkLogin")
    public Result<?> checkLogin(@RequestHeader(value = "Authorization", required = false) String token) {
        return userService.checkLogin(token);
    }
}
