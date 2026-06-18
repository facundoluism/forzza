// Declaraciones de módulo para assets de audio usados con Metro bundler (Expo/React Native).
// Metro resuelve estos archivos como números (asset IDs).
declare module "*.wav" {
  const value: number;
  export default value;
}
