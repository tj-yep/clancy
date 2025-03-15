# Backend Project Documentation

## Overview
This backend serves as the API for a puzzle game application. It handles puzzle data, user guesses, and traffic/visit tracking. The backend is built with Node.js, Express, and MongoDB.

## Current Architecture

### Core Technologies
- **Node.js & Express**: Server framework
- **MongoDB & Mongoose**: Database and ODM
- **CORS**: Cross-origin resource sharing support

### Existing Endpoints

#### Puzzle Endpoints (`/puzzle`)
- Manages daily puzzles and puzzle-related operations

#### Guess Endpoints (`/guess`)
- Handles user guesses for puzzles

#### Traffic Endpoints (`/traffic`)
- `/traffic/log`: Records basic user visits with timestamp and user ID

### Current Data Models

#### Visit Model
- `id`: User identifier
- `attempted`: Timestamp of the visit

#### DailyPuzzle Model
- Stores puzzle data

#### Guess Model
- Tracks user guesses

## Planned Enhancements: User Session Tracking

### New Endpoints to Implement

#### Enhanced Visit Tracking (`/traffic`)
- `POST /traffic/session/start`: Initialize a new user session
  - Records: user ID, device info, start time, IP address (anonymized)
  - Returns: session ID
  
- `PUT /traffic/session/:sessionId`: Update session data
  - Records: time spent, pages visited, interactions
  
- `POST /traffic/session/:sessionId/end`: End a user session
  - Records: end time, session duration
  
- `GET /traffic/analytics`: Get aggregated session data (admin only)
  - Filters: date range, user segments, device types

#### User Behavior Tracking (`/user`)
- `POST /user/event`: Track specific user events
  - Records: event type, timestamp, context data
  
- `GET /user/journey`: Get user journey data
  - Shows sequence of actions and time spent

### Data Model Updates

#### Enhanced Visit Model
- Add fields:
  - `sessionId`: Unique session identifier
  - `deviceInfo`: User agent, screen size, etc.
  - `ipHash`: Anonymized IP address
  - `referrer`: Where the user came from
  - `endTime`: When session ended
  - `duration`: Total session time

#### New Session Events Model
- `sessionId`: Reference to visit session
- `eventType`: Type of event (click, view, solve, etc.)
- `timestamp`: When the event occurred
- `data`: JSON object with event-specific data
- `pageUrl`: Where the event occurred

## Implementation Plan
1. Update existing Visit model with new fields
2. Create new SessionEvent model
3. Implement session start/update/end endpoints
4. Add user event tracking endpoint
5. Create analytics endpoints with proper authentication
6. Test with sample user journeys
7. Document API for frontend integration

## Security Considerations
- Anonymize IP addresses and sensitive user data
- Implement rate limiting for all endpoints
- Add authentication for analytics endpoints
- Ensure GDPR compliance with data retention policies

## Monitoring
- Add logging for all session-related operations
- Set up alerts for unusual traffic patterns
- Create dashboard for real-time session monitoring 