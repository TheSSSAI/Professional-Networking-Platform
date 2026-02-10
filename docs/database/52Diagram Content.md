erDiagram
    UserNode {
        Guid nodeId PK "Corresponds to User.userId"
        String label "Value: 'User'"
    }

    ConnectedToEdge {
        Guid sourceNode PK, FK
        Guid targetNode PK, FK
        String label "Value: 'CONNECTED_TO'"
        DateTime connectedAt
    }

    UserNode ||--o{ ConnectedToEdge : "is source of"
    UserNode ||--o{ ConnectedToEdge : "is target of"