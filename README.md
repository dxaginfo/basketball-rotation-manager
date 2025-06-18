# Basketball Rotation Manager

An interactive web application for coaches and team managers to plan, visualize, and optimize player rotations during basketball games.

## 🏀 Overview

The Basketball Rotation Manager is a tool designed to help coaches at all levels optimize their player substitution patterns. By visualizing player minutes, fatigue levels, and performance metrics, this application provides data-driven insights to maximize team performance throughout a game.

## ✨ Features

- **Interactive Timeline Interface**: Drag-and-drop interface to plan player rotations across quarters/periods
- **Player Management**: Create and maintain roster with positions, strengths, and limitations
- **Fatigue Modeling**: Visual indicators for player fatigue based on minutes played
- **Lineup Analytics**: Evaluate lineup combinations based on complementary skills
- **Substitution Suggestions**: AI-powered recommendations for optimal substitution patterns
- **Game Templates**: Save and reuse rotation plans for different game scenarios
- **Export Functionality**: Generate printable rotation charts for game day

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dxaginfo/basketball-rotation-manager.git
cd basketball-rotation-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## 🔧 Technology Stack

- **Frontend**: React with TypeScript
- **State Management**: Redux with Redux Toolkit
- **UI Framework**: Material-UI for components
- **Visualization**: D3.js for timeline and analytics charts
- **Build Tools**: Vite for fast development and optimized production builds

## 📋 Use Cases

### For Coaches
- Plan player rotations before games
- Make data-driven substitution decisions during games
- Analyze minutes distribution post-game

### For Team Managers
- Track player usage throughout the season
- Identify patterns in team performance related to rotation strategies
- Generate reports on player utilization

### For Analysts
- Evaluate the effectiveness of different lineup combinations
- Correlate rotation patterns with game outcomes
- Develop optimal rotation strategies based on opponent matchups

## 📊 Architecture

The application follows a modular architecture:

- **Core Components**:
  - Player Management Module
  - Timeline Visualization Module
  - Analytics Dashboard Module
  - Suggestion Engine

- **Data Flow**:
  - User input → State management → Visualization rendering
  - Player data → Analysis algorithms → Substitution recommendations

## 📝 Future Enhancements

- Integration with external statistical APIs
- Mobile app version for on-bench use during games
- Advanced analytics incorporating player performance data
- Multi-team management for leagues and tournaments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- Inspired by the needs of basketball coaches at all levels
- Special thanks to the open-source community for providing the tools that make this project possible