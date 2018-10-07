import { NgModule } from '@angular/core';

import { SearchRoutingModule } from './search-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SearchComponent } from './search.component';

@NgModule({
  imports: [SharedModule, SearchRoutingModule],
  declarations: [SearchComponent],
})
export class SearchModule {}
