# MoonRabbits
내일배움캠프 최종 프로젝트-MR-(게임 서버)

```
MoonRabbits
├─ .gitignore
├─ .prettierrc
├─ assets
│  └─ monster.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ src
   ├─ classes
   │  ├─ button.class.js
   │  ├─ dungeon.class.js
   │  ├─ manager
   │  │  └─ base.manager.js
   │  ├─ monster.class.js
   │  ├─ player.class.js
   │  ├─ session
   │  │  ├─ dungeonSession.class.js
   │  │  └─ userSession.class.js
   │  ├─ transformInfo.class.js
   │  └─ user.class.js
   ├─ config
   │  └─ config.js
   ├─ constants
   │  ├─ env.js
   │  └─ header.js
   ├─ db
   │  ├─ database.js
   │  ├─ migration
   │  │  └─ createSchemas.js
   │  ├─ redis
   │  ├─ sql
   │  │  └─ user_db.sql
   │  └─ user
   │     ├─ user.db.js
   │     └─ user.queries.js
   ├─ events
   │  ├─ onConnection.js
   │  ├─ onData.js
   │  ├─ onEnd.js
   │  └─ onError.js
   ├─ handlers
   │  └─ index.js
   ├─ init
   │  ├─ assets.js
   │  ├─ index.js
   │  └─ loadProtos.js
   ├─ protobuf
   │  ├─ common.proto
   │  └─ packetNames.js
   ├─ server.js
   ├─ session
   │  └─ sessions.js
   └─ utils
      ├─ dateFormatter.js
      ├─ db
      │  └─ testConnection.js
      ├─ error
      │  ├─ customError.js
      │  ├─ errorCodes.js
      │  └─ errorHandler.js
      ├─ log
      │  └─ printPacket.js
      ├─ packet
      │  ├─ makePacket.js
      │  ├─ payload.js
      │  └─ payloadData.js
      └─ transformCase.js
```