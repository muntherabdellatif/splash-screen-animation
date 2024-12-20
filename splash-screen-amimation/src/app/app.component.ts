import { Component, ElementRef, ViewChild } from '@angular/core';
import { SplashScreenServiceService } from './services/splash-screen-service.service';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	@ViewChild('search') search!: ElementRef;
	@ViewChild('LocationPin') LocationPin!: ElementRef;
	@ViewChild('AdvanceSearchBtn') AdvanceSearchBtn!: ElementRef;

	constructor(private splashScreen: SplashScreenServiceService) { }

	elementsList: any = [];

	ngAfterViewInit() {
		this.splashScreen.StartAnimation([
			{element: this.search, text: "you can search for anything here."},
			{element: this.LocationPin, text: "you can search for your nearby stores from here."},
			{element: this.AdvanceSearchBtn, text: "you can do an advanced search from here."},
		])
	}
}
