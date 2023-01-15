import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDropzone]'
})
export class DropzoneDirective {

  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.opacity') private opacity = '1';
  @HostBinding('style.border') private border = 'none';

  @HostListener('dragover', ['$event']) public onDragOver(evt: Event): any {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '0.8';
    this.border = 'dotted 2px #FF4D2A';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: Event): any {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
    this.border = 'none';
  }

  @HostListener('drop', ['$event']) public ondrop(evt: Event): any {
    let dragEvent: DragEvent = evt as DragEvent;
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.opacity = '1';
    this.border = 'none';
    let files;

    if(dragEvent.dataTransfer){
      files = dragEvent.dataTransfer.files;
      
      if (files.length > 0) {
       this.onFileDropped.emit(files);
      }
    }

  }

}
