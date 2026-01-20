package com.example.dishcovery.dto;

import com.example.dishcovery.entity.Recipe;

public class RecipeDtos {

    // --- Summary view for list endpoint ---
    public static class RecipeSummary {
        private Long id;
        private String title;
        private String thumbnailPath;

        public RecipeSummary(Long id, String title, String thumbnailPath) {
            this.id = id;
            this.title = title;
            this.thumbnailPath = thumbnailPath;
        }

        public static RecipeSummary from(Recipe r) {
            return new RecipeSummary(r.getId(), r.getTitle(), r.getThumbnailPath());
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getThumbnailPath() { return thumbnailPath; }
    }

    // --- Detailed view for single recipe ---
    public static class RecipeDetail {
        private Long id;
        private String title;
        private String description;
        private String filePath;
        private String thumbnailPath;
        private String type;        // video | image | text
        private String visibility;  // public | private
        private Integer likes;
        private String owner;       // username

        public static RecipeDetail from(Recipe r) {
            RecipeDetail d = new RecipeDetail();
            d.id = r.getId();
            d.title = r.getTitle();
            d.description = r.getDescription();
            d.filePath = r.getFilePath();
            d.thumbnailPath = r.getThumbnailPath();
            d.type = r.getType();
            d.visibility = r.getVisibility();
            d.likes = r.getLikes();
            d.owner = (r.getOwner() != null) ? r.getOwner().getUsername() : null;
            return d;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getFilePath() { return filePath; }
        public String getThumbnailPath() { return thumbnailPath; }
        public String getType() { return type; }
        public String getVisibility() { return visibility; }
        public Integer getLikes() { return likes; }
        public String getOwner() { return owner; }
    }

    // --- Create request ---
    public static class CreateRecipe {
        private String title;
        private String description;
        private String filePath;
        private String thumbnailPath;
        private String type;
        private String visibility;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getFilePath() { return filePath; }
        public void setFilePath(String filePath) { this.filePath = filePath; }

        public String getThumbnailPath() { return thumbnailPath; }
        public void setThumbnailPath(String thumbnailPath) { this.thumbnailPath = thumbnailPath; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
    }

    // --- Update request (inherits from Create) ---
    public static class UpdateRecipe extends CreateRecipe {
        private Integer likes;

        public Integer getLikes() { return likes; }
        public void setLikes(Integer likes) { this.likes = likes; }
    }
}
