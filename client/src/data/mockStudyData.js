export const defaultMockStudyData = {
  'JWT Authentication': {
    roadmap: [
      '1. JWT Fundamentals & Use Cases',
      '2. JWT Structure: Header, Payload, Signature',
      '3. Access Tokens vs Refresh Tokens',
      '4. Express.js Middleware Authentication Flow',
      '5. Security Best Practices (XSS & CSRF Mitigation)'
    ],
    notes: [
      {
        heading: 'What is a JSON Web Token?',
        content: 'A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It is digitally signed using a secret key (HMAC algorithm) or a public/private key pair (RSA/ECDSA).'
      },
      {
        heading: 'Structure of JWT',
        content: 'JWT consists of 3 Base64URL-encoded strings separated by dots: HEADER.PAYLOAD.SIGNATURE. Header contains algorithm type, Payload holds claims/user ID, Signature verifies token authenticity.'
      },
      {
        heading: 'Access vs Refresh Tokens',
        content: 'Access tokens are short-lived (e.g. 15 mins) and sent in HTTP Authorization header. Refresh tokens are long-lived (e.g. 7 days), stored securely in HttpOnly cookies to request new access tokens.'
      }
    ],
    mcqs: [
      {
        question: 'Which part of a JWT contains the actual user metadata claims?',
        options: ['Header', 'Payload', 'Signature', 'Secret Key'],
        correct: 1,
        explanation: 'The Payload contains statements about an entity (typically user ID, roles, and expiration time).'
      },
      {
        question: 'Where is the safest place to store a refresh token on the web browser?',
        options: ['LocalStorage', 'SessionStorage', 'HttpOnly Cookie', 'Redux Store'],
        correct: 2,
        explanation: 'HttpOnly, Secure cookies prevent JavaScript access, protecting refresh tokens from XSS attacks.'
      }
    ],
    flashcards: [
      { front: 'What algorithm is commonly used for HMAC signing in JWT?', back: 'HS256 (HMAC with SHA-256)' },
      { front: 'What is the purpose of the "exp" claim in a JWT payload?', back: 'Expiration Time claim: defines when the token ceases to be valid.' },
      { front: 'Why should sensitive passwords never be placed in a JWT payload?', back: 'Payload is Base64 encoded, not encrypted. Anyone can decode and view claims.' }
    ],
    viva: [
      {
        question: 'Explain the end-to-end JWT Authentication flow in an Express.js application.',
        answer: '1. User submits credentials to /api/login.\n2. Server verifies credentials and generates a signed JWT.\n3. Server returns JWT to client.\n4. Client stores token and sends it in "Authorization: Bearer <token>" header for protected requests.\n5. Middleware verifies signature with secret key before granting controller access.'
      },
      {
        question: 'How do you revoke a JWT before its natural expiration time?',
        answer: 'JWTs are stateless, so revoking requires either maintaining a token blacklist in Redis, or bumping a user version identifier stored in the database.'
      }
    ],
    code: {
      language: 'javascript',
      code: `// Express JWT Authentication Middleware
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied: No Token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
    req.user = decoded;
    next();
  });
};`,
      explanation: 'This middleware extracts the token from authorization header and verifies signature using secret key before allowing execution to proceed.'
    }
  }
};

export const createFallbackMaterialForTopic = (topic, type, sessionId) => {
  const topicData = defaultMockStudyData[topic] || {
    roadmap: [
      `1. Core Fundamentals of ${topic}`,
      `2. Architecture & Design Principles`,
      `3. Implementation & Hands-on Patterns`,
      `4. Advanced Optimization & Security`
    ],
    notes: [
      {
        heading: `Introduction to ${topic}`,
        content: `${topic} is a crucial technical subject. Mastering it requires understanding its underlying architecture, data flow, and industry best practices.`
      }
    ],
    mcqs: [
      {
        question: `What is the primary objective of using ${topic}?`,
        options: ['Enhance system modularity & maintainability', 'Increase code complexity', 'Bypass type checking', 'Ignore error boundaries'],
        correct: 0,
        explanation: `${topic} helps organize application logic cleanly and scalably.`
      }
    ],
    flashcards: [
      { front: `What is the key benefit of ${topic}?`, back: 'Provides scalable, predictable, and robust code architecture.' }
    ],
    viva: [
      { question: `Describe how ${topic} operates in production scenarios.`, answer: 'It manages data flow efficiently, handles failure gracefully, and optimizes throughput.' }
    ],
    code: {
      language: 'javascript',
      code: `// Example Implementation for ${topic}\nfunction initialize${topic.replace(/\s+/g, '')}() {\n  console.log("Initializing ${topic}...");\n}`,
      explanation: `Standard initialization function for ${topic}.`
    }
  };

  if (type === 'notes') {
    return [{
      _id: `mock_mat_${Date.now()}_notes`,
      sessionId,
      type: 'notes',
      title: `Notes: ${topic}`,
      content: { sections: topicData.notes.map(n => ({ heading: n.heading || n.title, explanation: n.content })) }
    }];
  }

  if (type === 'roadmap') {
    return [{
      _id: `mock_mat_${Date.now()}_roadmap`,
      sessionId,
      type: 'roadmap',
      title: `${topic} Roadmap`,
      content: { steps: topicData.roadmap }
    }];
  }

  if (type === 'mcq') {
    return topicData.mcqs.map((m, i) => ({
      _id: `mock_mat_${Date.now()}_mcq_${i}`,
      sessionId,
      type: 'mcq',
      title: `${topic} MCQ #${i+1}`,
      content: { question: m.question, options: m.options, correctAnswer: m.correct, explanation: m.explanation }
    }));
  }

  if (type === 'flashcard') {
    return topicData.flashcards.map((f, i) => ({
      _id: `mock_mat_${Date.now()}_flashcard_${i}`,
      sessionId,
      type: 'flashcard',
      title: `${topic} Flashcard #${i+1}`,
      content: { front: f.front, back: f.back }
    }));
  }

  if (type === 'viva') {
    return topicData.viva.map((v, i) => ({
      _id: `mock_mat_${Date.now()}_viva_${i}`,
      sessionId,
      type: 'viva',
      title: `${topic} Viva #${i+1}`,
      content: { question: v.question || v.q, answer: v.answer || v.a }
    }));
  }

  if (type === 'code') {
    return [{
      _id: `mock_mat_${Date.now()}_code`,
      sessionId,
      type: 'code',
      title: `${topic} Code Example`,
      content: { code: topicData.code.code, language: topicData.code.language, explanation: topicData.code.explanation }
    }];
  }

  return [];
};
