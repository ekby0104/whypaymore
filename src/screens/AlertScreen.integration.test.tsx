// 네비게이션은 스텁으로 대체 (이 화면의 네비게이션 동작은 테스트 대상이 아님)
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils';
import AlertScreen from './AlertScreen';

describe('AlertScreen (통합)', () => {
  it('시드 알림 2개를 목록으로 보여준다', async () => {
    renderWithProviders(<AlertScreen />);
    expect(await screen.findByText('인천 → 도쿄 나리타')).toBeTruthy();
    expect(screen.getByText('인천 → 오사카')).toBeTruthy();
    expect(screen.getAllByText('목표 가격')).toHaveLength(2);
  });

  it('일시중지하면 활성 태그가 줄고 재개 버튼이 나타난다', async () => {
    renderWithProviders(<AlertScreen />);
    await screen.findByText('인천 → 도쿄 나리타');
    expect(screen.getAllByText('활성 중')).toHaveLength(2);

    fireEvent.press(screen.getAllByText('일시중지')[0]);

    expect(screen.getAllByText('활성 중')).toHaveLength(1);
    expect(screen.getByText('재개')).toBeTruthy();
  });

  it('삭제를 확인하면 목록에서 제거된다', async () => {
    renderWithProviders(<AlertScreen />);
    await screen.findByText('인천 → 도쿄 나리타');
    expect(screen.getAllByText('목표 가격')).toHaveLength(2);

    fireEvent.press(screen.getAllByText('삭제')[0]); // 카드의 삭제 버튼
    await screen.findByText('알림 삭제'); // 확인 모달

    const deleteButtons = screen.getAllByText('삭제');
    fireEvent.press(deleteButtons[deleteButtons.length - 1]); // 모달의 삭제 버튼

    await waitFor(() => expect(screen.getAllByText('목표 가격')).toHaveLength(1));
  });
});
