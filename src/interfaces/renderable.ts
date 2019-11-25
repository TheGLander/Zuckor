export default interface IRenderable {
  x: number;
  y: number;
  width: number;
  height: number;
  nickname: string;
  source?: string;
  renderer?: Function;
  onClick?: Function;
  onHover?: Function;
  hidden: boolean;
}
