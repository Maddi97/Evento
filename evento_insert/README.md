### Refactoring

- https://angular.io/guide/reactive-forms#creating-nested-form-groups

-Interface for form
interface IssueForm {
title: FormControl<string>;
description: FormControl<string>;  
priority: FormControl<string>;
type: FormControl<string>;
}

-> use formbuild to create the form (see angular docu)
profileForm = this.formBuilder.group({
firstName: [''],
lastName: [''],
address: this.formBuilder.group({
street: [''],
city: [''],
state: [''],
zip: [''],
}),
});

--> then easy update the form with eventForm.patchValue({...})

then we can do : this.issueForm.getRawValue() as
Issue to get the value of the defined template

- suggestions from the server when typing in:
  ngOnInit(): void {
  this.issueForm.controls.title.valueChanges.subscribe(title => {
  this.suggestions = this.issueService.getSuggestions(title); --> load from server
  });
  }
