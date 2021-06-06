import { renderHook, act } from '@testing-library/react-hooks';
import { useStateRef, getRefValue } from '../hooks';

describe('hooks utils', () => {
  describe('useStateRef()', () => {
    it('should return expected array', () => {
      const initialValue = 0;
      const hook = renderHook(() => useStateRef(initialValue));
      const [state, setState, ref] = hook.result.current;

      expect(state).toBe(initialValue);
      expect(typeof setState).toBe('function');
      expect(ref).toEqual({ current: initialValue });
    });

    it('should update state and ref', () => {
      const initialValue = 2;
      const hook = renderHook(() => useStateRef(initialValue));
      const [_state, setState] = hook.result.current;
      const newValue = 3;

      act(() => setState(newValue));

      const [state, _setState, ref] = hook.result.current;

      expect(state).toBe(newValue);
      expect(ref).toEqual({ current: newValue });
    });
  });

  describe('getRefValue()', () => {
    it('should return expected value', () => {
      const node = 'node';
      const ref = { current: node };

      expect(getRefValue(ref)).toBe(node);
    });
  });
});
