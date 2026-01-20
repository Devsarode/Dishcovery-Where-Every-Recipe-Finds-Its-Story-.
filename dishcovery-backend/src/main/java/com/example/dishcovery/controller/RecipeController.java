package com.example.dishcovery.controller;

import com.example.dishcovery.entity.Recipe;
import com.example.dishcovery.entity.User;
import com.example.dishcovery.repository.RecipeRepository;
import com.example.dishcovery.repository.UserRepository;
import com.example.dishcovery.dto.RecipeDtos.*;
import com.example.dishcovery.service.JwtService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeRepository recipeRepo;
    private final UserRepository userRepo;
    private final JwtService jwt;

    public RecipeController(RecipeRepository recipeRepo, UserRepository userRepo, JwtService jwt) {
        this.recipeRepo = recipeRepo; this.userRepo = userRepo; this.jwt = jwt;
    }

    // List with optional search & paging
    @GetMapping
    public List<RecipeSummary> list(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        var pageData = recipeRepo.findAll(pageable);

        var stream = pageData.stream();
        if (!q.isBlank()) {
            String qq = q.toLowerCase();
            stream = stream.filter(r ->
                    (r.getTitle()!=null && r.getTitle().toLowerCase().contains(qq)) ||
                    (r.getDescription()!=null && r.getDescription().toLowerCase().contains(qq)));
        }
        return stream.map(RecipeSummary::from).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDetail> get(@PathVariable Long id){
        return recipeRepo.findById(id)
                .map(RecipeDetail::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RecipeDetail> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateRecipe req){

        var claims = jwt.parseToken(jwt.extractBearer(authHeader));
        User owner = userRepo.findById(claims.userId()).orElseThrow();

        Recipe r = new Recipe();
        r.setTitle(req.getTitle());
        r.setDescription(req.getDescription());
        r.setFilePath(req.getFilePath());
        r.setThumbnailPath(req.getThumbnailPath());
        r.setType(req.getType());
        r.setVisibility(req.getVisibility());
        r.setLikes(0);
        r.setCreatedAt(Instant.now());
        r.setOwner(owner);

        recipeRepo.save(r);
        return ResponseEntity.ok(RecipeDetail.from(r));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeDetail> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id, @RequestBody UpdateRecipe req){

        var claims = jwt.parseToken(jwt.extractBearer(authHeader));
        Recipe r = recipeRepo.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        if (r.getOwner() != null && !r.getOwner().getId().equals(claims.userId())) {
            return ResponseEntity.status(403).build();
        }

        if (req.getTitle()!=null) r.setTitle(req.getTitle());
        if (req.getDescription()!=null) r.setDescription(req.getDescription());
        if (req.getFilePath()!=null) r.setFilePath(req.getFilePath());
        if (req.getThumbnailPath()!=null) r.setThumbnailPath(req.getThumbnailPath());
        if (req.getType()!=null) r.setType(req.getType());
        if (req.getVisibility()!=null) r.setVisibility(req.getVisibility());
        if (req.getLikes()!=null) r.setLikes(req.getLikes());

        recipeRepo.save(r);
        return ResponseEntity.ok(RecipeDetail.from(r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id){

        var claims = jwt.parseToken(jwt.extractBearer(authHeader));
        Recipe r = recipeRepo.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        if (r.getOwner() != null && !r.getOwner().getId().equals(claims.userId())) {
            return ResponseEntity.status(403).build();
        }
        recipeRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
