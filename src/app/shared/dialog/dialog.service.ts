import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector } from '@angular/core';
import { from, merge, Observable, ObservableInput, of } from 'rxjs';
import { catchError, finalize, mapTo, mergeAll, switchMap, take, tap } from 'rxjs/operators';

import {
    CONFIRM_DIALOG_OPTIONS,
    ConfirmDialogComponent,
    ConfirmDialogOptions,
} from './confirm-dialog/confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private document: Document;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        @Inject(DOCUMENT) document: any
    ) {
        this.document = document as Document;
    }

    confirm(
        title: string,
        message: string,
        confirmHandler: () => ObservableInput<any>,
        confirmLabel?: string,
        confirmButtonClass?: string
    ) {
        const portalHost = this.createPortalHost();
        const confirmDialogOptions: ConfirmDialogOptions = {
            title,
            message,
            confirmLabel: confirmLabel || 'Ja',
            confirmButtonClass
        };

        const injector = this.createConfirmDialogInjector(confirmDialogOptions);
        const portal = new ComponentPortal(ConfirmDialogComponent, null, injector);

        return new Observable<boolean>(observer => {
            const dialogRef = portalHost.attach(portal);
            return merge([
                dialogRef.instance.cancel.pipe(mapTo(false)),
                dialogRef.instance.confirm.pipe(
                    switchMap((_: boolean) => {
                        dialogRef.instance.busy = true;
                        return from(confirmHandler()).pipe(
                            catchError(__ => of(false)),
                            finalize(() => (dialogRef.instance.busy = false))
                        );
                    })
                )
            ])
                .pipe(
                    mergeAll(),
                    take(1),
                    tap(confirmed => {
                        portalHost.detach();
                        observer.next(confirmed === undefined ? true : !!confirmed);
                        observer.complete();
                    })
                )
                .subscribe(observer);
        });
    }

    private createConfirmDialogInjector(data): Injector {
        return Injector.create({
            name: 'ConfirmDialogInjector',
            providers: [{ provide: CONFIRM_DIALOG_OPTIONS, useValue: data }],
            parent: this.injector,
        });
    }

    private createPortalHost(): DomPortalOutlet {
        return new DomPortalOutlet(this.document.body, this.componentFactoryResolver, this.appRef, this.injector);
    }
}
