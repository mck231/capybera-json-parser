import {JsonItemDrawingStrategy} from "../../../shared/interfaces/jsonItemDrawingStrategy";
import {JsonMapperModel} from "../../../shared/models/JsonMapperModel";
import {JsonCanvasComponent} from "../json-canvas.component";
import {SVG} from "@svgdotjs/svg.js";

export class ObjectEndStrategy implements JsonItemDrawingStrategy {
    execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean) {
        let x = context.objectXaxisTracker.pop();
        context.xAxis = context.heightAndWidthForValueTracker[0].x;
        context.createSymbol('}', context.arrayIndex, 'object');
        if (x) {
            // move down complimentary symbol group
            let complimentarySymbolGroup = SVG('#symbolGroup' + x.startIndex);
            complimentarySymbolGroup.y(context.yAxis - 15)

            let {val, numVal} = context.adjustBbox(x, context);

            if(!val) {
                // found path for wrapping object
                context.wrapInSVGPath(context, x);
            }
            context.arrayIndex++;
            context.createPathForWrappingObject(x, '#D2B48C');
            //#FB94B5
        }
    }


}
