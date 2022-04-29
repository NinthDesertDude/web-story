/**
 * Contains text to execute if its conditions are met, with links to the parent and child nodes.
 */
export class StoryParseNode {
  /** Contains a list of conditions to be met for text to be considered. */
  public condition: string;

  /** Contains text to be processed only if the conditions are met. */
  public text: string;

  /** References the parent node, if any. */
  public parent: StoryParseNode | null;

  /** References the child nodes, if any. */
  public children: StoryParseNode[];

  constructor() {
    this.condition = "";
    this.text = "";
    this.parent = null;
    this.children = [];
  }
}
