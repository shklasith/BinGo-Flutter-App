import '../../domain/entities/daily_tip.dart';

class DailyTipDto {
  const DailyTipDto({required this.title, required this.content});

  final String title;
  final String content;

  factory DailyTipDto.fromJson(Map<String, dynamic> json) {
    return DailyTipDto(
      title: (json['title'] ?? '').toString(),
      content: (json['content'] ?? '').toString(),
    );
  }

  DailyTip toEntity() => DailyTip(title: title, content: content);
}
