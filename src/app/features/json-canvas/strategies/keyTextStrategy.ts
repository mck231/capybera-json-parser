import {JsonCanvasComponent} from "../json-canvas.component";
import {JsonMapperModel} from "../../../shared/models/JsonMapperModel";
import {JsonItemDrawingStrategy} from "../../../shared/interfaces/jsonItemDrawingStrategy";

export class KeyTextStrategy implements JsonItemDrawingStrategy {
    execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean) {
        if (startObjectIndent) {
            context.yAxis += 50;
            context.xAxis += 50;
            context.addSvgKeyToCanvas(item.Text!, context.arrayIndex);
        }
        context.addSvgKeyToCanvas(item.Text!, context.arrayIndex);
    }
}
