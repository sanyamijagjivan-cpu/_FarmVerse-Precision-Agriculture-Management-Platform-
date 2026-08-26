
package com.farmverse.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @JsonIgnore
    private String password;

    // ==============================
    // PROFILE INFORMATION
    // ==============================

    private String phone;

    private String state;

    private String district;

    private String village;

    private String farmerType;

    private String farmingExperience;

    private String preferredLanguage;

    // ==============================
    // FARM RELATION
    // ==============================

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Farm> farms = new ArrayList<>();

    // ==============================
    // CONSTRUCTOR
    // ==============================

    public User() {
    }

    // ==============================
    // ID
    // ==============================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // ==============================
    // NAME
    // ==============================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // ==============================
    // EMAIL
    // ==============================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // ==============================
    // PASSWORD
    // ==============================

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ==============================
    // PHONE
    // ==============================

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    // ==============================
    // STATE
    // ==============================

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    // ==============================
    // DISTRICT
    // ==============================

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    // ==============================
    // VILLAGE
    // ==============================

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    // ==============================
    // FARMER TYPE
    // ==============================

    public String getFarmerType() {
        return farmerType;
    }

    public void setFarmerType(String farmerType) {
        this.farmerType = farmerType;
    }

    // ==============================
    // FARMING EXPERIENCE
    // ==============================

    public String getFarmingExperience() {
        return farmingExperience;
    }

    public void setFarmingExperience(String farmingExperience) {
        this.farmingExperience = farmingExperience;
    }

    // ==============================
    // PREFERRED LANGUAGE
    // ==============================

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    // ==============================
    // FARMS
    // ==============================

    public List<Farm> getFarms() {
        return farms;
    }

    public void setFarms(List<Farm> farms) {
        this.farms = farms;
    }
}

