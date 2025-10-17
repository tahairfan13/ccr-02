export interface EventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}

// Helper to safely import and use ReactPixel only on client side
const getReactPixel = async () => {
  if (typeof window === 'undefined') return null;
  const module = await import('react-facebook-pixel');
  return module.default;
};

/**
 * Track standard Facebook Pixel events
 * Full list: https://developers.facebook.com/docs/meta-pixel/reference
 */
export const fbPixelEvent = {
  /**
   * Track when a user views content
   */
  viewContent: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('ViewContent', params);
  },

  /**
   * Track when a user searches
   */
  search: async (searchString?: string, params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('Search', {
      search_string: searchString,
      ...params,
    });
  },

  /**
   * Track when a user adds to cart
   */
  addToCart: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('AddToCart', params);
  },

  /**
   * Track when a user adds to wishlist
   */
  addToWishlist: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('AddToWishlist', params);
  },

  /**
   * Track when a user initiates checkout
   */
  initiateCheckout: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('InitiateCheckout', params);
  },

  /**
   * Track when a user adds payment info
   */
  addPaymentInfo: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('AddPaymentInfo', params);
  },

  /**
   * Track when a purchase is completed
   */
  purchase: async (value: number, currency: string = 'USD', params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('Purchase', {
      value,
      currency,
      ...params,
    });
  },

  /**
   * Track when a lead is generated
   */
  lead: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('Lead', params);
  },

  /**
   * Track when a user completes registration
   */
  completeRegistration: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('CompleteRegistration', params);
  },

  /**
   * Track when a user contacts you
   */
  contact: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('Contact', params);
  },

  /**
   * Track when a user customizes a product
   */
  customizeProduct: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('CustomizeProduct', params);
  },

  /**
   * Track when a user donates
   */
  donate: async (value: number, currency: string = 'USD', params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('Donate', {
      value,
      currency,
      ...params,
    });
  },

  /**
   * Track when a user finds a location
   */
  findLocation: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('FindLocation', params);
  },

  /**
   * Track when a user schedules an appointment
   */
  schedule: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('Schedule', params);
  },

  /**
   * Track when a user starts a trial
   */
  startTrial: async (value: number, currency: string = 'USD', params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('StartTrial', {
      value,
      currency,
      predicted_ltv: value,
      ...params,
    });
  },

  /**
   * Track when a user submits an application
   */
  submitApplication: async (params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('SubmitApplication', params);
  },

  /**
   * Track when a user subscribes
   */
  subscribe: async (value: number, currency: string = 'USD', params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.track('Subscribe', {
      value,
      currency,
      predicted_ltv: value,
      ...params,
    });
  },

  /**
   * Track custom events (for non-standard events)
   */
  custom: async (eventName: string, params?: EventParams) => {
    const ReactPixel = await getReactPixel();
    ReactPixel?.trackCustom(eventName, params);
  },
};
