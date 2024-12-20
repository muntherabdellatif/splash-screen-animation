import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SplashScreenServiceService } from 'src/app/services/splash-screen-service.service';

@Component({
	selector: 'app-splash-screen',
	templateUrl: './splash-screen.component.html',
	styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent {
	private subscription: Subscription = new Subscription();
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	AnimationSteps = {
		SHRINK: 0,
		SHOW_TEXT: 1,
		EXPAND: 2,
		STOP: 3,
	}

	point = {
		xStart: 0,
		xEnd: this.screenWidth,
		yStart: 0,
		yEnd: this.screenHeight,
	};

	startPoint = {
		xStart: 0,
		xEnd: this.screenWidth,
		yStart: 0,
		yEnd: this.screenHeight,
	}

	endPoint = {
		xStart: 0,
		xEnd: this.screenWidth,
		yStart: 0,
		yEnd: this.screenHeight,
	}

	isAnimating = false;
	isReversing = false;

	animationFrameId: number | null = null;
	startTime: number | null = null;
	helpMessage = 'This is a splash screen animation.';
	messageTop = this.screenHeight / 2;

	animationStepsTime = {
		[this.AnimationSteps.SHRINK]:  1000,
		[this.AnimationSteps.SHOW_TEXT]: 2000,
		[this.AnimationSteps.EXPAND]: 1000,
		[this.AnimationSteps.STOP]: 0,
	};
	animationStepIndex = this.AnimationSteps.SHRINK;
	elementsList: any = [];

	mobileScreenWidth = 768;

	constructor(private SplashScreenServiceService: SplashScreenServiceService) { }

	ngOnInit() {
		this.subscription = this.SplashScreenServiceService.elementList$.subscribe(value => {
			this.elementsList = value;

			if (this.elementsList.length > 0) {
				this.isAnimating = true;
				this.doNextAnimation();
			}
		});
	}

	easeInOut(t: number): number {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	doNextAnimation() {
		if (this.elementsList.length > 0) {
			const element = this.elementsList.shift();
			this.doAnimationForElement(element.point, element.text);
		} else {
			this.isAnimating = false;
		}
	}

	doAnimationForElement(point: any, text: string) {
		this.helpMessage = text;
		this.startPoint = {
			xStart: 0,
			xEnd: this.screenWidth,
			yStart: 0,
			yEnd: this.screenHeight,
		}
		this.endPoint = point;

		this.isAnimating = true;
		this.startTime = performance.now();
		this.animationStepIndex = this.AnimationSteps.SHRINK;
		this.animate();
	}

	animate() {
		if (!this.startTime) return;

		const elapsedTime = performance.now() - this.startTime!;
		let progress = Math.min(elapsedTime / this.animationStepsTime[this.animationStepIndex], 1);

		if ([this.AnimationSteps.SHRINK, this.AnimationSteps.EXPAND].includes(this.animationStepIndex))
			this.moveLight(progress)

		if (progress < 1)
			this.animationFrameId = requestAnimationFrame(() => this.animate());
		else
			this.goToNextStep();
	}

	moveLight(progress: number) {
		const easyProgress = this.easeInOut(this.isReversing ? 1 - progress : progress );
		this.point.xStart = this.startPoint.xStart + Math.abs(this.endPoint.xStart - this.startPoint.xStart) * easyProgress;
		this.point.xEnd = this.startPoint.xEnd - Math.abs(this.startPoint.xEnd - this.endPoint.xEnd) * easyProgress;
		this.point.yStart = this.startPoint.yStart + Math.abs(this.endPoint.yStart - this.startPoint.yStart) * easyProgress;
		this.point.yEnd = this.startPoint.yEnd - Math.abs(this.startPoint.yEnd - this.endPoint.yEnd) * easyProgress;
	}

	goToNextStep() {
		if (this.animationStepIndex == this.AnimationSteps.SHRINK) {
			this.animationStepIndex = this.AnimationSteps.SHOW_TEXT;
			this.startTime = performance.now();
			this.getTextLocation();
			this.animate();
		} else if (this.animationStepIndex == this.AnimationSteps.SHOW_TEXT) {
			this.animationStepIndex = this.AnimationSteps.EXPAND;
			this.isReversing = true;
			this.startTime = performance.now();
			this.animate();
		}
		else if (this.animationStepIndex == this.AnimationSteps.EXPAND) {
			this.animationStepIndex = this.AnimationSteps.STOP;
			this.isReversing = false;
			this.doNextAnimation();
		}
	}

	getTextLocation() {
		if(this.screenWidth < this.mobileScreenWidth) {
			if (this.endPoint.yEnd < (this.screenHeight - 100))
				this.messageTop = this.endPoint.yEnd + 100;
			else
				this.messageTop = this.endPoint.yStart - 120;

		} else {
			if (this.endPoint.yEnd < (this.screenHeight - 100))
				this.messageTop = this.endPoint.yEnd + 50;
			else
				this.messageTop = this.endPoint.yStart - 70;
		}
	}

	ngOnDestroy() {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
		}

		this.subscription.unsubscribe();
	}
}
