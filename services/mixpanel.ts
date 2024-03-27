import mixpanel from "mixpanel-browser"

export default class Mixpanel {
  private static _instance: Mixpanel

  public static getInstance(): Mixpanel {
    if ( Mixpanel._instance == null) 
      return (Mixpanel._instance = new Mixpanel())

    return this._instance
  }

  public constructor() {
    mixpanel.init('432dc6ac9f9a0f1225e9cd5b5565a874',
    {debug: true, ignore_dnt: true})
  }


  public track(name: string, data: object = {}) {
    mixpanel.track(name, data)
  }

  public identify(userId: string) {
    mixpanel.identify(userId)
  }

  public set(key: string, value: string) {
    mixpanel.people.set({ [key]: value})
  }


  public reset() {
    mixpanel.reset();
  }


}