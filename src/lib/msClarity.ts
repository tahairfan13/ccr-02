/**
 * Microsoft Clarity Event Tracking Utility
 *
 * This module provides helper functions to track custom events with Microsoft Clarity.
 * Use these methods to track user interactions and important events throughout the application.
 *
 * @see https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api
 */

declare global {
  interface Window {
    clarity?: (action: string, ...args: any[]) => void;
  }
}

/**
 * Check if Clarity is available in the browser
 */
const isClarityAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.clarity === 'function';
};

/**
 * Set a custom tag for the current session
 * Tags help segment and filter sessions in Clarity dashboard
 *
 * @param key - The tag key (e.g., 'user_type', 'plan')
 * @param value - The tag value (e.g., 'premium', 'free')
 *
 * @example
 * ```typescript
 * clarityEvent.setTag('user_type', 'premium');
 * clarityEvent.setTag('step_completed', '3');
 * ```
 */
export const setTag = (key: string, value: string | number): void => {
  if (!isClarityAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Clarity] Not available - Tag not set:', key, value);
    }
    return;
  }

  try {
    window.clarity!('set', key, value);
  } catch (error) {
    console.error('[Clarity] Error setting tag:', error);
  }
};

/**
 * Identify a user with a custom ID
 * This helps track the same user across sessions
 *
 * @param userId - Unique identifier for the user
 * @param sessionId - Optional session identifier
 * @param pageId - Optional page identifier
 *
 * @example
 * ```typescript
 * clarityEvent.identify('user_12345');
 * clarityEvent.identify('user_12345', 'session_abc', 'page_home');
 * ```
 */
export const identify = (
  userId: string,
  sessionId?: string,
  pageId?: string
): void => {
  if (!isClarityAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Clarity] Not available - User not identified:', userId);
    }
    return;
  }

  try {
    window.clarity!('identify', userId, sessionId, pageId);
  } catch (error) {
    console.error('[Clarity] Error identifying user:', error);
  }
};

/**
 * Track a custom event with optional metadata
 * Use this for tracking important user interactions
 *
 * @param eventName - Name of the event (e.g., 'step_completed', 'form_submitted')
 * @param metadata - Optional metadata object
 *
 * @example
 * ```typescript
 * clarityEvent.trackEvent('step_completed', { step: 1, name: 'Project Type' });
 * clarityEvent.trackEvent('phone_verified', { method: 'SMS' });
 * ```
 */
export const trackEvent = (eventName: string, metadata?: Record<string, any>): void => {
  if (!isClarityAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Clarity] Not available - Event not tracked:', eventName, metadata);
    }
    return;
  }

  try {
    // Set the event name as a tag
    window.clarity!('set', 'event', eventName);

    // If metadata is provided, set each property as a tag
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        window.clarity!('set', `${eventName}_${key}`, String(value));
      });
    }
  } catch (error) {
    console.error('[Clarity] Error tracking event:', error);
  }
};

/**
 * Upgrade the current session to be saved regardless of user activity
 * Useful for important sessions you want to preserve
 *
 * @param reason - Optional reason for upgrading the session
 *
 * @example
 * ```typescript
 * clarityEvent.upgrade('form_submitted');
 * clarityEvent.upgrade('error_occurred');
 * ```
 */
export const upgrade = (reason?: string): void => {
  if (!isClarityAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Clarity] Not available - Session not upgraded');
    }
    return;
  }

  try {
    window.clarity!('upgrade', reason || 'manual_upgrade');
  } catch (error) {
    console.error('[Clarity] Error upgrading session:', error);
  }
};

/**
 * Predefined event tracking methods for common use cases
 */
export const clarityEvent = {
  setTag,
  identify,
  trackEvent,
  upgrade,

  /**
   * Track when a user completes a step in the form
   */
  stepCompleted: (step: number, stepName: string): void => {
    trackEvent('step_completed', { step, stepName });
  },

  /**
   * Track when a user submits the form
   */
  formSubmitted: (formData: Record<string, any>): void => {
    trackEvent('form_submitted', formData);
    upgrade('form_submitted');
  },

  /**
   * Track when a user verifies their phone
   */
  phoneVerified: (method: string = 'SMS'): void => {
    trackEvent('phone_verified', { method });
  },

  /**
   * Track when an error occurs
   */
  error: (errorType: string, errorMessage?: string): void => {
    trackEvent('error', { type: errorType, message: errorMessage });
    upgrade('error_occurred');
  },

  /**
   * Track page views (optional, as Clarity auto-tracks this)
   */
  pageView: (pageName: string): void => {
    setTag('page', pageName);
  },
};

export default clarityEvent;
