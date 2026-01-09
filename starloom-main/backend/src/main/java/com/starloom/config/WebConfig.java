package com.starloom.config;

import com.starloom.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/chat/**", "/api/pay/account", "/api/user/**")
                .excludePathPatterns(
                        "/api/userLogin",
                        "/api/register",
                        "/api/sendEmailCode",
                        "/api/sendEmailCode4ResetPassword",
                        "/api/checkEmailCode4ResetPassword",
                        "/api/resetPassword",
                        "/api/checkLogin",
                        "/api/loginOut",
                        "/api/pay/card/info"
                );
    }
}
