// import {JsonCanvasComponent} from "../json-canvas.component";
// import {JsonItemDrawingStrategy} from "../../../shared/interfaces/jsonItemDrawingStrategy";
// import {JsonMapperModel} from "../../../shared/models/JsonMapperModel";
// import {SVG} from "@svgdotjs/svg.js";
//
// export class ArrayEndStrategy implements JsonItemDrawingStrategy {
//     execute(item: JsonMapperModel, context: JsonCanvasComponent, isInArray: boolean, startObjectIndent: boolean) {
//         isInArray = false;
//         let x = context.objectXaxisTracker.pop();
//         context.yAxis += 50;
//         context.xAxis -= 50;
//         context.createSymbol(']', context.arrayIndex, 'array');
//         if (x) {
//             // move down complimentary symbol group
//             let complimentarySymbolGroup = SVG('#symbolGroup' + x.startIndex);
//
//             complimentarySymbolGroup.x(context.xAxis)
//
//             let {val, numVal} = context.adjustBbox(x, context);
//             if(!val && !numVal) {
//                 // found path for wrapping object
//                 context.wrapInSVGPath(context, x);
//
//             }
//             context.arrayIndex++;
//             context.createPathForWrappingObject(x, '#FB94B5');
//             //#FB94B5
//         }
//     }
//
//
// }
