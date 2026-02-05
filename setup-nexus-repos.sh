#!/bin/bash
# Script para criar os repositórios no Nexus se não existirem

NEXUS_URL="${NEXUS_URL:?Set NEXUS_URL environment variable (e.g. http://host:30081)}"
NEXUS_USER="${NEXUS_USERNAME:-admin}"
NEXUS_PASS="${NEXUS_PASSWORD:?Set NEXUS_PASSWORD environment variable}"

echo "=== Configurando repositórios Maven no Nexus ==="

# Criar repositório maven-releases (hosted)
curl -u "$NEXUS_USER:$NEXUS_PASS" -X POST "$NEXUS_URL/service/rest/v1/repositories/maven/hosted" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "maven-releases",
    "online": true,
    "storage": {
      "blobStoreName": "default",
      "strictContentTypeValidation": true,
      "writePolicy": "ALLOW_ONCE"
    },
    "maven": {
      "versionPolicy": "RELEASE",
      "layoutPolicy": "STRICT"
    }
  }' 2>/dev/null && echo "maven-releases criado" || echo "maven-releases já existe ou erro"

# Criar repositório maven-snapshots (hosted)
curl -u "$NEXUS_USER:$NEXUS_PASS" -X POST "$NEXUS_URL/service/rest/v1/repositories/maven/hosted" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "maven-snapshots",
    "online": true,
    "storage": {
      "blobStoreName": "default",
      "strictContentTypeValidation": true,
      "writePolicy": "ALLOW"
    },
    "maven": {
      "versionPolicy": "SNAPSHOT",
      "layoutPolicy": "STRICT"
    }
  }' 2>/dev/null && echo "maven-snapshots criado" || echo "maven-snapshots já existe ou erro"

# Criar repositório maven-central (proxy)
curl -u "$NEXUS_USER:$NEXUS_PASS" -X POST "$NEXUS_URL/service/rest/v1/repositories/maven/proxy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "maven-central",
    "online": true,
    "storage": {
      "blobStoreName": "default",
      "strictContentTypeValidation": true
    },
    "proxy": {
      "remoteUrl": "https://repo1.maven.org/maven2/",
      "contentMaxAge": 1440,
      "metadataMaxAge": 1440
    },
    "negativeCache": {
      "enabled": true,
      "timeToLive": 1440
    },
    "httpClient": {
      "blocked": false,
      "autoBlock": true
    },
    "maven": {
      "versionPolicy": "RELEASE",
      "layoutPolicy": "PERMISSIVE"
    }
  }' 2>/dev/null && echo "maven-central criado" || echo "maven-central já existe ou erro"

# Criar repositório maven-public (group)
curl -u "$NEXUS_USER:$NEXUS_PASS" -X POST "$NEXUS_URL/service/rest/v1/repositories/maven/group" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "maven-public",
    "online": true,
    "storage": {
      "blobStoreName": "default",
      "strictContentTypeValidation": true
    },
    "group": {
      "memberNames": ["maven-releases", "maven-snapshots", "maven-central"]
    }
  }' 2>/dev/null && echo "maven-public criado" || echo "maven-public já existe ou erro"

echo ""
echo "=== Configurando repositórios NPM no Nexus ==="

# Criar repositório npm-hosted
curl -u "$NEXUS_USER:$NEXUS_PASS" -X POST "$NEXUS_URL/service/rest/v1/repositories/npm/hosted" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "npm-hosted",
    "online": true,
    "storage": {
      "blobStoreName": "default",
      "strictContentTypeValidation": true,
      "writePolicy": "ALLOW"
    }
  }' 2>/dev/null && echo "npm-hosted criado" || echo "npm-hosted já existe ou erro"

# Criar repositório npm-proxy (proxy para npmjs.org)
curl -u "$NEXUS_USER:$NEXUS_PASS" -X POST "$NEXUS_URL/service/rest/v1/repositories/npm/proxy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "npm-proxy",
    "online": true,
    "storage": {
      "blobStoreName": "default",
      "strictContentTypeValidation": true
    },
    "proxy": {
      "remoteUrl": "https://registry.npmjs.org/",
      "contentMaxAge": 1440,
      "metadataMaxAge": 1440
    },
    "negativeCache": {
      "enabled": true,
      "timeToLive": 1440
    },
    "httpClient": {
      "blocked": false,
      "autoBlock": true
    }
  }' 2>/dev/null && echo "npm-proxy criado" || echo "npm-proxy já existe ou erro"

# Criar repositório npm-group
curl -u "$NEXUS_USER:$NEXUS_PASS" -X POST "$NEXUS_URL/service/rest/v1/repositories/npm/group" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "npm-group",
    "online": true,
    "storage": {
      "blobStoreName": "default",
      "strictContentTypeValidation": true
    },
    "group": {
      "memberNames": ["npm-hosted", "npm-proxy"]
    }
  }' 2>/dev/null && echo "npm-group criado" || echo "npm-group já existe ou erro"

echo ""
echo "=== Repositórios configurados! ==="
echo ""
echo "Maven:"
echo "  - maven-public (group):   $NEXUS_URL/repository/maven-public/"
echo "  - maven-releases (hosted): $NEXUS_URL/repository/maven-releases/"
echo "  - maven-snapshots (hosted): $NEXUS_URL/repository/maven-snapshots/"
echo "  - maven-central (proxy):  $NEXUS_URL/repository/maven-central/"
echo ""
echo "NPM:"
echo "  - npm-group (group):  $NEXUS_URL/repository/npm-group/"
echo "  - npm-hosted (hosted): $NEXUS_URL/repository/npm-hosted/"
echo "  - npm-proxy (proxy):  $NEXUS_URL/repository/npm-proxy/"
