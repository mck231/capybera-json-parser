import {JsonCanvasComponent} from "../json-canvas.component";
import {JsonItemDrawingStrategy} from "../../../shared/interfaces/jsonItemDrawingStrategy";
import {JsonMapperModel} from "../../../shared/models/JsonMapperModel";

export class KeyLinkStrategy implements JsonItemDrawingStrategy {
    execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean) {
        context.createColonSvgLink(context.arrayIndex);
    }
}
