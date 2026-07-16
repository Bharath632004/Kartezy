package com.kartezy.catalogservice.controller;
import com.kartezy.catalogservice.dto.CategoryDto;
import com.kartezy.catalogservice.entity.Category;
import com.kartezy.catalogservice.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("/categories")
@AllArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepository;
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getList() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDto> dtos = categories.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getDetail(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto dto) {
        Category category = toEntity(dto);
        category = categoryRepository.save(category);
        return ResponseEntity.ok(toDto(category));
    }
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> update(@PathVariable Long id, @RequestBody CategoryDto dto) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dto.setId(id);
        Category category = toEntity(dto);
        category = categoryRepository.save(category);
        return ResponseEntity.ok(toDto(category));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    private CategoryDto toDto(Category entity) {
        return CategoryDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .name(entity.getName())
                .description(entity.getDescription())
                .parentId(entity.getParentId())
                .isActive(entity.isActive())
                .build();
    }
    private Category toEntity(CategoryDto dto) {
        return Category.builder()
                .id(dto.getId())
                .code(dto.getCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .parentId(dto.getParentId())
                .isActive(dto.isActive())
                .build();
    }
}