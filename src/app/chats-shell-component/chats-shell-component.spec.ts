import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsShellComponent } from './chats-shell-component';

describe('ChatsShellComponent', () => {
  let component: ChatsShellComponent;
  let fixture: ComponentFixture<ChatsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatsShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
