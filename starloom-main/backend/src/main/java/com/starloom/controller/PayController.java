package com.starloom.controller;

import com.starloom.common.Result;
import com.starloom.entity.User;
import com.starloom.service.UserService;
import com.starloom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
@RequiredArgsConstructor
public class PayController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/card/info")
    public Result<?> cardInfo() {
        // 返回会员卡信息
        List<Map<String, Object>> cards = new ArrayList<>();
        
        Map<String, Object> card1 = new HashMap<>();
        card1.put("id", 1);
        card1.put("name", "月度会员");
        card1.put("price", 29.9);
        card1.put("days", 30);
        card1.put("description", "每月无限次AI占卜");
        cards.add(card1);

        Map<String, Object> card2 = new HashMap<>();
        card2.put("id", 2);
        card2.put("name", "季度会员");
        card2.put("price", 79.9);
        card2.put("days", 90);
        card2.put("description", "季度无限次AI占卜，享8折优惠");
        cards.add(card2);

        Map<String, Object> card3 = new HashMap<>();
        card3.put("id", 3);
        card3.put("name", "年度会员");
        card3.put("price", 199.9);
        card3.put("days", 365);
        card3.put("description", "全年无限次AI占卜，享5折优惠");
        cards.add(card3);

        return Result.success(cards);
    }

    @GetMapping("/account")
    public Result<?> account(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserId(token);
        User user = userService.getById(userId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("user_id", user.getId());
        data.put("email", user.getEmail());
        data.put("vip_level", user.getVipLevel());
        data.put("vip_expire_time", user.getVipExpireTime());
        
        return Result.success(data);
    }
}
