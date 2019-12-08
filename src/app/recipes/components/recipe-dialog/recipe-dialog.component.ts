import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrForm } from '@clr/angular';

import { Recipe } from '../../models/recipes.model';

@Component({
    selector: 'fc-recipe-dialog',
    templateUrl: './recipe-dialog.component.html'
})
export class RecipeDialogComponent implements OnInit {
    @ViewChild(ClrForm) clarityForm: ClrForm;

    isOpen = false;
    isNew = false;

    readonly form = new FormGroup({
        name: new FormControl(null, Validators.required),
        url: new FormControl(),
        note: new FormControl()
    });

    constructor() {}

    ngOnInit() {}

    open(recipe?: Recipe) {
        this.form.reset();
        this.isNew = !recipe;

        if (recipe) {
            this.form.patchValue(recipe);
        }

        this.isOpen = true;
    }

    onSubmit() {
        if (this.form.invalid) {
            this.clarityForm.markAsTouched();
        }
    }
}
