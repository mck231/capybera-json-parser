import {JsonMapperModel} from "../models/JsonMapperModel";

export interface TreeNode {
    data: JsonMapperModel;
    children: TreeNode[];
    parent?: TreeNode;  // Add this line

}
