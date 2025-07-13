package com.example.backend.controller;

import com.example.backend.entity.Expense;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense, @AuthenticationPrincipal UserDetails userDetails) {
        if (expense.getUser() == null && userDetails != null) {
            // Regular user: set the user to the currently authenticated user
            com.example.backend.entity.User user = userRepository.findByName(userDetails.getUsername()).orElse(null);
            expense.setUser(user);
        }
        return expenseRepository.save(expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
        Expense expense = expenseRepository.findById(id).orElseThrow();
        expense.setAmount(expenseDetails.getAmount());
        expense.setDescription(expenseDetails.getDescription());
        expense.setDate(expenseDetails.getDate());
        expense.setCategory(expenseDetails.getCategory());
        expense.setUser(expenseDetails.getUser());
        return expenseRepository.save(expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
    }

    // Analytics: Total by Category
    @GetMapping("/total-by-category")
    public Map<String, Double> getTotalByCategory() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream().collect(
            Collectors.groupingBy(
                e -> e.getCategory().getName(),
                Collectors.summingDouble(Expense::getAmount)
            )
        );
    }

    // Analytics: Monthly Summary
    @GetMapping("/monthly-summary")
    public Map<String, Double> getMonthlySummary() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream().collect(
            Collectors.groupingBy(
                e -> e.getDate().getYear() + "-" + String.format("%02d", e.getDate().getMonthValue()),
                Collectors.summingDouble(Expense::getAmount)
            )
        );
    }

    @GetMapping("/my")
    public List<Expense> getMyExpenses(@AuthenticationPrincipal UserDetails userDetails) {
        return expenseRepository.findByUser_Name(userDetails.getUsername());
    }

    @GetMapping("/my/total-by-category")
    public Map<String, Double> getMyTotalByCategory(@AuthenticationPrincipal UserDetails userDetails) {
        List<Expense> expenses = expenseRepository.findByUser_Name(userDetails.getUsername());
        return expenses.stream().collect(
            Collectors.groupingBy(
                e -> e.getCategory().getName(),
                Collectors.summingDouble(Expense::getAmount)
            )
        );
    }

    @GetMapping("/my/monthly-summary")
    public Map<String, Double> getMyMonthlySummary(@AuthenticationPrincipal UserDetails userDetails) {
        List<Expense> expenses = expenseRepository.findByUser_Name(userDetails.getUsername());
        return expenses.stream().collect(
            Collectors.groupingBy(
                e -> e.getDate().getYear() + "-" + String.format("%02d", e.getDate().getMonthValue()),
                Collectors.summingDouble(Expense::getAmount)
            )
        );
    }
}
 