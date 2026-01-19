package com.ecommerce.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
// import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String url;
    private Float mrp;
    private Integer discount;
    private Float quantity;
    private String unit;
    private Integer orderedquantity;
    // @ManyToOne
    // @JoinColumn(name = "categoryid", nullable = false)
    // @JsonIgnoreProperties({ "products" })
    // private Category category;
    private Integer category;
    private String description;
    private Integer stock;
    private Boolean isavailable;

    @CreationTimestamp
    @Column(updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createdat;

    @UpdateTimestamp
    @Column
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime updatedat;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonManagedReference
    @JsonIgnore
    private List<CartItem> cartItems;
}
