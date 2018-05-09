# Setup steps
1. `ng add @angular/elements`
The cli will install some packages and a line to your projects scripts config in `angular.json`.

```json
{
...
  "scripts": [
    {
      "input": "node_modules/document-register-element/build/document-register-element.js"
    }
  ]
}
```

2. `ng generate application my-element`

3. In your `angular.json` copy the scripts reference from step 2. into the config of your new project and remove it from your old one.

4. In your `projects/my-element` project sdd a polyfill to your `polyfills.ts`.
```
import '@webcomponents/custom-elements/custom-elements.min.js';
```

4. Change `app.component.ts` to:

```typescript
@Component({
  selector: 'ng-element',
  template: `<h1>I'm a webcomponent</h1>`,
  encapsulation: ViewEncapsulation.Native
})
export class AppComponent {

}
```

5. Change `app.module.ts` to:

```typescript
@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent],
  entryComponents: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {

  }
  ngDoBootstrap() { 
      const appElement = createCustomElement(AppComponent, {injector});
      customElements.define('app-element', appElement);
  }
}
```

7. ng build --project=my-element --prod --output-hashing=none

9. in your `index.html` replace ```html<app-root></app-root>``` with ```html<ng-element></ng-element>```

10. serve it ```ng serve --project my-element```

## Setup for IE

1. `npm i @webcomponents/custom-elements --save`

2. In the file `angular.json` the project `my-elements` replace the script by ```node_modules/@webcomponents/custom-elements/src/native-shim.js```

# Test web component standalone
1. `npm run update:element:standalone`
2. `ng serve --project elements`

# Test web component in other angular app
1. `npm run update:element`
2. `npm run start`
