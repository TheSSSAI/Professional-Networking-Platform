import { Observable } from 'rxjs';

export interface IsConnectedRequest {
  userAId: string;
  userBId: string;
}

export interface IsConnectedResponse {
  areConnected: boolean;
}

/**
 * Interface defining the contract for the Connections gRPC service client.
 * This is used for authorization to enforce REQ-1-029.
 */
export interface IConnectionsClient {
  /**
   * Checks if two users have a first-degree connection.
   * @param data - The request data containing the IDs of the two users.
   * @returns An observable that emits a boolean indicating connection status.
   */
  isConnected(data: IsConnectedRequest): Observable<IsConnectedResponse>;
}