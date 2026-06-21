import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  it('라벨을 렌더링한다', () => {
    render(<Button label="알림 저장" />);
    expect(screen.getByText('알림 저장')).toBeTruthy();
  });

  it('누르면 onPress 가 호출된다', () => {
    const onPress = jest.fn();
    render(<Button label="저장" onPress={onPress} />);
    fireEvent.press(screen.getByText('저장'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disabled 일 때는 onPress 가 호출되지 않는다', () => {
    const onPress = jest.fn();
    render(<Button label="저장" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('저장'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
