package com.kartezy.searchservice.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document(indexName = "products")
@Setting(settingPath = "elasticsearch/product-settings.json")
public class ProductDocument {
    @Id private String id;
    @MultiField(mainField = @Field(type = FieldType.Text, analyzer = "standard"),
                otherFields = {
                    @InnerField(suffix = "autocomplete", type = FieldType.SearchAsYouType, analyzer = "autocomplete"),
                    @InnerField(suffix = "keyword", type = FieldType.Keyword)
                })
    private String name;
    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;
    @Field(type = FieldType.Keyword)
    private String sku;
    @Field(type = FieldType.Keyword)
    private String categoryId;
    @Field(type = FieldType.Text)
    private String categoryName;
    @Field(type = FieldType.Double)
    private Double price;
    @Field(type = FieldType.Double)
    private Double compareAtPrice;
    @Field(type = FieldType.Keyword)
    private String merchantId;
    @Field(type = FieldType.Text)
    private String merchantName;
    @Field(type = FieldType.Keyword)
    private String brandId;
    @Field(type = FieldType.Text)
    private String brandName;
    @Field(type = FieldType.Keyword)
    private String status;
    @Field(type = FieldType.Integer)
    private Integer stock;
    @Field(type = FieldType.Keyword)
    private String imageUrl;
    @Field(type = FieldType.Keyword)
    private String tags;
    @Field(type = FieldType.Double)
    private Double rating;
}
