import {JsonItemDrawingStrategy} from "../../../shared/interfaces/jsonItemDrawingStrategy";
import {JsonMapperModel} from "../../../shared/models/JsonMapperModel";
import {JsonCanvasComponent} from "../json-canvas.component";

export class ObjectStartStrategy implements JsonItemDrawingStrategy {
    execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean) {
        context.xAxis += 100;
        context.createSymbol('{', context.arrayIndex, 'object');
        if (context.xAxis && context.arrayIndex) {
            let objStartAndEnd = { x: context.xAxis, y: context.yAxis, x2: 0, y2: 0, startIndex: context.arrayIndex, endIndex: 0 };
            context.objectXaxisTracker.push(objStartAndEnd);
        }
    }
}
