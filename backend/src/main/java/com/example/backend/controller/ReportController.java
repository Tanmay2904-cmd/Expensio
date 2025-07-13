package com.example.backend.controller;

import com.example.backend.entity.Expense;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyReport(
            @RequestParam(required = false) String yearMonth,
            @RequestParam(required = false) Long userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            // Parse year-month (format: "2024-01")
            YearMonth targetMonth = yearMonth != null ? 
                YearMonth.parse(yearMonth, DateTimeFormatter.ofPattern("yyyy-MM")) : 
                YearMonth.now();
            
            LocalDate startDate = targetMonth.atDay(1);
            LocalDate endDate = targetMonth.atEndOfMonth();
            
            List<Expense> expenses;
            
            // Determine which user's expenses to fetch
            if (userId != null) {
                // Admin requesting specific user's report
                expenses = expenseRepository.findByUser_IdAndDateBetween(userId, startDate, endDate);
            } else {
                // Regular user requesting their own report
                expenses = expenseRepository.findByUser_NameAndDateBetween(userDetails.getUsername(), startDate, endDate);
            }
            
            // Calculate summary statistics
            double totalAmount = expenses.stream().mapToDouble(Expense::getAmount).sum();
            long totalCount = expenses.size();
            
            // Group by category
            Map<String, Double> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                    e -> e.getCategory().getName(),
                    Collectors.summingDouble(Expense::getAmount)
                ));
            
            // Group by day
            Map<String, Double> dailyTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                    e -> e.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                    Collectors.summingDouble(Expense::getAmount)
                ));
            
            // Find top expenses
            List<Expense> topExpenses = expenses.stream()
                .sorted((e1, e2) -> Double.compare(e2.getAmount(), e1.getAmount()))
                .limit(5)
                .collect(Collectors.toList());
            
            // Calculate average daily spending
            double avgDailySpending = dailyTotals.isEmpty() ? 0 : 
                dailyTotals.values().stream().mapToDouble(Double::doubleValue).average().orElse(0);
            
            // Prepare response
            Map<String, Object> report = new HashMap<>();
            
            Map<String, Object> period = new HashMap<>();
            period.put("yearMonth", targetMonth.format(DateTimeFormatter.ofPattern("yyyy-MM")));
            period.put("startDate", startDate.toString());
            period.put("endDate", endDate.toString());
            period.put("daysInMonth", targetMonth.lengthOfMonth());
            report.put("period", period);
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalAmount", totalAmount);
            summary.put("totalCount", totalCount);
            summary.put("averageAmount", totalCount > 0 ? totalAmount / totalCount : 0);
            summary.put("averageDailySpending", avgDailySpending);
            summary.put("daysWithExpenses", dailyTotals.size());
            report.put("summary", summary);
            
            report.put("categoryBreakdown", categoryTotals);
            report.put("dailyBreakdown", dailyTotals);
            
            report.put("topExpenses", topExpenses.stream().map(e -> {
                Map<String, Object> expenseMap = new HashMap<>();
                expenseMap.put("id", e.getId());
                expenseMap.put("amount", e.getAmount());
                expenseMap.put("description", e.getDescription());
                expenseMap.put("category", e.getCategory().getName());
                expenseMap.put("date", e.getDate().toString());
                return expenseMap;
            }).collect(Collectors.toList()));
            
            report.put("allExpenses", expenses.stream().map(e -> {
                Map<String, Object> expenseMap = new HashMap<>();
                expenseMap.put("id", e.getId());
                expenseMap.put("amount", e.getAmount());
                expenseMap.put("description", e.getDescription());
                expenseMap.put("category", e.getCategory().getName());
                expenseMap.put("date", e.getDate().toString());
                return expenseMap;
            }).collect(Collectors.toList()));
            
            return ResponseEntity.ok(report);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to generate report: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAvailableUsers() {
        try {
            List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getName());
                    userMap.put("role", user.getRole());
                    return userMap;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }
} 