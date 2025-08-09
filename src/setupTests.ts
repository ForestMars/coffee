import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder in Jest environment
import { TextEncoder, TextDecoder } from 'util';
// @ts-expect-error - global in Jest
global.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
// @ts-expect-error - global in Jest
global.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;