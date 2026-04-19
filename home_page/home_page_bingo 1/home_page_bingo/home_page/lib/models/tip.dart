class Tip {
  const Tip({required this.title, required this.content});

  final String title;
  final String content;

  factory Tip.fromJson(Map<String, dynamic> json) => Tip(
        title:   json['title']   as String,
        content: json['content'] as String,
      );

  Map<String, dynamic> toJson() => <String, dynamic>{
        'title':   title,
        'content': content,
      };
}
