import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MenuComponent } from "../menu/menu.component";
import { WarehouseComponent } from "../warehouse/warehouse.component";

interface ILink {
	path: string;
	label: string;
}

/**
 * Component that implements the main page of the website.
 */
@Component({
	selector: 'home',
	standalone: true,
	imports: [
		MatToolbarModule,
		MatTabsModule,
		RouterOutlet,
		RouterLink,
		MenuComponent,
		WarehouseComponent
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})

export class HomeComponent {
	activePath: string = "";
	constructor(router: Router) {
		if (localStorage.getItem(this.activePath) == undefined) {
			localStorage.setItem(this.activePath, "")
		} else {
			const path = localStorage.getItem(this.activePath)!
			router.navigate([path])
		}
	}
	links: ILink[] = [
		{ path: '', label: 'WAREHOUSE' },
		{ path: 'menu', label: 'MENU' },
	];

	setActiveLink(path: string) {
		localStorage.setItem(this.activePath, path)
	}

	checkIfActive(path: string) {
		return path == localStorage.getItem(this.activePath)
	}
}

