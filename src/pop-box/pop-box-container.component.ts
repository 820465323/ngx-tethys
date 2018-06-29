import {
    Component, OnInit, ElementRef,
    HostBinding,
    Renderer2, ViewEncapsulation, HostListener
} from '@angular/core';
import { PopBoxRef } from './pop-box-ref.service';
import { PopBoxOptions } from './pop-box-options.class';

@Component({
    selector: 'pop-box-container',
    templateUrl: './pop-box-container.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PopBoxContainerComponent implements OnInit {


    @HostBinding('style.z-index') _zIndex: number | string;

    public popBoxRef: PopBoxRef;

    public showMask = false;

    constructor(
        protected elementRef: ElementRef,
        private renderer: Renderer2,
        public config: PopBoxOptions) {
        this.showMask = this.config.showMask;
    }

    ngOnInit(): void {
        this._zIndex = this.config.zIndex || '';
    }


    hide(): void {
        this.popBoxRef.hide();
    }

    clickPopBox(event:Event): void {
        if (this.config.stopPropagation) {
            event.stopPropagation();
        }
        if(this.showMask && this.config.insideAutoClose){
            this.hide();
        }
    }

    clickMask(event: Event): void {
        if (this.config.outsideAutoClose) {
            this.hide();
        } else {
            return;
            // this.closePopBox(event);
        }
    }

    @HostListener('window:keydown.esc', ['$event'])
    onEsc(event: any): void {
        if (this.config.keyboardESCClose) {
            event.preventDefault();
            this.hide();
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        if (this.config.showMask) {
            return;
        }
        
        // 是否点击了 pop box 内部区域
        const isClickPopBoxInner = this.elementRef.nativeElement.contains(event.target);
        let needClose = false;
        if (this.config.outsideAutoClose) {
            // 没有 target，说明是 直接传入的 position，点击外部元素直接关闭即可
            if (!this.config.target && !isClickPopBoxInner) {
                needClose = true;
            } else if (this.config.target && !this.config.target.contains(event.target) && !isClickPopBoxInner) {
                // 点击事件元素不是原来的触发弹出元素，并且不是 pob box 内部元素点击
                needClose = true;
            }
        }
        if (this.config.insideAutoClose && isClickPopBoxInner) {
            needClose = true;
        }

        if (needClose) {
            this.hide();
        }
    }
}
