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

        String argsJson = safeToJson(joinPoint.getArgs());
        log.info("[AOP-IN] {} args={}", signature, argsJson);

        try {
            Object result = joinPoint.proceed();
            long cost = System.currentTimeMillis() - start;
            log.info("[AOP-OUT] {} costMs={} result={}", signature, cost, safeToJson(result));
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

    private String safeToJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return String.valueOf(obj);
        }
    }
}
