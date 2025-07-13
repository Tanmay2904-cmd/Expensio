package com.example.backend.repository;

import com.example.backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser_Name(String name);
    List<Expense> findByUser_NameAndDateBetween(String userName, LocalDate startDate, LocalDate endDate);
    List<Expense> findByUser_IdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
} 
 