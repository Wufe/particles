import { SystemBridgeEventNotification } from "../drawing/system-bridge";
import { IParticleSystem, TSystemLinksConfiguration, ParticleSystemRequiredFeature } from "../models/particle-system";
import { IParticle } from "../models/particle";
import { RecursivePartial } from "../utils/object-utils";
import { SystemTimer, TTimerHandle } from "./timers/system-timer";
import { Unit } from "../utils/units";
import { ILibraryInterface } from "../library-interface";

export abstract class BaseParticleSystem implements IParticleSystem {
    abstract attach(): void;
    abstract getParticles(): IParticle[];
    public requirements: ParticleSystemRequiredFeature[] = [];

    protected _lastTickDelta = -1;
    protected _lastTickTime = -1;

    private _systemTimer = new SystemTimer();

    constructor(protected manager: ILibraryInterface) {}

    notifyWholeSystemChanged() {
        if (this.manager)
            this.manager.notify(SystemBridgeEventNotification.SYSTEM_UPDATED, this);
    }

    updateInternalParameters(delta: number, time: number) {
        this._lastTickDelta = delta;
        this._lastTickTime = time;
        this._systemTimer.check(time);
    }

    setTimeout(callback: () => any, timeout: number) {
        return this._systemTimer.add(callback, this._lastTickTime, this._lastTickTime + timeout, false);
    }

    setInterval(callback: () => any, timeout: number) {
        return this._systemTimer.add(callback, this._lastTickTime, this._lastTickTime + timeout, true);
    }

    clearTimeout(timerHandle: TTimerHandle) {
        return this._systemTimer.remove(timerHandle);
    }

    useLinks() {
        this.useProximityDetection();
        this.requirements.push(ParticleSystemRequiredFeature.LINKS);
    }
    
    useProximityDetection() {
        this.requirements.push(ParticleSystemRequiredFeature.PROXIMITY_DETECTION);
    }

    useTransitions() {
        this.requirements.push(ParticleSystemRequiredFeature.TRANSITIONS)
    }
}