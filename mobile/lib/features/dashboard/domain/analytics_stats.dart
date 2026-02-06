class AnalyticsStats {
  final int profileViews;
  final int vcfDownloads;
  final int qrShares;

  AnalyticsStats({
    this.profileViews = 0,
    this.vcfDownloads = 0,
    this.qrShares = 0,
  });

  factory AnalyticsStats.fromJson(Map<String, dynamic> json) {
    return AnalyticsStats(
      profileViews: json['profile_viewed'] ?? 0,
      vcfDownloads: json['vcf_downloaded'] ?? 0,
      qrShares: json['qr_code_shared'] ?? 0,
    );
  }
}
