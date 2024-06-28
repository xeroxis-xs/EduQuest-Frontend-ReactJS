import * as React from 'react';
import { logger } from '@/lib/default-logger';

export interface Selection<T = string> {
  deselectAll: () => void;
  deselectOne: (key: T) => void;
  selectAll: () => void;
  selectOne: (key: T) => void;
  selected: Set<T>;
  selectedAny: boolean;
  selectedAll: boolean;
}

// IMPORTANT: To prevent infinite loop, `keys` argument must be memoized with React.useMemo hook.
export function useSelection<T = string>(keys: T[] = []): Selection<T> {
  const [selected, setSelected] = React.useState<Set<T>>(new Set());

  React.useEffect(() => {
    setSelected(new Set());
  }, [keys]);

  const handleDeselectAll = React.useCallback(() => {
    setSelected(new Set());
    logger.debug('de-selected all');
  }, []);

  const handleDeselectOne = React.useCallback((key: T) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      logger.debug('de-selected', copy);
      copy.delete(key);
      return copy;
    });
  }, []);

  const handleSelectAll = React.useCallback(() => {
    setSelected(new Set(keys));
    logger.debug('selected', keys);
  }, [keys]);

  const handleSelectOne = React.useCallback((key: T) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.add(key);
      logger.debug('selected', copy);
      return copy;
    });
  }, []);

  const selectedAny = selected.size > 0;
  const selectedAll = selected.size === keys.length;

  return {
    deselectAll: handleDeselectAll,
    deselectOne: handleDeselectOne,
    selectAll: handleSelectAll,
    selectOne: handleSelectOne,
    selected,
    selectedAny,
    selectedAll,
  };
}
