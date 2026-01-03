import { Pipe, PipeTransform } from "@angular/core";

type FormatoFecha = "corto" | "hora" | "completo";

@Pipe({
    name: "fecha",
    standalone: true,
})
export class FechaPipe implements PipeTransform {
    transform(valor: string | Date | null | undefined, formato: FormatoFecha = "corto"): string {
        if (!valor) return "";

        const fecha = valor instanceof Date ? valor : new Date(valor);
        if (Number.isNaN(fecha.getTime())) return "";

        const idioma = undefined;

        if (formato === "hora") {
            return fecha.toLocaleTimeString(idioma, {
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        if (formato === "completo") {
            return fecha.toLocaleString(idioma, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        return fecha.toLocaleDateString(idioma, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }
}
