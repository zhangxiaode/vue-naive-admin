import { App } from "vue";
export const elTableDrag = (app: App<Element>) => {
  app.directive("elTableDrag", (el: HTMLElement) => {
    el = el.getElementsByClassName("el-scrollbar__wrap")[0] as HTMLElement;
    el.style.cursor = "grab";
    el.onmousedown = (e: any) => {
      if (e.target.localName === "input") return;
      const gapX = e.clientX;
      const startX = el.scrollLeft;
      document.onmousemove = (e) => {
        const x = e.clientX - gapX;
        el.scrollLeft = startX - x;
        return false;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  });
};
