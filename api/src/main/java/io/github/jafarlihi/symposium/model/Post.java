package io.github.jafarlihi.symposium.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long threadId;
    private Long userId;
    private Long postNumber;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
