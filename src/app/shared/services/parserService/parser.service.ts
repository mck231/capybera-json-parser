import { Injectable } from '@angular/core';
import { JsonMapperModel } from '../../models/JsonMapperModel';
import {TreeNode} from "../../interfaces/treeNode";

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  public jsonModel: Array<JsonMapperModel> = [];
  public fileContent: string = '';
  public fileTitle = '';
  public rootNode: TreeNode | null = null;

  constructor() { }

  public clearContent() {
    this.jsonModel = [];
    this.fileContent = '';
  }

  public parseJson(): void {
    try {
      let readyFormat = JSON.parse(this.fileContent);
      this.rootNode = this.startJsonParse(readyFormat); // Store the root node here
      console.warn(readyFormat);
      this.jsonModel = this.translateTreeToModel(this.rootNode);
      console.table(this.jsonModel);
    } catch (error) {
      console.log(error);
    }
  }
  private startJsonParse(data: any): TreeNode {
    let rootNode: TreeNode = { data: { IsKey: false, DataType: 'Value' }, children: [] };

    if (Array.isArray(data)) {
      this.processArrayData(data, rootNode);
    } else {
      this.processObjectData(data, rootNode);
    }

    return rootNode;
  }

  private processArrayData(data: any[], rootNode: TreeNode): void {
    rootNode.data.DataType = 'ArrayStart';
    rootNode.children.push(this.parseNode(data));
    rootNode.children.push({ data: { DataType: 'ArrayEnd' }, children: [] });
  }

  private processObjectData(data: Object, rootNode: TreeNode): void {
    rootNode.data.DataType = 'ObjectStart';

    for (let type in data) {
      this.addKeyToRoot(type, rootNode);
      this.addValueToRoot((data as any)[type], rootNode);
    }

    rootNode.children.push({ data: { DataType: 'ObjectEnd' }, children: [] });
  }

  private addKeyToRoot(type: string, rootNode: TreeNode): void {
    let keyNode: TreeNode = {
      data: {
        IsKey: true,
        DataType: 'Value',
        Value: type
      },
      children: []
    };
    rootNode.children.push(keyNode);
  }

  private addValueToRoot(value: any, rootNode: TreeNode): void {
    let valueNode: TreeNode = this.parseNode(value);
    rootNode.children.push(valueNode);
  }


  private parseNode(data: any): TreeNode {
    let node: TreeNode = { data: { IsKey: false }, children: [] };

    if (Array.isArray(data)) {
      node.data.DataType = 'ArrayStart';
      for (let item of data) {
        node.children.push(this.parseNode(item));
      }
      node.children.push({ data: { DataType: 'ArrayEnd' }, children: [] });
    } else if (typeof data === 'object' && data !== null) {
      node.data.DataType = 'ObjectStart';
      for (let key in data) {
        // Create a child node for the key
        let keyNode: TreeNode = {
          data: {
            IsKey: true,
            DataType: 'Value',
            Value: key
          },
          children: []
        };
        node.children.push(keyNode);

        // Create a child node for the value associated with the key
        let valueNode = this.parseNode(data[key]);
        node.children.push(valueNode);
      }
      node.children.push({ data: { DataType: 'ObjectEnd' }, children: [] });
    } else {
      this.determineValueType(data, node.data);
    }

    return node;
  }


  private determineValueType(value: any, valueItem: JsonMapperModel): void {
    if (typeof value === 'boolean') {
      valueItem.Value = value;
    } else if (typeof value === 'string') {
      valueItem.Value = value;
    } else if (typeof value === 'number') {
      valueItem.Value = value;
    } else if (value === null) {
      valueItem.Value = null;
    }
  }


  private translateTreeToModel(treeNode: TreeNode): JsonMapperModel[] {
    switch (treeNode.data.DataType) {
      case 'ArrayStart':
        return this.processArray(treeNode);
      case 'ObjectStart':
        return this.processObject(treeNode);
      default:
        return [treeNode.data];
    }
  }

  private processArray(treeNode: TreeNode): JsonMapperModel[] {
    const arrayContent = treeNode.children.flatMap(child => this.translateTreeToModel(child));
    return [{ DataType: 'ArrayStart' }, ...arrayContent, { DataType: 'ArrayEnd' }];
  }

  private processObject(treeNode: TreeNode): JsonMapperModel[] {
    const objectContent: JsonMapperModel[] = [];

    let isNextChildValue = false;
    treeNode.children.forEach((child, index) => {
      if (child.data.IsKey) {
        objectContent.push({ Value: child.data.Value, IsKey: true, DataType: 'Value' });
        isNextChildValue = true;
      } else if (isNextChildValue) {
        objectContent.push(...this.translateTreeToModel(child));
        isNextChildValue = false;
      }
    });

    return [{ DataType: 'ObjectStart' }, ...objectContent, { DataType: 'ObjectEnd' }];
  }


  public bfsTraversal(root: TreeNode, callback: (node: TreeNode) => void): void {
    let queue: TreeNode[] = [root];

    while (queue.length > 0) {
      let currentNode = queue.shift()!;

      callback(currentNode);

      for (let child of currentNode.children) {
        queue.push(child);
      }
    }
  }

  public dfsTraversal(node: TreeNode, callback: (node: TreeNode) => void): void {
    callback(node);

    for (let child of node.children) {
      this.dfsTraversal(child, callback);
    }
  }
}
