class ApiConstants {
  static String get baseUrl => const String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.kartezy.com/api/',
  );

  // Auth endpoints
  static const String login = 'auth/login';
  static const String register = 'auth/register';
  static const String refreshToken = 'auth/refresh-token';
  static const String logout = 'auth/logout';
  static const String sendOtp = 'auth/send-otp';
  static const String verifyOtp = 'auth/verify-otp';

  // MFA endpoints
  static const String mfaEnroll = 'auth/mfa/enroll';
  static const String mfaVerify = 'auth/mfa/verify';
  static const String mfaValidate = 'auth/mfa/validate';
  static const String mfaBackupCode = 'auth/mfa/backup-code';
  static const String mfaStatus = 'auth/mfa/status';
  static const String mfaDisable = 'auth/mfa/disable';

  // Merchant endpoints
  static const String merchantRegister = 'merchant/register';
  static const String merchantProfile = 'merchant/profile';
  static const String merchantUpdateProfile = 'merchant/update-profile';
  static const String merchantBusinessSettings = 'merchant/business-settings';

  // Dashboard endpoints
  static const String dashboardStats = 'dashboard/stats';
  static const String merchantOrders = 'merchant/orders';
  static const String merchantAnalytics = 'merchant/analytics';

  // Order endpoints
  static const String orderList = 'orders';
  static const String orderDetail = 'orders/{id}';
  static const String orderUpdateStatus = 'orders/{id}/status';

  // Promotion endpoints
  static const String promotionList = 'promotions';
  static const String promotionCreate = 'promotions';
  static const String promotionDetail = 'promotions/{id}';
  static const String promotionUpdate = 'promotions/{id}';
  static const String promotionDelete = 'promotions/{id}';
  static const String promotionCoupons = 'promotions/coupons';
  static const String promotionDiscountCodes = 'promotions/discount-codes';
  static const String promotionPercentageDiscounts =
      'promotions/percentage-discounts';
  static const String promotionFlatDiscounts = 'promotions/flat-discounts';
  static const String promotionBogo = 'promotions/bogo';
  static const String promotionComboOffers = 'promotions/combo-offers';
  static const String promotionBundleOffers = 'promotions/bundle-offers';
  static const String promotionFlashSales = 'promotions/flash-sales';
  static const String promotionHappyHour = 'promotions/happy-hour';
  static const String promotionCategoryDiscounts =
      'promotions/category-discounts';
  static const String promotionProductDiscounts =
      'promotions/product-discounts';
  static const String promotionFreeDelivery = 'promotions/free-delivery';
  static const String promotionCashback = 'promotions/cashback';
  static const String promotionMembership = 'promotions/membership';
  static const String promotionReferral = 'promotions/referral';

  // Finance endpoints
  static const String financeRevenue = 'finance/revenue';
  static const String financeSalesSummary = 'finance/sales-summary';
  static const String financeSettlementHistory = 'finance/settlement-history';
  static const String financePendingSettlements = 'finance/pending-settlements';
  static const String financeWalletBalance = 'finance/wallet-balance';
  static const String financeCommissionDetails = 'finance/commission-details';
  static const String financeTransactionHistory = 'finance/transaction-history';
  static const String financeRefundHistory = 'finance/refund-history';
  static const String financeTaxSummary = 'finance/tax-summary';
  static const String financeGstReports = 'finance/gst-reports';
  static const String financeProfitLoss = 'finance/profit-loss';
  static const String financePayoutHistory = 'finance/payout-history';
  static const String financeBankTransfers = 'finance/bank-transfers';
  static const String financePaymentStatus = 'finance/payment-status';

  // Analytics endpoints
  static const String analyticsRevenue = 'analytics/revenue';
  static const String analyticsOrders = 'analytics/orders';
  static const String analyticsCustomers = 'analytics/customers';
  static const String analyticsProducts = 'analytics/products';
  static const String analyticsInventory = 'analytics/inventory';
  static const String analyticsDeliveryPerformance =
      'analytics/delivery-performance';
  static const String analyticsConversionRate = 'analytics/conversion-rate';
  static const String analyticsAverageOrderValue =
      'analytics/average-order-value';
  static const String analyticsCustomerRetention =
      'analytics/customer-retention';
  static const String analyticsRepeatCustomers = 'analytics/repeat-customers';
  static const String analyticsBestSellers = 'analytics/best-sellers';
  static const String analyticsWorstSellers = 'analytics/worst-sellers';
  static const String analyticsPeakHours = 'analytics/peak-hours';
  static const String analyticsSalesByCategory = 'analytics/sales-by-category';
  static const String analyticsSalesByBrand = 'analytics/sales-by-brand';
  static const String analyticsSalesByCity = 'analytics/sales-by-city';
  static const String analyticsSalesByStore = 'analytics/sales-by-store';

  // Reports endpoints
  static const String reportsDaily = 'reports/daily';
  static const String reportsWeekly = 'reports/weekly';
  static const String reportsMonthly = 'reports/monthly';
  static const String reportsYearly = 'reports/yearly';
  static const String reportsInventory = 'reports/inventory';
  static const String reportsProduct = 'reports/product';
  static const String reportsSales = 'reports/sales';
  static const String reportsFinancial = 'reports/financial';
  static const String reportsRefund = 'reports/refund';
  static const String reportsSettlement = 'reports/settlement';
  static const String reportsExport = 'reports/export';

  // Marketing endpoints
  static const String marketingSponsoredProducts =
      'marketing/sponsored-products';
  static const String marketingFeaturedProducts = 'marketing/featured-products';
  static const String marketingBannerCampaigns = 'marketing/banner-campaigns';
  static const String marketingSeasonalCampaigns =
      'marketing/seasonal-campaigns';
  static const String marketingFestivalCampaigns =
      'marketing/festival-campaigns';
  static const String marketingPushCampaigns = 'marketing/push-campaigns';
  static const String marketingEmailCampaigns = 'marketing/email-campaigns';
  static const String marketingSmsCampaigns = 'marketing/sms-campaigns';

  // Product endpoints
  static const String product = 'product';

  // Inventory endpoints
  static const String inventory = 'inventory';

  // Invoices endpoints
  static const String invoicesList = 'invoices';
  static const String invoicesDetail = 'invoices/{id}';
  static const String invoicesDownloadPdf = 'invoices/{id}/download-pdf';
  static const String invoicesPrint = 'invoices/{id}/print';
  static const String invoicesExport = 'invoices/export';

  // Common endpoints
  static const String user = 'user';
  static const String address = 'address';
}
