import { Component, inject, signal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter } from "rxjs/operators";
import { ChatsComponent } from "../chats-component/chats-component";

@Component({
    selector: "app-chats-shell-component",
    standalone: true,
    imports: [ChatsComponent, RouterOutlet],
    templateUrl: "./chats-shell-component.html",
    styleUrls: ["./chats-shell-component.css"],
})
export class ChatsShellComponent {
    private readonly router = inject(Router);
    public readonly enDetalle = signal<boolean>(false);

    constructor() {
        this.enDetalle.set(this.esDetalle(this.router.url));

        this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe((e) => {
                this.enDetalle.set(this.esDetalle(e.urlAfterRedirects));
            });
    }

    private esDetalle(url: string): boolean {
        const normalizada = (url || "").split("?")[0].split("#")[0];

        if (normalizada === "/chats") return false;
        if (normalizada === "/nuevo") return false;

        return /^\/chats\/[^/]+$/.test(normalizada);
    }
}
