package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String description;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Constructors
    public Expense() {}
    public Expense(Double amount, String description, LocalDate date, Category category, User user) {
        this.amount = amount;
        this.description = description;
        this.date = date;
        this.category = category;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
