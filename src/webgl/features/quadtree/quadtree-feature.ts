import { IFeature, TFeatureBuilder } from "../feature";
import { ILibraryInterface } from "../../../main";
import { RecursivePartial, getDefault } from "../../../utils/object-utils";
import { IProgramBuilder } from "../../programs/webgl-program";
import { QuadTreeProgram } from "./webgl-quadtree-program";
import { QuadTreeProximityDetectionSystem } from "../../../models/proximity-detection/quad-tree/quad-tree-proximity-detection-system";
import { ViewBox } from "../../camera/view-box";
import { IWebGLLibraryInterface } from "../../../rendering/renderer-webgl";

export type TQuadTreeFeatureParams = {
    color: number[];
}

export class QuadTreeFeatureBuilder {
    static build = (partialParams?: RecursivePartial<TQuadTreeFeatureParams>): TFeatureBuilder => ({
        build: (manager: ILibraryInterface) => new QuadTreeFeature(manager, partialParams)
    })
}

class QuadTreeFeature implements IFeature {

    private _params: TQuadTreeFeatureParams;
    private _program: QuadTreeProgram

    constructor(private _manager: ILibraryInterface, partialParams?: RecursivePartial<TQuadTreeFeatureParams>) {
        this._params = getDefault(partialParams, {
            color: [255, 229, 104, .21]
        });
    }
    
    isAvailable() {
        return this._manager.params.proximityDetectionSystem === QuadTreeProximityDetectionSystem;
    }
    
    buildProgram(gl: WebGLRenderingContext, viewBox: ViewBox, libraryInterface: IWebGLLibraryInterface, ...args: any[]) {
        this._program = new QuadTreeProgram(gl, viewBox, libraryInterface, this._params);
        return this;
    }

    getProgram() {
        return this._program;
    }
}