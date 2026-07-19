package com.kartezy.searchservice.document;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document(indexName = "brands")
public class BrandDocument {
    @Id private String id;
    @Field(type = FieldType.Keyword) private String name;
    @Field(type = FieldType.Text) private String description;
    @Field(type = FieldType.Keyword) private String logoUrl;
}
