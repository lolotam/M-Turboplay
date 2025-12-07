import { useState, useCallback } from 'react';
import { checkRateLimit } from '@/utils/security';

interface UseRateLimitOptions {
  identifier: string;
  maxRequests?: number;
  windowMs?: number;
}

export const useRateLimit = ({ 
  identifier, 
  maxRequests = 100, 
  windowMs = 60000 // 1 minute
}: UseRateLimitOptions) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(maxRequests);

  const checkLimit = useCallback(() => {
    const canProceed = checkRateLimit(identifier, maxRequests, windowMs);
    setIsRateLimited(!canProceed);
    setRemainingRequests(canProceed ? maxRequests : 0);
    return canProceed;
  }, [identifier, maxRequests, windowMs]);

  const resetLimit = useCallback(() => {
    setIsRateLimited(false);
    setRemainingRequests(maxRequests);
  }, [maxRequests]);

  return {
    isRateLimited,
    remainingRequests,
    checkLimit,
    resetLimit
  };
};