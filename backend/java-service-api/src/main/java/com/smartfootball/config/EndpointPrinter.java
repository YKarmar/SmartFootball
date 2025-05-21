package com.smartfootball.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 在应用启动时打印所有API端点
 */
@Component
public class EndpointPrinter implements CommandLineRunner {

    @Autowired
    private RequestMappingHandlerMapping handlerMapping;

    @Override
    public void run(String... args) {
        System.out.println("\n=== SmartFootball Java API Endpoints ===");
        
        // 获取所有映射的端点
        Map<RequestMappingInfo, HandlerMethod> map = handlerMapping.getHandlerMethods();
        
        // 转换为格式化的字符串列表
        List<String> endpoints = new ArrayList<>();
        map.forEach((info, method) -> {
            try {
                // 获取HTTP方法
                String httpMethods = info.getMethodsCondition().getMethods().isEmpty() ? 
                        "ALL" : info.getMethodsCondition().getMethods().toString();
                
                // 获取路径 - 兼容Spring Boot 2.7+版本
                String paths;
                if (info.getPathPatternsCondition() != null) {
                    // Spring Boot 2.7+使用PathPatternsCondition
                    paths = info.getPathPatternsCondition().getPatterns().toString();
                } else if (info.getPatternsCondition() != null) {
                    // 旧版本使用PatternsCondition
                    paths = info.getPatternsCondition().getPatterns().toString();
                } else {
                    // 如果两者都为null，使用默认值
                    paths = "[unknown path]";
                }
                
                // 获取控制器名称
                String controllerName = method.getBeanType().getSimpleName();
                String methodName = method.getMethod().getName();
                
                endpoints.add(String.format("%-50s %-10s %s.%s", 
                        paths, httpMethods, controllerName, methodName));
            } catch (Exception e) {
                // 捕获任何异常，确保程序不会崩溃
                System.out.println("Warning: " + e.getMessage());
            }
        });
        
        // 排序并打印
        endpoints.stream()
                .sorted()
                .forEach(System.out::println);
        
        System.out.println("=========================================\n");
    }
} 