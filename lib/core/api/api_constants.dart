class ApiConstants {
  static const String baseUrl = 'https://api.example.com/api/v1/';

  // Endpoints
  static const String cart = 'cart';
  static const String order = 'order';
  static const String payment = 'payment';
  static const String wallet = 'wallet';
  static const String coupon = 'coupon';
  static const String address = 'address';
  static const String product = 'product';
  static const String inventory = 'inventory';
  static const String pricing = 'pricing';
  static const String user = 'user';
  
  // Delivery Service Endpoints
  static const String deliveryAvailableOrders = 'delivery/available-orders';
  static const String deliveryAcceptOrder = 'delivery/accept-order';
  static const String deliveryRejectOrder = 'delivery/reject-order';
  static const String deliveryPickupOrder = 'delivery/pickup-order';
  static const String deliveryVerifyOtp = 'delivery/verify-otp';
  static const String deliveryDeliverOrder = 'delivery/deliver-order';
  static const String deliveryProofOfDelivery = 'delivery/proof-of-delivery';
  static const String deliverySignature = 'delivery/signature';
  static const String deliveryPhoto = 'delivery/photo';
  static const String deliveryNotes = 'delivery/notes';
  static const String deliveryTimeline = 'delivery/timeline';
  static const String deliveryHistory = 'delivery/history';
  
  // Navigation Service Endpoints
  static const String navigationRoute = 'navigation/route';
  static const String navigationVoice = 'navigation/voice';
  static const String navigationEta = 'navigation/eta';
  static const String navigationDistance = 'navigation/distance';
  
  // Earnings Service Endpoints
  static const String earningsDaily = 'earnings/daily';
  static const String earningsWeekly = 'earnings/weekly';
  static const String earningsMonthly = 'earnings/monthly';
  static const String earningsWallet = 'earnings/wallet';
  static const String earningsIncentives = 'earnings/incentives';
  static const String earningsBonuses = 'earnings/bonuses';
  static const String earningsTips = 'earnings/tips';
  static const String earningsSettlements = 'earnings/settlements';
  static const String earningsTransactions = 'earnings/transactions';
  
  // Performance Service Endpoints
  static const String performanceRating = 'performance/rating';
  static const String performanceAcceptanceRate = 'performance/acceptance-rate';
  static const String performanceCancellationRate = 'performance/cancellation-rate';
  static const String performanceDeliverySuccessRate = 'performance/delivery-success-rate';
  static const String performanceLeaderboard = 'performance/leaderboard';
  static const String performanceBadges = 'performance/badges';
  static const String performanceAchievements = 'performance/achievements';
  static const String performanceReports = 'performance/reports';
  
  // Notification Service Endpoints
  static const String notificationsNewOrder = 'notifications/new-order';
  static const String notificationsPickupReminder = 'notifications/pickup-reminder';
  static const String notificationsDeliveryReminder = 'notifications/delivery-reminder';
  static const String notificationsIncentives = 'notifications/incentives';
  static const String notificationsWalletCredit = 'notifications/wallet-credit';
  static const String notificationsSupportMessages = 'notifications/support-messages';
}
