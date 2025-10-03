erDiagram
    UserProfileCache {
        String key PK "Format: profile:{userId}"
        String_JSON_ value "TTL: 24 hours"
    }
    JwtBlocklist {
        String key PK "Format: blocklist:jwt:{jti}"
        String value "Value: 'revoked', TTL: Same as original token expiry"
    }
    ConnectionSet {
        String key PK "Format: connections:set:{userId}"
        Set value "Members are user IDs"
    }