import '@testing-library/jest-dom';

// Polyfill for TextEncoder (needed for react-router-dom in tests)
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder; 