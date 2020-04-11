import { BaseParticleSystem } from "./base-particle-system";
import { IParticleSystem, IParticleSystemBuilder, TParticleSystemConfiguration, RendererHook } from "../models/particle-system";
import { IParticle, Particle, ParticleDirection } from "../models/particle";
import { Vector3D } from "../models/vector3d";
import { LiquidParticleWrapper } from "./liquid/liquid-particle-wrapper";
import { RecursivePartial, getDefault } from "../utils/object-utils";
import { TransitionEasingFunction } from "./transition/transition-specification";
import { ParticleEventType } from "../models/base-particle";
import { Vector4D } from "../models/vector4d";

export interface ILiquidParticleSystemParams {
    particles: {
        environment: {
            count: number;
        };
        background: {
            count: number;
        };
    }
}

const defaultLiquidParticleSystemParams: ILiquidParticleSystemParams = {
    particles: {
        environment: {
            count: 200
        },
        background: {
            count: 20
        }
    }
}

export class LiquidParticleSystemBuilder {

    public static build(params?: RecursivePartial<ILiquidParticleSystemParams>) {

        params = getDefault(params, defaultLiquidParticleSystemParams);

        return class extends BaseParticleSystem implements IParticleSystem {

            private _particles: LiquidParticleWrapper[] = [];

            attach() {
                const environmentalParticles = this._buildEnvironmentalParticles();
                const backgroundParticles = this._buildBackgroundParticles();

                this._particles = environmentalParticles
                    .concat(backgroundParticles);
            }

            private _setupParticlePositionTransition(particle: Particle, randomHeight: boolean) {
                const { width, height, depth } = this.manager.configuration;

                const x = Math.random() * width;
                const y = randomHeight ? (Math.random() * height) : 0;
                const z = Math.random() * depth;
                particle
                    .useTransition()
                    .from(new Vector3D({ x, z, y }))
                    .to(new Vector3D({ x, z, y: height }))
                    .in(Math.random() * 60000 + 20000)
                    .easing(TransitionEasingFunction.LINEAR)
                    .then(() => {
                        this._setupParticlePositionTransition(particle, false);
                    })
                    .commit();
            }

            private _buildEnvironmentalParticles(): LiquidParticleWrapper[] {
                return new Array(params.particles.environment.count)
                    .fill(null)
                    .map(_ => {
                        const particle = new Particle(new Vector3D({ x: 0, y: 0, z: 0 }), this.manager);
                        particle.setSize({ min: 1, max: 10 });
                        particle.color.w = Math.random() / 2 + .2;
                        this._setupParticlePositionTransition(particle, true);
                        return new LiquidParticleWrapper(particle, this.manager);
                    });
            }

            private _buildBackgroundParticles(): LiquidParticleWrapper[] {
                const { width, height, depth } = this.manager.configuration;

                return new Array(params.particles.background.count)
                    .fill(null)
                    .map(_ => {
                        const x = Math.random() * width;
                        const y = Math.random() * height;
                        const z = Math.random() * depth;
                        const particle = new Particle(new Vector3D({ x, y, z }), this.manager);
                        particle.setSize({ min: 50, max: 100 });
                        particle.color.w = Math.random() / 5 + .1;
                        particle.setVelocity(ParticleDirection.UP, {
                            randomize: true,
                            boundary: {
                                min: .1,
                                max: .9
                            }
                        });
                        return new LiquidParticleWrapper(particle, this.manager);
                    });
            }

            getParticles() {
                return this._particles.map(x => x.particle);;
            }


            private _lastTickDelta = -1;
            private _lastTickTime = -1;
            tick(delta: number, time: number) {
                this._lastTickDelta = delta;
                this._lastTickTime = time;
                this._particles
                    .forEach(x => x.particle.update(delta, time));
            }
        }
    }
}