import { useEffect } from 'react';

import type { RootState } from '@/store';

import { useAppDispatch, useAppSelector } from '@/store';
import { bootstrapFetch } from '@/store/bootstrapSlice';

export function useBootstrap() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s: RootState) => s.bootstrap.data);
  const status = useAppSelector((s: RootState) => s.bootstrap.status);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(bootstrapFetch());
    }
  }, [dispatch, status]);

  return { data, status };
}