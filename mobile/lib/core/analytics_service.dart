import 'package:flutter/foundation.dart';

abstract class AnalyticsService {
  void capture(String eventName, {Map<String, dynamic>? properties});
}

class LoggingAnalyticsService implements AnalyticsService {
  @override
  void capture(String eventName, {Map<String, dynamic>? properties}) {
    // In production, integrate PostHog/Firebase/Segment here.
    if (kDebugMode) {
      print('📝 [Analytics] Event: $eventName, Props: $properties');
    }
  }
}
