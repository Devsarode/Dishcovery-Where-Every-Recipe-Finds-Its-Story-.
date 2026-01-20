package com.example.dishcovery.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Comment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String author;

  @Column(length = 1000)
  private String text;
}
