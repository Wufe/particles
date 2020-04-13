import { PluginAdapter } from "../plugin/plugin-adapter";
import { IRenderer } from "./renderer";
export declare class Renderer2D implements IRenderer {
    private _pluginAdapter;
    constructor(_pluginAdapter: PluginAdapter);
    register(): void;
    private _initContext;
    private _draw;
}