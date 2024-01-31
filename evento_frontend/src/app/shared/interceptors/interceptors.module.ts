import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServerStateInterceptor } from "./serverSideState";
import { BrowserStateInterceptor } from "./browserSideState.interceptor";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
})
export class InterceptorModule {}
