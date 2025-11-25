import { useEffect, useRef } from 'react';

type KeyboardEventType = 'keydown' | 'keyup' | 'keypress';

export function useKeyboardEvent(
  eventType: KeyboardEventType = 'keydown',
  key: string,
  callback: (event: KeyboardEvent) => void
) {
  const eventTypeRef = useRef(eventType);
  const keyRef = useRef(key);
  const callbackRef = useRef(callback);

  useEffect(() => {
    const event = eventTypeRef.current;
    const onEvent = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key === keyRef.current) {
        callbackRef.current(e);
      }
    };

    document.addEventListener(event, onEvent);
    return () => {
      document.removeEventListener(event, onEvent);
    };
  }, []);
}
