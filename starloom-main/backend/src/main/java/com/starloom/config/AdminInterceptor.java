package com.starloom.config;

import com.starloom.service.UserService;
import com.starloom.util.JwtUtil;
import com.starloom.common.Result;
import com.starloom.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class AdminInterceptor implements HandlerInterceptor {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 登录接口不需要验证
        String uri = request.getRequestURI();
        if (uri.contains("/sysAdm/login")) {
            return true;
        }
        
        // 获取token
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            writeResponse(response, Result.error(401, "未登录或token已过期"));
            return false;
        }
        
        token = token.substring(7);
        
        try {
            // 验证token格式和类型
            if (!jwtUtil.validateToken(token) || !jwtUtil.isAdminToken(token)) {
                writeResponse(response, Result.error(401, "token无效或非管理员token"));
                return false;
            }
            
            // 获取用户ID
            Long userId = jwtUtil.getUserId(token);
            if (userId == null) {
                writeResponse(response, Result.error(401, "token无效"));
                return false;
            }
            
            // 验证用户是否为管理员
            User user = userService.getById(userId);
            if (user == null || !user.isAdmin()) {
                writeResponse(response, Result.error(403, "权限不足"));
                return false;
            }
            
            // 将管理员ID放入request
            request.setAttribute("adminId", userId);
            request.setAttribute("adminUser", user);
            return true;
            
        } catch (Exception e) {
            writeResponse(response, Result.error(401, "token验证失败"));
            return false;
        }
    }
    
    private void writeResponse(HttpServletResponse response, Result<?> result) throws Exception {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(200);
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
