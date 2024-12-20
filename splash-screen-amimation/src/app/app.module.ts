import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { environment } from 'src/environments/environment';

@NgModule({
	declarations: [
		AppComponent,
		SplashScreenComponent
	],
	imports: [
		BrowserModule,
		provideFirebaseApp(() => {
			const app = initializeApp(environment.firebase);
			const analytics = getAnalytics(app);
			console.log('Firebase Initialized', analytics);
			return app;
		}),
	],
	providers: [
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
