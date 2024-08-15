import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientDialogComponent } from './item-dialog.component';

describe('IngredientDialogComponent', () => {
	let component: IngredientDialogComponent;
	let fixture: ComponentFixture<IngredientDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IngredientDialogComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IngredientDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
