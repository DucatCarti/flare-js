export interface VNode {
  tag: string;
  props: Record<string, unknown>;
  children: VNode | VNode[] | string | null;
  $el: HTMLElement | null;
}
