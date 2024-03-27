import mixpanel from "mixpanel-browser";

export default class Mixpanel {
  private static _instance: Mixpanel;

  public _isDev = process.env.NEXT_PUBLIC_ENV === "development";

  public static getInstance(): Mixpanel {
    if (Mixpanel._instance == null)
      return (Mixpanel._instance = new Mixpanel());

    return this._instance;
  }

  public constructor() {
    if (!this._isDev) {
      mixpanel.init(process.env.MIXPANEL_TOKEN as string, {
        debug: true,
        ignore_dnt: true,
      });
    }
  }

  public track(name: string, data: object = {}) {
    if (!this._isDev) {
      mixpanel.track(name, data);
    }
  }

  public identify(userId: string, email: string, name: string) {
    if (!this._isDev) {
      mixpanel.identify(userId);
      mixpanel.people.set({ $email: email });
      mixpanel.people.set({ $name: name });
    }
  }

  public reset() {
    if (!this._isDev) {
      mixpanel.reset();
    }
  }
}
