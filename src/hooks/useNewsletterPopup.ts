import { useState, useEffect } from 'react';

interface NewsletterPopupState {
  isOpen: boolean;
  hasShown: boolean;
}

export const useNewsletterPopup = () => {
  const [popupState, setPopupState] = useState<NewsletterPopupState>({
    isOpen: false,
    hasShown: false,
  });

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('newsletter_popup_shown');
    const lastShownDate = localStorage.getItem('newsletter_popup_last_shown');
    
    // Show popup if:
    // 1. User has never seen it before, OR
    // 2. It's been more than 30 days since last shown
    const shouldShowPopup = () => {
      if (!hasSeenPopup) {
        return true; // First time visitor
      }
      
      if (lastShownDate) {
        const lastShown = new Date(lastShownDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        return lastShown < thirtyDaysAgo; // Show again after 30 days
      }
      
      return false;
    };

    // Delay popup appearance by 3 seconds for better UX
    const timer = setTimeout(() => {
      if (shouldShowPopup() && !popupState.hasShown) {
        setPopupState({
          isOpen: true,
          hasShown: true,
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [popupState.hasShown]);

  const closePopup = () => {
    setPopupState(prev => ({
      ...prev,
      isOpen: false,
    }));
    
    // Mark popup as shown
    localStorage.setItem('newsletter_popup_shown', 'true');
    localStorage.setItem('newsletter_popup_last_shown', new Date().toISOString());
  };

  const openPopup = () => {
    setPopupState(prev => ({
      ...prev,
      isOpen: true,
      hasShown: true,
    }));
  };

  return {
    isOpen: popupState.isOpen,
    closePopup,
    openPopup,
  };
};
