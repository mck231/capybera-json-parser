import {JsonCanvasComponent} from "../../features/json-canvas/json-canvas.component";
import {JsonMapperModel} from "../models/JsonMapperModel";

export interface JsonItemDrawingStrategy {
    execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean): void;
}
