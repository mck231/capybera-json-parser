import {JsonMapperModel} from "../../../shared/models/JsonMapperModel";
import {JsonItemDrawingStrategy} from "../../../shared/interfaces/jsonItemDrawingStrategy";
import {JsonCanvasComponent} from "../json-canvas.component";

export class ValueNumberStrategy implements JsonItemDrawingStrategy {
    execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean) {
        context.changeCoordinates(isInArray);
        context.addSvgValueNumberToCanvas(item.Number!, context.arrayIndex);
    }
}
