declare module "sourcebuster" {
  interface SourceData {
    typ: string;  // Type (utm, organic, referral, typein)
    src: string;  // Source
    mdm: string;  // Medium
    cmp: string;  // Campaign
    cnt: string;  // Content
    trm: string;  // Term
    fd?: string;  // First date (for first visit)
  }

  interface SourceAddData {
    ep: string;   // Entry point (landing page)
    rf: string;   // Referrer
  }

  interface SessionData {
    pgs: number;  // Pages viewed
    cpg: string;  // Current page
  }

  interface UserData {
    vst: number;  // Visit count
    uip: string;  // User IP (if tracked)
  }

  interface InitOptions {
    domain?: string;
    lifetime?: number;       // Cookie lifetime in months
    session_length?: number; // Session length in minutes
    callback?: () => void;
    referrals?: Array<{
      host: string;
      medium: string;
      display?: string;
    }>;
    organics?: Array<{
      host: string;
      param: string;
      display?: string;
    }>;
    typein_attributes?: {
      source: string;
      medium: string;
    };
    timezone_offset?: string;
  }

  interface SBJS {
    init: (options?: InitOptions) => void;
    get: {
      current: SourceData;
      first: SourceData;
      current_add: SourceAddData;
      first_add: SourceAddData;
      session: SessionData;
      udata: UserData;
    };
  }

  const sbjs: SBJS;
  export default sbjs;
}
