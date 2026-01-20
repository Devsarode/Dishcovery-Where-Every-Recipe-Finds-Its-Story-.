package com.example.dishcovery.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Recipe {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  @Column(length = 2000)
  private String description;

  private String filePath;
  private String thumbnailPath;
  private String type;       // video | image | text
  private String visibility; // public | private
  private Integer likes = 0;
  private Instant createdAt = Instant.now();

  @ManyToOne
  private User owner;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Comment> comments = new ArrayList<>();
}
