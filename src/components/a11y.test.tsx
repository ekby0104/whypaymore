import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from './Button';
import { Toggle, Checkbox } from './Input';

describe('접근성 속성', () => {
  it('Button 은 button role 과 disabled 상태를 노출한다', () => {
    render(<Button label="저장" disabled />);
    const btn = screen.getByRole('button', { name: '저장' });
    expect(btn.props.accessibilityState.disabled).toBe(true);
  });

  it('Toggle 은 switch role 과 checked 상태를 노출한다', () => {
    const onToggle = jest.fn();
    render(<Toggle on={true} onToggle={onToggle} accessibilityLabel="푸시 알림" />);
    const sw = screen.getByRole('switch', { name: '푸시 알림' });
    expect(sw.props.accessibilityState.checked).toBe(true);

    fireEvent.press(sw);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('Checkbox 는 checkbox role 과 라벨·checked 상태를 노출한다', () => {
    render(<Checkbox checked={false} label="약관 동의" onToggle={() => {}} />);
    const cb = screen.getByRole('checkbox', { name: '약관 동의' });
    expect(cb.props.accessibilityState.checked).toBe(false);
  });

  it('radio 모드 Checkbox 는 radio role 을 노출한다', () => {
    render(<Checkbox checked label="편도" radio onToggle={() => {}} />);
    expect(screen.getByRole('radio', { name: '편도' })).toBeTruthy();
  });
});
