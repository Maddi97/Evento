import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ByPassSecurityPipe } from "./BypassSecurity.pipe";

@NgModule({
  declarations: [ByPassSecurityPipe],
  imports: [CommonModule],
  exports: [ByPassSecurityPipe],
})
export class PipesModule {}
