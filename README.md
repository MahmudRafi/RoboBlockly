# RoboBlockly

Web-based Blockly robotics education platform for ESP8266 robots. Students program robots through a visual block interface — no Arduino IDE, C++, or code uploading required.

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
cd RoboBlockly
npm install
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

### Student Workflow

1. Turn on robot
2. Connect to robot WiFi (`RoboBootcamp-01`, password: `robotics123`)
3. Open http://localhost:5173 (or deployed site)
4. Click **Connect** (robot IP: `192.168.4.1`)
5. Create Blockly program on **Program** page
6. Click **Run Program**

## Project Structure

```
RoboBlockly/
├── client/                 # React + Vite + Blockly frontend
│   ├── src/
│   │   ├── blockly/        # Block definitions, generator, execution engine
│   │   ├── components/     # UI components
│   │   ├── pages/          # 8 application pages
│   │   ├── services/       # Axios API clients
│   │   ├── stores/         # Zustand state management
│   │   └── types/          # TypeScript types
│   └── public/
├── server/                 # Express + SQLite backend
│   └── src/
│       ├── db/             # SQLite database layer
│       └── routes/         # REST API routes
├── firmware/               # ESP8266 Arduino firmware
│   └── RoboBlockly/
│       └── RoboBlockly.ino
└── docs/
    └── WIRING.md           # Complete wiring documentation
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Overview and getting started |
| Connect | `/connect` | Robot WiFi connection |
| Program | `/program` | Blockly programming workspace |
| Live Control | `/control` | Manual drive + keyboard (WASD) |
| Sensors | `/sensors` | Real-time sensor dashboard |
| Teacher | `/teacher` | Classroom management |
| Projects | `/projects` | Save/load/export projects |
| Settings | `/settings` | Platform configuration |

## Bootcamp Projects

Three pre-seeded Blockly templates:

1. **Basic Robot Car** — forward, wait, turn, stop
2. **Obstacle Avoidance** — forever loop with if/else on obstacle sensor
3. **Line Following** — forever loop with line sensor logic
4. **Light Blink** — blink RGB LED with configurable count and duration

## Robot API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | Connection status, battery, speed, program state |
| GET | `/api/sensors` | Obstacle and line sensor readings |
| GET | `/api/battery` | Voltage and percentage |
| POST | `/api/forward` | Move forward |
| POST | `/api/backward` | Move backward |
| POST | `/api/left` | Turn left |
| POST | `/api/right` | Turn right |
| POST | `/api/stop` | Stop motors (supports `{ emergency: true }`) |
| POST | `/api/speed` | Set speed `{ speed: 200 }` |
| POST | `/api/light/on` | Turn RGB light on |
| POST | `/api/light/off` | Turn RGB light off |
| POST | `/api/light/blink` | Blink `{ times: 5, duration: 500 }` |
| POST | `/api/program` | Run/stop Blockly program `{ commands: [...] }` |

## Firmware Upload

1. Install [Arduino IDE](https://www.arduino.cc/en/software) with ESP8266 board support
2. Install libraries: **ArduinoJson** (v6+)
3. Open `firmware/RoboBlockly/RoboBlockly.ino`
4. Set `#define ROBOT_NAME "RoboBootcamp-01"` for each robot
5. Select board: **NodeMCU 1.0 (ESP-12E Module)**
6. Upload via USB

See [docs/WIRING.md](docs/WIRING.md) for complete wiring diagrams.

## Production Build

```bash
npm run build
npm start
```

Serves the built frontend from the Express server on port 3001.

## License

MIT
