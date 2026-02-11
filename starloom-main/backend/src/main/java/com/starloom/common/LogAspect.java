package com.starloom.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Aspect
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
@RequiredArgsConstructor
public class LogAspect {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Pointcut("within(com.starloom.controller..*)")
    public void controllerLayer() {
    }

    @Pointcut("within(com.starloom.service..*)")
    public void serviceLayer() {
    }

    @Around("controllerLayer() || serviceLayer()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String signature = joinPoint.getSignature().toShortString();

        String argsJson = safeToJson(sanitize(joinPoint.getArgs()));
        log.info("[AOP-IN] {} args={}", signature, argsJson);

        try {
            Object result = joinPoint.proceed();
            long cost = System.currentTimeMillis() - start;
            log.info("[AOP-OUT] {} costMs={} result={}", signature, cost, safeToJson(sanitize(result)));
            return result;
        } catch (Throwable ex) {
            long cost = System.currentTimeMillis() - start;
            Map<String, Object> err = new LinkedHashMap<>();
            err.put("type", ex.getClass().getName());
            err.put("message", ex.getMessage());
            log.error("[AOP-ERR] {} costMs={} ex={}", signature, cost, safeToJson(err), ex);
            throw ex;
        }
    }

    private Object sanitize(Object obj) {
        if (obj == null) return null;
        if (obj instanceof HttpServletRequest) return "<HttpServletRequest>";
        if (obj instanceof HttpServletResponse) return "<HttpServletResponse>";
        if (obj instanceof MultipartFile) return "<MultipartFile>";
        if (obj instanceof java.io.InputStream) return "<InputStream>";
        if (obj instanceof java.io.OutputStream) return "<OutputStream>";
        if (obj instanceof java.io.Reader) return "<Reader>";
        if (obj instanceof java.io.Writer) return "<Writer>";
        if (obj instanceof PrintWriter) return "<PrintWriter>";
        if (obj.getClass().isArray()) {
            if (obj instanceof Object[] arr) {
                Object[] out = new Object[arr.length];
                for (int i = 0; i < arr.length; i++) out[i] = sanitize(arr[i]);
                return out;
            }
        }
        return obj;
    }

    private String safeToJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return String.valueOf(obj);
        }
    }
}
