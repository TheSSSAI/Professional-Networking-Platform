/**
 * @interface IConnectionsClientService
 * @description Defines the contract for the client wrapper that communicates with the external Connections microservice via gRPC.
 * This interface abstracts the underlying gRPC communication, providing a simple, Promise-based method for the application
 * to retrieve connection data. This represents an outbound port in a Ports and Adapters architecture.
 */
export interface IConnectionsClientService {
  /**
   * Retrieves the complete list of first-degree connection user IDs for a given user.
   * This method is critical for the fan-out process.
   *
   * @param userId - The unique identifier of the user whose connections are to be fetched.
   * @returns {Promise<string[]>} A promise that resolves to an array of connection user IDs.
   * @throws {ExternalServiceException} If the gRPC call fails due to network issues, timeouts, or an error from the remote service.
   */
  getConnections(userId: string): Promise<string[]>;
}

export const IConnectionsClientService = Symbol('IConnectionsClientService');