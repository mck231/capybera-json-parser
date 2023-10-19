import {TreeNode} from "./treeNode";
import {Position} from "./position";

export interface QueueItem {
    treeNode: TreeNode;
    position: Position;
    parentPosition: Position | null;
}
