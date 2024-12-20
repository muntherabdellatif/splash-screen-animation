import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenServiceService {
  private elementListSubject = new BehaviorSubject<any[]>([]);
  elementList$ = this.elementListSubject.asObservable();

  constructor() { }

  StartAnimation(elementsList: any) {
    const AnimationList: any = [];
    elementsList.forEach((element: any) => {
      AnimationList.push({
        point: this.getElementLocation(element.element),
        text: element.text,
      });
    });

    this.elementListSubject.next(AnimationList);
  }

  private getElementLocation(element: ElementRef) {
    const rect = element.nativeElement.getBoundingClientRect();

    return {
      xStart: rect.left,
      xEnd: rect.right,
      yStart: rect.top,
      yEnd: rect.bottom,
    };
  }
}
