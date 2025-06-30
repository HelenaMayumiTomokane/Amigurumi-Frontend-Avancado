import { useState } from 'react';

export default function useTriggerReload() {
  const [trigger, setTrigger] = useState(0);
  const reload = () => setTrigger(prev => prev + 1);
  return [trigger, reload];
}
