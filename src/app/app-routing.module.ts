import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
