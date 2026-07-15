package com.kartezy.searchservice.document;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document(indexName = "categories")
public class CategoryDocument {
    @Id private String id;
    @Field(type = FieldType.Keyword) private String name;
    @Field(type = FieldType.Text) private String description;
    @Field(type = FieldType.Keyword) private String parentId;
    @Field(type = FieldType.Integer) private Integer sortOrder;
    @Field(type = FieldType.Keyword) private String imageUrl;
    @Field(type = FieldType.Boolean) private Boolean isActive;
}
