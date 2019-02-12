import { Observable, of } from 'rxjs';

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * The following errorHandler() is shared by many ProfileService methods so it's generalized
 * to meet their different needs.
 * Instead of handling the error directly, it returns an error handler function to catchError
 * that it has configured with both the name of the operation that failed and a safe return
 * value.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
export function handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    // console.error(`${operation} failed: ${error.message}`); // log the error
    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
