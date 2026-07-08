import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'store.freezed.dart';
part 'store.g.dart';

@freezed
@JsonSerializable()
class Store with _$Store {
  const factory Store({
    required String id,
    required String name,
    required String imageUrl,
    required double distance,
    required bool isOpen,
  }) = _Store;

  factory Store.fromJson(Map<String, dynamic> json) => _$StoreFromJson(json);
  Map<String, dynamic> toJson() => _$StoreToJson(this);
}