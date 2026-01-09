package com.starloom.service;

import cn.hutool.crypto.digest.BCrypt;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.starloom.common.Result;
import com.starloom.common.ResultCode;
import com.starloom.entity.User;
import com.starloom.mapper.UserMapper;
import com.starloom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService extends ServiceImpl<UserMapper, User> {

    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    // 使用内存缓存代替Redis（开发环境）
    private static final Map<String, String> codeCache = new ConcurrentHashMap<>();

    private static final String CODE_PREFIX = "email:code:";
    private static final String RESET_CODE_PREFIX = "email:reset:code:";

    public Result<?> login(String email, String password) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getEmail, email));
        if (user == null) {
            return Result.error(ResultCode.ACCOUNT_NOT_EXIST, "账号不存在");
        }
        if (!BCrypt.checkpw(password, user.getPassword())) {
            return Result.error(ResultCode.PASSWORD_ERROR, "密码错误");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        Map<String, Object> data = new HashMap<>();
        data.put("user_token", token);
        data.put("user_id", user.getId());
        data.put("account", user.getEmail());
        return Result.success(data);
    }

    public Result<?> walletLogin(String walletAddress, String signature, String timestamp) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getWalletAddress, walletAddress));
        if (user == null) {
            user = new User();
            user.setWalletAddress(walletAddress);
            user.setNickname("Wallet_" + walletAddress.substring(0, 8));
            save(user);
        }
        String token = jwtUtil.generateToken(user.getId(), walletAddress);
        Map<String, Object> data = new HashMap<>();
        data.put("user_token", token);
        data.put("user_id", user.getId());
        data.put("account", walletAddress);
        return Result.success(data);
    }

    public Result<?> sendEmailCode(String email, String language) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getEmail, email));
        if (user != null) {
            return Result.error(ResultCode.EMAIL_EXIST, "邮箱已注册");
        }
        String code = generateCode();
        codeCache.put(CODE_PREFIX + email, code);
        log.info("验证码已生成: {} -> {}", email, code);
        emailService.sendVerifyCode(email, code, language);
        return Result.success();
    }

    public Result<?> register(String email, String password, String verifyCode) {
        String cachedCode = codeCache.get(CODE_PREFIX + email);
        if (cachedCode == null || !cachedCode.equals(verifyCode)) {
            return Result.error(ResultCode.CODE_ERROR, "验证码错误");
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(BCrypt.hashpw(password));
        user.setNickname("User_" + System.currentTimeMillis());
        save(user);
        codeCache.remove(CODE_PREFIX + email);
        Map<String, Object> data = new HashMap<>();
        data.put("email", email);
        return Result.success(data);
    }

    public Result<?> sendResetPasswordCode(String email, String language) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getEmail, email));
        if (user == null) {
            return Result.error(ResultCode.ACCOUNT_NOT_EXIST, "账号不存在");
        }
        String code = generateCode();
        codeCache.put(RESET_CODE_PREFIX + email, code);
        log.info("重置密码验证码已生成: {} -> {}", email, code);
        emailService.sendVerifyCode(email, code, language);
        return Result.success();
    }

    public Result<?> checkResetCode(String email, String verifyCode) {
        String cachedCode = codeCache.get(RESET_CODE_PREFIX + email);
        Map<String, Integer> data = new HashMap<>();
        if (cachedCode != null && cachedCode.equals(verifyCode)) {
            data.put("is_checked", 1);
        } else {
            data.put("is_checked", 0);
        }
        return Result.success(data);
    }

    public Result<?> resetPassword(String email, String password, String verifyCode) {
        String cachedCode = codeCache.get(RESET_CODE_PREFIX + email);
        if (cachedCode == null || !cachedCode.equals(verifyCode)) {
            return Result.error(ResultCode.CODE_ERROR, "验证码错误");
        }
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getEmail, email));
        if (user == null) {
            return Result.error(ResultCode.ACCOUNT_NOT_EXIST, "账号不存在");
        }
        user.setPassword(BCrypt.hashpw(password));
        updateById(user);
        codeCache.remove(RESET_CODE_PREFIX + email);
        return Result.success();
    }

    public Result<?> checkLogin(String token) {
        if (token == null || !jwtUtil.validateToken(token)) {
            return Result.error(ResultCode.TOKEN_INVALID, "登录已过期");
        }
        Long userId = jwtUtil.getUserId(token);
        User user = getById(userId);
        if (user == null) {
            return Result.error(ResultCode.TOKEN_INVALID, "用户不存在");
        }
        Map<String, Object> data = new HashMap<>();
        data.put("user_id", user.getId());
        data.put("email", user.getEmail());
        return Result.success(data);
    }

    private String generateCode() {
        return String.valueOf((int) ((Math.random() * 9 + 1) * 100000));
    }
}
