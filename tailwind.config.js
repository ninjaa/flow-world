export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './node_modules/@fbp/graph-editor/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',
        border: '#1e293b'
      }
    }
  },
  plugins: []
};
