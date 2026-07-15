package com.kartezy.searchservice.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document(indexName = "stores")
public class StoreDocument {
    @Id private String id;
    @MultiField(mainField = @Field(type = FieldType.Text, analyzer = "standard"),
                otherFields = @InnerField(suffix = "keyword", type = FieldType.Keyword))
    private String name;
    @Field(type = FieldType.Text)
    private String description;
    @Field(type = FieldType.Keyword)
    private String merchantId;
    @Field(type = FieldType.Keyword)
    private String category;
    @Field(type = FieldType.Keyword)
    private String city;
    @Field(type = FieldType.Keyword)
    private String state;
    @Field(type = FieldType.Double)
    private Double latitude;
    @Field(type = FieldType.Double)
    private Double longitude;
    @Field(type = FieldType.Double)
    private Double rating;
    @Field(type = FieldType.Boolean)
    private Boolean isOpen;
    @Field(type = FieldType.Keyword)
    private String logoUrl;
    @Field(type = FieldType.Keyword)
    private String status;
}
