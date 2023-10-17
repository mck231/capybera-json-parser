import {JsonMapperModel} from "../../../shared/models/JsonMapperModel";
import {JsonItemDrawingStrategy} from "../../../shared/interfaces/jsonItemDrawingStrategy";
import {JsonCanvasComponent} from "../json-canvas.component";

export class ArrayStartStrategy implements JsonItemDrawingStrategy {
    execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean) {
        isInArray = true;
        if (startObjectIndent) {
            context.changeCoordinates(false);
        }
        context.createSymbol('[', context.arrayIndex, 'array');
        if (context.xAxis && context.arrayIndex) {
            let objStartAndEnd = { x: context.xAxis, y: context.yAxis, x2: 0, y2: 0, startIndex: context.arrayIndex, endIndex: 0 };
            context.objectXaxisTracker.push(objStartAndEnd);
        }
        context.xAxis += 50;
    }
}
