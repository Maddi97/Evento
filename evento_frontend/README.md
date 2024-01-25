### Refactor

- Lazy Loading -> routes load children/ seperates modules for pages that manages routing e.g. events.routing.module

- for parameters from root use withComponentInputBindin https://angular.io/guide/router

- for getting route params try const heroId = this.route.snapshot.paramMap.get('id');
  this.hero$ = this.service.getHero(heroId);

- passing observables down to components to use it in html if possible using the async pipe {{$evebts || async}}

replace div+*ngIf with ng-container + *ngIf -> ng container doesnt add to the dom

- As Pipe: common-utilities/logic/opening-times-format-helpers.ts
- global types directory

-models are interfaces not classes

# syntactical

- vents to app
- rename docker container to equal
- all threevents to evento
