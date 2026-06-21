// 네비게이션/라우트 스텁: 검색 조건(query)을 파라미터로 주입
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true }),
  useRoute: () => ({
    params: {
      query: {
        tripType: '왕복',
        from: '인천 (ICN)',
        to: '도쿄 (NRT)',
        departDate: '2025.08.15',
        passengers: '성인 1명',
        seatClass: '이코노미',
      },
    },
  }),
}));

import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils';
import SearchResultsScreen from './SearchResultsScreen';

describe('SearchResultsScreen (통합)', () => {
  it('검색 조건 요약을 헤더에 표시한다', async () => {
    renderWithProviders(<SearchResultsScreen />);
    expect(await screen.findByText(/인천 → 도쿄 · 2025.08.15 · 성인 1명/)).toBeTruthy();
  });

  it('직항만 필터는 경유편(5→4)을 제외한다', async () => {
    renderWithProviders(<SearchResultsScreen />);
    expect(await screen.findByText('항공권 5개', {}, { timeout: 2000 })).toBeTruthy();

    fireEvent.press(screen.getByText('직항만'));

    expect(await screen.findByText('항공권 4개', {}, { timeout: 2000 })).toBeTruthy();
  });
});
