import { Component, EventEmitter, Inject, InjectionToken, Input, Optional, Output } from '@angular/core';

export interface ConfirmDialogOptions {
    title: string;
    message: string;
    confirmLabel: string;
    confirmButtonClass?: string;
}

export const CONFIRM_DIALOG_OPTIONS = new InjectionToken<{}>('ConfirmDialogOptions');

@Component({
    selector: 'fc-confirm-dialog',
    templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
    @Input()
    title: string;

    @Input()
    message: string;

    @Input()
    confirmLabel: string;

    @Input()
    cancelLabel: string;

    @Input()
    confirmButtonClass: string;

    @Input()
    treatMessageAsHtml = false;

    @Input()
    busy = false;

    @Output()
    cancel = new EventEmitter();

    @Output()
    confirm = new EventEmitter();

    private isOpened = true;

    get opened() {
        return this.isOpened;
    }

    set opened(value: boolean) {
        this.isOpened = value;
        if (value === false) {
            this.cancel.emit();
        }
    }

    constructor(@Optional() @Inject(CONFIRM_DIALOG_OPTIONS) private options?: ConfirmDialogOptions) {
        if (options) {
            this.title = options.title;
            this.message = options.message;
            this.confirmLabel = options.confirmLabel;
            this.confirmButtonClass = options.confirmButtonClass;
        }
    }
}
