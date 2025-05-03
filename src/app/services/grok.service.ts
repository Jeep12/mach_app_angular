import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, of } from "rxjs"
import { catchError, map } from "rxjs/operators"
import type { Product } from "../models/product.model"

@Injectable({
  providedIn: "root",
})
export class GrokService {
  private apiUrl = "/api/grok"

  constructor(private http: HttpClient) {}

  getProductRecommendations(product: Product): Observable<Product[]> {
    // En un entorno real, esto sería una llamada a la API de Grok
    return this.http.post<any>(`${this.apiUrl}/recommendations`, { product }).pipe(
      map((response) => response.recommendations),
      catchError((error) => {
        console.error("Error getting recommendations:", error)
        return of([])
      }),
    )
  }

  searchWithNaturalLanguage(query: string): Observable<Product[]> {
    return this.http.post<any>(`${this.apiUrl}/search`, { query }).pipe(
      map((response) => response.results),
      catchError((error) => {
        console.error("Error searching with natural language:", error)
        return of([])
      }),
    )
  }

  getShoppingAssistantResponse(question: string, context?: any): Observable<string> {
    return this.http
      .post<any>(`${this.apiUrl}/assistant`, {
        question,
        context,
      })
      .pipe(
        map((response) => response.answer),
        catchError((error) => {
          console.error("Error getting assistant response:", error)
          return of("Lo siento, no puedo responder en este momento. Por favor, inténtalo de nuevo más tarde.")
        }),
      )
  }
}
