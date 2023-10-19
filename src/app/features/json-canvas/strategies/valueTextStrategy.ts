import {JsonMapperModel} from "../../../shared/models/JsonMapperModel";
import {JsonItemDrawingStrategy} from "../../../shared/interfaces/jsonItemDrawingStrategy";
import {JsonCanvasComponent} from "../json-canvas.component";

export class ValueTextStrategy implements JsonItemDrawingStrategy {
    execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean) {
        context.changeCoordinates(isInArray);
        //context.addSvgValueToCanvas(item.Text!, context.arrayIndex);
    }
}
