console.log('=== Environment Test ===');
console.log('Environment variables available:', {
  VITE_GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV
});
