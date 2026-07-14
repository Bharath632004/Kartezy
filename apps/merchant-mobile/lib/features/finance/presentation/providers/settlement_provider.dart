import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/finance_service.dart';

// Settlement State
class SettlementState {
  final bool isLoading;
  final String? error;
  final List<dynamic> settlementHistory;
  final List<dynamic> pendingSettlements;
  final bool hasMoreHistory;
  final bool hasMorePending;

  SettlementState({
    required this.isLoading,
    this.error,
    required this.settlementHistory,
    required this.pendingSettlements,
    required this.hasMoreHistory,
    required this.hasMorePending,
  });

  factory SettlementState.initial() => SettlementState(
    isLoading: false,
    settlementHistory: [],
    pendingSettlements: [],
    hasMoreHistory: false,
    hasMorePending: false,
  );

  SettlementState copyWith({
    bool? isLoading,
    String? error,
    List<dynamic>? settlementHistory,
    List<dynamic>? pendingSettlements,
    bool? hasMoreHistory,
    bool? hasMorePending,
  }) {
    return SettlementState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      settlementHistory: settlementHistory ?? this.settlementHistory,
      pendingSettlements: pendingSettlements ?? this.pendingSettlementHistory,
      pendingSettlements: pendingSettlements ?? this.pendingSettlements,
      hasMoreHistory: hasMoreHistory ?? this.hasMoreHistory,
      hasMorePending: hasMorePending ?? this.hasMorePending,
    );
  }
}

// Settlement Notifier
class SettlementNotifier extends StateNotifier<SettlementState> {
  final FinanceService _financeService;
  int _historyPage = 1;
  int _pendingPage = 1;
  bool _hasMoreHistory = true;
  bool _hasMorePending = true;

  SettlementNotifier(this._financeService) : super(SettlementState.initial());

  Future<void> fetchSettlementHistory({
    String? startDate,
    String? endDate,
    bool refresh = false,
  }) async {
    if (refresh) {
      _historyPage = 1;
      _hasMoreHistory = true;
      state = state.copyWith(
        isLoading: true,
        error: null,
        settlementHistory: [],
      );
    } else if (!state.isLoading) {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final settlementHistory = await _financeService.getSettlementHistory(
        startDate: startDate,
        endDate: endDate,
        page: _historyPage,
      );

      if (refresh) {
        state = state.copyWith(
          isLoading: false,
          settlementHistory: settlementHistory,
          hasMoreHistory: settlementHistory.length >= 20, // assuming limit 20
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          settlementHistory: [...state.settlementHistory, ...settlementHistory],
          hasMoreHistory: settlementHistory.length >= 20,
        );
      }

      if (settlementHistory.isNotEmpty) {
        _historyPage++;
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> fetchPendingSettlements({bool refresh = false}) async {
    if (refresh) {
      _pendingPage = 1;
      _hasMorePending = true;
      state = state.copyWith(
        isLoading: true,
        error: null,
        pendingSettlements: [],
      );
    } else if (!state.isLoading) {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final pendingSettlements = await _financeService.getPendingSettlements(
        page: _pendingPage,
      );

      if (refresh) {
        state = state.copyWith(
          isLoading: false,
          pendingSettlements: pendingSettlements,
          hasMorePending: pendingSettlements.length >= 20, // assuming limit 20
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          pendingSettlements: [
            ...state.pendingSettlements,
            ...pendingSettlements,
          ],
          hasMorePending: pendingSettlements.length >= 20,
        );
      }

      if (pendingSettlements.isNotEmpty) {
        _pendingPage++;
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refreshAll() async {
    await fetchSettlementHistory(refresh: true);
    await fetchPendingSettlements(refresh: true);
  }
}

// Provider
final settlementProvider =
    StateNotifierProvider<SettlementNotifier, SettlementState>((ref) {
      return SettlementNotifier(ref.read(financeServiceProvider));
    });
