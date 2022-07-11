import { EventEmitter } from "events";
import { IEvent } from "../types/IEvent";
import { INTERNAL_YACK_MESSAGE } from "../constants";

export class EventsService {
  public message$: EventEmitter;
  public time: any = new Date().getTime();
  static instance: EventsService

  static getInstance(): any {
    if (!this.instance) this.instance = new EventsService();

    return this.instance;
  }

  constructor() {
    this.message$ = new EventEmitter();
  }

  public send(payload: IEvent): void {
    this.message$.emit(INTERNAL_YACK_MESSAGE, payload);
  }

  public get(): EventEmitter {
    return this.message$
  }
}
