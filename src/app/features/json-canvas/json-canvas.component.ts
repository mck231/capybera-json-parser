import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SVG, Element as SVGElement, Svg } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import {JsonMapperModel, JsonValue} from 'src/app/shared/models/JsonMapperModel';
import { ParserService } from 'src/app/shared/services/parserService/parser.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Box } from '@svgdotjs/svg.js';
import { Text } from '@svgdotjs/svg.js';
import { Rect } from '@svgdotjs/svg.js';
import { LegendDialog } from 'src/app/shared/dialogs/legend-dialog';
import { MatDialog } from '@angular/material/dialog';
import {QueueItem} from "../../shared/interfaces/queueItem";
import {Position} from "../../shared/interfaces/position";
import {TreeNode} from "../../shared/interfaces/treeNode";

@Component({
  selector: 'json-canvas',
  templateUrl: './json-canvas.component.html',
  styleUrls: ['./json-canvas.component.scss']
})
export class JsonCanvasComponent implements OnInit, OnDestroy, AfterViewInit {

  destroyed = new Subject<void>();
  public isMobile = false;
  public isShowing: boolean = false;
  public fileTitle: string = '';
  public toggleButton = true;
  public json: JsonMapperModel[] = [];
  public canvas: Svg = new Svg();
  public heightAndWidthForValueTracker: Array<{ x: number, y: number }> = [];
  /** this will mark the horizontal axis in regard to the canvas */
  public xAxis: number = 50;
  /** this will mark the vertical axis in regard to the canvas */
  public yAxis: number = 40;
  public arrayIndex = 0;
  //initialise array to track the start and end of objects
  public objectXaxisTracker: Array<{ x: number, y: number, x2: number, y2: number, startIndex: number, endIndex: number }> = new Array<{ x: number, y: number, x2: number, y2: number, startIndex: number, endIndex: number }>();
  public currentPosition: { x: number, y: number } = { x: 50, y: 40 };

  constructor(public parserService: ParserService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private cdRef: ChangeDetectorRef
    ) {
    this.json = this.parserService.jsonModel;
    this.fileTitle = this.parserService.fileTitle;
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.matches) {
           this.isMobile = true;
           this.isShowing = false;
          }
          else{this.isShowing = true;}
        }
      });
  }
  ngAfterViewInit(): void {
    this.convertJsonToSVG()
    this.cdRef.detectChanges();
  }


  ngOnInit(): void {
    this.toggleButton = false;
    this.canvas = SVG().addTo('#canvas').size('100%', '100%');
    this.toggleButton = true;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }


  public reloadCanvas() {
    this.canvas.clear();
    this.xAxis = 50;
    this.yAxis = 40;
    this.currentPosition = { x: 50, y: 40 }; // Reset the currentPosition
    this.heightAndWidthForValueTracker = [];
    this.convertJsonToSVG();
  }

  public changeCoordinates(isInArray: boolean) {
    if(isInArray) {
      this.yAxis = this.yAxis + 50;
      return;
    }
    this.xAxis = this.xAxis + 100;
  }

  public convertJsonToSVG() {
    const queue: QueueItem[] = [];
    const root = this.parserService.rootNode;

    if (!root) {
      console.error("The root node is not defined. Unable to proceed.");
      return;
    }

    const startPosition = { x: this.xAxis, y: this.yAxis };
    queue.push({ treeNode: root, position: startPosition, parentPosition: null });

    while (queue.length) {
      const item: QueueItem = queue.shift()!;
      const { treeNode, position, parentPosition } = item;

      const nextPos = this.getNextPosition(this.getNodeType(treeNode.data));

      // Draw node
      this.drawNode(treeNode.data, position);

      // If there's a parentPosition, draw an edge
      if (parentPosition) {
        //this.drawEdge(parentPosition, position);
      }

      const childrenPositioning = this.calculateChildrenPositioning(treeNode, position);

      treeNode.children.forEach((child, index) => {
        queue.push({
          treeNode: child,
          position: childrenPositioning[index],
          parentPosition: position
        });
      });
    }
  }
  private getNodeType(node: JsonMapperModel): JsonValue {
    // Logic to determine the type of the node and return it
    if (node.IsKey) return 'Key';
    if (!node.IsKey && node.Value) return 'Value';
    if (node.DataType) {
      switch (node.DataType) {
        case 'ArrayStart': return 'ArrayStart';
        case 'ArrayEnd': return 'ArrayEnd';
        case 'ObjectStart': return 'ObjectStart';
        case 'ObjectEnd': return 'ObjectEnd';
          // ... other cases
      }
    }
    throw new Error('Unknown node type');
  }
  private getNextPosition(type: JsonValue): Position {
    let offset = { x: 0, y: 0 };

    switch (type) {
      case 'Key':
        offset.x = 100;  // Adjust as needed
        break;
      case 'Value':
        offset.x = 100;  // Adjust as needed
        break;
      case 'ArrayStart':
      case 'ArrayEnd':
        offset.y = 50;   // Adjust as needed
        break;
      case 'ObjectStart':
      case 'ObjectEnd':
        offset.y = 50;   // Adjust as needed
        break;
        // ... handle other types if there are any
    }

    this.currentPosition.x += offset.x;
    this.currentPosition.y += offset.y;

    // Handle wrapping if needed
    //this.handleWrapping(); // assuming you have a handleWrapping method

    return this.currentPosition;
  }

  // Handle wrapping:
  private handleWrapping(elementHeight: number): void {
    if (this.currentPosition.x > this.CANVAS_WIDTH) {
      this.currentPosition.x = 50; // reset to some starting value
      this.currentPosition.y += elementHeight + this.PADDING; // move down by the height of the last element and some padding
    }
  }

  // Add constants for padding and canvas width
  private readonly PADDING = 10;
  private readonly CANVAS_WIDTH = 1000; // you may need to adjust this based on your actual canvas size


  // Handle Different Types of Data Differently & Adjust for Hierarchies:
  private calculateChildrenPositioning(node: TreeNode, position: Position): Position[] {
    const positions: Position[] = [];
    const indent = this.getDepth(node) * this.PADDING; // Add indentation based on depth
    if (node.data.DataType === 'ObjectStart') {
      node.children.forEach(() => this.pushObjectPosition(positions, position, indent));
    } else if (node.data.DataType === 'ArrayStart') {
      node.children.forEach(() => this.pushArrayPosition(positions, position, indent));
    }
    return positions;
  }


  private pushObjectPosition(positions: Position[], position: Position, indent: number): void {
    const xOffset = 50 + indent;  // Horizontal offset for keys and values
    positions.push({ x: position.x + xOffset, y: position.y });
  }

  private pushArrayPosition(positions: Position[], position: Position, indent: number): void {
    const yOffset = 50;  // Vertical offset, used mainly for arrays
    positions.push({ x: position.x + indent, y: position.y + yOffset });
  }

// Calculate position for a node based on its depth and position within its level
  private calculatePosition(node: TreeNode): Position {
    const depth = this.getDepth(node);
    const siblingsBefore = this.getSiblingsBefore(node);
    const x = this.xAxis + siblingsBefore * 10;  // 150 is arbitrary spacing, adjust as needed
    const y = this.yAxis + depth * 5;  // 100 is arbitrary spacing, adjust as needed
    return { x, y };
  }


  private getDepth(node: TreeNode): number {
    let depth = 0;
    while (node.parent) {
      depth++;
      node = node.parent;
    }
    return depth;
  }

  private getSiblingsBefore(node: TreeNode): number {
    if (!node.parent) return 0;  // root has no siblings before
    return node.parent.children.indexOf(node);
  }

  private drawNode(node: JsonMapperModel, position: Position): void {
    if (node.IsKey && node.Value) {
      this.addSvgKeyToCanvas(node.Value as string, position);
    } else if (!node.IsKey && node.Value) {
      this.addSvgValueToCanvas(node.Value, position);
    } else if (node.DataType) {
      switch (node.DataType) {
        case 'ArrayStart':
          //this.createSymbol('[', 'array');
          this.currentPosition.x += 50; // reset to some starting value
          this.currentPosition.y -= 50; // move down by the height of the last element and some padding
          break;
        case 'ArrayEnd':
          this.currentPosition.x -= 50; // reset to some starting value
          this.currentPosition.y += 50; // move down by the height of the last element and some padding
          //this.createSymbol(']', 'array');
          break;
        case 'ObjectStart':
          //this.createSymbol('{', 'object');
          break;

        case 'ObjectEnd':
          this.currentPosition.x -= 50; // reset to some starting value
          this.currentPosition.y += 50; // move down by the height of the last element and some padding
          //this.createSymbol('}', 'object');
          break;
        default:
          // Handle other data types...
          this.currentPosition.x -= 50; // reset to some starting value
          this.currentPosition.y += 50; // move down by the height of the last element and some padding
          break;
      }
    }
  }

  private drawEdge(parentPosition: Position, childPosition: Position): void {
    this.canvas.line(parentPosition.x, parentPosition.y, childPosition.x, childPosition.y)
        .stroke({ color: '#004442', width: 3, linecap: 'round' });
  }

  public adjustBbox(x: { x: number; y: number; x2: number; y2: number; startIndex: number; endIndex: number }, context: JsonCanvasComponent) {
    x.endIndex = context.arrayIndex;

    let val = SVG('#value' + (context.arrayIndex - 1));
    if (val) {
      let valBbox = val.bbox()
      x.x2 = valBbox.x2
      x.y2 = valBbox.y2
    }
    let numVal = SVG('#valueNumber' + (context.arrayIndex - 1));
    if (numVal) {
      let valBbox = numVal.bbox()
      x.x2 = valBbox.x2
      x.y2 = valBbox.y2
    }
    return {val, numVal};
  }

  public wrapInSVGPath(context: JsonCanvasComponent, x: { x: number; y: number; x2: number; y2: number; startIndex: number; endIndex: number }) {
    let previousObject = SVG('#path' + (context.arrayIndex - 1));
    x.x2 = previousObject.bbox().x2;
    x.y2 = previousObject.bbox().y2;

    let previousSymbol = SVG('#symbolGroup' + context.arrayIndex);
    previousSymbol.x(previousObject.bbox().x2 + 30)
  }


  // Update Position After Each Addition example:
  public addSvgKeyToCanvas(node: JsonValue, position: Position): void {
    if (node) {
      let text = this.canvas.text(node as string).id('key' + this.arrayIndex);
      this.setTextProperties(text, 'key', this.currentPosition);
      let background = SVG('#key' + this.arrayIndex);
      if (background) {
        const boxSize = background.bbox();
        this.currentPosition.x += boxSize.width + this.PADDING;
        this.handleWrapping(boxSize.height);
      }
    }
  }



  public addSvgValueToCanvas(value: JsonValue, position: Position) {
    if(value){
      let text = this.canvas.text(value as string).id('value' + this.arrayIndex)
      this.setTextProperties(text, 'value', position);
      let background = SVG('#value' + this.arrayIndex);
      const boxSize = background.bbox();
      this.handleWrapping(boxSize.height);

      // if (background) {
      //   const { squareValue, boxSize } = this.createSvgBoxAroundValue(background, this.arrayIndex, text, '#dee8f2');
      //   this.currentPosition.x += boxSize.width + 10;  // 10 for padding
      //   this.groupSvg(this.arrayIndex, squareValue, text);
      //   this.heightAndWidthForValueTracker.push({ x: boxSize.x2 + 50, y: boxSize.y });
      //   this.createSvgLineToKey(this.arrayIndex, boxSize);
      //
      // }
    }

  }

  // public addSvgValueNumberToCanvas(value: number, int: number) {
  //   let text = this.canvas.text(value.toString()).id('valueNumber' + int)
  //   this.setTextProperties(text, 'valueNumber', null);
  //   let background = SVG('#valueNumber' + int);
  //   if (background) {
  //     const { squareValue, boxSize } = this.createSvgBoxAroundValue(background, int, text, '#C1E1C1');
  //     this.groupSvg(int, squareValue, text);
  //     this.createSvgLineToKey(int, boxSize);
  //   }
  // }

  private createSvgBoxAroundValue(background: SVGElement, int: number, text: Text, color: string) {
    const boxSize = background.bbox();
    let xaxis = boxSize.width;
    let yaxis = boxSize.height * 2;
    const squareValue = this.canvas.rect(10, 10).fill(color).y(this.yAxis - 7).x(this.xAxis - 7).radius(10).stroke('#000').id('rectValue' + int);
    squareValue.height(yaxis).width(xaxis + 20);
    text.front();
    return { squareValue, boxSize };
  }

  private setTextProperties(text: Text, className: string, position: Position) {
    text.node.setAttribute('class', className);
    text.font({ fill: '#000', family: 'Inconsolata' }).y(position.y).x(position.x);
  }

  private groupSvg(int: number, squareValue: Rect, text: Text) {
    let valueGroup = this.canvas.group().id('valueGroup' + int);
    valueGroup.add(squareValue);
    valueGroup.add(text);
  }

  private createSvgLineToKey(int: number, boxSize: Box) {
    let line = SVG('#colon' + (int - 1));
    if (line) {
      line.attr('x2', boxSize.x);
    }
  }

  public createColonSvgLink(int: number) {
    let kSVG = SVG('#key' + (int - 1));
    let line = this.canvas.line(kSVG.bbox().x2, this.yAxis + 5, kSVG.bbox().x2 + 70, this.yAxis + 5).id('colon' + int);
    line.stroke({ color: '#004442', width: 3, linecap: 'round' })
    line.back();
  }

  public createPathForWrappingObject(pathData: { x: number, y: number, x2: number, y2: number}, color: string) {
    let path = this.canvas.path(
      `
      M ${pathData.x} ${pathData.y}
      H ${pathData.x2 + 50}
      V ${pathData.y2 + 50}
      H ${pathData.x}
      Z
      `
    ).fill({ color: color }).id('path' + this.arrayIndex).opacity(0.3);
    path.back();
  }

  /**
   * Creates a symbol either an array or object
   */
  public createSymbol(symbol: string, symbolType: string) {
    let text = this.canvas.text(symbol).id(symbolType + this.arrayIndex)
    text.font({ fill: '#fff', family: 'Inconsolata', size: 28 }).y(this.yAxis - 15).x(this.xAxis);
    let background = SVG('#'+ symbolType + this.arrayIndex);
    if (background) {
      const circleSymbol = this.canvas.circle(40, 40).fill('#000').cy(this.yAxis).cx(this.xAxis + 5).id('circle' + this.arrayIndex);
      let symbolGroup = this.canvas.group().id('symbolGroup' + this.arrayIndex);
      symbolGroup.add(circleSymbol);
      symbolGroup.add(text);
    }
  }

  public toggleSideNave(drawer: MatSidenav) {
    drawer.toggle();
  }

  public viewLegend() {
    const dialogRef = this.dialog.open(LegendDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      result;
    });
  }
}
